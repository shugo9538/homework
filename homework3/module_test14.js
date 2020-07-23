function print(parent, user) {
	console.log('print() 호출됨 : %s, %s, %s', parent, user.id, user.name);
}

var parent = '소녀시대의 엄마';

var createUser = require('./user14_2');

print(parent, createUser('user1', '소녀시대'));
