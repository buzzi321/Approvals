// vendor libraries
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();




var bodyParser = require('body-parser');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded




app.use('/api', router);
app.use('/node_modules',  express.static(__dirname + '/node_modules'));
app.use('/style',  express.static(__dirname + '/style'));
app.use('/ajax',  express.static(__dirname + '/ajax'));
app.use('/img',  express.static(__dirname + '/img'));
app.use('/templates',  express.static(__dirname + '/templates'));
app.use('/includes',  express.static(__dirname + '/includes'));
app.use('/app',  express.static(__dirname + '/app'));
app.use('/fonts',  express.static(__dirname + '/fonts'));


module.exports = app;