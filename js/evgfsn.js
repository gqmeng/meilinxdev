var greendot='http://maps.google.com/mapfiles/ms/icons/green-dot.png';
var reddot='http://maps.google.com/mapfiles/ms/icons/red-dot.png';
var cameradot ='http://maps.google.com/mapfiles/ms/icons/blue.png';
var gatewaydot ='http://maps.google.com/mapfiles/ms/icons/purple.png';

$(document).ready(function(){
	var mydata;
	var self=this;
	console.log("Retrieving initial data...");

	function myFunction() {
		console.log("Starting retrieving config data...");

		$.getJSON("./json/resouces.json", function(data){
			 greendot = data.greendot;
			 reddot = data.reddot;
			 cameradot =data.cameradot;
			 gatewaydot=data.gatewaydot;
		 },
	 function(response){
		 console.log("Error=>"+response);
	 });

	}
	$.getJSON("./json/stubdata.json", function(data){
		 this.mydata=$.extend(true, {},data);
//		 setTimeout(showPage, 3000);
		 console.log(this.mydata);
	 },
 function(response){
	 console.log("Error=>"+response);
 });

 google.charts.load('current', {'packages':['corechart']});
 google.charts.setOnLoadCallback(drawChart);

 function drawChart() {
	 var data = google.visualization.arrayToDataTable([
		 ['Time', 'Reading'],
		 [ 75617,      3360],
		 [ 75622,    416],
		 [  75636,     255],
		 [  75645,      0],
		 [  75689,      417],
		 [  75693,    255]
	 ]);

	 var options = {
		 title: 'Sensor Reading',
		 hAxis: {title: 'Time'},
		 vAxis: {title: 'Reading'},
		 legend: 'none',

		 width: 600,
		 height: 300

	 };


	 var chart = new google.visualization.ScatterChart(document.getElementById('chart_div'));

	 chart.draw(data, options);
 }
});


// define the item component
Vue.component('item', {
template: '#item-template',
props: {
  model: Object
},
data: function () {
  return {
    open: true
  }
},
computed: {
  isFolder: function () {
    return this.model.children &&
      this.model.children.length
  },
  micon:function(){
    switch(this.model.entitytype){
      case 'gateway':
        return gatewaydot;
      case 'videonode':
        return cameradot;
      case 'sensornode':
        if(this.model.displayClass.includes('success')){
          return greendot;
        }else {
          return reddot;
        }
      default:
       return '';
    }
  }
},
methods: {
  toggle: function () {
    if (this.isFolder) {
      this.open = !this.open
    }else {
      console.log("Clicked "+this.model.name);
    }
  },
  changeType: function () {
    if (!this.isFolder) {
      Vue.set(this.model, 'children', [])
      this.addChild()
      this.open = true
    }
  },
  addChild: function () {
    this.model.children.push({
      name: 'new stuff'
    })
  },
  showSummary:function(e) {
    e.stopPropagation();
    console.log("hover:"+this.model.title);
    $("#summary>span").text(this.model.title);
  }
}
})

// boot up the demo
var demo = new Vue({
el: '#fsnapp',
data: function(){
  return {
    treeData: {},
    dataReady: false,
    snlistReady: false,
    gwReady: false,
    vnReady: false,
  }
},
beforeCreate: function(){
  var self=this;
  $.when(
    $.getJSON("./json/sensornodes.json",function(data){
        console.log("Sensor Node list retrieved");
                self.snlistReady=true;
      }),
    $.getJSON("./json/gateways.json",function(data){
      console.log("Gateway retrieved");
        self.gwReady=true;
      }),
  $.getJSON("./json/videonodes.json",function(data){
      console.log("Video Nodes retrieved");
        self.vnReady=true;
    })
).then(
  $.getJSON("./json/stubdata.json", function(data){
    // console.log(data);
     $.extend(true,self.treeData,data);
    console.log(self.treeData);

    $("#summary>span").text(self.treeData.title);
    self.dataReady = true;
  })
);
}
})

function overlayShow(id) {
	console.log("Marker Clicked: "+id);
	$("#nodeoverlay").modal('show');
	$("#node_id").text(id);
}

	function initMap() {
		var greendot='http://maps.google.com/mapfiles/ms/icons/green-dot.png';
		var reddot='http://maps.google.com/mapfiles/ms/icons/red-dot.png';
		var cameradot ='http://maps.google.com/mapfiles/ms/icons/blue.png'
		var gatewaydot ='http://maps.google.com/mapfiles/ms/icons/purple.png'
		var arrDestinations = [
		{
			lat: 42.289714,
			lon: -83.730221,
			id:"SR01",
			title: "Sensor Node #1",
			type: "snode",
			alert: false,
			description: ""
		},
		{
			lat: 42.289781,
			lon: -83.730076,
			id:"SR11",
			title: "Sensor Node #11",
			type: "snode",
			alert: false,
			description: ""
		},
		{
			lat: 42.289837,
			lon: -83.729956,
			id:"SR12",
			title: "Sensor Node #12",
			type: "snode",
			alert: false,
			description: ""
		},
		{
			lat: 42.289837,
			lon:-83.730291,
			id:"SR02",
			title: "Sensor Node #2",
			type: "snode",
			alert: true,
			description: "Flood Alert Warning"
		},
		{
			lat: 42.289678,
			lon: -83.730538,
			id:"VR01",
			title: "Video Node #1",
			type: "vnode",
			alert: false,
			description: ""
		},
		{
			lat: 42.289916,
			lon: -83.730076,
			id:"GW01",
			title: "Gateway #1",
			type: "gateway",
			alert: false,
			description: ""
		}
	];
		var uluru = {lat: 42.289916, lng: -83.730076};
		var map = new google.maps.Map(document.getElementById('map'), {
			zoom: 19,
			center: uluru
		});

		// var marker = new google.maps.Marker({
		// 	position: uluru,
		// 	map: map
		// });
		// var marker1 = new google.maps.Marker({
		// 	position:{lat: 42.290169, lng: -83.72823},
		// 	map: map
		// });
		var infowindow =  new google.maps.InfoWindow({
		content: ''
	});
	for (i = 0; i < arrDestinations.length; i++) {
	// create a marker
	var micon =null;
	if(arrDestinations[i].type=="snode"){
		if(arrDestinations[i].alert){
			micon = reddot;
		}else {
			micon=greendot;
		}
	}
	if(arrDestinations[i].type=="vnode"){
		micon=cameradot;
	}
	if(arrDestinations[i].type=="gateway"){
		micon=gatewaydot;
	}
	var marker = new google.maps.Marker({
		title: arrDestinations[i].title,
		icon:micon,
		position: new google.maps.LatLng(arrDestinations[i].lat, arrDestinations[i].lon),
		map: map
	});
	showOverlay(marker, arrDestinations[i].id);

	// // add an event listener for this marker
	bindInfoWindow(marker, map, infowindow, "<span style='font-weight:600;'>" + arrDestinations[i].description + "!!!</span>");
}
}
function showOverlay(marker, id){
	marker.addListener('click', function() {
				 marker.map.setZoom(19);
				 marker.map.setCenter(marker.getPosition());
				 overlayShow(id);
			 });
}
function bindInfoWindow(marker, map, infowindow, html) {
	google.maps.event.addListener(marker, 'mouseover', function() {
		infowindow.setContent(html);
		infowindow.open(map, marker);
	});
	google.maps.event.addListener(marker, 'mouseout', function() {
		infowindow.setContent("");
		infowindow.close();
	});
}
			// // var clickHandler = new ClickEventHandler(map, uluru);
			// marker.addListener('click', function() {
			// 			 map.setZoom(18);
			// 			 map.setCenter(marker.getPosition());
			// 			 overlayShow("#0");
			// 		 });
			// 		 marker1.addListener('click', function() {
			// 						map.setZoom(18);
			// 						map.setCenter(marker1.getPosition());
			// 						overlayShow("#1");
			// 					});




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
