var map = new GMaps({
    div: '#map',
    lat: 10,
    lng: 10
});

var lat, lng;

GMaps.geolocate({
  success: function(position) {
    lat = position.coords.latitude;
    lng = position.coords.longitude;
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

function shareReview() {
    var review = $('#review').html();
    $.post('/api/share', {text: review,
                          lat: lat,
                          lng: lng}, function(data) {
                            if (data.done == 1) {
                                $('#share').html("Shared!");
                                $('#share').unbind('click');
                                $('#map').hide();
                                $('#review').hide();
                            }
                          }, 'json');
}

$('#share').bind('click', shareReview);