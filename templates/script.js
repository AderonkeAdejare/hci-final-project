let selectedRect = null;
let hoverTime = 0;

// Adapted from https://p5js.org/examples/interaction-snake-game.html
//

var host = "localhost:4444";
$(document).ready(function() {
  frames.start();
  twod.start();
});

const direction = {
  LEFT: 0,
  RIGHT: 1,
  MIDDLE: 2
}

var counter = -1;
const locations = [];
var startTime = null;
var timeElapsed = 0;

var frames = {
  socket: null,

  start: function() {
    var user_info = {
      position: null,
      time: null,
    };
    var url = "ws://" + host + "/frames";
    frames.socket = new WebSocket(url);
    frames.socket.onmessage = function (event) {
      var command = frames.get_left_right_command(JSON.parse(event.data));
      
      if (command !== null) {
        var timestamp = frames.get_timestamp(JSON.parse(event.data));
        counter += 1;
        if (command == direction.LEFT) {
          user_info.position = "LEFT";
          locations.push("LEFT");
        }
        else if (command == direction.RIGHT) {
          user_info.position = "RIGHT";
          locations.push("RIGHT");
        }
        else if (command == direction.MIDDLE) {
          user_info.position = "MIDDLE";
          locations.push("MIDDLE");
        }
        
      }
      if (counter != 0) {
        timeElapsed = timestamp - startTime;
        user_info.time = timeElapsed/650;
        if (locations[counter] != locations[counter-1]) {
          // new location
          startTime = timestamp;
        }
      }
      else if (counter == 0) {
        startTime = timestamp;
      }
      return user_info;
      // console.log(user_info.position);
      // console.log(user_info.time);
    }
    // console.log(user_info.position);
    // console.log(user_info.time);
  },

  get_timestamp: function(frame) {
    return frame.ts;
  },

  get_left_right_command: function (frame) {
    var command = null;
    if (frame.people.length < 1) {
      return command;
    }

    // Normalize by subtracting the root (pelvis) joint coordinates
    var pelvis_x = frame.people[0].joints[0].position.x * -1;
    // var pelvis_y = frame.people[0].joints[0].position.y * -1;
    // var pelvis_z = frame.people[0].joints[0].position.z * -1;

    if (pelvis_x < -600) {
      command = direction.LEFT; // LEFT
    }
    else if (pelvis_x > 200) {
      command = direction.RIGHT; // RIGHT
    }
    else if (pelvis_x > -600 && pelvis_x < 200) {
      command = direction.MIDDLE; // MIDDLE
    }
    
    return command;
  }
};

var twod = {
  socket: null,

  start: function() {
    var url = "ws://" + host + "/twod";
    twod.socket = new WebSocket(url);
    twod.socket.onmessage = function(event) {
      twod.show(JSON.parse(event.data));
    }
  },

  show: function(twod) {
    $('.twod').attr("src", 'data:image/pnjpegg;base64,'+twod.src);
  }
};

function setup() {
  let answercanvas=createCanvas(windowWidth, windowHeight);
  answercanvas.parent("answer-container");
  
}

// function test() {
//   var result = frames.start;
//   console.log(result.position);
//   console.log(result.time);
// }

function draw(){

  background(244, 248, 252);

  circle(mouseX, mouseY, 30);
  
  // Draw the first rectangle
  if (selectedRect == 1) {
    fill(255, 0, 0);
  } else {
    fill(0, 0, 200);
  }
  rect(windowWidth/8, windowHeight/2, 300, 100);
  
  // Draw the second rectangle

  if (selectedRect == 2) {
    fill(255, 0, 0);
  } else {
    fill(0, 0, 200);
  }
  rect((windowWidth/8)*5, windowHeight/2, 300, 100);

  //Question come here 
  fill(0);
  textSize(40);
  textAlign(CENTER, CENTER);
  text("What's your favorite song?", windowWidth/2, windowHeight/4);

  
  // Add text to the first rectangle
  fill(255);
  textSize(20);
  textAlign(CENTER, CENTER);
  text("Option1", windowWidth/8+150, windowHeight/2+50);
  
  // Add text to the second rectangle
  fill(255);
  textSize(20);
  textAlign(CENTER, CENTER);
  text("Option2", (windowWidth/8)*5+150, windowHeight/2+50);
  
  // Check if mouse is over a rectangle and start timing
  if (selectedRect !== null) {
        hoverTime++;
        if (hoverTime >= 500 && selectedRect==1) {
        redirectToPage1();
        } 
        else if (hoverTime >= 500 && selectedRect==2) {
        redirectToPage2();
        }
    } else {
    hoverTime = 0;
  }
}

function mouseMoved() {
  selection();
}


//now working on mouseX and mouseY
function selection() {
  if (mouseX > windowWidth/8-10 && mouseX < windowWidth/8+310 && mouseY > windowHeight/2-10 && mouseY < windowHeight/2+110) {
    selectedRect = 1;
  } else if (mouseX > windowWidth/8*5-10 && mouseX < windowWidth/8*5+310 && mouseY > windowHeight/2-10 && mouseY < windowHeight/2+110) {
    selectedRect = 2;
  } else {
    selectedRect = null;
  }
}


function redirectToPage1() {
  window.location.href = "results.html";
}

function redirectToPage2() {
    window.location.href = "results2.html";
}




