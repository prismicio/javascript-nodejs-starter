exports.Configuration = {

  apiEndpoint: 'https://lesbonneschoses.prismic.io/api',

  // -- Access token if the Master is not open
  // accessToken: 'xxxxxx',

  // OAuth
  // clientId: 'xxxxxx',
  // clientSecret: 'xxxxxx',

  // -- Links resolution rules
  linkResolver: function(doc) {
    if (doc.isBroken) return false;
    return '/documents/' + doc.id + '/' + doc.slug;
  },

  // -- What to do in the event of an error from prismic.io
  onPrismicError: function(err, req, res) {
    res.send(500, "Error 500: " + err.message);
  }

};