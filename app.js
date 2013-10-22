
/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    engine = require('ejs-locals'),
    prismic = require('./prismic-helpers');

var app = express();

// all environments
app.engine('ejs', engine);
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('1234'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Routes
app.get('/', routes.index);
app.get('/documents/:id/:slug', routes.detail);
app.get('/search', routes.search);

// OAuth - Routes
app.get('/signin', prismic.signin);
app.get('/auth_callback', prismic.authCallback);
app.post('/signout', prismic.signout);

var PORT = process.env.PORT || 3000;

http.createServer(app).listen(PORT, function() {
  console.log('Express server listening on port ' + PORT);
});
