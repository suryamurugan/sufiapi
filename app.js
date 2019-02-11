var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require("body-parser");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const jwt = require('jsonwebtoken');
var auth = require('./autho/auth.js') ;
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));



/* Creae API route */
app.get('/api', (req, res) => {
  res.json({

      msg: "Welcome to NodeJS JWT Authentication Tutorial"

  });

});

/** Create posts protected route */
//var verifyToken = auth.token ;

app.post('/api/posts', verifyToken, (req, res) => {

  jwt.verify(req.token, 'SuperSecRetKey', (err, authData)=>{

      if(err){

          res.sendStatus(403);

      }else{

          res.json({

              msg: "A new post is created",

              authData

          });
      }

  });

});

/** verifyToken method - this method verifies token */
function verifyToken(req, res, next){
  
  //Request header with authorization key
  const bearerHeader = req.headers['authorization'];
  
  //Check if there is  a header
  if(typeof bearerHeader !== 'undefined'){

      const bearer = bearerHeader.split(' ');
      
      //Get Token arrray by spliting
      const bearerToken = bearer[1];

      req.token = bearerToken;
      console.log(req.token);
      
      //call next middleware
      next();

  }else{

      res.sendStatus(403);

  }
}


//User signin route 
app.post('/api/signin', (req, res) => {
  const user = {
      id: 1,
      username: "john",
      email: "john.doe@test.com"
  }
  console.log(req.body.username);
  console.log(user.username);
  
  
  jwt.sign({user},'SuperSecRetKey', { expiresIn: 60 * 60 }, (err, token) => {
      res.json({token});
  });


});


app.use('/hi', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
