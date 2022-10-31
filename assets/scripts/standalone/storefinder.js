/* NOTE: This file is for a prototype and will not be the most update file */
// SEARCH ***************************************************************************************************************
// Auto redirect if a user selects a store from the list or types in the correct branch name 
$('body').on('change keyup','#store',function(e){

  var $this = $(this);
  var storeID = $('#branches option[value="'+$this.val()+'"]').attr('data-id');

  if(!isNaN(storeID)){
    window.location = "/prototype/virgin/storefinder/branch"+storeID;
  }
});

// If a user can use geolocation then show the button and redirect to search page with lat and long coords when clicked 
if(navigator.geolocation){

  $('#geolocation').removeClass('d-none');

  function getUserLocation(position) {
    window.location = "/prototype/virgin/storefinder/search?lat="+position.coords.latitude+"&long="+position.coords.longitude+"#results";
  }

  // Add error message if a problem occurs 
  function gpsFail(){
    $('#search-branches').addClass('form--submitted');
    $('#search-branches .form-group').addClass('form-group--error')
    $('#search-branches label').append('<span class="error">Sorry, there has been a problem finding your location. Please enter a location manually in the search box.</span>')
  }

  $('body').on('click','#geolocation',function(e){
    e.preventDefault();
    navigator.geolocation.getCurrentPosition(getUserLocation, gpsFail);
  });
}

// MAP ***************************************************************************************************************
// Initialize and add the map
function initMap() {
  
  var zoom = $('[data-lat][data-lng]').length == 1 ? 16 : 11;
  var lat = $('[data-lat][data-lng]').first().attr('data-lat');
  var lng = $('[data-lat][data-lng]').first().attr('data-lng');
  var center = {lat: parseFloat(lat), lng: parseFloat(lng)};
  var activeInfoWindow;
  var defaultPin = $('#map').attr('data-default-pin');

  // Create Map
  var map = new google.maps.Map(document.getElementById('map'), {zoom: zoom, center: center});

  // Add markers
  $('[data-lat][data-lng]').each(function(index){

    var $this = $(this);
    var lat = $this.attr('data-lat');
    var lng = $this.first().attr('data-lng');
    var markerPoint = {lat: parseFloat(lat), lng: parseFloat(lng)};
    var title = $this.find('.branch-title').length ? $this.find('.branch-title').text() : "Branch";
    var address = $this.find('address').html();
    var link = $this.find('.store-details-link').attr('href');
    var pin = $this.find('> img:first-child').length ? $this.find('> img:first-child').attr('src'): defaultPin;
    
    var marker = new google.maps.Marker({
      position: markerPoint,
      map: map,
      title: title,
      icon: icon = {
        url: pin,
        scaledSize: new google.maps.Size(32, 44)
      }
    });

    // Add info window if it is on search page
    if($('.branch-listing').length){
        
      var infowindow = new google.maps.InfoWindow({
        content: "<span class='h6 pb-2'>"+title+"</span><address class='body d-block pb-3'>"+address+"</address><a href='"+link+"' class='btn btn-link mb-1'>View store details</a>"
      });

      marker.addListener('click', function(e) {
        if (activeInfoWindow) { activeInfoWindow.close();}
        infowindow.open(map, marker);
        activeInfoWindow = infowindow;

        map.panTo(this.getPosition());
        map.setZoom(16);
      });
    }
  });
}