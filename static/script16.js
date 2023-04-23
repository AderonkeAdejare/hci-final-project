// https://towardsdatascience.com/talking-to-python-from-javascript-flask-and-the-fetch-api-e0ef3573c451
//https://www.youtube.com/watch?v=exRAM1ZWm_s

let pos = "0";
  
/////////////////////////////
// Adapted from https://p5js.org/examples/interaction-snake-game.html
//
var host = "localhost:4444";
$(document).ready(function() {
  frames.start();
  twod.start();
});

const direction = {
  LEFT: "LEFT",
  RIGHT: "RIGHT",
  MIDDLE: "MIDDLE"
}

var counter = -1;
// var timeCounter = [];
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
          pos="LEFT";
          locations.push("LEFT");
        }
        else if (command == direction.RIGHT) {
          pos="RIGHT";
          locations.push("RIGHT");
        }
        else if (command == direction.MIDDLE) {
          pos="MIDDLE";
          locations.push("MIDDLE");
        }
        
      }
      if (counter != 0) {
        timeElapsed = timestamp - startTime;
        time_curr = timeElapsed/650;
        if (locations[counter] != locations[counter-1]) {
          // new location
          startTime = timestamp;
        }
        
      }
      else if (counter == 0) {
        startTime = timestamp;
      }
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
    var pelvis_y = frame.people[0].joints[0].position.y * -1;
    var pelvis_z = frame.people[0].joints[0].position.z * -1;

    // if (pelvis_z < 100) {
    //   return command;
    // }

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
    
  
/************************* LIST OF CONSTANTS *****************************/
// Page type enumerator
const pages = {
    QUESTION: 1,
    PAUSE: 2,
    FIRST: 3,
    INSTRUCTION:4,
    RESULT:5
  };
  
  const timerLength = 30;
  const QBoxXSize = 250;
  const QBoxYSize = 100;
  const HOVERTHRESHOLD = 3.0;
  const FRAMESECOND = 60;
  
  // Initialized in the SetupFunction
  var ThreeBox;
  
  // /**************************************************************************/
  
  
  
  let questionCount = 0;
  let answers = [] //pass to questions.html
  //let displayPage = page.QUESTION;
  let currentPage = null;
  
  let questionText = 
    ["What is your favorite study spot?", 
    "What is your favorite dining hall?", 
    "How many stickers do you have on your computer?", 
    "How important are song lyrics to you?",
    "What is the best CS class at Yale?"]
  
  let option1=
    ["Bass Library", 
    "Saybrook", 
    "No stickers", 
    "Not super important",
    "CS50"]
  
  let option2=
    ["The Good Life Center", 
    "Commons", "A few stickers", 
    "Neutral", 
    "CPSC 484:HCI"]
  
  let option3=
    ["Tsai City", 
    "Timothy Dwight", 
    "Lots of stickers", 
    "VERY important", 
    "CPSC 323"]
    
// //////////////////////////////////////////////////

class ResultPage {
  constructor(canvasWidth, canvasHeight, img) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.selectedRect = -1;
    this.hoverTime = 0;
    this.timer = timerLength
    this.fantext = "";
    this.counttext = "";
    this.img = img;

    this.THREEBOX = {
      LEFT: {
        XPOS: canvasWidth/10,
        YPOS: canvasHeight/2
      },
      MIDDLE: {
        XPOS: (canvasWidth/10)*4,
        YPOS: canvasHeight/2
      },
      RIGHT: {
        XPOS: (canvasWidth/10)*7,
        YPOS: canvasHeight/2
      }
    };
  }

  populate(data) {
    this.fantext = data[0];
    this.counttext = data[1];
  }
  //writing any contents including title, timer and desc
  drawText(content, xpos, ypos, ts) {
    fill(0);
    textAlign(CENTER, CENTER);
    textFont('Rockwell')
    textSize(ts);
    text(content, xpos, ypos);
  }
  
  drawQuestionBox(selected, content, xpos, ypos) {
      // Draw box
      if (selected) fill(255, 0, 0);
      else fill('#213F99');
      rect(xpos, ypos, QBoxXSize, QBoxYSize);
      noStroke();
  
      // Write text
      fill(255);
      textSize(20);
      textAlign(CENTER, CENTER);
      text(content, xpos+QBoxXSize/2, ypos+QBoxYSize/2);
  }
  
  draw() {
    background('#F2D4D6');

    this.drawText("Result", this.canvasWidth / 2, this.canvasHeight / 20, 50);
    this.drawText(this.fantext, this.canvasWidth / 2, this.canvasHeight/3 - 90, 40 );
    this.drawText(this.counttext, this.canvasWidth / 2, this.canvasHeight/3 - 40, 40);
    this.drawText("Check out the playlist, 'What's AKW Listening To?'", this.canvasWidth / 2, this.canvasHeight/3 + 10, 40);
    image(qrcode,this.canvasWidth / 2 - 125, this.canvasHeight / 3 + 70, 250, 250);
    this.drawText(this.timer, this.canvasWidth / 2, this.canvasHeight - 100);
  }

  update() {
    // Wait 30 seconds and return -3 ---> go back to instructions page.
    if (frameCount % FRAMESECOND == 0) this.timer--;
    if (this.timer <= 0) return -3;
    return -1;
  }

  run() {
    this.draw();
    //it will remove eventually
    circle(mouseX, mouseY, 30);
    return this.update();
  }

  posIsSelectingInQuestionWindow(pos) {
    //nothing there
  }
}

class SelectPage {
  constructor(qnum, title, desc, boxCount, options, optionIndices, canvasWidth, canvasHeight) {
    this.qnum = qnum;
    this.title = title;
    this.desc = desc;
    this.boxCount = boxCount;
    this.options = options;
    this.optionIndices = optionIndices;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.selectedRect = -1;
    this.hoverTime = 0;
    this.timer = timerLength;

    this.THREEBOX = {
      LEFT: {
        XPOS: canvasWidth/10,
        YPOS: canvasHeight/2
      },
      MIDDLE: {
        XPOS: (canvasWidth/10)*4,
        YPOS: canvasHeight/2
      },
      RIGHT: {
        XPOS: (canvasWidth/10)*7,
        YPOS: canvasHeight/2
      }
    };
  }

  reset() {
    this.selectedRect =- 1;
    this.hoverTime = 0;
    this.timer = timerLength;
  }
  //writing any contents including title, timer and desc
  drawText(content, xpos, ypos, ts) {
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(ts);
    textFont('Rockwell');
    text(content, xpos, ypos);
  }
  
  drawQuestionBox(selected, content, xpos, ypos) {
      // Draw box
      if (selected) fill(255, 0, 0);
      else fill('#213F99');
      rect(xpos, ypos, QBoxXSize, QBoxYSize);
      noStroke();
  
      // Write text
      fill(255);
      textSize(20);
      textAlign(CENTER, CENTER);
      text(content, xpos+QBoxXSize/2, ypos+QBoxYSize/2);
  }
  
  draw() {
    background('#F2D4D6');
    if (this.qnum == -3){
      this.drawText(this.title, this.canvasWidth / 2, this.canvasHeight / 20, 40);
      this.drawText(this.timer, this.canvasWidth / 2, this.canvasHeight - 100, 40);
      this.drawText(this.desc, this.canvasWidth / 2, this.canvasHeight/3-90, 40);
      this.drawText("Move to the side of the option for 3 sec",this.canvasWidth /2, this.canvasHeight/3-40, 40);
      this.drawText("If no response, it will automatically end",this.canvasWidth /2, this.canvasHeight/3+10, 40);
    } else {
      this.drawText(this.title, this.canvasWidth / 2, this.canvasHeight / 20, 50);
      this.drawText(this.timer, this.canvasWidth / 2, this.canvasHeight - 100, 50);
      this.drawText(this.desc, this.canvasWidth / 2, this.canvasHeight/4, 50);
    }
  
    // Draw answer rectangle 
    if (this.boxCount == 3) {
      this.drawQuestionBox(this.selectedRect == this.optionIndices[0], this.options[0], this.THREEBOX.LEFT.XPOS, this.THREEBOX.LEFT.YPOS);
      this.drawQuestionBox(this.selectedRect == this.optionIndices[1], this.options[1], this.THREEBOX.MIDDLE.XPOS, this.THREEBOX.MIDDLE.YPOS);
      this.drawQuestionBox(this.selectedRect == this.optionIndices[2], this.options[2], this.THREEBOX.RIGHT.XPOS, this.THREEBOX.RIGHT.YPOS);  
    } else if (this.boxCount == 2) {
      this.drawQuestionBox(this.selectedRect == this.optionIndices[0], this.options[0], this.THREEBOX.LEFT.XPOS, this.THREEBOX.LEFT.YPOS);
      this.drawQuestionBox(this.selectedRect == this.optionIndices[1], this.options[1], this.THREEBOX.RIGHT.XPOS, this.THREEBOX.RIGHT.YPOS);  
    } else {
      this.drawQuestionBox(this.selectedRect == this.optionIndices[0], this.options[0], this.THREEBOX.MIDDLE.XPOS, this.THREEBOX.RIGHT.YPOS);
    }
  }
    //update returning selectionRec 0, 1, 2 not selected -1 or it goes puase -2 
  update() {
    // Update various counters
    if (frameCount % FRAMESECOND == 0) this.timer--;
    if (this.selectedRect >= 0) this.hoverTime++;
    else this.hoverTime = 0;

    // Based on counters, change page state.
    // 1. Move onto the next question
    if(this.hoverTime >= HOVERTHRESHOLD * 60) return this.selectedRect;

    if (this.timer <= 0 && this.boxCount ==2) return -2;

    if (this.timer <= 0 && this.qnum ==-3) return 3;

    if (this.timer <= 0 && this.qnum == -4 ) return 4;

    return -1;
  }

  run() {
    this.draw();
    //it will remove eventually/ 
    circle(mouseX, mouseY, 30);
    return this.update();
  }
  //maybe not needed when we using motion capturing. 
  // isMouseWithin(pos, boxXPos, boxYPos, boxWidth, boxHeight) {
  //     if (pos == "LEFT")
  //   if (mouseXPos > boxXPos - 10 && 
  //       mouseXPos < boxXPos + boxWidth + 10 && 
  //       mouseYPos > boxYPos - 10 && 
  //       mouseYPos < boxYPos + boxHeight + 10) return true;
  //   return false;
  // }
  
  
  // In Question Window, detect if mouse is seleting a box
  // later, mouseXPos, mouseYPos will be replaced with motion (left middle right), 
  //this.THREEBOX.xxxx.XPOS, this.THREEBOX.Lxxxx.YPOS, QBoxXSize, QBoxYSize will be replaced with THREEBOX.xxxx()
  posIsSelectingInQuestionWindow(pos) {
    let prevSelection = this.selectedRect;
    if (this.boxCount == 3) {
      // if (this.isMouseWithin(pos, this.THREEBOX.LEFT.XPOS, this.THREEBOX.LEFT.YPOS, QBoxXSize, QBoxYSize)) 
      if (pos == null) {
          this.selectedRect = -1; // not selecting
      }
      else if (pos == direction.LEFT) {
          this.selectedRect = this.optionIndices[0]; //0
      }
      else if (pos == direction.MIDDLE) {
          this.selectedRect = this.optionIndices[1]; //1
      }
      else if (pos == direction.RIGHT) {
          this.selectedRect = this.optionIndices[2]; //2
      }

    } else if (this.boxCount == 2) {
        if (pos == null) {
          this.selectedRect = -1; // not selecting
        }
        else if (pos == direction.LEFT) {
          this.selectedRect = this.optionIndices[0];
        }
        else if (pos == direction.RIGHT) {
          this.selectedRect = this.optionIndices[1];
        }
    //in case I need to use one box; currently not using it; 
    } else if (this.boxCount == 1) {
        if (pos == null) {
          this.selectedRect = -1;
        }
        else if (pos == direction.RIGHT) {
          this.selectedRect = this.optionIndices[0];
        }
    }
    //once it is selected, reset hovertime again. 
    if (prevSelection != this.selectedRect) this.hoverTime = 0;
  }
}

function preload(){
  qrcode =loadImage("static/spotifyplaylist.png");
  //myFont =loadFont("static/TalkComic.ttf");
}
    
function setup() {
  createCanvas(windowWidth, windowHeight);

  FirstPage = new SelectPage(-2, "What's AKW Listening To?", "Stay in the middle to begin", 1, ["Begin"], [5], windowWidth, windowHeight);
  
  InstructPage = new SelectPage(-3, "Instruction", "To select the answer", 1, ["Continue"], [3], windowWidth, windowHeight);

  QuestionPages = [];
  for (let i = 0; i < 5; i++) {
    QuestionPages[i] = new SelectPage(i + 1, "Question" + (i + 1), questionText[i], 
    3, [option1[i], option2[i], option3[i]], [0, 1, 2],
    windowWidth, windowHeight);
  }

  
  PausePage = new SelectPage(-2, "PAUSED", "Would you like to continue?", 2, ["Continue", "Quit"], [3, 4], windowWidth, windowHeight);
  FinalPage = new ResultPage(windowWidth, windowHeight, qrcode);

  currentPage = FirstPage;
  //currentPage = QuestionPages[questionCount];
}

function draw(){
  if (currentPage != null) currentPage.posIsSelectingInQuestionWindow(pos);
  let status = currentPage.run();
  // If status == -1, then keep drawing the page. 
  if (status >= 0 && status <= 2) {
    answers[questionCount] = status;
    questionCount++;

    if (questionCount == 5) {
      $.ajax({
        url: "/results?selection=" + answers,
        type: "GET",
        success: function (data) {
          FinalPage.populate(data);
        },
        error: function (error) {
          FinalPage.populate(["Encountered an error when", "connecting to the server."])
        }
      });
      currentPage = FinalPage;
    } else {
      // Otherwise, move to the next page
      currentPage = QuestionPages[questionCount]
    }
  } else if (status == -2) {
    PausePage.reset();
    currentPage = PausePage;
  } else if (status == 3) {
    currentPage = QuestionPages[questionCount];
    currentPage.reset();
  } else if (status == 4 || status == -3) {
    //window.location.href = "/"
    currentPage=FirstPage;
    currentPage.reset();
  } else if(status == 5){
    currentPage=InstructPage;
  }
  

}  
//currenpage.run return 
//0, 1, 2 ==> selectedRect
//-1 ==> not selected in question//keep 

//-2 --> time's up (goes to pause status)
//3 --> want to continue (come back to the question)
//-3 ---> result page time's up--> coming back to the index
//4 ---> puase time up 
//instuction ==> move question ==>
//going to the instruction page