var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

//Mine
var MongoClient = require('mongodb').MongoClient;
var uri = require('../app').dbUri;
//!mine

mongoose.connect(uri);
var db = mongoose.connection;

// User Schema
var UserSchema = mongoose.Schema({
	firstName: { type: String, index: true },
	lastName: { type: String, index: true },
	email: { type: String, index: true },
	password: { type: String, required: true, bcrypt: true },
	profileImage: { type: String },
});


var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function (newUser, callback)
{
	// MongoClient.connect(uri, function (err, db)
	// {
	// 	if (err)
	// 		console.log(err);
	// 	db.collection('User').insertOne({ newUser }).then(function (result)
	// 	{
	// 		// process result  
	// 		db.close();
	// 	});
	// });
	//#2
	bcrypt.hash(newUser.password, 10, function (err, hash)
	{
		if (err) throw err;
		//Set Hash Password
		newUser.password = hash;
		//Create User
		newUser.save(callback);
	});
};

module.exports.getUserByEmail = function (email, callback)
{
	var query = { email: email };
	User.findOne(query, callback);
};

module.exports.getUserById = function (id, callback)
{
	User.findById(id, callback);
};

module.exports.comparePassword = function (candidatePassword, hash, callback)
{
	bcrypt.compare(candidatePassword, hash, function (err, isMatch)
	{
		if (err)
			return callback(err);
		callback(null, isMatch);
	});
};