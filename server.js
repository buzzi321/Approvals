var app = require('./server/app');

// Binding express app to port 3000
app.set('port', process.env.PORT || 3000);

console.log('Listening on port ' + '3000' + '...');
var server = app.listen(app.get('port'), function(err) {
    if(err) throw err;

    var message = 'Server is running @ http://localhost:' + server.address().port;
    console.log(message);
});



