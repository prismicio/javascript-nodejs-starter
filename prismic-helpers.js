var Prismic = require('prismic.io').Prismic,
    Configuration = require('./prismic-configuration').Configuration,
    http = require('http'),
    https = require('https'),
    url = require('url'),
    querystring = require('querystring');

// -- A NodeJS compatible request handler

var requestsCache = {},
    nodeJsRequestHandler = function(requestUrl, callback) {

  if(requestsCache[requestUrl]) {
    callback(requestsCache[requestUrl]);
  } else {

    console.log('[prismic.io] ' + requestUrl)

    var parsed = url.parse(requestUrl),
        h = parsed.protocol == 'https:' ? https : http,
        options = {
          hostname: parsed.hostname,
          path: parsed.path,
          query: parsed.query,
          headers: { 'Accept': 'application/json' }
        };

    h.get(options, function(response) {
      if(response.statusCode && response.statusCode == 200) {
        var jsonStr = '';

        response.setEncoding('utf8');
        response.on('data', function (chunk) {
          jsonStr += chunk;
        });

        response.on('end', function () {
          var cacheControl = response.headers['cache-control'],
              maxAge = cacheControl && /max-age=(\d+)/.test(cacheControl) ? parseInt(/max-age=(\d+)/.exec(cacheControl)[1]) : undefined,
              json = JSON.parse(jsonStr);
          
          if(maxAge) {
            requestsCache[requestUrl] = json;
          }
          
          callback(json);
        });
      } else {
        throw new Error("Unexpected status code [" + response.statusCode + "]")
      }
    });

  }

};

// -- Helpers

exports.getApiHome = function(accessToken, callback) {
  Prismic.Api(Configuration.apiEndpoint, callback, accessToken || Configuration.accessToken || undefined, nodeJsRequestHandler);
};

exports.getDocument = function(ctx, id, slug, onSuccess, onNewSlug, onNotFound) {
  ctx.api.forms('everything').ref(ctx.ref).query('[[:d = at(document.id, "' + id + '")]]').submit(function(results) {
    var doc = results && results.length ? results[0] : undefined;
    if(doc && doc.slug == slug) onSuccess(doc)
    else if(doc && doc.slugs.indexOf('slug') > -1) onNewSlug(doc.slug)
    else onNotFound();
  });
};

exports.getDocuments = function(ctx, ids, callback) {
  if(ids && ids.length) {
    ctx.api.forms('everything').ref(ctx.ref).query('[[:d = any(document.id, [' + ids.map(function(id) { return '"' + id + '"';}).join(',') + '])]]').submit(function(results) {
      callback(results);
    });
  } else {
    callback([]);
  }
};

exports.getBookmark = function(ctx, bookmark, callback) {
  var id = ctx.api.bookmarks[bookmark];
  if(id) {
    exports.getDocument(ctx, id, undefined, callback);
  } else {
    callback();
  }
};

// -- Route wrapper that provide a "prismic context" to the underlying function

exports.route = function(callback) {
  return function(req, res) {
    exports.getApiHome(req.session['ACCESS_TOKEN'], function(Api) {
      var ref = req.query['ref'] || Api.master(),
          ctx = {
            api: Api,
            ref: ref,
            maybeRef: ref == Api.master() ? undefined : ref,

            oauth: function() {
              var token = req.session['ACCESS_TOKEN'];
              return {
                accessToken: token,
                hasPrivilegedAccess: !!token
              }
            },

            linkResolver: function(doc) {
              return Configuration.linkResolver(ctx, doc);
            }
          };
      res.locals.ctx = ctx;
      callback(req, res, ctx);
    });
  };
};

// -- OAuth routes

var redirectUri = function(req) {
  return req.protocol + '://' + req.get('Host') + '/auth_callback';
};

exports.signin = function(req, res) {
  exports.getApiHome(undefined, function(Api) {
    var endpointSpec = url.parse(Api.data.oauthInitiate);

    endpointSpec.query = endpointSpec.query || {};
    endpointSpec.query['client_id'] = Configuration.clientId;
    endpointSpec.query['redirect_uri'] = redirectUri(req);
    endpointSpec.query['scope'] = 'master+releases';

    res.redirect(301, url.format(endpointSpec));
  });
};

exports.authCallback = function(req, res) {
  exports.getApiHome(undefined, function(Api) {
    var endpointSpec = url.parse(Api.data.oauthToken),
        h = endpointSpec.protocol == 'https:' ? https : http,
        postData = querystring.stringify({
          'grant_type' : 'authorization_code',
          'code': req.query['code'],
          'redirect_uri': redirectUri(req),
          'client_id': Configuration.clientId,
          'client_secret': Configuration.clientSecret
        });

    var postOptions = endpointSpec;
    postOptions.method = 'POST';
    postOptions.headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': postData.length
    };

    var postRequest = h.request(postOptions, function(response) {
      var jsonStr = '';

      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        jsonStr += chunk;
      });

      response.on('end', function () {
        var accessToken = JSON.parse(jsonStr)['access_token'];
        if(accessToken) {
          req.session['ACCESS_TOKEN'] = accessToken;
        }
        res.redirect(301, '/');
      });
    });

    postRequest.write(postData);
    postRequest.end();
  });
};

exports.signout = function(req, res) {
  delete req.session['ACCESS_TOKEN'];
  res.redirect(301, '/');
};

