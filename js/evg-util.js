var chartData;
var chartOptions = {
			  chartArea:{left:0,top:0,width:"100%",height:"100%"}
			   ,height: 915
			   ,width: 800
			 };
var dashboard ;
var control;
var chart;

function showPage() {
            document.getElementById("loader").style.opacity = 0;
            document.getElementById("myDiv").style.opacity = 1;
  }

function drawVisualization() {
    dashboard = new google.visualization.Dashboard(
      			 document.getElementById('dashboard'));
    control = new google.visualization.ControlWrapper({
		 'controlType': 'ChartRangeFilter',
		 'containerId': 'control',
		 'options': {
			 // Filter by the date axis.
			 'filterColumnIndex': 0,
			 'ui': {
				 'chartType': 'LineChart',
				 'chartOptions': {
					 'chartArea': {'width': '915px', 'height':'50px'},
						 'hAxis': {'baselineColor': 'none', format: "dd.MM.yyyy" },
             'vAxis':{'title':''}
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

	chart = new google.visualization.ChartWrapper({
		 'chartType': 'LineChart',
		 'containerId': 'chart',
		 'options': {
			 // Use the same chart area width as the control for axis alignment.
			 'chartArea': {'height': '300px', 'width': '915px'},
			 'hAxis': {'slantedText': false },
			 'vAxis':{
				title:"Sensor Reading"
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

	 chartData = new google.visualization.DataTable();
   chartData.addColumn('date', 'Date');
	  chartData.addColumn('number', 'Level');
		console.log(chartData);
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
