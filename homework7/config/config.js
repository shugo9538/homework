module.exports = {
	server_port: 3000,
	db_url: 'mongodb://localhost:27017/local',
	db_schemas: [
	    {file:'./user_schema', collection:'users6', schemaName:'UserSchema', modelName:'UserModel'}
	],
	route_info: [
	],
	facebook: {
		clientID: '289458702143229',
    clientSecret: 'd221c4f8ca275024d66087eaf46a286d',
    callbackURL: 'http://localhost:3000/auth/facebook/callback'
	},
	twitter: {
		clientID: 'id',
		clientSecret: 'secret',
		callbackURL: '/auth/twitter/callback'
	},
	google: {
		clientID: 'id',
		clientSecret: 'secret',
		callbackURL: '/auth/google/callback'
	}
}
