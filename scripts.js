// TODO: optionally show calorie consumptions, remember consumptions before reset for undo
// UNSURE: remove Go button (update on change).
let calorieTarget = 0; // the total amount of calories intended to be consumed during the day.
let breakfastCalories = 0; // calories that were consumed prior to starting the timer, e.g. breakfast.
let calorieConsumptions = []; // list of calories consumed after starting, i.e. excluding alreadyConsumed.

let startTime; // the time the "go" button was first pressed, unless altered.
let bedTime; // the time at which all calories will be made available.

const updateInterval = 1000;
let updateInstance;

main();
function main() {
  document
    .getElementById('consumeCalories')
    .addEventListener('keypress', consumeCaloriesEnter);
  document.getElementById('goButton').addEventListener('click', goButton);
  document.getElementById('consumeResetButton').addEventListener('click', consumeResetButton);

  window.onbeforeunload = userLeaving;

  getAllLocalStorage();
  updateInputValues();
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
function getTotalAvailableCalories() {
  let unavailableCalories = calorieTarget;
  unavailableCalories -= breakfastCalories;
  unavailableCalories -= getTotalConsumedCalories();

  return unavailableCalories;
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

// Events
function update() {
  updateOutputValues();
}
function userLeaving() {
  return '';
}

// Used in HTML
// eslint-disable-next-line no-unused-vars
function goButton() {
  clearInterval(updateInstance);
  intakeInputValues();
  storeAllLocalStorage();
  update();
  updateInstance = setInterval(update, updateInterval);
}
function consumeCaloriesEnter(e) {
  if (e.key === 'Enter') {
    if (!Number.isNaN(parseInt(getValueDOM('consumeCalories'), 10))) {
      consumeCalories(parseInt(getValueDOM('consumeCalories'), 10));
      setValueDOM('consumeCalories', null);
      goButton();
    }
  }
}
function consumeResetButton() {
  calorieConsumptions = [];
  goButton();
}

// Provide persistance
function storeAllLocalStorage() {
  localStorage.setItem('calorieTarget', calorieTarget);
  localStorage.setItem('breakfastCalories', breakfastCalories);
  localStorage.setItem('startTime', startTime);
  localStorage.setItem('bedTime', bedTime);
  localStorage.setItem('calorieConsumptions', JSON.stringify(calorieConsumptions));
}

function getAllLocalStorage() {
  calorieTarget = localStorage.getItem('calorieTarget');
  breakfastCalories = localStorage.getItem('breakfastCalories');
  startTime = new Date(localStorage.getItem('startTime'));
  bedTime = new Date(localStorage.getItem('bedTime'));

  const calorieConsumptionsJSON = JSON.parse(localStorage.getItem('calorieConsumptions'));
  if (calorieConsumptionsJSON.length !== 0) {
    calorieConsumptions = JSON.parse(localStorage.getItem('calorieConsumptions'));
  }
}

// Update UI
function updateOutputValues() {
  setInnerHTMLDOM('availableCalories', getAvailableCalories());
  setInnerHTMLDOM('totalAvailableCalories', getTotalAvailableCalories());
  setInnerHTMLDOM('consumeCaloriesLabel', "Consumed ("+getTotalConsumedCalories()+")");
}
function updateInputValues() {
  setValueDOM('calorieTarget', calorieTarget);
  setValueDOM('breakfastCalories', breakfastCalories);
  setValueDOM('startTime', startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  setValueDOM('bedTime', bedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
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
  const timeToZeroInMinutes = (timeToZero.getHours() * 60) + timeToZero.getMinutes();
  returnDate = addMinutes(returnDate, -(timeToZeroInMinutes));
  const timeToAlignInMinutes = (timeToAlign.getHours() * 60) + timeToAlign.getMinutes();
  if (timeToAlignInMinutes < timeToZeroInMinutes) {
    returnDate = addMinutes(returnDate, 1440);
  }
  return returnDate;
}
