

function Draw(x, y, isDown) {
	if (isDown) {

    	if (selectedBrush === typePencil || selectedBrush === typeEraser) {
			if (selectedBrush === typePencil) {
				drawLine(lastX, lastY, x, y, selectedColor, document.getElementById(widthID).value);
      		} else if (selectedBrush === typeEraser) {
        		drawLine(lastX, lastY, x, y, '#FFFFFF', document.getElementById(widthID).value);
      		}
		}
	}
	lastX = x;
	lastY = y;
}

function fillCircle(imageData, xp ,yp, radius, col) {
    var xoff = 0;
    var yoff = radius;
    var balance = -radius;

    while (xoff <= yoff) {
         var p0 = xp - xoff;
         var p1 = xp - yoff;

         var w0 = xoff + xoff;
         var w1 = yoff + yoff;

         imageData = hLine(imageData, p0, yp + yoff, w0, col);
         imageData = hLine(imageData, p0, yp - yoff, w0, col);

		 imageData = hLine(imageData, p1, yp + xoff, w1, col);
         imageData = hLine(imageData, p1, yp - xoff, w1, col);

        if ((balance += xoff++ + xoff)>= 0) {
            balance -= --yoff + yoff;
        }
    }

	return imageData;
}

function hLine(imageData, xp, yp, w, col) {
    for (var i = 0; i < w; i++){
		setColorAt(imageData, xp + i, yp, col);
    }
	return imageData;
}

function drawLine(x0, y0, x1, y1, lcolor, thickness) {
	var tempCanvas = context.getImageData(0, 0, canvas.width, canvas.height);
	var imageData = tempCanvas.data;
	var color = hexToRgbA(lcolor);
	console.log('color: ' + color);

	imageData = fillCircle(imageData, x0, y0, Math.floor(thickness/2), color);
	imageData = fillCircle(imageData, x1, y1, Math.floor(thickness/2), color);

	var dx = Math.abs(x0-x1);
	var dy = Math.abs(y0-y1);

	if (dx>dy) {
		for (var i = 0; i < thickness/2; i++) {
			imageData = drawSingleLine(imageData, x0, y0+i, x1, y1+i, color);
		}
		for (var i = 0; i < thickness/2; i++) {
			imageData = drawSingleLine(imageData, x0, y0-i, x1, y1-i, color);
		}
	} else {
		for (var i = 0; i < thickness/2; i++) {
			imageData = drawSingleLine(imageData, x0+i, y0, x1+i, y1, color);
		}
		for (var i = 0; i < thickness/2; i++) {
			imageData = drawSingleLine(imageData, x0-i, y0, x1-i, y1, color);
		}
	}

	tempCanvas.data = imageData;
	context.putImageData(tempCanvas, 0, 0);
}

function drawSingleLine(imageData, x0, y0, x1, y1, color) {
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
	return imageData;
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
