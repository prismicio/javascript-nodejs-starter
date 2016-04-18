
/**
 * Module dependencies.
 */
var express = require('express'),
    favicon = require('static-favicon'),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    errorHandler = require('errorhandler'),
    http = require('http'),
    path = require('path'),
    configuration = require('./prismic-configuration').Configuration,
    prismic = require('express-prismic').Prismic;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser());
app.use(methodOverride());
app.use(session({secret: '1234', saveUninitialized: true, resave: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(errorHandler());

prismic.init(configuration);

function handleError(err, req, res) {
  if (err.status == 404) {
    res.status(404).send("404 not found");
  } else {
    res.status(500).send("Error 500: " + err.message);
  }
}

// Routes

// -- Display all documents

app.route('/').get(function(req, res) {
  var p = prismic.withContext(req,res);

  p.query('', {
    'page': req.query.page || '1'
  }, function(err, docs) {
    if(err) return handleError(err, req, res);
    res.render('index', {
      docs: docs
    });
  });
});

// -- Display a given document

app.route('/documents/:id/:slug').get(function(req, res, ctx) {
  var id = req.params.id,
      slug = req.params.slug,
      p = prismic.withContext(req, res);

  p.getByID(id,
    function(err, doc) {
      if (err) return handleError(err, req, res);
      res.render('detail', {
        doc: doc
      });
    }
  );
});

// -- Search in documents

app.route('/search').get(function(req, res, ctx) {
  var q = req.query.q;

  if (q) {
    var p = prismic.withContext(req, res);
    p.query('[[:d = fulltext(document, "' + q + '")]]', {
      'page': req.query.page || '1'
    }, function(err, docs) {
      if (err) return handleError(err, req, res);
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

app.route('/preview').get(prismic.preview);


var PORT = app.get('port');

app.listen(PORT, function() {
  console.log('Express server listening on port ' + PORT);
});

