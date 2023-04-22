// Adapted from https://p5js.org/examples/interaction-snake-game.html
//
var global_var = {
  position: null,
  time: null,
};

var host = "localhost:4444";
$(document).ready(function() {
  result = frames.start();
  console.log(result.position);
  console.log(result.time);
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
    var url = "ws://" + host + "/frames";
    frames.socket = new WebSocket(url);
    frames.socket.onmessage = function (event) {
      var command = frames.get_left_right_command(JSON.parse(event.data));
      
      if (command !== null) {
        var timestamp = frames.get_timestamp(JSON.parse(event.data));
        counter += 1;
        if (command == direction.LEFT) {
          global_var.position = "LEFT";
          locations.push("LEFT");
        }
        else if (command == direction.RIGHT) {
          global_var.position = "RIGHT";
          locations.push("RIGHT");
        }
        else if (command == direction.MIDDLE) {
          global_var.position = "MIDDLE";
          locations.push("MIDDLE");
        }
        
      }
      if (counter != 0) {
        timeElapsed = timestamp - startTime;
        global_var.time = timeElapsed/650;
        if (locations[counter] != locations[counter-1]) {
          // new location
          startTime = timestamp;
        }
      }
      else if (counter == 0) {
        startTime = timestamp;
      }
      return global_var;
      // console.log(global_var.position);
      // console.log(global_var.time);
    }

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

    if (pelvis_x < -400) {
      command = direction.LEFT; // LEFT
    }
    else if (pelvis_x > 200) {
      command = direction.RIGHT; // RIGHT
    }
    else if (pelvis_x > -400 && pelvis_x < 200) {
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