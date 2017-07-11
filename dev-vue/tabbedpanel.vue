	<template id= "tab-panel-template">
		<div class="tab-content view-obj">
			<ul>
				<li class="ot-viewlist" v-for="field in filteredFields">
					<fieldtile :field="field" :object="object" :isDisabled=isDisabled></fieldtile>
				</li>
			</ul>
		</div>
	</template>
	<script>
	import fieldtile from './fieldtile.vue';
	import { loadFieldsConfig } from '../ot.js';
	export default {
		name:'tabpane', 
		props:['section','object','isDisabled'],
		data: function(){
			return {
				fields_json : {
					fields : []
				},
				raw:9
			}
		},
		components: {
			fieldtile:fieldtile
		},
		beforeCreate : function() {
			var self = this;
			$.getJSON("./static/json/fields.json",function(data) {
				self.fields_json.fields = data.fields;
			});
		},
		updated : function() {
			
		},
		created : function() {
			
		},
		mounted : function() {
			
		},
		computed : {
			filteredFields :function(){
				var section = this.section;
				var fields = this.fields_json.fields;
				return fields.filter(function(field){
					return (field.section==section)
				})
			}
		},
		methods: {
			
		}
	};
	</script>
<style>
ul#tab {
    list-style-type: none;
    margin: 22px 0px 0px 0px;
    padding: 0;
    width: 100%;
    float: left;
    min-height: 800px;
    box-sizing: border-box;
    background-color: #ffffff;
}
input[type=text]:disabled {
	border: none;
	background-color: #fff;
	color: #666666;
	font-weight: 400;
	font-size: 14px;
padding: 0px;
}
.addtext .textview {
	resize:none;
	padding:8px 0px 0px 0px;
	border: none;
	border-radius: 0px;
	color:#666666;
  	margin: 0;
  	font-size: 14px;
  	overflow-y:auto;
  	line-height:1.4em;
  	   	text-overflow: clip;
   	white-space: pre-wrap;
   	word-break: break-word;
   	background-color: #fff;
    font-weight: 400;
}


.addtext a {
	display: block;
	border: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 38px;
    padding: 10px 0px 0px 1px;
	border-radius: 0px;
    margin: 0px;
    font-size: 14px;
    color: #666666;
    font-weight: 400;
}

.addtext a span {
	border-bottom: 1px solid #39b45a;
	text-decoration: none;
}

.addtext a:visited span {
	text-decoration: none;
}

ul.list li {
    display: block;
    padding: 0px;
}


</style>
	