// https://towardsdatascience.com/talking-to-python-from-javascript-flask-and-the-fetch-api-e0ef3573c451
//https://www.youtube.com/watch?v=exRAM1ZWm_s

let selectedRect = null;
let hoverTime = 0;
let timer = 20;
let questionCount = 1;
let answers = []

let questionText = ["What is your favorite study spot?"," What is your favorite dining hall?"
,"How many stickers do you have on your computer?", "How important are song lyrics to you?",
"What is the best CS class at Yale?"]
let option1=["Bass Library", "Saybrook", "No stickers", 
"Not super important", "CS50"]
let option2=["The Good Life Center", "Commons", "A few stickers", 
"Neutral", "CPSC 484:HCI"]
let option3=["Tsai CITY 2", "Timothy Dwigh", "Lots of stickers", 
"VERY important", "CPSC 323"]


function setup() {
  let answercanvas=createCanvas(windowWidth, windowHeight);
  answercanvas.parent("answer-container");
  
}

function draw(){
  background(250, 250, 250);

// question 
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(50);
  text("QUIZ"+questionCount, windowWidth/2, windowHeight/20);


  //timer
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(50);
  text(timer, windowWidth/2, windowHeight-100);
  if (frameCount % 60 == 0 && timer > 0) {
    timer --;
  }
 
  
  //question come here 
  fill(0);
  textSize(40);
  textAlign(CENTER, CENTER);
  text(questionText[questionCount-1], windowWidth/2, windowHeight/4);
  
  
  circle(mouseX, mouseY, 30);
  
  // Draw the first rectangle
  if (selectedRect == "A") {
    fill(255, 0, 0);
  } else {
    fill(0, 0, 200);
  }
  rect(windowWidth/10, windowHeight/2, 250, 100);
  
  // Draw the second rectangle
  if (selectedRect == "B") {
    fill(255, 0, 0);
  } else {
    fill(0, 0, 200);
  }
  rect((windowWidth/10)*4, windowHeight/2, 250, 100);

  if (selectedRect == "C") {
    fill(255, 0, 0);
  } else {
    fill(0, 0, 200);
  }
  rect((windowWidth/10)*7, windowHeight/2, 250, 100);



  // Add text to the first rectangle
  fill(255);
  textSize(20);
  textAlign(CENTER, CENTER);
  text(option1[questionCount-1], windowWidth/10+125, windowHeight/2+50);


  // Add text to the second rectangle
  fill(255);
  textSize(20);
  textAlign(CENTER, CENTER);
  text(option2[questionCount-1], (windowWidth/10)*4+125, windowHeight/2+50);

  // Add text to the third rectangle
  fill(255);
  textSize(20);
  textAlign(CENTER, CENTER);
  text(option3[questionCount-1], (windowWidth/10)*7+125, windowHeight/2+50);

if (timer == 0) {
  window.location.href ="error"
}
  // Check if mouse is over a rectangle and start timing
if (selectedRect !== null) {
   hoverTime++;
  if(hoverTime >= 500) {
      answers.push(selectedRect)
      hoverTime = 0;
      questionCount++;
      timer=20;
    }
    if (questionCount >5){
      window.location.href ="results?selection=" + answers;
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
  if (mouseX > windowWidth/10-10 && 
  mouseX < windowWidth/10+260 && 
  mouseY > windowHeight/2-10 && mouseY < windowHeight/2+110) {
    selectedRect = "A";
  } else if (mouseX > (windowWidth/10)*4-10 && 
  mouseX < (windowWidth/10)*4+260 && 
  mouseY > windowHeight/2-10 && mouseY < windowHeight/2+110) {
    selectedRect = "B";
  } else if(mouseX > (windowWidth/10)*7-10 && 
  mouseX < (windowWidth/10)*7+260 && mouseY > windowHeight/2-10 && 
  mouseY < windowHeight/2+110) {
    selectedRect = "C";
  } else {
    selectedRect = null;
  }
}


