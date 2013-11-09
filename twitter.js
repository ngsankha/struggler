var express = require('express'),
passport = require('passport'),
TwitterStrategy = require('passport-twitter').Strategy,
ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn,
app = express();
 
app.use(express.static(__dirname + '/public'));
app.use(express.cookieParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
 
passport.serializeUser(function(user, done) {
done(null, user);
});
 
passport.deserializeUser(function(obj, done) {
done(null, obj);
});
 
 
var TWITTER_CONSUMER_KEY = "p31jCAXjIGZwUR8uwT42w";
var TWITTER_CONSUMER_SECRET = "fM9w3kvtr8t35X4l1FSoclmJgwXESGfQOVcn9d4N4";
 
passport.use(new TwitterStrategy({
consumerKey: TWITTER_CONSUMER_KEY,
consumerSecret: TWITTER_CONSUMER_SECRET,
callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
},
function(token, tokenSecret, profile, done) {
// NOTE: You'll probably want to associate the Twitter profile with a
// user record in your application's DB.
var user = profile;
return done(null, user);
}
));
 
 
app.get('/', function(req, res){
res.send('Hello World');
});
 
app.get('/account',
ensureLoggedIn('/login'),
function(req, res) {
res.send('Hello ' + req.user.username);
});
 
app.get('/login',
function(req, res) {
res.send('<html><body><a href="/auth/twitter">Sign in with Twitter</a></body></html>');
});
app.get('/logout',
function(req, res) {
req.logout();
res.redirect('/');
});
 
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { successReturnToOrRedirect: '/', failureRedirect: '/login' }));
 
 
var server = app.listen(3000);
console.log('Express server started on port %s', server.address().port);