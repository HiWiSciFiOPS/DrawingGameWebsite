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

	context.fillStyle = "rgba(0, 0, 255, 255)";
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function mousedown(e) {
	if (enabled) {
	  	if (document.getElementById(brushTypeID).value === typeBucket) {
			floodFill(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, [255, 0, 0, 255]);
		} else {
    		mousePressed = true;
    		Draw(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, false);
		}
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

		} else if (brushType === typeBucket) {
			floodFill(x, y, [255, 0, 0, 255]);
		}
	}
	lastX = x;
	lastY = y;
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

		// TODO: write new data to imageData
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
	// (x*4)+((y*canvas.width)*4)
	var toReturn = [];
	var offset = (x*4)+((y*canvas.width)*4);
	toReturn[0] = imgDat[offset+0];
	toReturn[1] = imgDat[offset+1];
	toReturn[2] = imgDat[offset+2];
	toReturn[3] = imgDat[offset+3];
	return toReturn;
}

function compareColors(first, second) {
	if (first[0] === second[0] && first[1] === second[1] && first[2] === second[2] && first[3] === second[3]) {
		return true;
	}
	return false;
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
