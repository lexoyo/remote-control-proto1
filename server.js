var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var nextId = 1;

app.use(express.static(__dirname+'/dist'));

io.on('connection', function(socket){
	var id = (nextId++) + '-' + Math.round(Math.random()*99999);
	console.log('a user connected');
	socket.on('disconnect', function(){
	    console.log('user disconnected');
		io.emit('connection.close', id);
	});
	socket.on('init', function(type){
		io.emit('connection.open', id, type);
		console.log('init', id, type);
		socket.on('key', function(key, isDown){
			console.log('key: ', key, isDown);
			io.emit('key', id, key, isDown);
		});
	});
});

http.listen(9080, function(){
	console.log('listening on *:9080');
});
