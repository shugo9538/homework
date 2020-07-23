function print(parent, user) {
	console.log('print() 호출됨 : %s, %s, %s', parent, user.id, user.name);
}

var parent = '소녀시대의 엄마';

var location = '서초동';
var id = 'user1';
var name = '소녀시대';

var createUser = require('./user15_2');

print(parent, createUser(location, id, name));
