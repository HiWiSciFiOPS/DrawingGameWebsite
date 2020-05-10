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


function InitThis() {
	canvas = document.getElementById(canvasID);
	context = canvas.getContext("2d");

	canvas.addEventListener("mousedown", mousedown);
	canvas.addEventListener("mousemove", mousemove);
	canvas.addEventListener("mouseup", mouseup);
	canvas.addEventListener("mouseleave", mouseleave);
	canvas.addEventListener("mouseenter", mouseenter);

	//context.fillStyle = "rgba(0, 0, 255, 255)";
    //context.fillRect(0, 0, canvas.width, canvas.height);

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

function Draw(x, y, isDown) {
	if (isDown) {

    	if (selectedBrush === typePencil || selectedBrush === typeEraser) {
			if (selectedBrush === typePencil) {
        		//drawSingleLine(lastX, lastY, x, y, selectedColor);
				drawLine(lastX, lastY, x, y, selectedColor, document.getElementById(widthID).value);
      		} else if (selectedBrush === typeEraser) {
        		drawSingleLine(lastX, lastY, x, y, '#FFFFFF');
      		}
		}
	}
	lastX = x;
	lastY = y;
}

function sgn(x) {
	return (x > 0) ? 1 : (x < 0) ? -1 : 0;
}

function drawLine(x0, y0, x1, y1, color, thickness) {
	for (var i = 0; i < thickness/2; i++) {
		drawSingleLine(x0, y0+i, x1, y1+i, color);
	}
	for (var i = 0; i < thickness/2; i++) {
		drawSingleLine(x0, y0-i, x1, y1-i, color);
	}
}

function drawSingleLine(x0, y0, x1, y1, linecolor) {
	var tempCanvas = context.getImageData(0, 0, canvas.width, canvas.height);
	var imageData = tempCanvas.data;
	var color = hexToRgbA(linecolor);

	{
		var dx =  Math.abs(x1-x0), sx = x0<x1 ? 1 : -1;
		var dy = -Math.abs(y1-y0), sy = y0<y1 ? 1 : -1;
		var err = dx+dy, e2; /* error value e_xy */

		while (1) {
			setColorAt(imageData, x0, y0, color);
			if (x0===x1 && y0===y1) break;
			e2 = 2*err;
			if (e2 > dy) { err += dy; x0 += sx; } /* e_xy+e_x > 0 */
			if (e2 < dx) { err += dx; y0 += sy; } /* e_xy+e_y < 0 */
		}
	}

	tempCanvas.data = imageData;
	context.putImageData(tempCanvas, 0, 0);
}

class vec2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
}

function floodFill(x, y, fillColor) {
	var queue = [];

	context.fillStyle = "rgba("+fillColor[0]+","+fillColor[1]+","+fillColor[2]+","+fillColor[3]+")";

	queue.push(new vec2(x, y));

	var origColor = context.getImageData(queue[0].x, queue[0].y, 1, 1).data;

	if (!compareColors(origColor, fillColor)) {
		var tempCanvas = context.getImageData(0, 0, canvas.width, canvas.height);
		var imageData = tempCanvas.data;

		while (queue.length > 0) {
			var curr = queue.pop();
			var currColor = getColorAt(imageData, curr.x, curr.y);

			if (compareColors(currColor, origColor)) {
				setColorAt(imageData, curr.x, curr.y, fillColor);

				if (compareColors(getColorAt(imageData, curr.x+1, curr.y), origColor)) {
					queue.push(new vec2(curr.x+1, curr.y));
				}
				if (compareColors(getColorAt(imageData, curr.x, curr.y+1), origColor)) {
					queue.push(new vec2(curr.x, curr.y+1));
				}
				if (compareColors(getColorAt(imageData, curr.x-1, curr.y), origColor)) {
					queue.push(new vec2(curr.x-1, curr.y));
				}
				if (compareColors(getColorAt(imageData, curr.x, curr.y-1), origColor)) {
					queue.push(new vec2(curr.x, curr.y-1));
				}
			}
		}

		tempCanvas.data = imageData;
		context.putImageData(tempCanvas, 0, 0);
	}
}

function setColorAt(imgDat, x, y, color) {
	var offset = (x*4)+((y*canvas.width)*4);
	imgDat[offset+0] = color[0];
	imgDat[offset+1] = color[1];
	imgDat[offset+2] = color[2];
	imgDat[offset+3] = color[3];
}

function getColorAt(imgDat, x, y) {
	var toReturn = [];
	var offset = (x*4)+((y*canvas.width)*4);
	toReturn[0] = imgDat[offset+0];
	toReturn[1] = imgDat[offset+1];
	toReturn[2] = imgDat[offset+2];
	toReturn[3] = imgDat[offset+3];
	return toReturn;
}

function compareColors(first, second) {
	if (first[0] === second[0] &&
		first[1] === second[1] &&
		first[2] === second[2] &&
		first[3] === second[3]) {
		return true;
	}
	return false;
}

function clearArea() {
	context.setTransform(1, 0, 0, 1, 0, 0);
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
}

function selectColor(hex) {
	console.log("selected color: " + hex);

	var btn = document.getElementById("color_" + selectedColor);
	btn.setAttribute("class", "color-unselected");

	btn = document.getElementById("color_" + hex);
	btn.setAttribute("class", "color-selected");

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

function hexToRgbA(hex) {
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
		var toReturn = [];
		toReturn[0] = (c>>16)&255;
		toReturn[1] = (c>>8)&255;
		toReturn[2] = c&255;
		toReturn[3] = 255;
		return toReturn;
    }
    throw new Error('Bad Hex');
}
