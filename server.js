// https://github.com/nko4/website/blob/master/module/README.md#nodejs-knockout-deploy-check-ins
require('nko')('G5_YmBWtI792QfKN');
var express = require('express'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy,
    ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

var app = express();

var isProduction = (process.env.NODE_ENV === 'production');
var port = (isProduction ? 80 : 8000);
var host = (isProduction) ? "struggler.2013.nodeknockout.com" : "localhost:8000";

var TWITTER_CONSUMER_KEY = "p31jCAXjIGZwUR8uwT42w";
var TWITTER_CONSUMER_SECRET = "fM9w3kvtr8t35X4l1FSoclmJgwXESGfQOVcn9d4N4";

var Schema = mongoose.Schema;

var ProfileSchema = new Schema({
  id: {type: Number, required: true},
  username: {type: String, required: true},
  fullname: {type: String, required: true},
  photo: {type: String, required: false}
});

function handleError(err) {
  console.log("Error: " + err);
}

var Profile = mongoose.model('Profile', ProfileSchema);
mongoose.connect('mongodb://localhost/nodeknockout', function (err) {
  if (err) return handleError(err);
});

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.use(express.static(__dirname + '/public'));
  app.set('view engine', 'jade');
  app.use(express.cookieParser('buskar'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({ secret: 'buskar' }));
  app.use(passport.initialize());
  app.use(passport.session());
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://" + host + "/auth/twitter/callback"
  }, function(token, tokenSecret, profile, done) {
    var user = profile;
    var entry = new Profile({id: profile.id,
                             username: profile.username,
                             fullname: profile.displayName,
                             photos: profile.photos[0].value
                           });
    Profile.findOne({id: profile.id}).exec(function(err, existing) {
      if (err || (existing == null)) {
        handleError(err);
        entry.save();
        return;
      }
      existing.username = entry.username;
      existing.fullname = entry.fullname;
      existing.photo = entry.photo;
      existing.save();
    });
    return done(null, user);
  }));

app.get('/', ensureLoggedIn('/login'),
  function(req, res) {
    res.render('index');
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.get('/account',
  ensureLoggedIn('/login'),
  function(req, res) {
    res.send('Hello ' + req.user.username);
});

app.get('/logout',
  function(req, res) {
    req.logout();
    res.redirect('/login');
});

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter',
       { successReturnToOrRedirect: '/', failureRedirect: '/login' }));

app.listen(port);
console.log("Listening on port: " + port);