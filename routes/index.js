var prismic = require('../prismic-helpers');

// -- Display all documents

exports.index = prismic.route(function(req, res, ctx) {
  ctx.api.form('everything').ref(ctx.ref).submit(function(docs) {
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
    function(doc) {
      res.render('detail', {
        doc: doc
      });
    },
    function(doc) {
      res.redirect(302, ctx.linkResolver(ctx, doc));
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
    ctx.api.form('everything').ref(ctx.ref).query('[[:d = fulltext(document, "' + q + '")]]').submit(function(docs) {
      res.render('search', {
        docs: docs
      });
    });
  } else {
    res.render('search', {
      docs: []
    });
  }

});
