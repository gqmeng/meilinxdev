function overlayShow(id) {
	console.log("Marker Clicked: "+id);
	$("#nodeoverlay").modal('show');
}
	function initMap() {
		var uluru = {lat: 42.290669, lng: -83.727823};
		var map = new google.maps.Map(document.getElementById('map'), {
			zoom: 16,
			center: uluru
		});
		var marker = new google.maps.Marker({
			position: uluru,
			map: map
		});
		var marker1 = new google.maps.Marker({
			position:{lat: 42.290169, lng: -83.72823},
			map: map
		});
			// var clickHandler = new ClickEventHandler(map, uluru);
			marker.addListener('click', function() {
						 map.setZoom(18);
						 map.setCenter(marker.getPosition());
						 overlayShow("#0");
					 });
					 marker1.addListener('click', function() {
									map.setZoom(18);
									map.setCenter(marker1.getPosition());
									overlayShow("#1");
								});

	}


// /**
//  * @constructor
//  */
// var ClickEventHandler = function(map, origin) {
//   this.origin = origin;
//   this.map = map;
//   this.directionsService = new google.maps.DirectionsService;
//   this.directionsDisplay = new google.maps.DirectionsRenderer;
//   this.directionsDisplay.setMap(map);
//   this.placesService = new google.maps.places.PlacesService(map);
//   this.infowindow = new google.maps.InfoWindow;
//   this.infowindowContent = document.getElementById('infowindow-content');
//   this.infowindow.setContent(this.infowindowContent);
//
//   // Listen for clicks on the map.
//   this.map.addListener('click', this.handleClick.bind(this));
// };
//
// ClickEventHandler.prototype.handleClick = function(event) {
//   console.log('You clicked on: ' + event.latLng);
//   // If the event has a placeId, use it.
//   if (event.placeId) {
//     console.log('You clicked on place:' + event.placeId);
//
//     // Calling e.stop() on the event prevents the default info window from
//     // showing.
//     // If you call stop here when there is no placeId you will prevent some
//     // other map click event handlers from receiving the event.
//     event.stop();
//     this.calculateAndDisplayRoute(event.placeId);
//     this.getPlaceInformation(event.placeId);
//   }
// };
//
// ClickEventHandler.prototype.calculateAndDisplayRoute = function(placeId) {
//   var me = this;
//   this.directionsService.route({
//     origin: this.origin,
//     destination: {placeId: placeId},
//     travelMode: 'WALKING'
//   }, function(response, status) {
//     if (status === 'OK') {
//       me.directionsDisplay.setDirections(response);
//     } else {
//       window.alert('Directions request failed due to ' + status);
//     }
//   });
// };
//
// ClickEventHandler.prototype.getPlaceInformation = function(placeId) {
//   var me = this;
//   this.placesService.getDetails({placeId: placeId}, function(place, status) {
//     if (status === 'OK') {
//       me.infowindow.close();
//       me.infowindow.setPosition(place.geometry.location);
//       me.infowindowContent.children['place-icon'].src = place.icon;
//       me.infowindowContent.children['place-name'].textContent = place.name;
//       me.infowindowContent.children['place-id'].textContent = place.place_id;
//       me.infowindowContent.children['place-address'].textContent =
//           place.formatted_address;
//       me.infowindow.open(me.map);
//     }
//   });
// };
