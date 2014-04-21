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
      res.redirect(301, ctx.linkResolver(ctx, doc));
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
    ctx.api.form('everything').ref(ctx.ref).query('[[:d = fulltext(document, "' + q + '")]]').submit(function(err, docs) {
      if (err) { prismic.onPrismicError(err, req, res); return; }
      res.render('search', {
        docs: docs
      });
    });
  } else {
    res.render('search', {
      docs: null
    });
  }

});
