'use strict';
var express = require('express');
var router = express.Router();

var passport = require('passport'); //User Auth Helper
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

/* GET SignIn Page */
router.get('/', function (req, res, next)
{ res.render('Account/login', { style: 'Login', title: 'LogIn - Ada ChatBot' }); });
/* passport Serialization */
passport.serializeUser(function (user, done)
{
	done(null, user.id);
});

passport.deserializeUser(function (id, done)
{
	User.getUserById(id, function (err, user)
	{
		done(err, user);
	});
});
/*Passport Signin*/
passport.use(new LocalStrategy({ usernameField: 'email' },
	function (email, password, done)
	{
		User.getUserByEmail(email, function (err, user)
		{
			if (err) return done(err);
			if (!user)
				return done(null, false, { message: 'Unknown User' });

			User.comparePassword(password, user.password, function (err, isMatch)
			{
				if (err) return done(err);
				if (isMatch)
					return done(null, user);
				else
					return done(null, false, { message: 'Invalid password' });
			});
		});
	}));

/* Post SignIn Page */
router.post('/signin', function (req, res, next)
{
	passport.authenticate('local', function (err, user, info)
	{
		if (err)
			return next(err); // will generate a 500 error
		// Generate a JSON response reflecting authentication status
		if (!user)
		{
			return res.render('Account/login', {
				style: 'Login', title: 'LogIn - Ada ChatBot', infoMessage: info
			});
		}
		// ***********************************************************************
		// "Note that when using a custom callback, it becomes the application's
		// responsibility to establish a session (by calling req.login()) and send
		// a response."
		// Source: http://passportjs.org/docs
		// ***********************************************************************
		req.login(user, loginErr =>
		{
			if (loginErr)
			{
				return next(loginErr);
			}
			res.render('Manage/dashboard', { style: 'dashboard', title: 'LogIn - Ada ChatBot' });
		});
	})(req, res, next);
});

/* Post SignUp Page */
router.post('/signup', function (req, res, next)
{   //Get Form Value
	var fullName = req.body.FullName;
	var email = req.body.Email;
	var password = req.body.Password;
	//Form Validation
	req.checkBody('FullName', 'FullName field is required').notEmpty();
	req.checkBody('Email', 'Email field is required').notEmpty();
	req.checkBody('Email', 'Email not valid').isEmail();
	req.checkBody('Password', 'Password field is required').notEmpty();
	//Check Errors
	req.getValidationResult().then(function (result)
	{
		if (!result.isEmpty())
		{
			res.render('Account/login', {
				signupErrors: result.useFirstErrorOnly().array(),
				FullName: fullName,
				Email: email,
				Password: password,

				style: 'Login', title: 'LogIn - Ada ChatBot'
			});
		}
		else
		{
			var newUser = new User({
				firstName: fullName.split(' ')[0],
				lastName: fullName.split(' ')[1],
				email: email,
				password: password,
				profileImage: 'noimage.png'
			});

			//Create User
			User.createUser(newUser, function (err, user)
			{
				if (err)
					throw err;
				console.log(newUser);
			});

			//Success Message
			req.flash('success', 'Profile Updated');

			// res.location('/');
			// res.redirect('/');
			res.render('Manage/dashboard', { style: 'dashboard', title: 'LogIn - Ada ChatBot' });
		}
	});
});


module.exports = router;