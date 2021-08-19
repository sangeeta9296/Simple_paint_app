	// Declaring Global variables for the script
	var color;
	var background_color;
		
	var rectangleCount;
	var rectangles;
	var context;
	var drag_and_draw;
	var drag_and_move;
	var dragX;
	var dragY;
	var dragIndexDelete;
	var dragIndexMove;
	var dragStartLocation;

	var canvas;
	var canvasImage;

	var mouseX;
	var mouseY;
	var radius;
	var w;
	var h;
	var targetX;
	var targetY;
	var tempX;
	var tempY;
	var dx;
	var dy;
	var flagRandom= false;

window.addEventListener('load', init, false);
window.onload = window.onresize = function() 
	{
		var canvas = document.getElementById('canvas');
		canvas.width = window.innerWidth * 0.6;
		canvas.height = window.innerHeight * 0.8;
		drawRectangles();
	}	
function init() 
	{
		canvas = document.getElementById("canvas");
		context = canvas.getContext('2d');
		context.lineWidth = 4;
		context.lineCap = 'round';
	
		rectangleCount=0;	
		drag_and_draw = false;
		background_color = "#000000";
		rectangles = [];
		
		canvas.addEventListener('mousedown', dragStart, false);
		canvas.addEventListener('mousemove', drag, false);
		canvas.addEventListener('mouseup', dragStop, false);
				canvas.addEventListener('dblclick', deleteRectangle,false);
	}	

function dragStart(event) {
    drag_and_draw = true;
    dragStartLocation = getCanvasCoordinates(event);
	color = "rgb(" + Math.floor(Math.random()*200) + "," + Math.floor(Math.random()*200) + "," + Math.floor(Math.random()*200) +")";
    getImage();
}

function drag(event) {
    var position;
    if (drag_and_draw === true) {
        putImage();
        position = getCanvasCoordinates(event);
        drawRectangle(position);
		context.fillStyle = color;
		context.fill();
    }
}
function dragStop(event) {
    drag_and_draw = false;
    putImage();
    var position = getCanvasCoordinates(event);
    drawRectangle(position);		
	context.fillStyle = color;
	context.fill();	
	rectangleCount=rectangleCount+1;
	tempRectangle = {x:tempX, y:tempY, w:position.x,h:position.y, color:color};
	
	rectangles.push(tempRectangle);
	
}
	
function getCanvasCoordinates(event) {

    var x = event.clientX - canvas.getBoundingClientRect().left,
        y = event.clientY - canvas.getBoundingClientRect().top;

    return {x: x, y: y};
}

function getImage() {
    canvasImage = context.getImageData(0, 0, canvas.width, canvas.height);
}

function putImage() {
    context.putImageData(canvasImage, 0, 0);
}

function drawRectangle(position) {
	
		tempX=dragStartLocation.x;
		tempY=dragStartLocation.y;
		context.beginPath();
		context.rect(tempX,tempY,position.x-tempX,position.y-tempY, false);
		context.closePath();
}

function drawScreen() {
		rectangleCount=0;
		rectangles = [];
		context.fillStyle = background_color;
		context.fillRect(0,0,canvas.width,canvas.height);
	}	

	
function togglebtn(){

		if(document.getElementById("btnMve").name == "Draw Shape")
			{ 	
		
				canvas.removeEventListener("mousedown", mouseDown, false);
				document.getElementById("btnMve").src = "moveButton.jpg";
				document.getElementById("btnMve").name = "Move Shape";		
				document.getElementById("spid").innerHTML="Click here to move the rectangles";
		
				canvas.addEventListener('mousedown', dragStart, false);
				canvas.addEventListener('mousemove', drag, false);
				canvas.addEventListener('mouseup', dragStop, false);				
			}
	  else if(document.getElementById("btnMve").name == "Move Shape")
	  {         
		
				canvas.removeEventListener("mousedown", dragStart, false);
				canvas.removeEventListener("mousemove", drag, false);
				canvas.removeEventListener("mouseup", dragStop, false);
				
				document.getElementById("btnMve").src = "drawButton.jpg";
				document.getElementById("btnMve").name = "Draw Shape";
				document.getElementById("spid").innerHTML="Click here to draw the rectangles";
				
				canvas.addEventListener('mousedown', mouseDown, false);
	   }
 }

	function drawRectangles() {
		var i;
		var x;
		var y;
		//var rad;
		var w;
		var h;
		var color;
		
		context.fillStyle = background_color;
		context.fillRect(0,0,canvas.width,canvas.height);		
		
		for (i=0; i < rectangleCount; i++) {
			h = rectangles[i].h;
			w = rectangles[i].w;
			x = rectangles[i].x;
			y = rectangles[i].y;
			color=rectangles[i].color;
			context.beginPath();
			context.rect(x, y, w,h,false);
			context.closePath();
			context.fillStyle = color;
			context.fill();
		}		
	}	

	function isRectangleClicked(shape,mx,my) {		
		var dx;
		var dy;
		dx = mx - shape.x;
		dy = my - shape.y;
		return (dx*dx + dy*dy < shape.h*shape.h+shape.w*shape.w);
	}

function deleteRectangle(event) 
{
		var i;
		var bRect = canvas.getBoundingClientRect();
//		var highestIndex=-1;
		dragIndexDelete=-1;
		
		mouseX = (event.clientX - bRect.left)*(canvas.width/bRect.width);
		mouseY = (event.clientY - bRect.top)*(canvas.height/bRect.height);
		//To find that which circle has been clicked
		for (i=0; i < rectangleCount; i++) {
			if	(isRectangleClicked(rectangles[i], mouseX, mouseY)) {
				dragIndexDelete = i;		
			}
		}
		//Remove the circle from the array
		if ( dragIndexDelete> -1 ){
			rectangles.splice(dragIndexDelete,1)[0];
			rectangleCount=rectangleCount-1;
		}
		
		if (event.preventDefault) {
			event.preventDefault();
		} 
		else if (event.returnValue) {
			event.returnValue = false;
		} 
		drawRectangles();				
		return false;
}

function mouseDown(event) 
{
		var i;
		var highestIndex = -1;		
		var bRect = canvas.getBoundingClientRect();
	
		mouseX = (event.clientX - bRect.left)*(canvas.width/bRect.width);
		mouseY = (event.clientY - bRect.top)*(canvas.height/bRect.height);
		
		for (i=0; i < rectangleCount; i++) {
			if	(isRectangleClicked(rectangles[i], mouseX, mouseY)) {
				drag_and_move = true;
				if (i > highestIndex) {
					dragX = mouseX - rectangles[i].x;
					dragY = mouseY - rectangles[i].y;
					highestIndex = i;
					dragIndexMove = i;
				}				
			}
		}
		if (drag_and_move) {
			window.addEventListener("mousemove", mouseMove, false);
			
			rectangles.push(rectangles.splice(dragIndexMove,1)[0]);
			
		}
		canvas.removeEventListener("mousedown", mouseDown, false);
		window.addEventListener("mouseup", mouseUp, false);
		
		if (event.preventDefault) {
				event.preventDefault();
			} 
		else if (event.returnValue) {
				event.returnValue = false;
			} 
		return false;
}
	
	function mouseUp(event) {

		canvas.addEventListener("mousedown", mouseDown, false);
		window.removeEventListener("mouseup", mouseUp, false);
		if (drag_and_move) {
			drag_and_move = false;
			window.removeEventListener("mousemove", mouseMove, false);
		}
	}

	function mouseMove(event) {
		
		var posX;
		var posY;
		var shapeRad = rectangles[rectangleCount-1].rad;
		var minX = shapeRad;
		var maxX = canvas.width - shapeRad;
		var minY = shapeRad;
		var maxY = canvas.height - shapeRad;
		
		var bRect = canvas.getBoundingClientRect();
		mouseX = (event.clientX - bRect.left)*(canvas.width/bRect.width);
		mouseY = (event.clientY - bRect.top)*(canvas.height/bRect.height);
		
		posX = mouseX - dragX;
		posX = (posX < minX) ? minX : ((posX > maxX) ? maxX : posX);
		posY = mouseY - dragY;
		posY = (posY < minY) ? minY : ((posY > maxY) ? maxY : posY);
		
		rectangles[rectangleCount-1].x = posX;
		rectangles[rectangleCount-1].y = posY;
		
		drawRectangles();
	}
	

function moveRandomly(){
	
	if(document.getElementById("btnMove").name=="Move Random")
		{		
			flagRandom=true;
			document.getElementById("btnMove").name="Stop Random";
			moveRandom();
		}
		
	else{
		
			flagRandom=false;
			document.getElementById("btnMove").name="Move Random";
			clearInterval();
		}		
}
	
function moveRandom(){
	if(flagRandom==true)
	{	
		for (i=0; i < rectangleCount; i++) {
			
			dx=Math.floor((Math.random()*50));
			dy=Math.floor((Math.random()*50));

			context.clearRect(0,0,canvas.width,canvas.height);
			context.beginPath();
			context.fillStyle=rectangles[i].color;

			context.rect(rectangles[i].x,rectangles[i].y,rectangles[i].h,rectangles[i].w,true);
			context.closePath();
			context.fill();

			if( rectangles[i].x<0 || rectangles[i].x>canvas.width)
				dx=-7*dx;
			if( rectangles[i].y<0 || rectangles[i].y>canvas.height)
				dy=-7*dy;
			rectangles[i].x+=dx;
			rectangles[i].y+=dy;
		}
	
		drawRectangles();
	}
	
	else
	{
		clearInterval();
	}
}

setInterval(moveRandom,10); 