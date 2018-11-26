var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var ball = 0;
var players = {};

app.use(express.static(__dirname + "/public"));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.on('new_player', function(){
		players[socket.id] = {
			lat:0,
			lng:0,
			points:0
		};
	});
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });

	socket.on('move', function(data){
		var player = players[socket.id]||{};
		player.lat = data.lat;
		player.lng = data.lng;
	});

});


setInterval(function(){
	io.sockets.emit('state',players);
}, 1000 / 60);

server.listen(8081, function(){
	console.log(`Listening on ${server.address().port}`);
});
