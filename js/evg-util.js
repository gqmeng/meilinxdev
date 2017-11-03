var chartData;
var chartData2;
var chartView;
var chartView2;
var chartOptions = {
			  chartArea:{left:0,top:0,width:"100%",height:"100%"}
			   ,height: 915
			   ,width: 800
			 };
var dashboard ;
var dashboard2 ;
var control;
var control2;
var chart;
var chart2;
var initControl = {
 'controlType': 'ChartRangeFilter',
 'containerId': 'control',
 'options': {
	 // Filter by the date axis.
	 'filterColumnIndex': 0,
	 'ui': {
		 'chartType': 'LineChart',
		 'chartOptions': {
			 'chartArea': {'width': '90%','left':60},
				 'hAxis': {'baselineColor': 'none', format: "dd.MM.yy" },
				 'vAxis':{'title':' '}
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
}

function	playmjpeg(file) {
    console.log("clicked");
    if($('#mjpegcontainer').children().length>0){
      $('#mjpegcontainer').empty()
    }
    $('#mjpegcontainer').append("<div id='mjpeg_wrapper'></div>");
		if(file!=""){
    $('#mjpeg_wrapper').clipchamp_mjpeg_player(
    file,
    24, // frames per second
    false, // autoloop
    stop
    );
	}
  }
var pauseNow = false;
	function stop(el, pi){
	  if(pauseNow){
	    pi.finish();
	  }
	}

function drawVisualization() {
    dashboard = new google.visualization.Dashboard(document.getElementById('dashboard'));
		dashboard2 = new google.visualization.Dashboard(document.getElementById('dashboard2'));
    control = new google.visualization.ControlWrapper(initControl);
		initControl.containerID='control2';
	 	control2 = new google.visualization.ControlWrapper(initControl);
		chart = new google.visualization.ChartWrapper({
		 'chartType': 'LineChart',
		 'containerId': 'chart',
		 'options': {
			 // Use the same chart area width as the control for axis alignment.
			 'chartArea': {'height': '80%', 'width': '90%',left:60},
			 'hAxis': {
				 	'slantedText': false ,
			 		'gridlines': {
							count: -1,
							units: {
								days: {format: ['MMM dd']},
								hours: {format: ['HH:mm', 'ha']},
							}
						},
					'minorGridlines': {
							units: {
								hours: {format: ['hh:mm:ss a', 'ha']},
								minutes: {format: ['HH:mm a Z', ':mm']}
							}
						}
				},

			 'vAxes':{0:{'viewWindowMode':'explicit','title':"Water Level (Inches)"},
			 		}	,
			 'series': {0: {targetAxisIndex:0},
								 },
			//  'vAxis': {'viewWindow': {'min': 0, 'max': 2000}},
			 'legend': {'position': 'none'},
			 'color':['red','blue']
		 		},
		 // Convert the first column from 'date' to 'string'.
		 'view': {
			 'columns': [
				 0, 1]
		 }
	 });
	 chart2 = new google.visualization.ChartWrapper({
 		 'chartType': 'LineChart',
 		 'containerId': 'chart2',
 		 'options': {
 			 // Use the same chart area width as the control for axis alignment.
 			 'chartArea': {'height': '80%', 'width': '90%','left':60},
			 'hAxis': {
					'slantedText': false ,
					'gridlines': {
							count: -1,
							units: {
								days: {format: ['MMM dd']},
								hours: {format: ['HH:mm', 'ha']},
							}
						},
					'minorGridlines': {
							units: {
								hours: {format: ['hh:mm:ss a', 'ha']},
								minutes: {format: ['HH:mm a Z', ':mm']}
							}
						}
				},
 			 'vAxes':{0:{'viewWindowMode':'explicit','title':"Temperature (Celsius)"},

 			 		}	,
 		// 	 'series': {0: {targetAxisIndex:0},
 		// 							1:{targetAxisIndex:1},
			// 						2:{targetAxisIndex:2},
			// 						3:{targetAxisIndex:3},
			// 						4:{targetAxisIndex:4}
 		// 						 },
 			//  'vAxis': {'viewWindow': {'min': 0, 'max': 2000}},
 			 'legend': {'position': 'none'},
 			 'color':['red','blue']
 		 		},
 		 // Convert the first column from 'date' to 'string'.
 	// 	 'view': {
 	// 		 'columns': [
 	// 			 0, 1, 2,3,4,5,6,7,8]
 	// 	 }
 	 });

	 chartData = new google.visualization.DataTable();
   chartData.addColumn('date', 'Date');
	 chartData.addColumn('number', 'Water Level');
	 chartData2 = new google.visualization.DataTable();
   chartData2.addColumn('date', 'Date');
	 chartData2.addColumn('number', 'Alert');
	 chartData2.addColumn('number','Battery 1')
	 chartData2.addColumn('number','Battery 2')
	chartData2.addColumn('number', 'Humidity');
	 chartData2.addColumn('number','Pressure 1')
	 chartData2.addColumn('number','Pressure 2')
	 chartData2.addColumn('number','Temperature 1')
	 chartData2.addColumn('number','Temperature 2')
}


function initMap() {
		var uluru = {lat: 42.289916, lng: -83.730076};
		map = new google.maps.Map(document.getElementById('map'), {
			zoom: 18,
			center: uluru
		});
	  infowindow =  new google.maps.InfoWindow({
			content: ''
		});
}

function showOverlay(marker, type, id){
	marker.addListener('click', function() {
		var obj =  {id:id,type:type};
		marker.map.setZoom(18);
		marker.map.setCenter(marker.getPosition());
		eventBus.$emit('overlayShow', obj);
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
		if(dest.alert>=4){
			micon = reddot;
		}else if(dest.alert==3){
			micon=yellowdot;
		}else{
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
	marker.addListener('click', function() {
		var obj =  {id:dest.id,type:dest.type};
				 marker.map.setZoom(19);
				 marker.map.setCenter(marker.getPosition());
				 eventBus.$emit('overlayShow', obj);
			 });

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

$(document).ready(function(){
	$( 'a[data-toggle="tab"]' ).on( 'shown.bs.tab', function( evt ) {
		dashboard.draw(chartView);
    chartView2.hideColumns([1,2,3,4,5,6])
		dashboard2.draw(chartView2);
	});
})
