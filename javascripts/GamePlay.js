/********************************************** 
* GamePlay.js
* Houle, Daniel B. 
* CS350/491 Summer 2019
* This file implements the code needed for the
* "shape transformation game" on index.htm 
***********************************************/

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
  menu.style.display = "block";
  menu.innerHTML = '<button class="button" onclick="refreshCanvas();">Refresh</button><button class="button" onclick="clearCanvas();">Exit</button>'
} // end showGame

// This function resets the "game" to its original settings
function refreshCanvas() {

} // end refreshCanvas

// This function resets the "game" to its original settings,
// hides everything, and brings the button "game-play-show"
// back into view.
function clearCanvas() {
  var buttonStart = document.getElementById("game-play-show");
  buttonStart.style.display = "inline-block";
  var canvas = document.getElementById("game-play");
  var menu = document.getElementById("game-controlls");
  canvas.style.display = "none";
  menu.style.display = "none";
} // end clearCanvas

class Point {
  constructor(x, y) {
    2
    this.x = x;
    this.y = y;
    if (Point.count == undefined) {
      Point.count = 1; }
    else if (Point.count == 1) { 
      Point.count = 2;
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


