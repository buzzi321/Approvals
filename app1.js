var express = require('express');
var path = require('path');
var mysql      = require('mysql');
var app = express();

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'sekhar',
    password : 'sekhar',
    database : 'mydb'
});

connection.connect(function(err){
    if(!err) {
        console.log("Database is connected ... \n\n");
    } else {
        console.log("Error connecting database ... \n\n");
    }
});



var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());




//routes
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/templates', 'index.html'));
});


app.post('/signup', function(req, res, next){
    var userload = req.body;
    console.log('signup request received:', userload);
    var query = connection.query('insert into users set ?', userload, function(err, result) {
        if (err) {
            console.error(err);
            return res.send(err);
        } else {
            return res.send('Ok');
        }
    })
});


app.post("/verifyuser",function(req,res){
    var userloginload = req.body;
    console.log('login request received:', userloginload);
    var email = req.body.email;
    var pass = req.body.pass;
    console.log(email,pass);
    connection.query('SELECT * from users where email = ? and pass =?',[email, pass], function(err, rows, fields) {
        if (!err) {
            console.log('Login found');
            //console.log('Role', rows[0].role);
            //console.log('Role', fields);
            return res.send('Ok');

        }
        else {
            console.log('Login user not found', rows);
            return res.send(err);}
    });
});


app.post('/newrequest', function(req, res, next){
    var newrequest = req.body;
    console.log('new approval request received:', newrequest);
    var query = connection.query('insert into requests set ?', newrequest, function(err, result) {
        if (err) {
            console.error(err);
            return res.send(err);
        } else {
            return res.send('Ok');
        }
    })
});


app.post('/getApprovals',function(req,res){
    //console.log('Get approval request received:', req);
    //var approverrequest = req.body;
    var assignedemail = req.body.email;
    //console.log('Get approval request received:', approverrequest);
    connection.query('SELECT * from requests where assignedto = ?',[assignedemail], function(err, rows) {
        if (!err) {
            //console.log('Login found', rows);
            //console.log('Role', rows[0].role);
            //console.log('Role', fields);
            return res.send(rows);


        }
        else {
            console.log('Login user not found', rows);
            return res.send(err);}
    });
});




app.use('/node_modules',  express.static(__dirname + '/node_modules'));
app.use('/style',  express.static(__dirname + '/style'));
app.use('/ajax',  express.static(__dirname + '/ajax'));
app.use('/img',  express.static(__dirname + '/img'));
app.use('/templates',  express.static(__dirname + '/templates'));
app.use('/includes',  express.static(__dirname + '/includes'));
app.use('/app',  express.static(__dirname + '/app'));
app.use('/fonts',  express.static(__dirname + '/fonts'));


module.exports = app;