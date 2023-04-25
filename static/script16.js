// https://towardsdatascience.com/talking-to-python-from-javascript-flask-and-the-fetch-api-e0ef3573c451
//https://www.youtube.com/watch?v=exRAM1ZWm_s

//pos = "0";  
/************************* LIST OF CONSTANTS *****************************/
// Adapted from https://p5js.org/examples/interaction-snake-game.html
//


var  bodyPos = null;
//var host = "localhost:4444";
var host = "cpsc484-01.yale.internal:8888";
$(document).ready(function() {
  frames.start();
  twod.start();
});

const Cdirection = {
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
        if (command == Cdirection.LEFT) {
          bodyPos="LEFT";
          locations.push("LEFT");
        }
        else if (command == Cdirection.RIGHT) {
          bodyPos="RIGHT";
          locations.push("RIGHT");
        }
        else if (command == Cdirection.MIDDLE) {
          bodyPos="MIDDLE";
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

    if (pelvis_x < -650) {
      command = Cdirection.LEFT; // LEFT
    }
    else if (pelvis_x > 0) {
      command = Cdirection.RIGHT; // RIGHT
    }
    else if (pelvis_x > -650 && pelvis_x < 0) {
      command = Cdirection.MIDDLE; // MIDDLE
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
  const QBoxXSize = 500;
  const QBoxYSize = 200;
  const HOVERTHRESHOLD = 4.0;
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
    "Commons",
    "A few stickers", 
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
    textFont(myFont)
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
    background('#ADD8E6');

    this.drawText("Result", this.canvasWidth / 2, this.canvasHeight / 20, 60);
    this.drawText(this.fantext, this.canvasWidth / 2, this.canvasHeight/3 - 90, 50 );
    this.drawText(this.counttext, this.canvasWidth / 2, this.canvasHeight/3 - 40, 50);
    this.drawText("Check out the playlist, 'What's AKW Listening To?'", this.canvasWidth / 2, this.canvasHeight/3 + 10, 50);
    image(qrcode,this.canvasWidth / 2 - 100, this.canvasHeight / 3 + 70, 500, 500);
    this.drawText(this.timer, this.canvasWidth / 2, this.canvasHeight - 100, 50);
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
    //circle(mouseX, mouseY, 30);
    return this.update();
  }

  posIsSelectingInQuestionWindow(bodyPos) {
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
    textFont(myFont);
    text(content, xpos, ypos);
    // if (content == this.title){
    //   textStyle(BOLD);
    // }
  }
  
  drawQuestionBox(selected, content, xpos, ypos) {
      // Draw box
      if (selected) fill(255, 0, 0);
      else fill('#213F99');
      rect(xpos, ypos, QBoxXSize, QBoxYSize);
      noStroke();
   
      // Write text
      fill(255);
      textSize(40);
      textAlign(CENTER, CENTER);
      text(content, xpos+QBoxXSize/2, ypos+QBoxYSize/2);
  }
  
  draw() {
    background('#ADD8E6');
    if (this.qnum == -3){
      this.drawText(this.title, this.canvasWidth / 2, this.canvasHeight / 20, 50);
      this.drawText(this.timer, this.canvasWidth / 2, this.canvasHeight - 90, 50);
      this.drawText(this.desc, this.canvasWidth / 2, this.canvasHeight/3-90, 50);
      this.drawText("Move to the Side of Your Favorite Option for 4 seconds.",this.canvasWidth /2, this.canvasHeight/3-40, 50);
      this.drawText("If you don't respond within 30 seconds, the game will pause.",this.canvasWidth /2, this.canvasHeight/3+10, 50);
      this.drawText("If the game is paused for 30 seconds, it will end and return to the home page.",this.canvasWidth /2, this.canvasHeight/3+60, 50);
    } else if (this.qnum == -4){
      this.drawText(this.title, this.canvasWidth / 2, this.canvasHeight / 20, 50);
      this.drawText(this.timer, this.canvasWidth / 2, this.canvasHeight - 100, 50);
      this.drawText(this.desc, this.canvasWidth / 2, this.canvasHeight/3-90, 50);
      this.drawText("Single Player Mode Only",this.canvasWidth /2, this.canvasHeight/3-40, 50);
    }
    else {
      this.drawText(this.title, this.canvasWidth / 2, this.canvasHeight / 20, 60);
      this.drawText(this.timer, this.canvasWidth / 2, this.canvasHeight - 100, 60);
      this.drawText(this.desc, this.canvasWidth / 2, this.canvasHeight/4, 60);
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

    if (this.timer <= 0 && this.boxCount == 3) return -2;

    if (this.timer <= 0 && this.qnum ==-2) return -3;

    if (this.timer <= 0 && this.qnum ==-3) return 3;

    if (this.timer <= 0 && this.qnum == -4 ) return 4;

    return -1;
  }

  run() {
    this.draw();
    //it will remove eventually/ 
    //circle(mouseX, mouseY, 30);
    return this.update();
  }
  
  posIsSelectingInQuestionWindow(bodyPos) {
    let prevSelection = this.selectedRect;
    if (this.boxCount == 3) {
      // if (this.isMouseWithin(bodyPos, this.THREEBOX.LEFT.XbodyPos, this.THREEBOX.LEFT.YbodyPos, QBoxXSize, QBoxYSize)) 
      if (bodyPos == null) {
          this.selectedRect = -1; // not selecting
      }
      else if (bodyPos == Cdirection.LEFT) {
          this.selectedRect = this.optionIndices[0]; //0
      }
      else if (bodyPos == Cdirection.MIDDLE) {
          this.selectedRect = this.optionIndices[1]; //1
      }
      else if (bodyPos == Cdirection.RIGHT) {
          this.selectedRect = this.optionIndices[2]; //2
      }

    } else if (this.boxCount == 2) {
        if (bodyPos == null) {
          this.selectedRect = -1; // not selecting
        }
        else if (bodyPos == Cdirection.LEFT) {
          this.selectedRect = this.optionIndices[0];
        }
        else if (bodyPos == Cdirection.RIGHT) {
          this.selectedRect = this.optionIndices[1];
        }
    //in case I need to use one box; currently not using it; 
    } else if (this.boxCount == 1) {
        if (bodyPos == null) {
          this.selectedRect = -1;
        }
        else if (bodyPos == Cdirection.RIGHT) {
          this.selectedRect = this.optionIndices[0];
        }
    }
    //once it is selected, reset hovertime again. 
    if (prevSelection != this.selectedRect) this.hoverTime = 0;
  }
}

function preload(){
  qrcode =loadImage("static/spotifyplaylist.png");
  myFont= loadFont("static/Roboto-Regular.ttf");

}
    
function setup() {
  createCanvas(windowWidth, windowHeight*1.2);

  FirstPage = new SelectPage(-4, "What's AKW Listening To?", "Move to the Middle to Begin!", 1, ["Begin"], [5], windowWidth, windowHeight);
  
  InstructPage = new SelectPage(-3, "Instructions", "To Select the Answer", 1, ["Continue"], [6], windowWidth, windowHeight);

  QuestionPages = [];
  for (let i = 0; i < 5; i++) {
    QuestionPages[i] = new SelectPage(i + 1, "Question " + (i + 1) + "/5", questionText[i], 
    3, [option1[i], option2[i], option3[i]], [0, 1, 2],
    windowWidth, windowHeight);
  }

  
  PausePage = new SelectPage(-2, "PAUSED", "Would you Like to Continue?", 2, ["Continue", "Quit"], [3, 4], windowWidth, windowHeight);
  FinalPage = new ResultPage(windowWidth, windowHeight, qrcode);

  currentPage = FirstPage;
}

function draw(){
  if (currentPage != null) currentPage.posIsSelectingInQuestionWindow(bodyPos);
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
    currentPage = QuestionPages[questionCount]; // error: Cannot read property of undefined. Check the line number in error and make sure the variable which is being operated is not undefined.
    currentPage.reset();
  } else if (status == 4 || status == -3) {
    //window.location.href = "/"
    FirstPage.reset()
    currentPage=FirstPage;
  } else if(status == 5){
    InstructPage.reset()
    currentPage=InstructPage;
  } else if(status == 6){
    questionCount=0;
    currentPage=QuestionPages[questionCount];
    currentPage.reset();
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
//5going to the instruction page
