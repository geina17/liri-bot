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
for (var i = 3; i < nodeArgv.length; i++) {
  if (i > 3 && i < nodeArgv.length) {
    x = x + "+" + nodeArgv[i];
  } else {
    x = x + nodeArgv[i];
  }
}

//switch case
switch (command) {
  case "my-tweets":
    showTweets();
    break;

  case "spotify-this-song":
    if (x) {
      spotifySong(x);
    } else {
      spotifySong("Fluorescent Adolescent");
    }
    break;

  case "movie-this":
    if (x) {
      omdbData(x);
    } else {
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

function showTweets() {
  //Display last 20 Tweets
  var screenName = {
    screen_name: 'gna_zonaGUALA'
  };
  client.get('statuses/user_timeline', screenName, function (error, tweets, response) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
        var date = tweets[i].created_at;
        console.log("@gna_zonaGUALA: " + tweets[i].text + " Created At: " + date.substring(0, 19));
        console.log("-----------------------");

        //adds text to log.txt file
        fs.appendFileSync('log.txt', "@gna_zonaGUALA: " + tweets[i].text + " Created At: " + date.substring(0, 19));
        fs.appendFileSync('log.txt', "-----------------------");
      }
    } else {
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
    console.log(error);
    console.log("tama");
    if (!error) {
      
      console.log(data.tracks);
      // for(var i = 0; i < songData.length; i++){
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
  var omdbURL = 'http://www.omdbapi.com/?t=' + movie + "&y=&plot=short&apikey=trilogy";

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
      fs.appendFile("log.txt", "\n" + '***** "' + info.Title + '" *****' + "\nReleased year" + info.Year + "\nIMDB rating " + info.Ratings[0].value + "\nRotten Tomatoes " + info.Ratings[1].Value + "\nLanguage: " + info.Language + "\nPlot: " + info.Plot + "\nActors: " + info.Actors + "\n", function (error) {
        if (error) {
          console.log(error);
        }
      });
    } else {
      console.log('Error occurred.');
    }
    if (movie === "Mr. Nobody") {
      console.log("-----------------------");
      console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      console.log("It's on Netflix!");

      //adds text to log.txt
      fs.appendFile('log.txt', "-----------------------");
      fs.appendFile('log.txt', "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      fs.appendFile('log.txt', "It's on Netflix!");
    }
  });
}
//node do-what-it-says
// function doThing() {
//   fs.readFile("random.txt", "utf8", function (error, data) {
//     var things = data.split(",");
//     var command = things[0];
//     var searchInput = things[1];

//     if (!error) {

//       for (var i = 1; i < things.length; i++) {
//         if (things === "my-tweets") {
//           myTweets(searchInput);
//         } else if (things === "spotify-this-song") {
//           spotifyThisSong(searchInput);
//         } else if (things === "movie-this") {
//           movieThis(searchInput);
//         } else {
//           return;
//         }
//       }
//     } else {
//       return console.log(error);
//     }
//   });
// }
function doThing() {
  fs.readFile("random.txt", "utf8", function(error, data){  
    console.log(error);
    console.log(data);
    
    var splice = data.split(",");

    action = splice[0];
    detail = splice[1];
    console.log(action);
    console.log("tama beans");
    console.log(detail);
    
    userSong = detail;
      spotify.search({ type:'track', query: userSong}, function(err, data) {
      if(!error) {
        console.log(data.tracks.items[0]);
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Song name: " + data.tracks.items[0].name);
        console.log("Link Preview: " + data.tracks.items[0].preview_url);
        console.log("Album: " + data.tracks.items[0].album.name);
  
      }
      else if (!data){
        console.log("'The Sign' by Ace of Base");
      }
    });
  });
}  
