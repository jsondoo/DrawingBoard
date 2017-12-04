var socket;
var r;
var g;
var b;
var slider;
var sizecounter;

// runs once at the beginning
function setup() {
  // socket = io.connect('localhost:3000');
  socket = io.connect('https://draw-your-thang.herokuapp.com/');

  // these need a call back function
  socket.on('syncDrawing', newDrawing);
  socket.on('currentState', currentState);
  socket.on('usersOnline', usersOnline);
  socket.on('clear canvas', function() {
    clear();
  })

  // assign a random color to the client
  r = random(100,255);
  g = random(100,255);
  b = random(100,255);

  ////////////
  slider = createSlider(1,8, 5);
  slider.parent('slider');
  sizecounter = select(".sizecounter");
  sizecounter.html(slider.value());
  var canvas = createCanvas(750,500);
  canvas.class('canvas');
  canvas.parent('canvas-holder');
  background('white');
  ////////////

  strokeWeight(5); // pen size
}

// called when the mouse is dragged
function mouseDragged() {
  sizecounter = select(".sizecounter");
  sizecounter.html(slider.value());
  strokeWeight(slider.value());

  stroke(r,g,b);
  line(mouseX, mouseY, pmouseX, pmouseY);

  // emit info about RGB
  var data = {
    "red": r,
    "green": g,
    "blue": b,
    "x": mouseX,
    "y": mouseY,
    "px": pmouseX,
    "py": pmouseY,
    "weight": slider.value()
  }
  socket.emit('mouseEvent', data);
}

function currentState(data) {
  for (var i = 0; i < data.length; i++) {
    strokeWeight(data[i].weight);
    stroke(data[i].red, data[i].green, data[i].blue);
    line(data[i].x, data[i].y, data[i].px, data[i].py);
  }
}

function newDrawing(data) {
  strokeWeight(data.weight);
  stroke(data.red, data.green, data.blue);
  line(data.x, data.y, data.px, data.py);
}

function usersOnline(x) {
  $('#num_users').text(x.toString()); // .val doesnt work on span
}

// clears canvas, also empties current state in server
function clearCanvas(){
  clear();
  socket.emit('clear canvas');
}
