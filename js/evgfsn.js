var greendot='http://maps.google.com/mapfiles/ms/icons/green-dot.png';
var reddot='http://maps.google.com/mapfiles/ms/icons/red-dot.png';
var cameradot ='http://maps.google.com/mapfiles/ms/icons/blue.png';
var gatewaydot ='http://maps.google.com/mapfiles/ms/icons/purple.png';
var markers=[];
var map;
var infowindow;
var eventBus = new Vue();
var arrDestinations = [
{
	lat: 42.289714,
	lon: -83.730221,
	id:"SR01",
	title: "Sensor Node #1",
	type: "snode",
	alert: false,
	description: "Normal"
}
,
{
	lat: 42.289781,
	lon: -83.730076,
	id:"SR11",
	title: "Sensor Node #11",
	type: "snode",
	alert: false,
	description: "Normal"
},
{
	lat: 42.289837,
	lon: -83.729956,
	id:"SR12",
	title: "Sensor Node #12",
	type: "snode",
	alert: false,
	description: "Normal"
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
	description: "Normal"
},
{
	lat: 42.289916,
	lon: -83.730076,
	id:"GW01",
	title: "Gateway #1",
	type: "gateway",
	alert: false,
	description: "Normal"
}
];

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


// define the item component for the tree data
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
    $("#summary>span").text(this.model.title);
		for(var i=0;i<markers.length;i++){
			var id=this.model.id;
			    console.log("hover:"+this.model.title+" vs "+markers[i].id);
			if(markers[i].id==id){
				google.maps.event.trigger(markers[i], 'mouseover');
			}
		}
  }
}
})

// boot up the demo
var demo = new Vue({
el: '#fsnapp',
data: function(){
  return {
		highlight:"",
    treeData: {},
		snList:{},
		vnList:{},
		gwList:{},
		arrDestinations:arrDestinations,
    dataReady: false,
    snlistReady: false,
    gwReady: false,
    vnReady: false,
  }
},
created:function(){
	eventBus.$on("highlight",function(id){
			$(".highlight").removeClass("highlight");
		if(id!=null){
		$("#"+id).addClass("highlight");}
	})
},
beforeCreate: function(){
  var self=this;
  $.when(
    $.getJSON("./json/sensornodes.json",function(data){
				$.extend(true, self.snList, data);
        console.log("Sensor Node list retrieved"+ JSON.stringify(self.snList));
        self.snlistReady=true;
      }),
    $.getJSON("./json/gateways.json",function(data){
			$.extend(true, self.gwList, data);
      console.log("Gateway retrieved"+self.gwList);
      self.gwReady=true;
      }),
  $.getJSON("./json/videonodes.json",function(data){
			$.extend(true, self.vnList, data);
      console.log("Video Nodes retrieved"+self.vnList);
      self.vnReady=true;
    })
).then(
  $.getJSON("./json/stubdata.json", function(data){
    // console.log(data);
     $.extend(true,self.treeData,data);
  	// console.log(self.treeData);
    $("#summary>span").text(self.treeData.title);
    self.dataReady = true;
		for (i = 0; i < arrDestinations.length; i++) {
			addMarker(arrDestinations[i]);
		}
		showMarkers();
})
)
},
methods:{
	setHighlight:function(id){
		this.highlight=id;
	}
}
})

function overlayShow(id) {
	console.log("Marker Clicked: "+id);
	$("#nodeoverlay").modal('show');
	$("#node_id").text(id);
}

	function initMap() {
		var uluru = {lat: 42.289916, lng: -83.730076};
		map = new google.maps.Map(document.getElementById('map'), {
			zoom: 19,
			center: uluru
		});
	  infowindow =  new google.maps.InfoWindow({
		content: ''
	});
}

function showOverlay(marker, id){
	marker.addListener('click', function() {
				 marker.map.setZoom(19);
				 marker.map.setCenter(marker.getPosition());
				 overlayShow(id);
			 });
}

function bindInfoWindow(marker, map, infowindow, html, id) {
	google.maps.event.addListener(marker, 'mouseover', function() {
		infowindow.setContent(html);
		infowindow.open(map, marker);
		eventBus.$emit("highlight",id);
	});
	google.maps.event.addListener(marker, 'mouseout', function() {
		infowindow.setContent("");
		infowindow.close();
			eventBus.$emit("highlight",null);
	});
}

function addMarker(dest) {
	var micon =null;
	if(dest.type=="snode"){
		if(dest.alert){
			micon = reddot;
		}else {
			micon=greendot;
		}
	}
	if(dest.type=="vnode"){
		micon=cameradot;
	}
	if(dest.type=="gateway"){
		micon=gatewaydot;
	}
	var marker = new google.maps.Marker({
		title: dest.title,
		icon:micon,
		position: new google.maps.LatLng(dest.lat, dest.lon),
		map: map
	});
	showOverlay(marker, dest.id);
	bindInfoWindow(marker, map, infowindow, "<span style='font-weight:600;'>" + dest.description + "</span>",dest.id);
	markers.push(marker);
}

		 // Sets the map on all markers in the array.
		 function setMapOnAll(map) {
			 for (var i = 0; i < markers.length; i++) {
				 markers[i].setMap(map);
			 }
		 }

		 // Removes the markers from the map, but keeps them in the array.
		 function clearMarkers() {
			 setMapOnAll(null);
		 }

		 // Shows any markers currently in the array.
		 function showMarkers() {
			 setMapOnAll(map);
		 }

		 // Deletes all markers in the array by removing references to them.
		 function deleteMarkers() {
			 clearMarkers();
			 markers = [];
		 }
