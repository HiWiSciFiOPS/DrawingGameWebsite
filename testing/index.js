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
		console.log('user disconnected');
	});

	socket.on('chat message', (msg) => {
		console.log('message: ' + msg);
		io.emit('chat message', msg);
	});

	socket.on('pencil', (color, thickness) => {
		console.log('pencil stroke: c:' + color + ' w:' + thickness);
	});
});

http.listen(8080, () => {
	console.log('listening on *:8080');
});
