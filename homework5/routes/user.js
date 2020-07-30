var login = function(req, res) {
  console.log('user(user2.js) 모듈 안에 있는 login 호출됨.');

  var paramId = req.body.id || req.query.id;
  var paramPassword = req.body.password || req.query.password;

  console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword);

  var database = req.app.get('database');

  if (database.db) {
    authUser(database, paramId, paramPassword, function(err, docs) {
      if (err) {
        console.error('사용자 로그인 중 에러 발생 : ' + err.stack);

        res.writeHead('200', {
          'Content-Type': 'text/html;charset=utf8'
        });
        res.write('<h2>사용자 로그인 중 에러 발생</h2>');
        res.write('<p>' + err.stack + '</p>');
        res.end();

        return;
      }

      if (docs) {
        console.dir(docs);

        var username = docs[0].name;

        res.writeHead('200', {
          'Content-Type': 'text/html;charset=utf8'
        });

        var context = {
          userid: paramId,
          username: username
        };
        req.app.render('login_success', context, function(err, html) {
          if (err) {
            console.error('뷰 렌더링 중 에러 발생 : ' + err.stack);

            res.writeHead('200', {
              'Content-Type': 'text/html;charset=utf8'
            });
            res.write('<h2>뷰 렌더링 중 에러 발생</h2>');
            res.write('<p>' + err.stack + '</p>');
            res.end();

            return;
          }
          console.log('rendered : ' + html);

          res.end(html);
        });

      } else {
        res.writeHead('200', {
          'Content-Type': 'text/html;charset=utf8'
        });
        res.write('<h1>로그인  실패</h1>');
        res.write('<div><p>아이디와 패스워드를 다시 확인하십시오.</p></div>');
        res.write("<br><br><a href='/public/login.html'>다시 로그인하기</a>");
        res.end();
      }
    });
  } else {
    res.writeHead('200', {
      'Content-Type': 'text/html;charset=utf8'
    });
    res.write('<h2>데이터베이스 연결 실패</h2>');
    res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
    res.end();
  }

};

var adduser = function(req, res) {
  console.log('user(user2.js) 모듈 안에 있는 adduser 호출됨.');

  var paramId = req.body.id || req.query.id;
  var paramPassword = req.body.password || req.query.password;
  var paramName = req.body.name || req.query.name;

  console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword + ', ' + paramName);

  var database = req.app.get('database');

  if (database.db) {
    addUser(database, paramId, paramPassword, paramName, function(err, addedUser) {
      if (err) {
        console.error('사용자 추가 중 에러 발생 : ' + err.stack);

        res.writeHead('200', {
          'Content-Type': 'text/html;charset=utf8'
        });
        res.write('<h2>사용자 추가 중 에러 발생</h2>');
        res.write('<p>' + err.stack + '</p>');
        res.end();

        return;
      }

      if (addedUser) {
        console.dir(addedUser);

        res.writeHead('200', {
          'Content-Type': 'text/html;charset=utf8'
        });

        var context = {
          title: '사용자 추가 성공'
        };
        req.app.render('adduser', context, function(err, html) {
          if (err) {
            console.error('뷰 렌더링 중 에러 발생 : ' + err.stack);

            res.writeHead('200', {
              'Content-Type': 'text/html;charset=utf8'
            });
            res.write('<h2>뷰 렌더링 중 에러 발생</h2>');
            res.write('<p>' + err.stack + '</p>');
            res.end();

            return;
          }

          console.log("rendered : " + html);

          res.end(html);
        });

      } else {
        res.writeHead('200', {
          'Content-Type': 'text/html;charset=utf8'
        });
        res.write('<h2>사용자 추가  실패</h2>');
        res.end();
      }
    });
  } else {
    res.writeHead('200', {
      'Content-Type': 'text/html;charset=utf8'
    });
    res.write('<h2>데이터베이스 연결 실패</h2>');
    res.end();
  }

};

var listuser = function(req, res) {
  console.log('user(user2.js) 모듈 안에 있는 listuser 호출됨.');

  var database = req.app.get('database');

  if (database.db) {
    database.UserModel.findAll(function(err, results) {
      if (err) {
        console.error('사용자 리스트 조회 중 에러 발생 : ' + err.stack);

        res.writeHead('200', {
          'Content-Type': 'text/html;charset=utf8'
        });
        res.write('<h2>사용자 리스트 조회 중 에러 발생</h2>');
        res.write('<p>' + err.stack + '</p>');
        res.end();

        return;
      }

      if (results) {
        console.dir(results);

        res.writeHead('200', {
          'Content-Type': 'text/html;charset=utf8'
        });

        var context = {
          results: results
        };
        req.app.render('listuser', context, function(err, html) {
          if (err) {
            console.error('뷰 렌더링 중 에러 발생 : ' + err.stack);

            res.writeHead('200', {
              'Content-Type': 'text/html;charset=utf8'
            });
            res.write('<h2>뷰 렌더링 중 에러 발생</h2>');
            res.write('<p>' + err.stack + '</p>');
            res.end();

            return;
          }
          console.log('rendered : ' + html);

          res.end(html);
        });

      } else {
        res.writeHead('200', {
          'Content-Type': 'text/html;charset=utf8'
        });
        res.write('<h2>사용자 리스트 조회  실패</h2>');
        res.end();
      }
    });
  } else {
    res.writeHead('200', {
      'Content-Type': 'text/html;charset=utf8'
    });
    res.write('<h2>데이터베이스 연결 실패</h2>');
    res.end();
  }

};


var authUser = function(database, id, password, callback) {
  console.log('authUser 호출됨.');

  database.UserModel.findById(id, function(err, results) {
    if (err) {
      callback(err, null);
      return;
    }

    console.log('아이디 [%s]로 사용자 검색결과', id);
    console.dir(results);

    if (results.length > 0) {
      console.log('아이디와 일치하는 사용자 찾음.');

      var user = new database.UserModel({
        id: id
      });
      var authenticated = user.authenticate(password, results[0]._doc.salt, results[0]._doc.hashed_password);
      if (authenticated) {
        console.log('비밀번호 일치함');
        callback(null, results);
      } else {
        console.log('비밀번호 일치하지 않음');
        callback(null, null);
      }

    } else {
      console.log("아이디와 일치하는 사용자를 찾지 못함.");
      callback(null, null);
    }

  });

}


var addUser = function(database, id, password, name, callback) {
  console.log('addUser 호출됨.');

  var user = new database.UserModel({
    "id": id,
    "password": password,
    "name": name
  });

  user.save(function(err) {
    if (err) {
      callback(err, null);
      return;
    }

    console.log("사용자 데이터 추가함.");
    callback(null, user);

  });
}


module.exports.login = login;
module.exports.adduser = adduser;
module.exports.listuser = listuser;
