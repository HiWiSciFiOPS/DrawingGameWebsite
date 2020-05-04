var mousePressed = false;
var lastX, lastY;
var context;
var canvas;

var enabled = true;

const canvasID = "drawingCanvas";
const clearButtonID = "clearButton";
const brushTypeID = "brushT";
	const typePencil = "pencil";
	const typeBucket = "bucket";
	const typeEraser = "eraser";
const colorID = "setColor";
const widthID = "setLWidth";


function InitThis() {
	canvas = document.getElementById(canvasID);
	context = canvas.getContext("2d");
	
	canvas.addEventListener("mousedown", mousedown);
	canvas.addEventListener("mousemove", mousemove);
	canvas.addEventListener("mouseup", mouseup);
	canvas.addEventListener("mouseleave", mouseleave);
	canvas.addEventListener("mouseenter", mouseenter);
}

function mousedown(e) {
	if (enabled) {
		mousePressed = true;
		Draw(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, false);
	}
}

function mousemove(e) {
	if (enabled && mousePressed) {
		Draw(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, true);
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
	if (enabled && e.buttons === 1) {
		mousePressed = true;
		Draw(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, false);
	}
}

function Draw(x, y, isDown) {
	if (isDown) {
		var brushType = document.getElementById(brushTypeID).value;
		
		if (brushType === typePencil || brushType === typeEraser) {
			context.beginPath();
			
			if (brushType === typePencil) {
				context.strokeStyle = document.getElementById(colorID).value;
			} else if (brushType === typeEraser) {
				context.strokeStyle = "white";
			}
			
			context.lineWidth = document.getElementById(widthID).value;
			context.lineJoin = "round";
			context.moveTo(lastX, lastY);
			context.lineTo(x, y);
			context.closePath();
			context.stroke();
		}
	}
	lastX = x;
	lastY = y;
}

function clearArea() {
	context.setTransform(1, 0, 0, 1, 0, 0);
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

function toggleEnabled() {
	setEnabled(!document.getElementById(clearButtonID).disabled);
}

function setEnabled(_enabled) {
	_enabled = !_enabled;
	document.getElementById(clearButtonID).disabled = !_enabled;
	document.getElementById(brushTypeID).disabled = !_enabled;
	document.getElementById(widthID).disabled = !_enabled;
	document.getElementById(colorID).disabled = !_enabled;
	enabled = _enabled;
	clearArea();
	//var image = canvas.toDataURL("image/png");
	//document.write('<img src="' + image + '"/>');
}