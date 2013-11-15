$(function(){

  var map;
  var markers = [];                             // Where all markers are stored
  var currentLat;                               // These two used to create pothole with last position
  var currentLng;
  var infobox = new google.maps.InfoWindow({    // One infobox, only content changes
     content: "Hello!",
     boxStyle:{
      border: "1px solid black"
     }
  });
  var isWindowOpen = false;                     // Used so only one window opens at a time
  var newMarkerExists = false;                  // Used so only one marker creaed at a time
  var blueDot = "/assets/blueDot.png";
  var currentMarker;                            // Maybe use this for photo sizing issue?

/////////////////////////////////////////////////////////////////////////////


  ////////////////////////
  // Setting up the Map //
  ////////////////////////

  // This doesn't (yet) include the 'drop all markers at start' function
  // That's further down the file

  function initialize() {

    // Step 1: Set up variable with custom map options
    var mapOptions = {
        // Refactoring: If geolocation, center there. Else, SF
        center: new google.maps.LatLng(37.7833, -122.4167),         // Set default center to SF
        zoom: 13,                                                   // Set default zoom to show entire city
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDoubleClickZoom: true,                               // Disable double click zoom
        // This is where you would paste any style found on Snazzy Maps.
        styles: [ {   featureType:'water',    elementType:'geometry',   stylers:[     {hue:'#165c64'},      {saturation:34},      {lightness:-69},      {visibility:'on'}   ] },{   featureType:'landscape',    elementType:'geometry',   stylers:[     {hue:'#b7caaa'},      {saturation:-14},     {lightness:-18},      {visibility:'on'}   ] },{   featureType:'landscape.man_made',   elementType:'all',    stylers:[     {hue:'#cbdac1'},      {saturation:-6},      {lightness:-9},     {visibility:'on'}   ] },{   featureType:'road',   elementType:'geometry',   stylers:[     {hue:'#8d9b83'},      {saturation:-89},     {lightness:-12},      {visibility:'on'}   ] },{   featureType:'road.highway',   elementType:'geometry',   stylers:[     {hue:'#d4dad0'},      {saturation:-88},     {lightness:54},     {visibility:'simplified'}   ] },{   featureType:'road.arterial',    elementType:'geometry',   stylers:[     {hue:'#bdc5b6'},      {saturation:-89},     {lightness:-3},     {visibility:'simplified'}   ] },{   featureType:'road.local',   elementType:'geometry',   stylers:[     {hue:'#bdc5b6'},      {saturation:-89},     {lightness:-26},      {visibility:'on'}   ] },{   featureType:'poi',    elementType:'geometry',   stylers:[     {hue:'#c17118'},      {saturation:61},      {lightness:-45},      {visibility:'on'}   ] },{   featureType:'poi.park',   elementType:'all',    stylers:[     {hue:'#8ba975'},      {saturation:-46},     {lightness:-28},      {visibility:'on'}   ] },{   featureType:'transit',    elementType:'geometry',   stylers:[     {hue:'#a43218'},      {saturation:74},      {lightness:-51},      {visibility:'simplified'}   ] },{   featureType:'administrative.province',    elementType:'all',    stylers:[     {hue:'#ffffff'},      {saturation:0},     {lightness:100},      {visibility:'simplified'}   ] },{   featureType:'administrative.neighborhood',    elementType:'all',    stylers:[     {hue:'#ffffff'},      {saturation:0},     {lightness:100},      {visibility:'off'}    ] },{   featureType:'administrative.locality',    elementType:'labels',   stylers:[     {hue:'#ffffff'},      {saturation:0},     {lightness:100},      {visibility:'off'}    ] },{   featureType:'administrative.land_parcel',   elementType:'all',    stylers:[     {hue:'#ffffff'},      {saturation:0},     {lightness:100},      {visibility:'off'}    ] },{   featureType:'administrative',   elementType:'all',    stylers:[     {hue:'#3a3935'},      {saturation:5},     {lightness:-57},      {visibility:'off'}    ] },{   featureType:'poi.medical',    elementType:'geometry',   stylers:[     {hue:'#cba923'},      {saturation:50},      {lightness:-46},      {visibility:'on'}   ] }]
    };


    // Step 2: Create map (with that options variable) and throw it into a div
    map = new google.maps.Map($("#map-canvas")[0],mapOptions);

    // Step 3: Allow for geolocation (the blue dot)
     if(navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {

        // 3.1: Grab current position in a variable
        var currentPosition = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);

        // 3.2: Place blue dot on current position
        var userMarker = new google.maps.Marker({
          position: currentPosition,
          map: map,
          icon: blueDot
        });

        // 3.3: Center on current position
        map.setCenter(currentPosition);
      }, function() {
          handleNoGeolocation(true);
        });
      }

    // Step 4: Allow double click to create (only one) new marker
    // This executes the createMarker function (defined below)
    if(gon.current_user){
      google.maps.event.addListener(map,'dblclick',function(event){
        if (newMarkerExists == false) {
          infobox.close();
          newMarkerExists = true;
          createMarker(event.latLng);
        }
      });
    }
  }


////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////



  // This needs refactoring
  // Creates pothole marker on map (but doesn't touch the database)
  function createMarker(location, content, potholeID) {

    // Step 1: Create the marker

    // (First, though, we use a special variable to make old ones non-draggable)
    var drag = (content === undefined) ? true : false
    var sprayCan = {
      url: "/assets/sprayCan2.png",
      scaledSize: new google.maps.Size(50,50)}

    // Now we actually do step 1
    var marker = new google.maps.Marker({
      position: location,
      map: map,
      draggable: drag,
      animation: google.maps.Animation.DROP,
      icon: sprayCan,
      pothole_id: potholeID
    });

    // Step 2: Add newly created marker to a marker array

    markers.push(marker);


    // Step 3: Set up HTML for infobox
    var contentString;
    var markerLocation = {latitude:marker.position.ob, longitude:marker.position.pb}

    // If a new marker, creates a form
    // If an existing marker, uses content data passed into createMarker function
    if (content === undefined) {
      contentString = JST['templates/newForm'](markerLocation);
    } else {
      contentString = content;
    }

    // Step 4: Put content into infobox
    infobox.setContent(contentString);


    // Step 5: If it's a new marker, open the infobox
    if (newMarkerExists === true) {
      infobox.open(map, marker);
      isWindowOpen = true;
    };

    // Bug fix: Set currentLat/currentLng to hold last dragged position
    currentLat = markerLocation.latitude
    currentLng = markerLocation.longitude

    google.maps.event.addListener(marker, 'dragend', function(){
      currentLat = this.getPosition().lat()
      currentLng = this.getPosition().lng()
    })




    // On clicking marker, centers and opens/closes info window
    // Refactoring: Does this need to go inside createMarker function?

    google.maps.event.addListener(marker, 'click', function(){

      map.panTo(marker.getPosition());

      if (isWindowOpen == false) {
        infobox.setContent(contentString);
        infobox.open(map,marker);
        isWindowOpen = true;
        currentMarker = marker;
      } else if (infobox.content === contentString) {
        infobox.close();
        isWindowOpen = false;
        currentMarker = null;
      } else {
        infobox.close();
        infobox.setContent(contentString);
        infobox.open(map,marker);
        currentMarker = marker;
      }
    });
  } // end of createMarker()


/////////////////////////////////////////////////////////////////////////////////////

  // This lets everything happen only AFTER rest of window loads
  // Refactoring: In a weird location, need to move it
  google.maps.event.addDomListener(window, 'load', initialize);


/////////////////////////////////////////////////////////////////////////////////////


  //////////////////////////
  // Creating the pothole //
  //////////////////////////

  // Executes when submit button is clicked
  $('body').on('click', '#ajax', function(event){
    event.preventDefault();

    // There are four steps to this process

    // Step 1: Grab input values from form and shove them into jquery variables
    var $name = $('#name').val();
    var $description = $('#description').val();
    var $latitude = currentLat
    var $longitude = currentLng
    var $vote_count = 1
    var $user_id = gon.current_user.id


    // Step 2: Set up a 'pothole' hash with those values
    // We'll feed this into ajax call and it'll become params for 'create' action
    var pothole = {
      pothole:
        {
          name: $name,
          description: $description,
          latitude: $latitude,
          longitude: $longitude,
          vote_count: $vote_count,
          user_id: $user_id
        }
      };

    // Step 3: Ajax call
    // A 'post' call requires two arguments: a route and the data to be sent in as params
    // In this case, that's the 'vote' hash from step 2
    $.post("/potholes", pothole).done(function(data) {
      // Step 4: Stuff done after successful ajax call
      // In this case, we need to fill in infoBox with newly created data

      // Step 4.1: Create the html that will fill the infobox
      // We got back json data because we rendered that in the 'create' action
      var newContent = JST['templates/pothole'](data);

      // Step 4.2: Recreate marker with correct data
      var lastMarker = markers.pop()
      var lastPosition = lastMarker.position
      createMarker(lastPosition, newContent, data.id);

      // Step 4.3: Allow a new marker to be created
      newMarkerExists = false;
    })
  })



  /////////////////////////////////////////////////////////////////////////////


  /////////////////////////////////////////
  // Display all pothole markers on load //
  /////////////////////////////////////////

  $.get('/potholes.json').done(function(data) {
    _.each(data, function(item) {

      // Create marker
      var itemData = new google.maps.LatLng( parseFloat(item.latitude), parseFloat(item.longitude) )

      // Add pothole content
      var potholeContent = JST['templates/pothole'](item);

      // Execute
      createMarker(itemData, potholeContent, item.id);

    })

    // Optional: Marker clusters. Remove/comment out if you don't want it.
    var markerCluster = new MarkerClusterer(map, markers);
  })


  /////////////////////////////////////////////////////////////////////////////


  ///////////////////////////////////
  // Creating and Displaying Votes //
  ///////////////////////////////////

  // Executes when upvote or downvote button (both have class 'vote') is clicked
  $('body').on('click', '.vote', function(event) {
    event.preventDefault()

    // Step 1: Grab the relevant data for the Vote attributes and stick them into jquery variables
    // Upvote boolean is determined by checking button for 'upvote' or 'downvote' class
    // Placeholder for user_id right now

    var $upvote = (_.contains(this.classList, "upvote")) ? true : false
    var $pothole_id = this.id
    // var $user_id = something wil go here


    // Step 2: Set up the 'vote' hash that will become params for 'create' action
    var vote = {
      vote: {
        upvote: $upvote,
        pothole_id: $pothole_id,
        user_id: gon.current_user
      }
    }

    // Step 3: Ajax call
    // Our background worker gets called on creation of Vote, so vote_count will also get updated.
    $.post("/votes", vote).done(function(data) {

      // Step 4: Stuff done after successful ajax call
      // In this case, we update the vote count

      // This also has several steps

      // Step 4.1: Grab the div that contains the current vote count
      // Here the 'votes' json data is useful: we use its pothole_id to grab the correct div
      // We could merge this with the last line, but it's more readable this way
      var $countDiv = $('.vote_counter[id="' + data.pothole_id + '"]')

      // Step 4.2: Ajax call to grab potholes json (because it stores the current vote count)
      $.getJSON("/potholes.json", function(json) {

        // Step 4.3: Loop through each pothole json, checking whether it matches our pothole_id
        // If it does, we grab its vote_count and stick it in a variable
        for (i in json) {
          if (json[i]["id"] == data.pothole_id) {
            var $newValue = json[i]["vote_count"]
          }
        }

        // Step 4.4: Shove that number (step 4.3) into the div (step 4.1)
        $countDiv.html($newValue)
      })
    })
  })


/////////////////////////////////////////////////////////////////////////////////////


  ///////////////
  // DELETE!!! //
  ///////////////

  // NOTE: Make sure delete_button has hidden class unless user_id == current_user.id

  $('body').on('click','.deleteButton', function(event){
    event.preventDefault();

    // Step 1: Grab pothole id
    var $potholeID = this.id

    // Step 2: Ask for confirmation (only execute if true)
    var confirmDelete = window.confirm("Are you sure you want to delete this pothole?");

    if (confirmDelete == true) {

      // Step 3: Ajax call to delete
      $.ajax({
        method: "delete",
        url: "/potholes/" + $potholeID
      }).done(function(data){

        // Step 4: Close infobox
        infobox.close();

        // Step 5: Loop through markers array, find matching id, remove it
        for (i in markers) {
          if ( markers[i]["pothole_id"] == $potholeID || markers[i]["pothole_id"] == null) {
            markers[i].setMap(null);
          }
        }

      }) // end of .done()

    } else {
      // Step 6: In case user is dumb
      console.log("OK, then why did you click delete?")
    }
  })


/////////////////////////////////////////////////////////////////////////////////////


  //////////////////////////
  // Toggle Photo Buttons //          // WARNING: Sizing issues
  //////////////////////////

  $('body').on('click', '.showHide', function(event) {
    event.preventDefault();

    $('.showPhotosButton[id="' + this.id + '"]').toggleClass('hidden');      // Do we even need to check ID? Test this
    $('.photosContent[id="' + this.id + '"]').toggleClass('hidden');



  })


  // To change the popup box css properties:

$('body').on('click', '.gmnoprint', function(){
  setTimeout(function(){
  $('#content').parent().parent().parent().css('border','3px solid #34495e');
  $('#content').parent().parent().parent().css('border-radius','20px');
  }, 20);
})


/////////////////////////////////////////////////////////////////////////////////////


  ////////////////////////////
  // Show Photo (not done ) //
  ////////////////////////////


  $('body').on('click', '.showPhotosButton', function(event) {
    event.preventDefault()

    // grab current pothole_id
    var $photoPotholeID = this.id

    // make an array in which to store photo remote urls
    var $photoDisplayArray = []

    // ajax to photos
    $.getJSON('/all_photos.json', function(json) {


      // loop through data, grab URLs by pothole_id
      for (i in json) {
        if ( json[i]['pothole_id'] == parseInt($photoPotholeID) ) {
          $photoDisplayArray.push(json[i]["remote_image_url"])
        }
      }

      // close infobox, put data inside and reopen it
      infobox.close()
      infobox.setContent(
        JST["templates/photos"]({
          array: $photoDisplayArray
        })
      )

      // bxSlider command
      $(".bxslider").bxSlider({
        adaptiveHeight: true,
        mode: 'fade'
      })


      infobox.open(map, currentMarker)
    })
  })



})
