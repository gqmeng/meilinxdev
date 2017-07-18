var greendot='http://maps.google.com/mapfiles/ms/icons/green-dot.png';
var reddot='http://maps.google.com/mapfiles/ms/icons/red-dot.png';
var cameradot ='http://maps.google.com/mapfiles/ms/icons/blue.png';
var gatewaydot ='http://maps.google.com/mapfiles/ms/icons/purple.png';
var markers=[];
var map;
var infowindow;
var eventBus = new Vue();
var arrDestinations = [];

$(document).ready(function(){
	var mydata;
	var self=this;
	console.log("Retrieving initial data...");

	// function myFunction() {
	// 	console.log("Starting retrieving config data...");
	//
	// 	$.getJSON("./json/resouces.json", function(data){
	// 		 greendot = data.greendot;
	// 		 reddot = data.reddot;
	// 		 cameradot =data.cameradot;
	// 		 gatewaydot=data.gatewaydot;
	// 	 },
	//  function(response){
	// 	 console.log("Error=>"+response);
	//  });
	//
	// }
google.charts.load('current', {'packages':['corechart', 'controls']});
 	google.charts.setOnLoadCallback(drawVisualization);

          function showPage() {
            document.getElementById("loader").style.opacity = 0;
            document.getElementById("myDiv").style.opacity = 1;
          }

function drawVisualization() {
	var dashboard = new google.visualization.Dashboard(
			 document.getElementById('dashboard'));

	 var control = new google.visualization.ControlWrapper({
		 'controlType': 'ChartRangeFilter',
		 'containerId': 'control',
		 'options': {
			 // Filter by the date axis.
			 'filterColumnIndex': 0,
			 'ui': {
				 'chartType': 'LineChart',
				 'chartOptions': {
					 'chartArea': {'width': '90%'},
						 'hAxis': {'baselineColor': 'none', format: "dd.MM.yyyy" }
				 },
				 // Display a single series that shows the closing value of the stock.
				 // Thus, this view has two columns: the date (axis) and the stock value (line series).
				 'chartView': {
					 'columns': [0, 1]
				 },
				 // 1 day in milliseconds = 24 * 60 * 60 * 1000 = 86,400,000
				 'minRangeSize': 86400000
			 }
		 },
		 // Initial range: 2012-02-09 to 2012-03-20.
		 'state': {'range': {'start': new Date(2017, 1, 20), 'end': new Date(2017, 1, 24)}}
	 });

	 var chart = new google.visualization.ChartWrapper({
		 'chartType': 'LineChart',
		 'containerId': 'chart',
		 'options': {
			 // Use the same chart area width as the control for axis alignment.
			 'chartArea': {'height': '80%', 'width': '90%'},
			 'hAxis': {'slantedText': false, title:"Sensor Reading"},
			 'vAxis':{
				 title: 'Time'
			 },
			//  'vAxis': {'viewWindow': {'min': 0, 'max': 2000}},
			 'legend': {'position': 'none'}
		 },
		 // Convert the first column from 'date' to 'string'.
		 'view': {
			 'columns': [
				 {
					 'calc': function(dataTable, rowIndex) {
						 return dataTable.getFormattedValue(rowIndex, 0);
					 },
					 'type': 'string'
				 }, 1]
		 }
	 });

	 var data = new google.visualization.DataTable();
					data.addColumn('date', 'Date');
					data.addColumn('number', 'Level');
	//  data.addColumn('number', 'Stock low');
	//  data.addColumn('number', 'Stock open');
	//  data.addColumn('number', 'Stock close');
	//  data.addColumn('number', 'Stock high');


	 // Create random stock values, just like it works in reality.

	 $.get( "./data/Data.txt", function( csv ) {
		 var dataset = $.csv.toArrays(csv);
		 var count=dataset.length;

		 for(var i=0; i<count; i++){
			 var ts = parseInt($.trim(dataset[i][2]));
			// console.log(ts);
			 var date = new Date(ts*1000);
			 if(i==0){
					control.setState({'range': {'start': date}});
			 }
			control.setState({'range': {'end': date}});
			// console.log(date);
			 var value =  parseFloat($.trim(dataset[i][1]));
			 data.addRow([date, value]);
		 }
		 var formatter = new google.visualization.DateFormat({pattern: "dd.MM.yyyy H:mm"});
		 formatter.format(data, 0);

			dashboard.bind(control, chart);
			dashboard.draw(data);
		 setTimeout(showPage, 3000);
//     console.log(data);
	 });



}

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
	created:function(){
		var self=this;
		eventBus.$on("listhighlight",function(id){
			if(id==self.model.id){
				self.showSummary();
			}
		})
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
      	case 'vnode':
        	return cameradot;
      	case 'snode':
        	if(!this.model.alert){
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
  	toggle: function (e) {
    	if (this.isFolder) {
      	this.open = !this.open
    	}else {
      	console.log("Clicked "+this.model.name);
				e.stopPropagation();
				eventBus.$emit("mapMarkerClick",this.model.id);
    	}
  	},
		openoverlay: function (e) {
			if (this.isFolder) {
				console.log("Clicked "+this.model.name);
				overlayShow("topnode",this.model.id);
			}else {
				console.log("Clicked "+this.model.name);
				e.stopPropagation();
				eventBus.$emit("mapMarkerClick",this.model.id);
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
		hoverover:function(e){
			e.stopPropagation();
			eventBus.$emit("maphighlight",this.model.id);
			this.showSummary();
		},
		hoverout:function(e){
			e.stopPropagation();
			eventBus.$emit("maphighlightover",this.model.id);
		},
  	showSummary:function() {
    	$("#summary>span").text(this.model.name);
  	}
	}
})

// boot up the demo
var demo = new Vue({
	el: '#fsnapp',
	data: function(){
  	return {
			highlight:"",
    	treeData: {  "name": "My Sensor Network",
			  "id":"mynetwork",
			  "children":[],
				"displayClass": "level0",
				"entitytype": "network",
				"title": "Sensor Network"
			},
			snList:{},
			vnList:{},
			gwList:{},
			arrDestinations:arrDestinations,
    	dataReady: false,
    	snReady: false,
    	gwReady: false,
    	vnReady: false,
			markers:markers,
			currentOLView:'sensornode',
			showOverlay:false
  	}
	},
	created:function(){
		var self=this;
				// initMap();
				// showMarkers();
		eventBus.$on("listhighlight",function(id){
	  	$(".highlight").removeClass("highlight");
			if(id!=null){
				$("#"+id).addClass("highlight");
			}
		});
		eventBus.$on("maphighlight",function(id){
			for(var i=0;i<markers.length;i++){
			// console.log("hover:"+id+" vs "+self.markers[i].title);
				if(self.markers[i].title==id){
					google.maps.event.trigger(self.markers[i], 'mouseover');
				}
			}
		});
		eventBus.$on("maphighlightover",function(id){
			for(var i=0;i<markers.length;i++){
			// console.log("hover:"+id+" vs "+self.markers[i].title);
				if(self.markers[i].title==id){
					google.maps.event.trigger(self.markers[i], 'mouseout');
				}
			}
		});
		eventBus.$on("mapMarkerClick",function(id){
			for(var i=0;i<markers.length;i++){
			// console.log("hover:"+id+" vs "+self.markers[i].title);
				if(self.markers[i].title==id){
					google.maps.event.trigger(self.markers[i], 'click');
				}
			}
		})
	},
	beforeCreate: function(){
  	var self=this;
  	$.when(
    	$.getJSON("./json/sensornodes.json",function(data){
				$.extend(true, self.snList, data);
        // console.log("Sensor Node list retrieved"+ JSON.stringify(self.snList));
        self.snReady=true;
      }),
    $.getJSON("./json/gateways.json",function(data){
			$.extend(true, self.gwList, data);
      // console.log("Gateway retrieved"+self.gwList);
      self.gwReady=true;
      }),
  $.getJSON("./json/videonodes.json",function(data){
			$.extend(true, self.vnList, data);
      // console.log("Video Nodes retrieved"+self.vnList);
      self.vnReady=true;
    })
).then(
	function(){
		initMap();
		// console.log(self.snList);
		var groups = {};
		for (var i = 0; i < self.snList.nodelist.length; i++) {
  		var groupName = self.snList.nodelist[i].Group;
  		if (!groups[groupName]) {
    		groups[groupName] = [];
  		}

  		groups[groupName].push({name:"Sensor Node "+self.snList.nodelist[i].ID,id:self.snList.nodelist[i].ID,displayClass: 'level2',entitytype:"snode",alert:self.snList.nodelist[i].Alert});
			}
			for (var groupName in groups) {
				var title='Sensor Node Group #'+groupName;
				var gname='Sensor Node Group '+groupName;
  			// result1.push({name: gname, title:title,displayClass: 'level1', entitytype:'group', children: groups[groupName]});
				self.treeData.children.push({name: gname, title:title,displayClass: 'level1', entitytype:'group', children: groups[groupName]});
			}
			for (var i = 0; i < self.gwList.nodelist.length; i++) {
				self.treeData.children.push({name:"Gateway "+self.gwList.nodelist[i].ID,id:self.gwList.nodelist[i].ID,displayClass: 'level1',entitytype:"gateway",alert:self.gwList.nodelist[i].Alert});
			}
			for (var i = 0; i < self.vnList.nodelist.length; i++) {
				self.treeData.children.push({name:"Video Node "+self.vnList.nodelist[i].ID,id:self.vnList.nodelist[i].ID,displayClass: 'level1',entitytype:"vnode",alert:self.vnList.nodelist[i].Alert});
			}
  	 	$("#summary>span").text(self.treeData.title);
    	self.dataReady = true;
			self.constructDestationArray("gateway");
			self.constructDestationArray("vnode");
			self.constructDestationArray("snode");
				// console.log(arrDestinations.length);
			for (i = 0; i < arrDestinations.length; i++) {
				addMarker(arrDestinations[i]);
			}
			showMarkers();

	}
	)
},
methods:{
	setHighlight:function(id){
		this.highlight=id;
	},
	constructDestationArray: function(type){
		var self=this;
		switch(type){
			case "gateway":
				ready=self.gwReady;
				list=self.gwList.nodelist;
				break;
			case  "snode":
				ready=self.snReady;
				list=self.snList.nodelist;
				break;
			case  "vnode":
				ready=self.vnReady;
				list=self.vnList.nodelist;
				break;
		}
		if(ready){
			$.each(list,function(index,item){
			// console.log(item);
				var arrDest = {};
				arrDest.lat=item.Latitude;
				arrDest.lon=item.Longitude;
				arrDest.id=item.ID;
				arrDest.title=item.ID;
				arrDest.type=type;
				arrDest.alert=item.Alert;
				arrDest.description="Normal Operation.";
				arrDestinations.push(arrDest);
			})
		}
	}
}
})

Object.defineProperty(Array.prototype, 'group', {
  enumerable: false,
  value: function (key) {
    var map = {};
    this.forEach(function (e) {
      var k = key(e);
      map[k] = map[k] || [];
      map[k].push(e);
    });
    return Object.keys(map).map(function (k) {
      return {name: k, children: map[k]};
    });
  }
});

function overlayShow(type, id) {
	console.log("Marker Clicked: "+id);
	var olID = '#snodeoverlay';
	switch(type){
		case "topnode":
			olID = '#topnodeoverlay';
			break;
		case "vnode":
				olID = '#vnodeoverlay';
				break;
		case "gateway":
					olID = '#gatewayoverlay';
					break;
		case "snode":
					olID = '#snodeoverlay';
					break;
	}
	$(olID).modal('show');
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

function showOverlay(marker, type, id){
	marker.addListener('click', function() {
				 marker.map.setZoom(19);
				 marker.map.setCenter(marker.getPosition());
				 overlayShow(type, id);
			 });
}

function bindInfoWindow(marker, map, infowindow, html, id) {
	google.maps.event.addListener(marker, 'mouseover', function(e) {
		infowindow.setContent(html);
		infowindow.open(map, marker);
		if(e){
		eventBus.$emit("listhighlight",id);}
	});
	google.maps.event.addListener(marker, 'mouseout', function(e) {
		infowindow.setContent("");
		infowindow.close();
		if(e){
		eventBus.$emit("listhighlight",null);}
	});
	google.maps.event.addListener(infowindow, 'domready', function() {
   // Reference to the DIV which receives the contents of the infowindow using jQuery
   	var iwOuter = $('.gm-style-iw');
	 	var iwCloseBtn = iwOuter.next();
	 	iwCloseBtn.css({'display': 'none'});
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
		title: dest.id,
		icon:micon,
		position: new google.maps.LatLng(dest.lat, dest.lon),
		map: map
	});
	showOverlay(marker, dest.type, dest.id);
	bindInfoWindow(marker, map, infowindow, "<span style='font-weight:600;'>" + dest.id+" - "+dest.description + "</span>",dest.id);
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
