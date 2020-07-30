var local_login = require('./passport/local_login');
var local_signup = require('./passport/local_signup');
var facebook = require('./passport/facebook');
var twitter = require('./passport/twitter');
var google = require('./passport/google');

module.exports = function(app, passport) {
  console.log('config/passport 호출됨.');

  passport.serializeUser(function(user, done) {
    console.log('serializeUser() 호출됨.');
    console.dir(user);

    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    console.log('deserializeUser() 호출됨.');
    console.dir(user);

    done(null, user);
  });

  passport.use('local-login', local_login);
  passport.use('local-signup', local_signup);
  passport.use('facebook', facebook(app, passport));
  passport.use('twitter', twitter(app, passport));
  passport.use('google', google(app, passport));
  console.log('5가지 passport 인증방식 설정됨.');

};
