/********************************************** 
* GamePlay.js
* Houle, Daniel B. 
* CS350/491 Summer 2019
* This file implements the code needed for the
* "shape transformation game" on index.htm 
***********************************************/

// Macros used to determine the operations of the code.
const MAXPOINTS = 5; // maximum number of Point objects
const UPDATECOLOR = 0.8; // The threshold to beat for a Point to change its color
const UPDATEPOS = 0.75; // The threshold to beat for a Point to change its position
const UPDATESHAPE = 0.9; // The threshold to beat for a Point to change its shape
const SPEED = 250; // Number of milliseconds between intervals of the program

var points = new Array();
var shapes = new Array('rectangle', 'square', 'circle', 'oval', 'triangle', 'line');
var colors = new Array('red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple');
var interval; // Used to store the ID returned by setInterval()


// This function exposes the "game" to the user
function showGame() {
  var buttonStart = document.getElementById("game-play-show");
  buttonStart.style.display = "none";
  var canvas = document.getElementById("game-play");
  var ctx = canvas.getContext("2d");
  var menu = document.getElementById("game-controlls");
  var controllButtons = '<input type="button" class="button" value="Refresh" onclick="refreshCanvas();">';
  controllButtons += '<input type="button"  class="button" value="Exit" onclick="clearCanvas();">';
  // canvas.parentElement.style.width = "100%";
  canvas.style.display = "inline-block"; 
  // canvas.style.position = "relative"; 
  canvas.style.margin = '0px';
  ctx.canvas.width  = document.body.offsetWidth;//window.innerWidth;
  ctx.canvas.height = document.body.offsetWidth;//window.innerHeight;
  // canvas.setAttribute("width",canvas.parentElement.style.width);  TODO
  // canvas.setAttribute("height",canvas.parentElement.style.height);  
  canvas.style.backgroundColor = "white";
  gameInstructions(ctx);
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
  clearInterval(interval);
  points.length = 0; // resets any & all references to the points Array
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
  ctx.resetTransform();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
} // end wipeCanvasClean

// This function stores a users click location as a point.
function captureClick(e) {
  var canvas = document.getElementById("game-play");
  if (Point.getCount() != MAXPOINTS) {
    if (Point.getCount() < MAXPOINTS) {
      if (Point.getCount() == 0) { wipeCanvasClean(canvas); }
      points[Point.getCount()] = new Point(e.offsetX, e.offsetY, canvas);
    }
    if (Point.getCount() == MAXPOINTS) {
      interval = setInterval(runOverPoints, SPEED, canvas);
    }
  }
  else {
    e.stopPropagation();
  }
} // end captureClick

// Function itterates over the `points` Array
function runOverPoints(canvas) {
  var ctx = canvas.getContext("2d");
  wipeCanvasClean(canvas);
  for(let point of points) {
    drawThings(point, canvas);
    point.maybeUpdate(canvas);
  }
} //end runOverPoints

// Function draws a pseudorandom shape in a pseudorandom color
function drawThings(point, canvas){
  var ctx = canvas.getContext("2d");
  var info = point.getShapeInfo();

  ctx.fillStyle = point.getColor();
  ctx.strokeStyle = point.getColor();
  switch (point.getShape()) {
    case 'rectangle':
      ctx.fillRect(info.centerX, info.centerY, info.width, info.height);
      break;
    case 'square':
      ctx.fillRect(info.centerX, info.centerY, info.width, info.width);
      break;
    case 'circle':
      ctx.beginPath();
      ctx.arc(info.centerX, info.centerY, info.radius, info.startAngle, info.endAngle); 
      ctx.fill();
      ctx.stroke();
      break;
    case 'oval':
      // ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle)
      ctx.beginPath();
      ctx.ellipse(info.centerX, info.centerY, info.radiusX, info.radiusY, info.rotation, info.startAngle, info.endAngle);
      ctx.fill();
      ctx.stroke();
      break;
    case 'triangle':
      ctx.beginPath();
      ctx.moveTo(info.oneX, info.oneY);
      ctx.lineTo(info.twoX, info.twoY);
      ctx.lineTo(info.thrX, info.thrY);
      ctx.fill();
      break;
    case 'line':
      ctx.beginPath();
      ctx.moveTo(info.oneX, info.oneY);
      ctx.lineTo(info.twoX, info.twoY);
      ctx.stroke(); 
      break;
  } // end switch
} // end drawThings



// Object holds the info for a single mouse click.
// The object updates its own position, shape, & color IFF
// the thresholds set by the macros are met or exceeded.
class Point {
  
  constructor(x, y, canvas) {
    this.x = x; // mouse click
    this.y = y; // mouse click
    this.shape = shapes[Math.floor(Math.random()*shapes.length)];
    this.color = colors[Math.floor(Math.random()*colors.length)];
    this.constructShapeInfo(canvas);
    if (Point.count == undefined) {
      Point.count = 1; }
    else if (Point.count < MAXPOINTS) { 
      Point.count += 1;
    }
  } // end constructor

  // creates the shapes info
  constructShapeInfo(canvas) {
    var width = this.getNumInRange(canvas.offsetWidth/6,canvas.offsetWidth/2);
    var height = this.getNumInRange(canvas.offsetHeight/6,canvas.offsetHeight/2);
    var points;
    switch (this.shape) {
      case 'rectangle':
        this.centerX = Math.floor(this.x - (width / 2));
        this.centerY = Math.floor(this.y - (height / 2));
        if (Math.floor(Math.random() + 0.5) == 0) {
          this.width = width;
          this.height = height;
        }
        else {
          this.width = height;
          this.height = width;
        }
        break;
      case 'square':
        this.centerX = Math.floor(this.x - (width / 2));
        this.centerY = Math.floor(this.y - (height / 2));
        this.width = width;
        this.height = height;
        break;
      case 'circle':
        this.radius = (width / 2);
        this.centerX = this.x;
        this.centerY = this.y;
        this.startAngle = 0;
        this.endAngle = 2 * Math.PI;
        break;
      case 'oval':
        this.centerX = this.x;
        this.centerY = this.y;
        // ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle)
        if (Math.floor(Math.random() + 0.5) == 0) {
          this.radiusX = Math.floor(height/2);
          this.radiusY = Math.floor(width/2);
          this.rotation = Math.PI / 2;
          this.startAngle = 0;
          this.endAngle = 2 * Math.PI;
        }
        else {
          this.radiusX = Math.floor(width/2);
          this.radiusY = Math.floor(height/2);
          this.rotation = Math.PI / 4;
          this.startAngle = 0;
          this.endAngle = 2 * Math.PI;
        }
        break;
      case 'triangle':
        points = this.centerTriangle(this.x, this.y, this.getOtherPoint(width, 1, this.x, this.y), this.getOtherPoint(width, 2, this.x, this.y));
        this.oneX = points.oneX;
        this.oneY = points.oneY;
        this.twoX = points.twoX;
        this.twoY = points.twoY;
        this.thrX = points.thrX;
        this.thrY = points.thrY;
        break;
      case 'line':
        points = this.centerLine(this.x, this.y, this.getOtherPoint(width, null, this.x, this.y));
        this.oneX = points.oneX;
        this.oneY = points.oneY;
        this.twoX = points.twoX;
        this.twoY = points.twoY;
        break;
    } // end switch
  } // end constructShapeInfo

  // Function returns a number between the min and max given
  getNumInRange(min,max) {
    return Math.floor(Math.random() * (max - min) + min);
  } //end getNumInRange

  // Function returns offset points based off of a radius, centered on (offX,offY)
  getOtherPoint(radius, random, offX, offY) {
    var angle;
    switch (random) {
      case 1:
        angle = 60 * Math.PI / 180;
        break;
      case 2:
        angle = 120 * Math.PI / 180;
        break;
      default:
        angle = Math.random() * Math.PI * 2;
    }
    return {
      x: Math.floor(Math.cos(angle) * radius) + offX,
      y: Math.floor(Math.sin(angle) * radius) + offY
    };
  } // end getOtherPoint

  // Function returns 3 points for a triangle, centered around the mouse click
  centerTriangle(oX, oY, other, otherO) {
    var dY = Math.floor(oY - ((oY + other.y + otherO.y)/3)); // midway on the Y-plane from mouse click
    return {
      oneX: oX,
      oneY: oY + dY,
      twoX: other.x,
      twoY: other.y + dY,
      thrX: otherO.x,
      thrY: otherO.y + dY
    }
  } // end centerTriangle

  // Function returns 2 points for a line, centered around the mouse click
  centerLine(oX, oY, other) {
    var dX = Math.floor((oX - other.x)/2); // midway on the X-plane
    var dY = Math.floor((oY - other.y)/2); // midway on the Y-plane
    return {
      oneX: oX + dX,
      oneY: oY + dY,
      twoX: other.x + dX,
      twoY: other.y + dY
    }
  } // end centerLine
  
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

  // Returns shape of Point
  getShape() {
    return this.shape;
  } // end getShape

  // Returns color of Point
  getColor() {
    return this.color;
  } // end getColor

  // Returns Points shapes info
  getShapeInfo() {
    switch (this.shape) {
      case 'rectangle':
        return {
          centerX: this.centerX,
          centerY: this.centerY,
          width: this.width,
          height: this.height
        }
        break;
      case 'square':
        return {
          centerX: this.centerX,
          centerY: this.centerY,
          width: this.width,
          height: this.height
        }
        break;
      case 'circle':
        return {
          radius: this.radius,
          centerX: this.centerX,
          centerY: this.centerY,
          startAngle: this.startAngle,
          endAngle: this.endAngle
        }
        break;
      case 'oval':
        return {
          centerX: this.centerX,
          centerY: this.centerY,
          radiusX: this.radiusX,
          radiusY: this.radiusY,
          rotation: this.rotation,
          startAngle: this.startAngle,
          endAngle: this.endAngle
        }
        break;
      case 'triangle':
        return {
          oneX: this.oneX,
          oneY: this.oneY,
          twoX: this.twoX,
          twoY: this.twoY,
          thrX: this.thrX,
          thrY: this.thrY
        }
        break;
      case 'line':
        return {
          oneX: this.oneX,
          oneY: this.oneY,
          twoX: this.twoX,
          twoY: this.twoY
        }
        break;
    } // end switch
  } // end getShapeInfo

  // Updates objects color property, maybe
  updateColor() {
    if (Math.random() >= UPDATECOLOR) {
      this.color = colors[Math.floor(Math.random()*colors.length)];
    }
  } // end updateColor

  // Updates this.x & this.y for the point, maybe
  updatePos(canvas) {
    if (Math.random() >= UPDATEPOS) {
      var tempX, tempY;
      if (Math.floor(Math.random() + 0.5) == 0) {
         tempX = this.x + Math.floor(canvas.width * 0.2); 
         tempY = this.y + Math.floor(canvas.height * 0.2);
      }
      else {
         tempX = this.x + Math.floor(canvas.width * 0.2) * -1; 
         tempY = this.y + Math.floor(canvas.height * 0.2) * -1;
      }
      // Need to make sure the objects don't go outside of the canvas element
      if (((tempX > 0) && (tempX < canvas.width)) && ((tempY > 0) && (tempY < canvas.height))) {
        this.x = tempX;
        this.y = tempY;
        this.constructShapeInfo(canvas);
      }
    }
  } // end updatePos

  // Updates objects shape, maybe
  updateShape(canvas) {
    if (Math.random() >= UPDATESHAPE) {
      this.shape = shapes[Math.floor(Math.random()*shapes.length)];
      this.constructShapeInfo(canvas);
    }
  } // end updateShape

  // Calls the other functions to see if the object properties will be updated
  maybeUpdate(canvas) {
    this.updateColor();
    this.updatePos(canvas);
    this.updateShape(canvas);
  } // end maybeUpdate

  // Return a count for the number of Point objects
  static getCount() {
    return (Point.count == undefined) ? 0 : Point.count;
  } // end getCount

  // Resets the class element to 0
  static resetCount() {
    Point.count = undefined;
  } // end resetCount

  
} // end Point class


