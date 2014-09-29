var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var nextId = 1;

app.use(express.static(__dirname+'/dist'));

io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('disconnect', function(){
	    console.log('user disconnected');
	});
	socket.on('init', function(type){
		var id = (nextId++) + Math.round(Math.random()*99999);
		io.emit('newiConnection', id, type);
		console.log('init', id, type);
		socket.on('keydown', function(msg){
			console.log('keydown: ' + msg);
			io.emit('keydown', id, msg);
		});
	});
});

http.listen(9080, function(){
	console.log('listening on *:9080');
});
