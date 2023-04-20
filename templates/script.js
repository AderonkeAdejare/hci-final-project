// https://towardsdatascience.com/talking-to-python-from-javascript-flask-and-the-fetch-api-e0ef3573c451
//https://www.youtube.com/watch?v=exRAM1ZWm_s

let selectedRect = null;
let hoverTime = 0;
let questions = ["What's your favorite song?", "What's your favorite color?", "What's your favorite food?", "What's your favorite movie?", "What's your favorite hobby?"];
let count = 0 



function setup() {
  let answercanvas=createCanvas(windowWidth, windowHeight/2);
  answercanvas.parent("answer-container");
  
}

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

  }


  
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
        redirectToPage(1);
        } 
        else if (hoverTime >= 500 && selectedRect==2) {
        redirectToPage(2);
        }
    } else {
    hoverTime = 0;
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


function redirectToPage(selectedRect) {
  fetch('/api/api/insergetInput', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({selectedRect})
  })
  .then(response => {
    if (response.ok) {
      window.location.href = "results.html";
    } else {
      window.location.href = "errors.html";
    }
  });
}


// Probalby copy cesar's codes //timer 
// var timeleft = 10;
// var downloadTimer = setInterval(function(){
//   if(timeleft <= 0){
//     clearInterval(downloadTimer)
//   }
//   timeleft -= 1;
// }, 1000);







