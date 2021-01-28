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
  updateCurrentTime();

  // doesn't need to be used, is an interval
  // eslint-disable-next-line no-unused-vars
  updateCurrentTimeInstance = setInterval(updateCurrentTime, 1000);
}

// Events
function update() {

}
function updateCurrentTime() {
  setCurrentTime();
}

// Used in HTML
// eslint-disable-next-line no-unused-vars
function goButton() {
  clearInterval(updateInstance);
  intakeInputValues();
  update();
  updateInstance = setInterval(update, updateInterval);
  debugCommands();
}

function debugCommands() {
  console.log(getBedTime());
}

// Update UI
function updateOutputValues() {
  setCurrentTime();
  setAvailableCalories();
}
function setCurrentTime() {
  currentTime = new Date();
  document.getElementById('currentTime').innerHTML = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
  return correctTimeToCurrentDate(document.getElementById('startTime').valueAsDate);
}
function getBedTime() {
  const workingBedTime = correctTimeToCurrentDate(document.getElementById('bedTime').valueAsDate);
  if (workingBedTime.getUTCHours() < getStartTime().getUTCHours()) {
    return new Date(workingBedTime.getUTCFullYear(), workingBedTime.getUTCMonth(), workingBedTime.getUTCDate() + 1,
      workingBedTime.getUTCHours(), workingBedTime.getUTCMinutes());
  }
  return workingBedTime;
  // TODO test during DST? During DST changeover? make all internals UTC, apply timezone in/out (how to predict time zone DST, is that possible)?
}

// Utility
function correctTimeToCurrentDate(date) {
  if (date.getFullYear() === 1970) {
    const timeHours = date.getUTCHours();
    const timeMinutes = date.getUTCMinutes();
    const newTime = new Date();
    newTime.setUTCHours(timeHours);
    newTime.setUTCMinutes(timeMinutes);
    newTime.setSeconds(0);
    newTime.setMilliseconds(0);
    return newTime;
  }
  return date;
}

function addDays(date, days) {
  const newDate = new Date(date);
  return newDate.setDate(newDate.getDate() + days);
}
