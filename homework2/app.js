var express = require('express'),
  http = require('http'),
  path = require('path'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  errorHandler = require('errorhandler'),
  static = require('serve-static'),
  expressErrorHandler = require('express-error-handler'),
  expressSession = require('express-session');

var app = express();


var MongoClient = require('mongodb').MongoClient;
var database;

function connectDB() {
	var databaseUrl = 'mongodb://localhost:27017/local';

	MongoClient.connect(databaseUrl, function(err, db) {
		if (err) throw err;
		console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);
		database = db;
	});
}

var router = express.Router();

router.route('/process/login').post(function(req, res) {
  var paramId = req.body.id || req.query.id;
  var paramPassword = req.body.password || req.query.password;

  console.log('/process/login 호출됨.');
  console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword);

	if (database) {
		authUser(database, paramId, paramPassword, function(err, docs) {
			if (err) {throw err;}
			if (docs) {
        var username = docs[0].name;

        console.dir(docs);

				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h1>로그인 성공</h1>');
				res.write('<div><p>사용자 아이디 : ' + paramId + '</p></div>');
				res.write('<div><p>사용자 이름 : ' + username + '</p></div>');
				res.write("<br><br><a href='/public/login.html'>다시 로그인하기</a>");
				res.end();
			} else {
				res.write('<h1>로그인  실패</h1>');
				res.write('<div><p>아이디와 패스워드를 다시 확인하십시오.</p></div>');
				res.write("<br><br><a href='/public/login.html'>다시 로그인하기</a>");
				res.end();
			}
		});
    res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
		res.end();
	}
});

router.route('/process/adduser').post(function(req, res) {
  var paramId = req.body.id || req.query.id;
  var paramPassword = req.body.password || req.query.password;
  var paramName = req.body.name || req.query.name;

	console.log('/process/adduser 호출됨.');
  console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword + ', ' + paramName);

	if (database) {
		addUser(database, paramId, paramPassword, paramName, function(err, result) {
			if (err) {throw err;}
			if (result && result.insertedCount > 0) {
				console.dir(result);

				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>사용자 추가 성공</h2>');
				res.end();
			} else {
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>사용자 추가  실패</h2>');
				res.end();
			}
		});
	} else {
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.end();
	}
});

var authUser = function(database, id, password, callback) {
	var users = database.collection('users');

  console.log('authUser 호출됨 : ' + id + ', ' + password);

	users.find({"id":id, "password":password}).toArray(function(err, docs) {
		if (err) {
			callback(err, null);
			return;
		}
    if (docs.length > 0) {
    	console.log('아이디 [%s], 패스워드 [%s] 가 일치하는 사용자 찾음.', id, password);
      callback(null, docs);
    } else {
    	console.log("일치하는 사용자를 찾지 못함.");
    	callback(null, null);
    }
	});
};

var addUser = function(database, id, password, name, callback) {
	var users = database.collection('users');

  console.log('addUser 호출됨 : ' + id + ', ' + password + ', ' + name);

	users.insertMany([{"id":id, "password":password, "name":name}], function(err, result) {
		if (err) {
			callback(err, null);
			return;
		}
    if (result.insertedCount > 0) {
      console.log("사용자 레코드 추가됨 : " + result.insertedCount);
    } else {
      console.log("추가된 레코드가 없음.");
    }
    callback(null, result);
	});
}

var errorHandler = expressErrorHandler({
 static: {
   '404': './public/404.html'
 }
});
app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/public', static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(expressSession({
  secret:'my key',
  resave:true,
  saveUninitialized:true
}));
app.use('/', router);

process.on('SIGTERM', function () {
    console.log("프로세스가 종료됩니다.");
    app.close();
});

app.on('close', function () {
	console.log("Express 서버 객체가 종료됩니다.");
	if (database) {
		database.close();
	}
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));

  connectDB();
});
