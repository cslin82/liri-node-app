require("dotenv").config();
const keys = require("./keys");

console.log(keys.spotify);

var Spotify = require('node-spotify-api');
 
var spotify = new Spotify(keys.spotify);

spotify.search({ type: 'track', query: 'All the Small Things' }, function(err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }
   
  // console.log(data); 
  console.log(JSON.stringify(data, null, 4)); 
  });