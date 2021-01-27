// Variables
var calorieTarget; // the total amount of calories intended to be consumed during the day.
var breakfastCalories; // calories that were consumed prior to starting the timer, e.g. breakfast.

var startTime; // the time the "go" button was first pressed, unless altered.
var bedTime; // the time at which all calories will be made available.

var availableCalories;

var calorieConsumptions; // list of calories consumed after starting, i.e. excluding alreadyConsumed.

// Main
main();
function main() {

}

// Functions
function getInputValues(){
    calorieTarget = getCalorieTarget();
    breakfastCalories = getBreakfastCalories();
    startTime = getStartTime();
    bedTime = getBedTime();
}

// Events
function goButton(){
    console.log(getCalorieTarget());
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