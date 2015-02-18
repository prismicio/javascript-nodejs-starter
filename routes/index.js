var prismic = require('../prismic-helpers');

// -- Display all documents

exports.index = prismic.route(function(req, res, ctx) {
  ctx.api.form('everything').set("page", req.param('page') || "1").ref(ctx.ref).submit(function(err, docs) {
    if (err) { prismic.onPrismicError(err, req, res); return; }
    res.render('index', {
      docs: docs
    });
  });
});

// -- Display a given document

exports.detail = prismic.route(function(req, res, ctx) {
  var id = req.params['id'],
      slug = req.params['slug'];

  prismic.getDocument(ctx, id, slug, 
    function(err, doc) {
      if (err) { prismic.onPrismicError(err, req, res); return; }
      res.render('detail', {
        doc: doc
      });
    },
    function(doc) {
      res.redirect(301, ctx.linkResolver(doc));
    },
    function(NOT_FOUND) {
      res.send(404, 'Sorry, we cannot find that!');
    }
  );
});

// -- Search in documents

exports.search = prismic.route(function(req, res, ctx) {
  var q = req.query['q'];

  if(q) {
    ctx.api.form('everything').set("page", req.param('page') || "1").ref(ctx.ref)
           .query('[[:d = fulltext(document, "' + q + '")]]').submit(function(err, docs) {
      if (err) { prismic.onPrismicError(err, req, res); return; }
      res.render('search', {
        q: q,
        docs: docs,
        url: req.url
      });
    });
  } else {
    res.render('search', {
      q: q,
      docs: null,
      url: req.url
    });
  }

});

// -- Preview documents from the Writing Room

exports.preview = prismic.route(function(req, res, ctx) {
  var token = req.query['token'];

  if (token) {
    ctx.api.previewSession(token, ctx.linkResolver, '/', function(err, url) {
      res.cookie(prismic.previewCookie, token, { maxAge: 30 * 60 * 1000, path: '/', httpOnly: false });
      res.redirect(301, url);
    });
  } else {
    res.send(400, "Missing token from querystring");
  }
});
