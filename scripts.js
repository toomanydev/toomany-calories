// Variables
var calorieTarget; // the total amount of calories intended to be consumed during the day.
var breakfastCalories; // calories that were consumed prior to starting the timer, e.g. breakfast.

var startTime; // the time the "go" button was first pressed, unless altered.
var bedTime; // the time at which all calories will be made available.
var currentTime; 

var availableCalories;

var calorieConsumptions; // list of calories consumed after starting, i.e. excluding alreadyConsumed.

var updateInterval = 1000;
var updateInstance;
var updateCurrentTimeInstance;

// Main
main();
function main() {
    setupStartTime();
    updateCurrentTime();
    updateCurrentTimeInstance = setInterval(updateCurrentTime,1000);
}

// Events
function update() {
    console.log(getStartTime());
}
function updateCurrentTime() {
    currentTime = new Date();
    // TODO correct current time to be 1970, same data as default
    setCurrentTime(currentTime.getHours(), currentTime.getMinutes());
}
function goButton(){
    clearInterval(updateInstance);
    intakeInputValues();
    update();
    updateInstance = setInterval(update,updateInterval);
}

// Update UI
function updateOutputValues(){
    setCurrentTime();
    setAvailableCalories();
}
function setCurrentTime(hours, mins) {
    var hoursCorrected = correctTimeDigits(hours);
    var minsCorrected = correctTimeDigits(mins);
    document.getElementById("currentTime").innerHTML = hoursCorrected+":"+minsCorrected;
}
function setAvailableCalories() {
    document.getElementById("calorieTarget").value = availableCalories;
}

// Intake values from UI
function intakeInputValues(){
    calorieTarget = getCalorieTarget();
    breakfastCalories = getBreakfastCalories();
    startTime = getStartTime();
    bedTime = getBedTime();
}
function getCalorieTarget(){
    return document.getElementById("calorieTarget").value;
}
function getBreakfastCalories(){
    return document.getElementById("breakfastCalories").value;
}
function getStartTime(){
    return document.getElementById("startTime").valueAsDate;
}
function getBedTime(){
    return document.getElementById("bedTime").valueAsDate;
}

// Setup Times
function setupStartTime(){
    
}

// Utility
function correctTimeDigits(number){
    if(number < 10) {
        return "0"+number;
    } else {
        return number;
    }
}