// Variables
let calorieTarget; // the total amount of calories intended to be consumed during the day.
let breakfastCalories; // calories that were consumed prior to starting the timer, e.g. breakfast.
let calorieConsumptions; // list of calories consumed after starting, i.e. excluding alreadyConsumed.

let startTime; // the time the "go" button was first pressed, unless altered.
let bedTime; // the time at which all calories will be made available.

let currentTime;

let availableCalories;
let totalConsumedCalories;

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
  setInnerHTMLDOM('currentTime', getCurrentTime().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
}

// Primary logic

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

}

// Update UI
function updateOutputValues() {
  setValueDOM('calorieTarget', availableCalories);
}
function setValueDOM(elementID, value) {
  document.getElementById(elementID).value = value;
}
function setInnerHTMLDOM(elementID, innerHTML) {
  document.getElementById(elementID).innerHTML = innerHTML;
}


// Intake values
function intakeInputValues() {
  calorieTarget = getValueDOM('calorieTarget');
  breakfastCalories = getValueDOM('breakfastCalories');
  startTime = getTimeAsDisplayedDOM('startTime');
  bedTime = getTimeAsDisplayedDOM('bedTime');
}
function getValueDOM(elementID) {
  return document.getElementById(elementID).value;
}
function getTimeAsDisplayedDOM(elementID) {
  let returnTime = correctTimeToSameDate(document.getElementById(elementID).valueAsDate);
  returnTime = addMinutes(returnTime, returnTime.getTimezoneOffset()); // Fixes timezone discrepancy
  return returnTime;
}
function getCurrentTime() {
  return correctTimeToSameDate(new Date());
}

// Utility
function correctTimeToSameDate(date) {
  const timeHours = date.getUTCHours();
  const timeMinutes = date.getUTCMinutes();
  const newTime = new Date();
  newTime.setUTCHours(timeHours);
  newTime.setUTCMinutes(timeMinutes);
  newTime.setSeconds(0);
  newTime.setMilliseconds(0);
  return newTime;
}
function addMinutes(date, minutes) {
  const returnDate = date;
  returnDate.setTime(date.getTime() + (minutes * 60 * 1000));
  return returnDate;
}
function calculateHoursDifference(startDate, endDate) {
  return (endDate - startDate) / (1000 * 60 * 60);
}

// TODO When current date moves into next day, startTime may jump forwards if gotten?
// Perhaps if current time is before start time, it will miscompute due to start time being one day ahead? If so, implement checks for current time when setting day of start time
// If we make the main logic of % time passed just hours and minutes, perhaps the other code correcting days will become redundant.
// Reduce StartTime to zero, apply same subtraction to BedTime, then if BedTime is negative subtract it from 24?
