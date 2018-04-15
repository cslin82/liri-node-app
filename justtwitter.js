require("dotenv").config();
const keys = require("./keys");

console.log(keys.twitter);


var Twitter = require('twitter');

var client = new Twitter(keys.twitter);


client.get('search/tweets', {q: '@thehill'}, function(error, tweets, response) {
    console.log(tweets);
 });