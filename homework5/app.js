var express = require('express'),
  http = require('http'),
  path = require('path');

var bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  static = require('serve-static'),
  errorHandler = require('errorhandler');

var expressErrorHandler = require('express-error-handler');

var expressSession = require('express-session');


var passport = require('passport');
var flash = require('connect-flash');


var config = require('./config');

var database = require('./database/database');

var route_loader = require('./routes/route_loader');




var app = express();


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
console.log('뷰 엔진이 ejs로 설정되었습니다.');


console.log('config.server_port : %d', config.server_port);
app.set('port', process.env.PORT || 3000);


app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(bodyParser.json())

app.use('/public', static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(expressSession({
  secret: 'my key',
  resave: true,
  saveUninitialized: true
}));



app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


var router = express.Router();
route_loader.init(app, router);





router.route('/').get(function(req, res) {
  console.log('/ 패스 요청됨.');
  res.render('index.ejs');
});

router.route('/login').get(function(req, res) {
  console.log('/login 패스 요청됨.');
  res.render('login.ejs', {
    message: req.flash('loginMessage')
  });
});

router.route('/login').post(passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true
}));

router.route('/signup').get(function(req, res) {
  console.log('/signup 패스 요청됨.');
  res.render('signup.ejs', {
    message: req.flash('signupMessage')
  });
});

router.route('/signup').post(passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/signup',
  failureFlash: true
}));

router.route('/profile').get(function(req, res) {
  console.log('/profile 패스 요청됨.');

  console.log('req.user 객체의 값');
  console.dir(req.user);

  if (!req.user) {
    console.log('사용자 인증 안된 상태임.');
    res.redirect('/');
    return;
  }

  console.log('사용자 인증된 상태임.');
  if (Array.isArray(req.user)) {
    res.render('profile.ejs', {
      user: req.user[0]._doc
    });
  } else {
    res.render('profile.ejs', {
      user: req.user
    });
  }
});

router.route('/logout').get(function(req, res) {
  console.log('/logout 패스 요청됨.');

  req.logout();
  res.redirect('/');
});




var LocalStrategy = require('passport-local').Strategy;

passport.use('local-login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) {
  console.log('passport의 local-login 호출됨 : ' + email + ', ' + password);

  var database = app.get('database');
  database.UserModel.findOne({
    'email': email
  }, function(err, user) {
    if (err) {
      return done(err);
    }

    if (!user) {
      console.log('계정이 일치하지 않음.');
      return done(null, false, req.flash('loginMessage', '등록된 계정이 없습니다.'));
    }

    var authenticated = user.authenticate(password, user._doc.salt, user._doc.hashed_password);
    if (!authenticated) {
      console.log('비밀번호 일치하지 않음.');
      return done(null, false, req.flash('loginMessage', '비밀번호가 일치하지 않습니다.'));
    }

    console.log('계정과 비밀번호가 일치함.');
    return done(null, user);
  });

}));


passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function(req, email, password, done) {
  var paramName = req.body.name || req.query.name;

  console.log('passport의 local-signup 호출됨 : ' + email + ', ' + password + ', ' + paramName);

  process.nextTick(function() {
    var database = app.get('database');
    database.UserModel.findOne({
      'email': email
    }, function(err, user) {
      if (err) {
        return done(err);
      }

      if (user) {
        console.log('기존에 계정이 있음.');
        return done(null, false, req.flash('signupMessage', '계정이 이미 있습니다.'));
      } else {
        var user = new database.UserModel({
          'email': email,
          'password': password,
          'name': paramName
        });
        user.save(function(err) {
          if (err) {
            throw err;
          }

          console.log("사용자 데이터 추가함.");
          return done(null, user);
        });
      }
    });
  });

}));



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

var errorHandler = expressErrorHandler({
  static: {
    '404': './public/404.html'
  }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);


process.on('uncaughtException', function(err) {
  console.log('uncaughtException 발생함 : ' + err);
  console.log('서버 프로세스 종료하지 않고 유지함.');

  console.log(err.stack);
});

process.on('SIGTERM', function() {
  console.log("프로세스가 종료됩니다.");
  app.close();
});

app.on('close', function() {
  console.log("Express 서버 객체가 종료됩니다.");
  if (database.db) {
    database.db.close();
  }
});

var server = http.createServer(app).listen(app.get('port'), function() {
  console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));

  database.init(app, config);

});
