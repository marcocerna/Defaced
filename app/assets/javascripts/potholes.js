

    //initialize function to set up default map and map behavior

$(function(){
      var map;
      var markers = [];

    function initialize() {
      var mapOptions = {
          center: new google.maps.LatLng(37.7833, -122.4167), //set default center to be SF
          zoom: 13,//set default zoom to show entire extent of SF
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDoubleClickZoom: true, //disabled double click zoom
      };

      map = new google.maps.Map($("#map-canvas")[0],mapOptions);

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
      var markerLocation = {latitude:marker.position.nb, longitude:marker.position.ob}
      console.log(markerLocation)
      /// content string is where the css for the info boxes should go
      //JST["/templates/pothole.jst.ejs"]()
      var contentString =
      "<h2>New Pothole</h2>"+"<form id='potholeForm'><input id='name' type='text'name='name'placeholder='name'><br><input type='text' id='description' name='description'placeholder='description'> <input type='hidden' id='latitude' name='latitude' value='"+markerLocation.latitude+"'><input type='hidden' id ='longitude' name='longitude' value='"+markerLocation.longitude+"'><button id='ajax'></button>"

      var infowindow = new google.maps.InfoWindow({
           content:contentString,
           maxWidth:300
      });
      console.log($('#potholeForm'))

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

$('body').on('click', '#ajax', function(event){
  event.preventDefault();
  var $name =$('#name').val();
  var $description=$('#description').val();
  var $latitude=$('#latitude').val();
  var $longitude=$('#longitude').val();
  var $vote_count= 1

  var pothole = { pothole:
          {
            name: $name,
            description: $description,
            latitude: $latitude,
            longitude: $longitude,
            vote_count: $vote_count
          }
        };
        console.log(pothole)
        $.post("/potholes",pothole).done(function(data){
          alert('hep')
          console.log(data)
        })

      })

})









