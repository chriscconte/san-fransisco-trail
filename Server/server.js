var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
 
// Start the server
var port = process.env.PORT || 8000;
server.listen(port, function() {
  console.log("Running on port ", port);
});
 
// Serve the client
var staticPath = path.join(__dirname, '../client/dist');
app.use(express.static(staticPath);
app.get('/', function(req, res) {
  res.sendfile(__dirname + '/public/index.html');
});
 
// Handle socket.io
require('./routes/io.js')(app, io);