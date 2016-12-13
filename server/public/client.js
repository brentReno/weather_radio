////////////Globals\\\\\\\\\\\\\\\\

//response arrays
var weather_data = [];
var artist_data =[];

// music genres
var chill_genres= ["acoustic","ambient","chill","singer-songwriter","songwriter"];
var rock_genres= ["alt-rock", "alternative", "emo", "garage", "grunge", "indie", "indie-pop", "psych-rock", "punk", "punk-rock", "rock", "rock-n-roll", "rockabilly"];
var metal_genres= ["black-metal","death-metal","goth", "grindcore", "hard-rock","hardcore", "heavy-metal", "metal", "metal-misc", "metalcore"];
var country_folk_genres= ["bluegrass","country", "folk", "honky-tonk", "singer-songwriter", "songwriter"];
var hiphop_rnb_genres= ["breakbeat", "hip-hop", "funk", "groove", "r-n-b", "soul"];
var electronic_genres= ["chicago-house", "club", "dance", "deep-house", "detroit-techno", "drum-and-bass", "dubstep", "edm", "electro", "electronic", "house", "post-dubstep", "progressive-house", "techno" , "trance", "trip-hop"];
var world_genres= ["bossanova", "brazil", "dancehall", "latin", "reggae", "reggaeton", "salsa", "samba", "world-music", "afrobeat" ];
//weather groups



(function() {

  /**
   * Obtains parameters from the hash of the URL
   * @return Object
   */
  function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  var userProfileSource = document.getElementById('user-profile-template').innerHTML,
      userProfileTemplate = Handlebars.compile(userProfileSource),
      userProfilePlaceholder = document.getElementById('user-profile');

  var oauthSource = document.getElementById('oauth-template').innerHTML,
      oauthTemplate = Handlebars.compile(oauthSource),
      oauthPlaceholder = document.getElementById('oauth');

  var params = getHashParams();

  var access_token = params.access_token,
      refresh_token = params.refresh_token,
      error = params.error;

  if (error) {
    alert('There was an error during the authentication');
  } else {
    if (access_token) {
      // render oauth info
      oauthPlaceholder.innerHTML = oauthTemplate({
        access_token: access_token,
        refresh_token: refresh_token
      });

      $.ajax({
          url: 'https://api.spotify.com/v1/me',
          headers: {
            'Authorization': 'Bearer ' + access_token
          },
          success: function(response) {
            userProfilePlaceholder.innerHTML = userProfileTemplate(response);

            $('#login').hide();
            $('#loggedin').show();
          }
      });
    } else {
        // render initial screen
        $('#login').show();
        $('#loggedin').hide();
    }

    document.getElementById('obtain-new-token').addEventListener('click', function() {
      $.ajax({
        url: '/refresh_token',
        data: {
          'refresh_token': refresh_token
        }
      }).done(function(data) {
        access_token = data.access_token;
        oauthPlaceholder.innerHTML = oauthTemplate({
          access_token: access_token,
          refresh_token: refresh_token
        });
      });
    }, false);
  }

    ///////////////// Route used to see available genres, wil be deleted later \\\\\\\\\\\\\\\\\\\\\\\

    document.getElementById('obtain-genres').addEventListener('click', function(){
      $.ajax({
        type: "GET",
        url: 'https://api.spotify.com/v1/recommendations/available-genre-seeds',
        dataType: "json",
        headers: {"Authorization": "Bearer " + access_token},
        success: function(genres){
          console.log('back from spotify with: ', genres);
        }
      });
    });

    document.getElementById('obtain-artists').addEventListener('click', function() {
      console.log("access", access_token);
      $.ajax({
        type: "GET",
        url: "https://api.spotify.com/v1/me/top/artists",
        dataType: "json",
        headers: {"Authorization": "Bearer " + access_token},
        success: function(artists){
          console.log("back from spotify with: ", artists);
          for (var i = 0; i < artists.items.length; i++) {
            //package top artist data in to an object
            var user_artist ={
              //artist's name
              name: artists.items[i].name,
              // artist's genres
              genres: artists.items[i].genres,
              // artist's uri
              artist_uri: artists.items[i].uri
            };
            //push each artis to array
            artist_data.push(user_artist);
          }
          console.log(artist_data);
          findGenres();
      },
         error: function(err) {
          console.log("Error retrieving spotify API ", err);
        }
      });
    });

    document.getElementById('obtain-weather').addEventListener('click', function(){
      $.ajax({
        type: "GET",
        url: "http://api.wunderground.com/api/b67101dd22166f78/conditions/q/MN/Minneapolis.json",
        dataType: "json",
        success: function(weather){
          console.log("back with", weather);
          // get the current temp
          var current_temp = weather.current_observation.feelslike_f;
          //get the current weater conditions
          var current_conditions = weather.current_observation.weather;
          // get the current wind speed
          var current_wind= weather.current_observation.wind_mph;
          // push current data into weather_data
          weather_data.push(current_temp);
          weather_data.push(current_conditions);
          weather_data.push(current_wind);
          console.log(current_temp, current_conditions, current_wind);
          console.log(weather_data);
        }
      });
    }); // end weather click

    var findGenres = function(){
        for (var h = 0; h < artist_data.length; h++){
          // console.log(artist_data[h].genres);
          for(var i = 0; i < artist_data[h].genres.length; i++){
            //use electronic genres because it's the longest genre array
            for (var j =0; j < electronic_genres.length; j++){
              // console.log(electronic_genres[j]);
              // console.log(artist_data[h].genres[j]);
              if (electronic_genres[j] == artist_data[h].genres[i] ) {
                console.log("it's a match: " + electronic_genres[j]+ " & " + artist_data[h].genres[i] + " Artist: " + artist_data[h].name );
              }
              if( chill_genres[j]== artist_data[h].genres[i]){
                console.log("it's a match: " + chill_genres[j]+ " & " + artist_data[h].genres[i] + " Artist: " + artist_data[h].name );
              }
              if( rock_genres[j]== artist_data[h].genres[i]){
                console.log("it's a match: " + rock_genres[j]+ " & " + artist_data[h].genres[i] + " Artist: " + artist_data[h].name );
              }
              if( metal_genres[j]== artist_data[h].genres[i]){
                console.log("it's a match: " + metal_genres[j]+ " & " + artist_data[h].genres[i] + " Artist: " + artist_data[h].name );
              }
              if( country_folk_genres[j]== artist_data[h].genres[i]){
                console.log("it's a match: " + country_folk_genres[j]+ " & " + artist_data[h].genres[i] + " Artist: " + artist_data[h].name );
              }
              if( hiphop_rnb_genres[j]== artist_data[h].genres[i]){
                console.log("it's a match: " + hiphop_rnb_genres[j]+ " & " + artist_data[h].genres[i] + " Artist: " + artist_data[h].name );
              }
              if( world_genres[j]== artist_data[h].genres[i]){
                console.log("it's a match: " + world_genres[j]+ " & " + artist_data[h].genres[i] + " Artist: " + artist_data[h].name );
              }
            }
          }
        }
      };
})();
