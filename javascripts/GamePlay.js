/********************************************** 
* GamePlay.js
* Houle, Daniel B. 
* CS350/491 Summer 2019
* This file implements the code needed for the
* "shape transformation game" on index.htm 
***********************************************/

var points = new Array();

// This function exposes the "game" to the user
function showGame() {
  var buttonStart = document.getElementById("game-play-show");
  buttonStart.style.display = "none";
  var canvas = document.getElementById("game-play");
  var menu = document.getElementById("game-controlls");
  // canvas.parentElement.style.width = "100%";
  canvas.style.display = "block"; 
  canvas.style.position = "relative"; 
  canvas.style.width = "100%"; 
  canvas.style.height = "100%"; 
  canvas.style.backgroundColor = "white";
  gameInstructions(canvas.getContext("2d"));
  // canvas.addEventListener();
  menu.style.display = "block";
  menu.innerHTML = '<input type="button" class="button" value="Refresh" onclick="refreshCanvas();"><input type="button"  class="button" value="Exit" onclick="clearCanvas();">'
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
} // end wipeCanvasClean

// This function stores a users click location as a point.
function captureClick(e) {
  
  if (Point.getCount() < 6) {
    wipeCanvasClean(document.getElementById("game-play"));
    points[Point.getCount()] = new Point(e.clientX, e.clientY);
    // document.getElementById("pt1").innerHTML = point1.value(); 
  }
  if (Point.getCount() == 5) {
    
  }
} // end captureClick

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

  // Return a count for the number of Point objects
  static getCount() {
    return (Point.count == undefined) ? 0 : Point.count;
  } // end getCount


  static resetCount() {
    Point.count = undefined;
  } // end resetCount

  // Return the distance between the two points or null if one 
  // or more of the points is missing.
  static distance(pt1, pt2) {
    var xDist, yDist; // distances apart in the 2 dimensions var distance; // distance apart with direct connection
    if (Point.count == 2) {
      xDist = pt1.x - pt2.x;
      yDist = pt1.y - pt2.y;
      distance = Math.sqrt(xDist * xDist + yDist * yDist);
    }
    else {
      distance = null; 
    }
    return distance; 
  } // end distance
} // end Point class


