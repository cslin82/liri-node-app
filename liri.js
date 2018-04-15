require("dotenv").config();

// Get command-line arguments

var [ , , ...myArgs] = process.argv;
var argAction = myArgs.shift();
myArgs = myArgs.join(' ');

console.log(`action is ${argAction} and target is ${myArgs}`);

