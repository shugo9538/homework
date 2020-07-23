var express = require('express'),
  http = require('http'),
  path = require('path');

var bodyParser = require('body-parser'),
  static = require('serve-static');

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use('/public', static(path.join(__dirname, 'public')));

var router = express.Router();

router.route('/process/users/:id').get(function(req, res) {
	console.log('/process/users/:id 처리함.');

	var paramId = req.params.id;

	console.log('/process/users와 토큰 %s를 이용해 처리함.', paramId);

	res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
	res.write('<h1>Express 서버에서 응답한 결과입니다.</h1>');
	res.write('<div><p>Param id : ' + paramId + '</p></div>');
	res.end();
});

app.use('/', router);


app.all('*', function(req, res) {
	res.status(404).send('<h1>ERROR - 페이지를 찾을 수 없습니다.</h1>');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
