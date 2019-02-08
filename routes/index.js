var express = require('express');
var mysql = require('mysql');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CIA Solves Problems!!' });
  console.log("hello");
  
  var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "rickyjerry_0",
    database: "hmm"
  });
  console.log("hi");
  con.connect(function(err) {
    if (err) {
      throw err ;
    }
    else {
      console.log("Connected!");
    }
    
      //console.error.bind(console, 'MongoDB connection error:');

    //res.render('index', { output: err });
    //console.log("Connected!");
    
    
  });

  con.query("SELECT * FROM Categories", 
    function(err, rows, fields) {
      if(!err) {
        console.log(rows);
        
      }
      else {
        console.log("oops");
        
      }
    });
  
});

module.exports = router;
