
      var map;
      var markers = [];

    //initialize function to set up default map and map behavior
    function initialize() {
      var mapOptions = {
          center: new google.maps.LatLng(37.7833, -122.4167), //set default center to be SF
          zoom: 13,//set default zoom to show entire extent of SF
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDoubleClickZoom: true, //disabled double click zoom
      };

      map = new google.maps.Map(document.getElementById("map-canvas"),mapOptions);

      //click event listener to add new marker on double cick
      google.maps.event.addListener(map,'dblclick',function(event){
        potHole(event.latLng);
      });
    }

    //set default behavior for markers
    function potHole(location) {

      var marker = new google.maps.Marker({
        position: location,
        map: map,
        draggable:true,
        animation: google.maps.Animation.DROP,
        icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 5
        }
      });
      //adds newly created markers to marker array
      markers.push(marker);

      /// content string is where the css for the info boxes should go
      var contentString ="<img src= 'http://bostonbiker.org/files/2011/02/pothole.jpg'><h2>Bill</h2> <li> Discovered by: Rocketfish</li> <li> Date Discovered: 11/10/2013</li>"
      var infowindow = new google.maps.InfoWindow({
           content: contentString,
           maxWidth:300
      });

       google.maps.event.addListener(marker, 'click', function(){
       map.setZoom(18);
       map.setCenter(marker.getPosition());

          google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
          });
       });
    }

    function setAllMap(map) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
      }
    }

    function clearMarkers(){
      setAllMap(null);
    }

    function showMarkers(){
      setAllMap(map);
    }

    function deleteMarkers(){
      clearMarkers();
      markers =[];
    }
google.maps.event.addDomListener(window, 'load', initialize);