'use strict';
var express = require('express');
var router = express.Router();

/* GET SignIn Page */
router.get('/', function (req, res, next)
{ res.render('Account/login', { style: 'Login', title: 'LogIn - Ada ChatBot' }); });

/* Post SignIn Page */
router.post('/signin', function (req, res, next)
{   //Get Form Value
	var userName = req.body.UserName;
	var password = req.body.Password;
	//Form Validation
	req.checkBody('UserName', 'UserName field is required').notEmpty();
	req.checkBody('Password', 'Password field is required').notEmpty();

	//Check Errors
	req.getValidationResult().then(function (result)
	{
		if (!result.isEmpty())
		{
			res.render('Account/login', {
				loginErrors: result.array(),
				UserName: userName,
				Password: password,

				style: 'Login', title: 'LogIn - Ada ChatBot'
			});
		}
		else
		{
			res.render('Account/login', { style: 'Login', title: 'LogIn - Ada ChatBot' });
		}

	});
});

/* Post SignUp Page */
router.post('/signup', function (req, res, next)
{   //Get Form Value
	var userName = req.body.UserName;
	var email = req.body.Email;
	var password = req.body.Password;
	//Form Validation
	req.checkBody('UserName', 'UserName field is required').notEmpty();
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
				UserName: userName,
				Email: email,
				Password: password,

				style: 'Login', title: 'LogIn - Ada ChatBot'
			});
		}
		else
		{
			res.render('Account/login', { style: 'Login', title: 'LogIn - Ada ChatBot' });
		}
	});
});


module.exports = router;