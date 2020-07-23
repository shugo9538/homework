var User = require('./user14_1');

var createUser = function(id, name) {
	return new User(id, name);
}

module.exports = createUser;
