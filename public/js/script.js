var map = new GMaps({
    div: '#map',
    lat: 10,
    lng: 10
});

GMaps.geolocate({
  success: function(position) {
    map.setCenter(position.coords.latitude, position.coords.longitude);
    map.addMarker({lat: position.coords.latitude,
                   lng: position.coords.longitude,
                   infoWindow: {content: 'Your location'}});
  },
  error: function(error) {
    console.log('Geolocation failed: '+error.message);
  },
  not_supported: function() {
    console.log("Your browser does not support geolocation");
  }
});