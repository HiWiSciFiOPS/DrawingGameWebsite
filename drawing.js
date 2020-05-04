var mousePressed = false;
var lastX, lastY;
var context;

var canvas;

function InitThis() {
	canvas = document.getElementById("drawingCanvas");
	context = canvas.getContext("2d");
	
	canvas.addEventListener("mousedown", mousedown);
	canvas.addEventListener("mousemove", mousemove);
	canvas.addEventListener("mouseup", mouseup);
	canvas.addEventListener("mouseleave", mouseleave);
	canvas.addEventListener("mouseenter", mouseenter);
}

	mousePressed = true;
	Draw(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, false);
	//Draw(e.clientX, e.clientY, false);
}

function mousemove(e) {
	if (mousePressed) {
		Draw(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, true);
		//Draw(e.clientX, e.clientY, true);
	}
}

function mouseup(e) {
	mousePressed = false;
}

function mouseleave(e) {
	mousePressed = false;
}

function mouseenter(e) {
	if (e.buttons === 1) {
		mousePressed = true;
		Draw(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, false);
	}
}

function Draw(x, y, isDown) {
	if (isDown) {
		context.beginPath();
		context.strokeStyle = document.getElementById("setColor").value;
		context.lineWidth = document.getElementById("setLWidth").value;
		context.lineJoin = "round";
		context.moveTo(lastX, lastY);
		context.lineTo(x, y);
		context.closePath();
		context.stroke();
	}
	lastX = x;
	lastY = y;
}

function clearArea() {
	context.setTransform(1, 0, 0, 1, 0, 0);
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}