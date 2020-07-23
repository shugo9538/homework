function print(parent, user) {
	console.log('print() 호출됨 : %s, %s, %s', parent, user.id, user.name);
}

var parent = '소녀시대의 엄마';

function User(id, name) {
	this.id = id;
	this.name = name;
}

print(parent, new User('user1', '소녀시대'));
