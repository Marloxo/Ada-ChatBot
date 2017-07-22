var express = require('express');
var router = express.Router();

var nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function (req, res, next)
{ res.render('index', { title: 'Home' }); });

router.post('/', function (req, res, next)
{
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: { user: 'alsabeklaith@gmail.com', pass: 'laith96.com' }
  });

  var mailOption = {
    form: 'Ada Website <alsabeklaith@gmail.com>',
    to: 'Ada Website Mailbox <OmarSabekZ@gmail.com>',
    subject: 'Submission From Ada Website - ' + req.body.name,

    text: 'You have a new submission with the following details.. Name:' + req.body.name +
    'Email:' + req.body.email + 'Message:' + req.body.message,

    html: '<p>You have a new submission with the following details.. </p>' +
    '<ul><li> Name: ' + req.body.name + '</li><li>Email: ' + req.body.email + '</li><li>Message: ' +
    req.body.message + '</li></ul>'
  };

  transporter.sendMail(mailOption, function (err, info)
  {
    if (err)
    {
      console.log(err)
      res.redirect('/');
    }
    else
    {
      console.log('Message Sent: ' + info.response)
      res.redirect('/');
    }
  })
});

module.exports = router;
