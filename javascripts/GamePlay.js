/********************************************** 
* GamePlay.js
* Houle, Daniel B. 
* CS350/491 Summer 2019
* This file implements the code needed for the
* "shape transformation game" on index.htm 
***********************************************/

var points = new Array();
var shapes = new Array('rectangle', 'square', 'circle', 'oval', 'triangle', 'line');
var colors = new Array('red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple');

// This function exposes the "game" to the user
function showGame() {
  var buttonStart = document.getElementById("game-play-show");
  buttonStart.style.display = "none";
  var canvas = document.getElementById("game-play");
  var menu = document.getElementById("game-controlls");
  var controllButtons = '<input type="button" class="button" value="Refresh" onclick="refreshCanvas();">';
  controllButtons += '<input type="button"  class="button" value="Exit" onclick="clearCanvas();">';
  // canvas.parentElement.style.width = "100%";
  canvas.style.display = "block"; 
  canvas.style.position = "relative"; 
  canvas.style.width = "100%"; 
  canvas.style.height = "100%"; 
  canvas.style.backgroundColor = "white";
  gameInstructions(canvas.getContext("2d"));
  // canvas.addEventListener();
  menu.style.display = "block";
  menu.innerHTML = controllButtons;
} // end showGame

// This function resets the "game" to its original settings
function refreshCanvas() {
  var canvas = document.getElementById("game-play");
  var ctx = canvas.getContext("2d");
  wipeCanvasClean(canvas);
  gameInstructions(ctx);
  Point.resetCount();
} // end refreshCanvas

// This function resets the "game" to its original settings,
// hides everything, and brings the button "game-play-show"
// back into view.
function clearCanvas() {
  refreshCanvas();
  var buttonStart = document.getElementById("game-play-show");
  buttonStart.style.display = "inline-block";
  var canvas = document.getElementById("game-play");
  var menu = document.getElementById("game-controlls");
  canvas.style.display = "none";
  menu.style.display = "none";
} // end clearCanvas

// function merely returns the string that informs the user what to do
function gameInstructions(ctx) {
  ctx.fillText("Please click on 5 arbitrary spots within this box to begin", 5, 10);
} // end gameInstructions

// function clear the canvas of everything
function wipeCanvasClean(canvas) {
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = 'black';
  ctx.clearRect(0, 0, canvas.width, canvas.height);
} // end wipeCanvasClean

// This function stores a users click location as a point.
function captureClick(e) {
  var canvas = document.getElementById("game-play");
  if (Point.getCount() < 6) {
    wipeCanvasClean(canvas);
    points[Point.getCount()] = new Point(e.offsetX, e.offsetY);
    // document.getElementById("pt1").innerHTML = point1.value(); 
  }
  if (Point.getCount() == 5) {
    for(let point of points) {
      drawThings(point, canvas);
    }
  }
} // end captureClick

// Function draws a pseudorandom shape in a pseudorandom color
function drawThings(point, canvas){
  var ctx = canvas.getContext("2d");
  var shape = 'square';//shapes[Math.floor(Math.random()*shapes.length)];
  var color = colors[Math.floor(Math.random()*colors.length)];
  var width = getNumInRange(canvas.offsetWidth * (1/6),canvas.offsetWidth * (1/2));
  var height = getNumInRange(canvas.offsetHeight * (1/6),canvas.offsetHeight * (1/2));
  console.log('shape:',shape, 'color:',color, 'width:',width, 'height:',height, 'cWidth:',canvas.offsetWidth, 'cHeight:',canvas.offsetHeight,'Point:', point);
  console.log('topX:',Math.floor(point.getX() - ( width / 2)), 'topY:',Math.floor(point.getY() - ( height / 2)));
  ctx.fillStyle = color;
  switch (shape) {
    case 'rectangle':
      ctx.fillRect(
        Math.floor(point.getX() - ( width / 2)),Math.floor(point.getY() - ( height / 2)),width,height
      );
      break;
    case 'square':
      ctx.fillRect(
        Math.floor(point.getX() - ( width / 2)),Math.floor(point.getY() - ( width / 2)),width,width
      );
      break;
    case 'circle':
      
      break;
    case 'oval':
      
      break;
    case 'triangle':
      
      break;
    case 'line':
      
      break;
  } // end switch
} // end drawThings

// Function returns a number between the min and max given
function getNumInRange(min,max) {
  return Math.floor(Math.random() * (max - min) + min);
} //end getNumInRange

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    if (Point.count == undefined) {
      Point.count = 1; }
    else if (Point.count < 6) { 
      Point.count += 1;
    }
  } // end constructor
  
  // Return the point in the format "(x, y)"
  value() {
    return "(" + this.x + ", " + this.y + ")";
  } // end value

  // Returns the x-value
  getX() {
    return this.x;
  } // end getX

  // Returns the y-value
  getY() {
    return this.y;
  } // end getY


  // Return a count for the number of Point objects
  static getCount() {
    return (Point.count == undefined) ? 0 : Point.count;
  } // end getCount

  // Resets the class element to 0
  static resetCount() {
    Point.count = undefined;
  } // end resetCount

  
} // end Point class


