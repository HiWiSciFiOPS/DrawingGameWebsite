var express = require('express');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static('client'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});

io.on('connection', (socket) => {
	console.log('user connected: ' + socket.id);

	socket.on('disconnect', () => {
		console.log('user disconnected: ' + socket.id);
	});

	socket.on('chat message', (msg) => {
		console.log('message: ' + msg);
		io.emit('chat message', msg);
	});

	socket.on('pencil', (data) => {
		io.emit('pencil', data);
	});

	socket.on('bucket', (data) => {
		io.emit('bucket', data);
	});

	socket.on('clear', () => {
		io.emit('clear');
	});
});

http.listen(8080, () => {
	console.log('listening on *:8080');
});
