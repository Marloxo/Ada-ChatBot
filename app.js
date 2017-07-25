'use strict';
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

//added
var engine = require('ejs-locals');
var helmet = require('helmet'); //Handle Security for form
var session = require('express-session');
var expressValidator = require('express-validator');
var passport = require('passport'); //User Auth Helper
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');
//var multer = require('multer'); //file upload
var flash = require('connect-flash'); //Send flash message over session
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose'); //Handle connect with mongodb
var db = mongoose.connection;

var uri = 'mongodb://Iglesk:omar.1994@cluster0-shard-00-00-kt6rw.mongodb.net:27017,cluster0-shard-00-01-kt6rw.mongodb.net:27017,cluster0-shard-00-02-kt6rw.mongodb.net:27017/admin?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin';
MongoClient.connect(uri, function (err, db)
{
	if (err)
	{
		console.log(err);
	}
	db.close();
});

//Routes
var index = require('./routes/index');
var login = require('./routes/login');
var dashboard = require('./routes/dashboard');

//app
var app = express();
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
//Accept HTML
app.engine('ejs', engine);
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//Handle File Uploads
//app.use(multer({ dest: './uploads' }));
//global.upload = multer({ dest: './uploads' });

//Handle Express Sessions
app.use(session({
	secret: 'secret',
	saveUninitialized: true,
	resave: true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

//Validator
// In this example, the formParam value is going to get morphed into form body format useful for printing. 
app.use(expressValidator({
	errorFormatter: function (param, msg, value)
	{
		var namespace = param.split('.')
			, root = namespace.shift()
			, formParam = root;

		while (namespace.length)
		{
			formParam += '[' + namespace.shift() + ']';
		}
		return {
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));

//Flash
app.use(flash());
app.use(function (req, res, next)
{
	res.locals.messages = require('express-messages')(req, res);
	next();
});


//Route define
app.use('/', index);
app.use('/login', login);
app.use('/dashboard', dashboard);



// catch 404 and forward to error handler
app.use(function (req, res, next)
{
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function (err, req, res, next)
{
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error', { style: 'Main', title: 'Oops.. 404 Not Found!' });
});

module.exports = app;
