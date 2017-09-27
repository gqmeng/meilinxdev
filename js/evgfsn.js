var greendot='http://maps.google.com/mapfiles/ms/icons/green-dot.png';
var reddot='http://maps.google.com/mapfiles/ms/icons/red-dot.png';
var cameradot ='http://maps.google.com/mapfiles/ms/icons/blue.png';
var gatewaydot ='http://maps.google.com/mapfiles/ms/icons/purple.png';
var markers=[];
var map;
var infowindow;
var eventBus = new Vue();
var arrDestinations = [];

  function showPage() {
            document.getElementById("loader").style.opacity = 0;
            document.getElementById("myDiv").style.opacity = 1;
  }


// define the item component for the tree data
Vue.component('item', {
	template: '#item-template',
	props: {
  	model: Object
	},
	data: function () {
  	return {
    	open: true,
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
				overlayShow(true,"topnode",this.model.id);
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
    	$("#summary").jsonBrowse(this.model.data);
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
			showOverlay:false,
      isLoggedIn: false,
      isAdmin:true,
      user:{username:'',password:''},
      servernodelist:[],
      serverconnect:true
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
		});
    // $("a[href='#2a']").on('shown.bs.tab', function (e) {

  // });
	},
	beforeCreate: function(){
  	var self=this;
  	$.when(
      $.ajax({  // eslint-disable-line
          type: 'GET',
          url: 'http://52.36.202.215/sensornodes',
          success: function (response) {
            console.log(response);
            if(response.length>0){
              response.forEach(function(e){
                self.servernodelist.push(e);
              });
            }
          },
          error: function (response) {
            console.log(response);
          }
        }),
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
		// construct sensor node list from servernodelist
    if(self.serverconnect){
      self.snList.nodelist[0].ID = self.servernodelist[0].hwid;
      self.snList.nodelist[1].ID = self.servernodelist[1].hwid;
    }
		var groups = {};
		for (var i = 0; i < self.snList.nodelist.length; i++) {
  		var groupName = self.snList.nodelist[i].Group;
  		if (!groups[groupName]) {
    		groups[groupName] = [];
  		}

  		groups[groupName].push({name:"Sensor Node "+self.snList.nodelist[i].ID,id:self.snList.nodelist[i].ID,displayClass: 'level2',entitytype:"snode",alert:self.snList.nodelist[i].Alert, data:self.snList.nodelist[i]});
			}
			for (var groupName in groups) {
				var title='Sensor Node Group #'+groupName;
				var gname='Sensor Node Group '+groupName;
  			// result1.push({name: gname, title:title,displayClass: 'level1', entitytype:'group', children: groups[groupName]});
				self.treeData.children.push({name: gname, title:title, displayClass: 'level1', entitytype:'group', children: groups[groupName]});
			}
			for (var i = 0; i < self.gwList.nodelist.length; i++) {
				self.treeData.children.push({name:"Gateway "+self.gwList.nodelist[i].ID,id:self.gwList.nodelist[i].ID,displayClass: 'level1',entitytype:"gateway",alert:self.gwList.nodelist[i].Alert,data:self.gwList.nodelist[i]});
			}
			for (var i = 0; i < self.vnList.nodelist.length; i++) {
				self.treeData.children.push({name:"Video Node "+self.vnList.nodelist[i].ID,id:self.vnList.nodelist[i].ID,displayClass: 'level1',entitytype:"vnode",alert:self.vnList.nodelist[i].Alert,data:self.vnList.nodelist[i]});
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
  submitlogin:function(){
    //send loginin
    this.isLoggedIn=true;
},
logout:function(){
  this.isLoggedIn=false;
},
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
        if(arrDest.alert){
               arrDest.description="Alert!!";
        }else{
				      arrDest.description="Normal Operation.";
        }
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

function overlayShow(serverconnect, type, id) {
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
	if(type=='snode'){
    console.log("Tab 2a shown");
if(serverconnect){
  $.ajax({  // eslint-disable-line
      type: 'GET',
      url: 'http://52.36.202.215/dataset?gatewaynode=sensor1',
      success: function (response) {
        console.log(response);
        if(response.length>0){
          var n = chartData.getNumberOfRows();
          chartData.removeRows(0,n);
          response.forEach(function(e, index){
              var date=new Date(e[0]);
              if(index==0){
                 control.setState({'range': {'start': date}});
              }
             control.setState({'range': {'end': date}});
             var alert =  parseFloat($.trim(e[1]));
             var bat1 =  parseFloat($.trim(e[2]));
             var bat2 =  parseFloat($.trim(e[3]));
              var hum1 =  parseFloat($.trim(e[5]));
              var pre1 =  parseFloat($.trim(e[6]));
              var pre2 =  parseFloat($.trim(e[7]));
              var temp1 =  parseFloat($.trim(e[9]));
              var temp2 =  parseFloat($.trim(e[10]));
              var water =  parseFloat($.trim(e[12]));
             chartData.addRow([date, water,temp1]);

          });
        }
        console.log(chartData);
  var formatter = new google.visualization.DateFormat({pattern: "dd.MM.yyyy H:mm"});
  formatter.format(chartData, 0);
  chart.view={
   'columns': [
     {
       'calc': function(dataTable, rowIndex) {
         return dataTable.getFormattedValue(rowIndex, 0);
       },
       'type': 'string'
     }, 1]
 };
 console.log(chart);
 chartView=new google.visualization.DataView(chartData);
  dashboard.bind(control, chart);
  dashboard.draw(chartView);
  setTimeout(showPage, 1000);
      },
      error: function (response) {
        console.log(response);
      }
    })
}else {
    $.get( "../data/data1.txt", function( csv ) {
      console.log("loading data for the chart...");
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
        var value2 =  parseInt($.trim(dataset[i][2]))-parseInt($.trim(dataset[i][2])/10)*10;
        chartData.addRow([date, value,value2]);
      }
            console.log(chartData);
      var formatter = new google.visualization.DateFormat({pattern: "dd.MM.yyyy H:mm"});
      formatter.format(chartData, 0);
      chart.view={
 			 'columns': [
 				 {
 					 'calc': function(dataTable, rowIndex) {
 						 return dataTable.getFormattedValue(rowIndex, 0);
 					 },
 					 'type': 'string'
 				 }, 1]
 		 };
     console.log(chart);
     chartView=new google.visualization.DataView(chartData);
      dashboard.bind(control, chart);
      dashboard.draw(chartView);
      setTimeout(showPage, 1000);
  });

}



	 }
}
