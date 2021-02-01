// TODO: remember settings in cookies, add total calories consumed display, remove current time.
let calorieTarget = 0; // the total amount of calories intended to be consumed during the day.
let breakfastCalories = 0; // calories that were consumed prior to starting the timer, e.g. breakfast.
const calorieConsumptions = []; // list of calories consumed after starting, i.e. excluding alreadyConsumed.

let startTime; // the time the "go" button was first pressed, unless altered.
let bedTime; // the time at which all calories will be made available.

let availableCalories; // calorieTarget - totalConsumedCalories

const updateInterval = 1000;
let updateInstance;

main();
function main() {
  document
    .getElementById('consumeCalories')
    .addEventListener('keypress', consumeCaloriesEnter);
  document.getElementById('goButton').addEventListener('click', goButton);
}

// Events
function update() {
  availableCalories = getAvailableCalories();
  updateOutputValues();
}

// Primary logic
// if startTime is reduced to 0, we don't need to calculate it, just subtract it from bedTime;

function getCaloriesMinusBreakfast() {
  return calorieTarget - breakfastCalories;
}
function getUnveiledCalories() {
  return (
    getCaloriesMinusBreakfast()
    * Math.min(getTimePassed(startTime, getCurrentTime(), bedTime), 1)
  );
}
function getAvailableCalories() {
  return Math.round(getUnveiledCalories() - getTotalConsumedCalories());
}

function consumeCalories(calories) {
  calorieConsumptions.push({ calories });
  update();
}
function getTotalConsumedCalories() {
  let totalCalories = 0;
  for (let i = 0; i < calorieConsumptions.length; i += 1) {
    totalCalories += calorieConsumptions[i].calories;
  }
  return totalCalories;
}

// Used in HTML
// eslint-disable-next-line no-unused-vars
function goButton() {
  clearInterval(updateInstance);
  intakeInputValues();
  update();
  updateInstance = setInterval(update, updateInterval);
}

function consumeCaloriesEnter(e) {
  if (e.key === 'Enter') {
    if (!Number.isNaN(parseInt(getValueDOM('consumeCalories'), 10))) {
      consumeCalories(parseInt(getValueDOM('consumeCalories'), 10));
      setValueDOM('consumeCalories', null);
    }
  }
}

// Update UI
function updateOutputValues() {
  setInnerHTMLDOM('availableCalories', availableCalories);
  setInnerHTMLDOM(
    'currentTime',
    getCurrentTime().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
  );
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
  return fixTimezoneDifference(
    correctTimeToCurrentDate(document.getElementById(elementID).valueAsDate),
  );
}
function getCurrentTime() {
  return new Date();
}

// Utility
function correctTimeToCurrentDate(date) {
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
  const returnDate = new Date(date);
  returnDate.setTime(date.getTime() + minutes * 60 * 1000);
  return returnDate;
}
function fixTimezoneDifference(date) {
  return addMinutes(date, date.getTimezoneOffset());
}
function timeToMinutes(date) {
  const dateHours = date.getHours();
  let returnMinutes = date.getMinutes();
  returnMinutes += dateHours * 60;
  return returnMinutes;
}
function getTimePassed(timeToZero, currentTime, endTime) {
  return (
    timeToMinutes(alignTimeToZero(timeToZero, getCurrentTime()))
    / timeToMinutes(alignTimeToZero(timeToZero, endTime))
  );
}
function alignTimeToZero(timeToZero, timeToAlign) {
  // aligns the second time as though first time is at midnight, used for calculating difference in time.
  let returnDate = new Date(timeToAlign);
  returnDate = addMinutes(returnDate, -(timeToZero.getHours() * 60));
  if (bedTime.getHours() < timeToZero.getHours()) {
    returnDate = addMinutes(returnDate, 1440);
  }
  return returnDate;
}
