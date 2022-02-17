"use strict"

const timerButton = document.getElementById("startTimer");
const timeOption1 = document.getElementById("fifteenMins");
const timeOption2 = document.getElementById("originalPomodoro");
const timeOption3 = document.getElementById("fortyFive");
const pauseButton = document.getElementById("pauseTimer");
const colorButton = document.getElementById("colorChanger");
const modalButton = document.getElementById("modalDismiss");
const longBreakButton = document.getElementById("modalDismissLong");
const playSoundsButton = document.getElementById("startMusic");
const pauseSoundsButton = document.getElementById("pauseMusic");
const forestSounds = document.getElementById("forestSounds");
const rainSounds = document.getElementById("rainSounds");
let intro = document.querySelector(".intro");
let logo = document.querySelector(".logo-header");
let cyclesHTML = document.querySelector(".cycles");
let logoSpan = document.querySelectorAll(".logo");
let taskInput = document.getElementById("newItem");
let selectedSound = "";
let pomodoroCycles = 0;
let completedTasks = 1;
let currentToDo = [];

//animacion de comienzo
window.addEventListener("DOMContentLoaded", () => {
  logoSpan.forEach((span, idx) => {
    setTimeout(() => {
      span.classList.add("active");
    }, (idx + 1) * 400);
  });

  setTimeout(() => {
    logoSpan.forEach((span, idx) => {
      setTimeout(() => {


        span.classList.remove("active");
        span.classList.add("fade");
      }, (idx + 1) * 50);
    });
  }, 1500);

  setTimeout(() => {
    intro.style.top = "-100vh";
  }, 1500);
});

//cambio de color del sitio
function changeColor() {
  var randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
  //genera un color aleatorio basado en los valores hexadecimales
  //cambiamos el bacgkground del navbar y del contenedor principal
  document.getElementById("nav").style.backgroundColor = randomColor;
  document.getElementById("mainContainer").style.backgroundColor = randomColor;
  document.querySelector(".benefitsDiv").style.backgroundColor = randomColor;
  document.querySelector(".containerTodo").style.backgroundColor = randomColor;
}


let i = 0;
function addToList() {
  currentToDo.push(taskInput.value);
  document.getElementById("listSection").insertAdjacentHTML(
      "beforeend",
      ` <div class="form-check">
          <input class="form-check-input" type="checkbox" onclick="deleteFromlist(this.id)"  value="" id="task${i}">
          <label class="form-check-label" id="task${i}label" for="flexCheckDefault">
            ${taskInput.value}
          </label>
        </div> <hr>`
    );
  i++;
  taskInput.value = null;
}

function deleteFromlist(clicked_id) {
  console.log(clicked_id);
  document.getElementById(`${clicked_id}label`).style.textDecoration =
    "line-through";
  document.getElementById(`${clicked_id}`).disabled = true;
  document.querySelector(
    ".tasksHTML"
  ).innerHTML = `Completed Tasks: ${completedTasks}`;
  completedTasks++;
}

//sonidos relajantes
function playRelaxing(chosenSound) {
  myAudio = new Audio(`sounds/${chosenSound}.mp3`);
  if (typeof myAudio.loop == "boolean") {
    myAudio.loop = true;
  } else {
    myAudio.addEventListener(
      "ended",
      function () {
        this.currentTime = 0;
        this.play();
      },
      false
    );
  }
  myAudio.play();

  pauseSoundsButton.addEventListener("click", (event) => {
    myAudio.pause();
  });

  playSoundsButton.addEventListener("click", (event) => {
    playRelaxing(chosenSound);
  });
}

colorButton.addEventListener("click", (event) => {
  changeColor();
});

function breakAchieved() {
  let breakAudio = new Audio("sounds/breakAudio.wav");
  breakAudio.play();
}

let minutesInterval;
let secondsInterval;
let mins;
let secs;
let isItBreak;


//todas las funciones del timer
function startTimerV2(minutes, seconds, isBreak) {
  
  mins = minutes;
  secs = seconds;
  isItBreak = isBreak;

  function decreaseMinutes() {
    mins--;
    document.getElementById("timerText").innerHTML = `${mins} : ${secs}`;
  }

  function decreaseSeconds() {
    secs--;

    document.getElementById("timerText").innerHTML = `${mins} : ${secs}`;
    console.log(document.getElementById("timerText").innerHTML);
    if (secs === 0) {
      secs = 60;
    }
    //when timer reaches 0 on minutes and seconds, clear intervals and start break.
    if (
      document.getElementById("timerText").innerHTML == "0 : 0" &&
      isItBreak === true
    ) {
      $("#breakEndingModal").modal("show");
      pomodoroCycles++;
      cyclesHTML.innerHTML = `Completed Cycles: ${pomodoroCycles}`;
      isItBreak = false;
      pauseTimer();
    } else if (
      document.getElementById("timerText").innerHTML == "0 : 0" &&
      isItBreak === false
    ) {
      if (pomodoroCycles % 3 === 0 && pomodoroCycles > 0) {
        breakAchieved();
        pauseTimer();
        $("#longBreakModal").modal("show");
        isItBreak = true;
      } else {
        breakAchieved();
        pauseTimer();
        $("#breakModal").modal("show");
        isItBreak = true;
      }
    }
  }

  minutesInterval = setInterval(decreaseMinutes, 60000);
  secondsInterval = setInterval(decreaseSeconds, 1000);

}

function pauseTimer() {
  clearInterval(minutesInterval);
  clearInterval(secondsInterval);
  document.getElementById("timerText").innerHTML == `${mins} : ${secs}`
}

function startFromPrev(minutes,seconds){
  if(mins === undefined){
    startTimerV2(minutes, seconds, false);
  } else {
    pauseTimer();
    startTimerV2(mins, secs, isItBreak);
  }
}

pauseButton.addEventListener('click',() => {
  pauseTimer();
})


timerButton.addEventListener("click", (event) => {
  startFromPrev(24,59);
});

document.getElementById("modalDismissNoBreak").addEventListener('click',(event) => {
  secs = undefined;
  mins = undefined;
})

//start break
modalButton.addEventListener("click", (event) => {
  startTimerV2(4, 59, true);
});

//start long break
longBreakButton.addEventListener("click", (event) => {
  startTimerV2(9, 59, true);
});

