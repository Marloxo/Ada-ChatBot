'use strict';
var express = require('express');
var router = express.Router();

var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
/* dashboard page. */
router.get('/', ensureAuthenticated, function (req, res, next)
{
	res.render('Manage/dashboard', { style: 'dashboard', title: 'Dashboard - Ada ChatBot' });
});

function ensureAuthenticated(req, res, next)
{
	if (req.isAuthenticated())
		return next();
	res.render('Account/login', { style: 'Login', title: 'LogIn - Ada ChatBot' });
}

/* */
router.get('/settings', function (req, res, next)
{ res.render('Manage/settings', { style: 'dashboard', title: 'Dashboard - Ada ChatBot' }); });

router.get('/profile', function (req, res, next)
{ res.render('Manage/profile', { style: 'dashboard', title: 'Dashboard - Ada ChatBot' }); });

router.post('/profile', upload.single('profileImage'), function (req, res, next)
{    //Get Form Value
	var firstName = req.body.first_name;
	var lastName = req.body.last_name;
	var email = req.body.email;
	var password = req.body.Password;
	var passwordConfirmation = req.body.password_confirmation;
	if (req.file)
	{
		var profileImageOriginalName = req.file.OriginalName;
		var profileImageName = req.file.name;
		var profileImageMime = req.file.mimetype;
		var profileImagePath = req.file.path;
		var profileImageExt = req.file.extension;
		var profileImageSize = req.file.size;
	}
	else { var profileImageName = 'noimage.png'; }

	//Form Validation
	req.checkBody('firstName', 'FirstName field is required').notEmpty();
	req.checkBody('lastName', 'LastName field is required').notEmpty();
	req.checkBody('email', 'Email field is required').notEmpty();
	req.checkBody('email', 'Email not valid').isEmail();
	req.checkBody('password', 'Password field is required').notEmpty();
	req.checkBody('passwordConfirmation', 'Password do not match').equals(password);

	//Check Errors
	req.getValidationResult().then(function (result)
	{
		if (!result.isEmpty())
		{
			res.render('Manage/profile', {
				errors: result.array(),
				first_name: firstName,
				last_name: lastName,
				email: email,
				Password: password,
				password_confirmation: passwordConfirmation,

				style: 'dashboard', title: 'Profile - Ada ChatBot'
			});
		}
		else
		{
			//Success Message
			req.flash('success', 'Profile Updated');

			res.render('/Manage/dashboard', { style: 'dashboard', title: 'Dashboard - Ada ChatBot' });
		}
	});
});

router.get('/logout', function (req, res)
{
	req.logout();
	req.flash('success', 'You have logged out');
	res.render('index', { style: 'Main', title: 'Home - Ada ChatBot' });
});


module.exports = router;
