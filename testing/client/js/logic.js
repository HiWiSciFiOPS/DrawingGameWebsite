var mousePressed = false;
var lastX, lastY;
var context;
var canvas;

var enabled = true;

const canvasID = "drawingCanvas";

const typePencil = "pencil";
const typeBucket = "bucket";
const typeEraser = "eraser";
const widthID = "setLWidth";

var selectedColor = '#000000';
var selectedBrush = 'pencil';

//establish connection
var socket = io();

InitThis();
function InitThis() {
	canvas = document.getElementById(canvasID);
	context = canvas.getContext("2d");

	canvas.addEventListener("mousedown", mousedown);
	canvas.addEventListener("mousemove", mousemove);
	canvas.addEventListener("mouseup", mouseup);
	canvas.addEventListener("mouseleave", mouseleave);
	canvas.addEventListener("mouseenter", mouseenter);

	socket.on('pencil', (data) => {
		drawLine(data.x0, data.y0, data.x1, data.y1, data.color, data.thickness);
	});

	socket.on('bucket', (data) => {
		floodFill(data.x, data.y, hexToRgbA(data.color));
	});

	socket.on('clear', () => {
		clear();
	});

	context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);

	context.imageSmoothingEnabled = false;
}

function Draw(brush, color, x, y, isDown) {
	if (isDown) {
    	if (brush === typePencil || brush === typeEraser) {
			if (brush === typePencil) {
				socket.emit('pencil', { x0:lastX, y0:lastY, x1:x, y1:y, color:selectedColor, thickness:document.getElementById(widthID).value });
      		} else if (selectedBrush === typeEraser) {
        		socket.emit('pencil', { x0:lastX, y0:lastY, x1:x, y1:y, color:'#FFFFFF', thickness:document.getElementById(widthID).value });
      		}
		} else if (brush === typeBucket) {
			//floodFill(x, y, hexToRgbA(color));
			socket.emit('bucket', { x:x, y:y, color:color });
		}
	}
	lastX = x;
	lastY = y;
}

function mousedown(e) {
	if (enabled) {
	  	if (selectedBrush === typeBucket) {
			Draw(selectedBrush, selectedColor, e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, true);
		} else if (selectedBrush === typePencil || selectedBrush === typeEraser) {
    		mousePressed = true;
    		Draw(selectedBrush, selectedColor, e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, false);
		}
	}
}

function mousemove(e) {
	if (enabled && mousePressed && (selectedBrush === typePencil || selectedBrush === typeEraser)) {
    	Draw(selectedBrush, selectedColor, e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, true);
	}
}

function mouseup(e) {
	if (enabled) {
    	mousePressed = false;
	}
}

function mouseleave(e) {
	if (enabled) {
    	mousePressed = false;
	}
}

function mouseenter(e) {
	if (enabled && e.buttons === 1 && (selectedBrush === typePencil || selectedBrush === typeEraser)) {
	  	mousePressed = true;
		Draw(selectedBrush, selectedColor, e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, false);
	}
}

function clearArea() {
	socket.emit('clear');
}

function clear() {
	context.setTransform(1, 0, 0, 1, 0, 0);
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function selectColor(hex) {
	console.log("selected color: " + hex);

	var btn = document.getElementById("color_" + selectedColor);
	btn.classList.remove("color-selected");
	btn.classList.add("color-unselected");
	//btn.setAttribute("class", "color-unselected");

	btn = document.getElementById("color_" + hex);
	btn.classList.remove("color-unselected");
	btn.classList.add("color-selected");

	selectedColor = hex;
}

function selectBrush(brush) {
	console.log("selected brush: " + brush);

	var btn = document.getElementById("brush_" + selectedBrush);
	btn.setAttribute("class", "brush-unselected");

	btn = document.getElementById("brush_" + brush);
	btn.setAttribute("class", "brush-selected");

	selectedBrush = brush;
}
