/*==========================================================================
  General
	Build Time: 2017-10-26 10:52PM EDT
  ========================================================================== */


var greendot='http://maps.google.com/mapfiles/ms/icons/green-dot.png';
var reddot='http://maps.google.com/mapfiles/ms/icons/red-dot.png';
var cameradot ='http://maps.google.com/mapfiles/ms/icons/blue.png';
var gatewaydot ='http://maps.google.com/mapfiles/ms/icons/purple.png';
var markers=[];
var map;
var infowindow;
var eventBus = new Vue();
var arrDestinations = [];
var mjpeglist=[];

function showPage() {
  document.getElementById("loader").style.opacity = 0;
  document.getElementById("myDiv").style.opacity = 1;
  document.getElementById("loader2").style.opacity = 0;
  document.getElementById("myDiv2").style.opacity = 1;
}

Vue.component('videoitem', {
	template: `<div :id="fileitem.title">
            <span>{{fileitem.title}}</span>

            <button @click="stopmjpeg" v-if='isPlaying' ><span class="glyphicon glyphicon-stop"></span></button>
            <button @click="playmjpeg" v-else><span class="glyphicon glyphicon-play"></span></button>
      </div>`,
  // template: `<span>{{fileitem.title}}</span>`,
	props: {
  	fileitem: Object
	},
	data: function () {
  	return {
      serverconnect:true,
    	isPlaying: false,
  	}
	},
  computed:{
    fileurl:function(){
      if(this.serverconnect){
        return "https://34.213.66.163/movieportal?file_name="+this.fileitem.filename
      }else {
      return "../video/"+this.fileitem.filename
    }
    }
  },
  methods:{
    playmjpeg: function() {
        console.log("clicked");
        this.isPlaying=true;
        var token="";
        if(this.serverconnect){
          token = $('meta[name=csrf-token]').attr('content');
          }
        if($('#mjpegcontainer').children().length>0){
          $('#mjpegcontainer').empty()
        }
        $('#mjpegcontainer').append("<div id='mjpeg_wrapper'></div>");
    		var file=this.fileurl;
        $('#mjpeg_wrapper').clipchamp_mjpeg_player(
        file,
        24, // frames per second
        false, // autoloop
        token,  //token
        stop
        );

      },
      stopmjpeg:function(){
        this.isPlaying=false;
        if($('#mjpegcontainer').children().length>0){
          $('#mjpegcontainer').empty()
        }
      }
  }
});
// define the item component for the tree data
Vue.component('item', {
	template: `<li :class="model.displayClass" :id="model.id" v-on:mouseover="hoverover" v-on:mouseout="hoverout"><div  @dblclick="changeType">
          <span v-if="isFolder" class="glyphicon glyphicon-minus" @click="toggle"></span><span v-else><img :src="micon" height="18px"></span>
          <span class="entryname" @click.stop="toggle">{{model.name}}</span></div>
        <ul v-show="open" v-if="isFolder">
          <item class="item"
            v-for="model in model.children"
            :model="model" :key="model.name">
          </item>
        </ul>
      </li>`,
	props: {
  	model: Object
	},
	data: function () {
  	return {
    	open: true,
      serverconnect:false,
      starttime:'2017-09-23T21:41:19Z',
      endtime:moment().toISOString(),
      mjpeglist:mjpeglist
  	}
	},
	created:function(){
		var self=this;
		eventBus.$on("listhighlight",function(id){
			if(id==self.model.id){
				self.showSummary();
			}
		});
    eventBus.$on("overlayShow",function(obj){
      if(self.model.id==obj.id) {
        overlayShow(self.serverconnect,obj.type,obj.id,
          self.starttime,self.endtime);
      }
		});
    this.starttime=moment(this.endtime).subtract(6,'hours').toISOString();
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
				this.toggle();
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
      $("#summary").innerHTML ="" ;
		},
  	showSummary:function() {
      var summ = {};
      if(this.model.data)
        { summ.ID=this.model.data.ID;
          summ.Latitude=this.model.data.Latitude;
          summ.Longitude=this.model.data.Longitude;
        }
    	$("#summary").jsonBrowse(summ);
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
			  "ID":"mynetwork",
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
      isLoggedIn: true,
      isAdmin:true,
      user:{username:'',password:''},
      servernodelist:[],
      serverconnect:false,
      starttime:"",
      endtime:"",
      libraryready:false,
      selectedTrace:'temp',
      mjpeglistModel:{list:mjpeglist}
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
    eventBus.$on('vlistReady',function(l){
      self.mjpeglistModel.list=l;
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
				if(self.markers[i].title==id){
					google.maps.event.trigger(self.markers[i], 'click');
				}
			}
		});

  // });
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
		// initMap();
		// construct sensor node list from servernodelist
    if(self.serverconnect){
      self.servernodelist.forEach(function(e,index){
        if(self.snList.nodelist[index]){
          self.snList.nodelist[index].ID = e.hwid;
          self.snList.nodelist[index].Latitude = e.latitude;
          self.snList.nodelist[index].Longitude = e.longitude;
        }
        else{
          self.snList.nodelist.push({ID:e.hwid,Latitude:e.latitude,Longitude:e.longitude,"Timstamp":100,
              "Battery1":12,
              "Battery2":12,
              "Alert":false,
              "Pressure1":0.4,
              "Pressure2":0.6,
              "Temperature1":89,
              "Temperature2":89,
              "TypeA":20,
              "Humidity1":80,
              "Group":"a"})
        }
            })

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
			// showMarkers();

	}
	)
},
mounted: function(){
	initMap();
  showMarkers();
},
watch:{
  libraryready:function(){
    console.log("Map Library Loaded")
  },
  selectedTrace: function(){
    chartView2=new google.visualization.DataView(chartData2);
    if(this.selectedTrace=='temp'){
      chart2.setOptions({'vAxes':{0:{'title':"Temperature (Celsius)"}},'legend': {'position': 'none'},'chartArea': {'height': '80%', 'width': '90%','left':60}} );
      chartView2.hideColumns([1,2,3,4,5,6])
    }
    if(this.selectedTrace=='hum'){
      chart2.setOptions({'vAxes':{0:{'title':"Humidity (%RH)"}},'legend': {'position': 'none'},'chartArea': {'height': '80%', 'width': '90%','left':60}} )	;
      chartView2.hideColumns([1,2,3,5,6,7,8]);
    }
    if(this.selectedTrace=='pres'){
      chart2.setOptions({'vAxes':{0:{'title':"Pressure (Pascal)"}},'legend': {'position': 'none'},'chartArea': {'height': '80%', 'width': '90%','left':60}} )	;
      chartView2.hideColumns([1,2,3,4,7,8]);
    }
    if(this.selectedTrace=='batt'){
      chart2.setOptions({'vAxes':{0:{'title':"Battery (V)"}},'legend': {'position': 'none'},'chartArea': {'height': '80%', 'width': '90%','left':60}} )	;
      chartView2.hideColumns([1,4,5,6,7,8]);
    }
    dashboard2.draw(chartView2);
  }
},
methods:{
  submitlogin:function(){
    this.isLoggedIn=true;
  },
  logout:function(){
    $.ajax({  // eslint-disable-line
      type: 'GET',
      url: 'http://52.36.202.215/logout',
      success: function (response) {
        console.log(response);
        window.location.replace("http://52.36.202.215/login");
      },
      error: function (response) {
        console.log(response);
      }
    });
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

function overlayShow(serverconnect, type, id, start, end) {
  console.log("serverconnect"+serverconnect);
  console.log("type"+type);
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
  if(type=='vnode'){
    console.log("video list:");
    var fn = mjpeglist.length;
    mjpeglist.splice(0,fn);
    if(true){
      $.ajax({  // eslint-disable-line
        type: 'GET',
        url: 'http://52.36.202.215/videos',
        success: function (response) {
          console.log(response);
          response.forEach(function(e){
            var obj={};
            obj.filename=e;
            obj.title=e.slice(0,e.indexOf('.'));
            mjpeglist.push(obj);
          })

        }
      })
    }else{
      $.getJSON("./json/mjpglist.json", function( response ) {
        console.log(response);
        var l = response.filelist;
        $.extend(true, mjpeglist, l);
        eventBus.$emit('vlistReady',l);
    });
  }
}
	if(type=='snode'){
    console.log("Tab 2a shown");
    var n = chartData.getNumberOfRows();
    chartData.removeRows(0,n);
    var n = chartData2.getNumberOfRows();
    chartData2.removeRows(0,n);
    if(serverconnect){
      $.ajax({  // eslint-disable-line
        type: 'GET',
        url: 'http://52.36.202.215/dataset?sensornode='+id+'&start_time='+start+'&end_time='+end,
        success: function (response) {
          console.log(response);
          if(response.length>0){
            response.forEach(function(e, index){
            var date=new Date(e[0]);
            if(index==0){
                 control.setState({'range': {'start': date}});
                 control2.setState({'range': {'start': date}});
            }
             control.setState({'range': {'end': date}});
             control2.setState({'range': {'end': date}});
             var alert =  parseFloat($.trim(e[1]));
             var bat1 =  parseFloat($.trim(e[2]));
             var bat2 =  parseFloat($.trim(e[3]));
              var hum1 =  parseFloat($.trim(e[5]));
              var pre1 =  parseFloat($.trim(e[8]));
              var pre2 =  parseFloat($.trim(e[9]));
              var temp1 =  parseFloat($.trim(e[11]));
              var temp2 =  parseFloat($.trim(e[12]));
              var water =  parseFloat($.trim(e[14]));
             chartData.addRow([date, water]);
             chartData2.addRow([date, alert,bat1,bat2,hum1,pre1,pre2,temp1,temp2]);
          });
        }
        chartView=new google.visualization.DataView(chartData);
        dashboard.bind(control, chart);
        dashboard.draw(chartView);
        chartView2=new google.visualization.DataView(chartData2);
        dashboard2.bind(control2, chart2);
        dashboard2.draw(chartView2);
        setTimeout(showPage, 1000);
      },
      error: function (response) {
        console.log(response);
        document.getElementById("loader").style.opacity = 0;
        document.getElementById("myDiv").style.opacity = 0;
        $("#node_id").text(id+ "  -  No Data Available");
      }
    })
}else {
    $.get( "../data/data1.txt", function( csv ) {
      var dataset = $.csv.toArrays(csv);
      dataset.forEach(function(e, index){
      var date=moment.unix(e[0]).toDate();
      console.log("Unix timestamp:"+e[0]+"===>"+date)
      if(index==0){
             control.setState({'range': {'start': date}});
             control2.setState({'range': {'start': date}});
          }
          control.setState({'range': {'end': date}});
          control2.setState({'range': {'end': date}});
          var alert =  parseFloat($.trim(e[1]));
          var bat1 =  parseFloat($.trim(e[2]));
          var bat2 =  parseFloat($.trim(e[3]));
          var hum1 =  parseFloat($.trim(e[5]));
          var pre1 =  parseFloat($.trim(e[6]));
          var pre2 =  parseFloat($.trim(e[7]));
          var temp1 =  parseFloat($.trim(e[9]));
          var temp2 =  parseFloat($.trim(e[10]));
          var water =  parseFloat($.trim(e[12]));
          chartData.addRow([date, water]);
          chartData2.addRow([date, alert,bat1,bat2,hum1,pre1,pre2,temp1,temp2]);
        });
        chartView=new google.visualization.DataView(chartData);
        dashboard.bind(control, chart);
        dashboard.draw(chartView);
        chartView2=new google.visualization.DataView(chartData2);
        chartView2.hideColumns([1,2,3,4,5,6]);
        dashboard2.bind(control2, chart2);
        dashboard2.draw(chartView2);
        setTimeout(showPage, 1000);
      })
    };
  }
}
