var express = require('express');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static('client'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/client/index.html');
});

class drawCall {
	constructor(type, data) {
		this.type = type;
		this.data = data;
	}
}

io.on('connection', (socket) => {
	console.log('user connected: ' + socket.id);

	socket.on('disconnect', () => {
		console.log('user disconnected: ' + socket.id);
	});

	socket.on('chat message', (msg) => {
		console.log('message: ' + msg);
		io.emit('chat message', msg);
	});

	socket.on('draw_pencil', (data) => {
		io.emit('draw_pencil', data);
	});

	socket.on('draw_bucket', (data) => {
		io.emit('draw_bucket', data);
	});

	socket.on('draw_clear', () => {
		io.emit('draw_clear');
	});
});

http.listen(8080, () => {
	console.log('listening on *:8080');
});
