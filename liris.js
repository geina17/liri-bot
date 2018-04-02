require("dotenv").config();
//Grab data from keys.js
var keys = require('./keys.js');
var request = require('request');
var twitter = require('twitter');
var spotify = require('spotify');
//changed from new twitter(keys.twitterKeys)
var client = new twitter(keys.twitter);
var fs = require('fs');

//Stored argument's array
var nodeArgv = process.argv;
var command = process.argv[2];

//movie or song
var x = "";

//attaches multiple word arguments
for (var i=3; i<nodeArgv.length; i++){
  if(i>3 && i<nodeArgv.length){
    x = x + "+" + nodeArgv[i];
  } else{
    x = x + nodeArgv[i];
  }
}

//switch case
switch(command){
  case "my-tweets":
    showTweets();
  break;

  case "spotify-this-song":
    if(x){
      spotifySong(x);
    } else{
      spotifySong("Fluorescent Adolescent");
    }
  break;

  case "movie-this":
    if(x){
      omdbData(x);
    } else{
      omdbData("Mr. Nobody");
    }
  break;

  case "do-what-it-says":
    doThing();
  break;

  default:
    console.log("{Please enter a command: my-tweets, spotify-this-song, movie-this, do-what-it-says}");
  break;
}

function showTweets(){
  //Display last 20 Tweets
  var screenName = {screen_name: 'gna_zonaGUALA'};
  client.get('statuses/user_timeline', screenName, function(error, tweets, response){
    if(!error){
      for(var i = 0; i<tweets.length; i++){
        var date = tweets[i].created_at;
        console.log("@gna_zonaGUALA: " + tweets[i].text + " Created At: " + date.substring(0, 19));
        console.log("-----------------------");
        
        //adds text to log.txt file
        fs.appendFileSync('log.txt', "@gna_zonaGUALA: " + tweets[i].text + " Created At: " + date.substring(0, 19));
        fs.appendFileSync('log.txt', "-----------------------");
      }
    }else{
      console.log('Error occurred');
      console.log(error);
    }
  });
}
function spotifySong(song) {
  spotify.search({
        type: 'track',
        query: song
      }, function (error, data) {
        if (!error) {
          // for(var i = 0; i < data.tracks.items.length; i++){
          var songData = data.tracks.items[i];
          //artist
          console.log("Artist: " + songData.artists[0].name);
          //song name
          console.log("Song: " + songData.name);
          //spotify preview link
          console.log("Preview URL: " + songData.preview_url);
          //album name
          console.log("Album: " + songData.album.name);
          console.log("-----------------------");

          //adds text to log.txt
          fs.appendFile("log.txt", "\n" + "Artist: " + songData.artists[0].name + "\nSong : " + songData.name + "\nPreview URL: " + songData.external_urls.spotify + "\nAlbum: " + songData.album.name + "\n", function (error) {
            if (error) {
              console.log(error);
            } else {
              console.log('An error occurred: ' + error);
            }
          });
        }
      });
}

function omdbData(movie) {
  var omdbURL = 'http://www.omdbapi.com/?t=' + movie + '&plot=short&tomatoes=' + omdb.key;

  request(omdbURL, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var torso = JSON.parse(body);

      console.log("Title: " + torso.Title);
      console.log("Release Year: " + torso.Year);
      console.log("IMdB Rating: " + torso.imdbRating);
      console.log("Country: " + torso.Country);
      console.log("Language: " + torso.Language);
      console.log("Plot: " + torso.Plot);
      console.log("Actors: " + torso.Actors);
      console.log("Rotten Tomatoes Rating: " + torso.tomatoRating);
      console.log("Rotten Tomatoes URL: " + torso.tomatoURL);

      //adds text to log.txt
      fs.appendFile("log.txt", "\n" + '***** "' + info.Title + '" *****' + "\nReleased year" + info.Year + "\nIMDB rating " + info.Ratings[0].value + "\nRotten Tomatoes " + info.Ratings[1].Value + "\nLanguage: " + info.Language + "\nPlot: " + info.Plot + "\nActors: " + info.Actors + "\n",function (error) {
        if(error){  
        console.log(error);
        }
      });
    }else {
      console.log('Error occurred.');
    }
  });
}

//node do-what-it-says
function doThis () {

  fs.readFile("random.txt", "utf8", function(error, data) {

      var things = data.split(",");
      var command = things[0];
      var searchInput = things[1];

      if (!error) {

          for (var i = 1; i < things.length; i++) {
              if (command === "my-tweets") {
                  myTweets(searchInput);
              } else if (command === "spotify-this-song") {
                  spotifyThisSong(searchInput);
              } else if (command === "movie-this") {
                  movieThis(searchInput);
              } else {
                  return;
              }
          }
      } else {
          return console.log(error);
      }
  });
}
