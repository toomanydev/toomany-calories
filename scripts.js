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

// Main
main();
function main() {

}

// Events
function update() {
    console.log(getCalorieTarget());
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
function setCurrentTime() {
    document.getElementById("currentTime").value = currentTime;
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
    return document.getElementById("startTime").value;
}
function getBedTime(){
    return document.getElementById("bedTime").value;
}