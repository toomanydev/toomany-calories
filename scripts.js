// Variables
let calorieTarget; // the total amount of calories intended to be consumed during the day.
let breakfastCalories; // calories that were consumed prior to starting the timer, e.g. breakfast.

let startTime; // the time the "go" button was first pressed, unless altered.
let bedTime; // the time at which all calories will be made available.
let currentTime;

let availableCalories;

let calorieConsumptions; // list of calories consumed after starting, i.e. excluding alreadyConsumed.

const updateInterval = 1000;
let updateInstance;
let updateCurrentTimeInstance;

// Main
main();
function main() {
  setupStartTime();
  updateCurrentTime();

  // doesn't need to be used, is an interval
  // eslint-disable-next-line no-unused-vars
  updateCurrentTimeInstance = setInterval(updateCurrentTime, 1000);
}

// Events
function update() {
  setupStartTime();
}
function updateCurrentTime() {
  currentTime = new Date();
  // TODO correct current time to be 1970, same data as default
  setCurrentTime(currentTime.getHours(), currentTime.getMinutes());
}

// Used in HTML
// eslint-disable-next-line no-unused-vars
function goButton() {
  clearInterval(updateInstance);
  intakeInputValues();
  update();
  updateInstance = setInterval(update, updateInterval);
}

// Update UI
function updateOutputValues() {
  setCurrentTime();
  setAvailableCalories();
}
function setCurrentTime(hours, mins) {
  const hoursCorrected = correctTimeDigits(hours);
  const minsCorrected = correctTimeDigits(mins);
  document.getElementById('currentTime').innerHTML = `${hoursCorrected}:${minsCorrected}`;
}
function setAvailableCalories() {
  document.getElementById('calorieTarget').value = availableCalories;
}

// Intake values from UI
function intakeInputValues() {
  calorieTarget = getCalorieTarget();
  breakfastCalories = getBreakfastCalories();
  startTime = getStartTime();
  bedTime = getBedTime();
}
function getCalorieTarget() {
  return document.getElementById('calorieTarget').value;
}
function getBreakfastCalories() {
  return document.getElementById('breakfastCalories').value;
}
function getStartTime() {
  return document.getElementById('startTime').valueAsDate;
}
function getBedTime() {
  return document.getElementById('bedTime').valueAsDate;
}

// Setup Times
function setupStartTime() {
  document.getElementById('startTime').valueAsDate = correctTimeToCurrentDate(getStartTime());
  console.
}

// Utility
function correctTimeDigits(number) {
  if (number < 10) {
    return `0${number}`;
  }
  return number;
}
function correctTimeToCurrentDate(date) {
  const timeHours = date.getHours();
  const timeMinutes = date.getHours();
  const newTime = new Date();
  newTime.setHours(timeHours);
  newTime.setMinutes(timeMinutes);
  newTime.setSeconds(0);
  newTime.setMilliseconds(0);
  return newTime;
}

// crunch all times to same day? Only actually use hours, minutes specifically? If bedtime is lower is next day.
