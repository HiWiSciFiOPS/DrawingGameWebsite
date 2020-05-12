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


//connection stuff
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

	context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, canvas.width, canvas.height);

	context.imageSmoothingEnabled = false;
}

function mousedown(e) {
	if (enabled) {
	  	if (selectedBrush === typeBucket) {
			floodFill(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, hexToRgbA(selectedColor));
		} else if (selectedBrush === typePencil || selectedBrush === typeEraser) {
    		mousePressed = true;
    		Draw(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, false);
		}
	}
}

function mousemove(e) {
	if (enabled && mousePressed && (selectedBrush === typePencil || selectedBrush === typeEraser)) {
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
	if (enabled && e.buttons === 1 && (selectedBrush === typePencil || selectedBrush === typeEraser)) {
	  	mousePressed = true;
		Draw(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, false);
	}
}

function clearArea() {
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
