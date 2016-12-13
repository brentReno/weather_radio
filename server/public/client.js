var weather_data = [];
var artist_data =[];


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
    });


})();
