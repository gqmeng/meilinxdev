	<template id="fieldtile-template">
	<div class="addtext" :id="field.name">
		<h4>{{field.title}}</h4>
		<input :type="field.type" class="metaEdit" disabled v-bind:value="value" 
			v-if="isInput" />
		<div class="metaEdit textview" v-if="isTextArea">{{value}}</div>
			
		<linkedfieldtile v-if="isLicense" v-bind:link="value.licenseLink"
			v-bind:value="value.licenseName"></linkedfieldtile>
		<div class='entryDisplayArea' id='citation_entries' v-if="isCitation">
			<ul class="list">
				<li v-for="citation in value">
				<linkedfieldtile :value="citation.citation_title" :link="citation.citation_at"></linkedfieldtile>
				</li>
			</ul>
		</div>
	</div>
	</template>
	<script>
	import linkedfieldtile from './linkedfield.vue';
	export default {
				name: "fieldtile",
				props : [ 'field' ,'fieldmodel', 'object',"isDisabled"],
				created:function(){
		
					},
				mounted: function(){
						if(this.isTextArea){
							var ta = this.$el.children[1];
							//console.log(this.field.section+" TextArea Mounted:"+ ta + "Scroll Height = "+ ta.scrollHeight);
							var sh = ta.scrollHeight+15;
							///ta.style.height="0px";     //Reset height, so that it not only grows but also shrinks
							///ta.style.height = sh + 'px';    //Set new height
						}
					},
				data:function(){
						return {}
					},
				components:{
					linkedfieldtile
					},
				computed : {
						value : function() {
							var propertyValue = "";
							switch (this.field.section) {
							case "metadata":
								propertyValue = this.object[this.field.section][this.field.name];
								break;
							case "payload":
								propertyValue = this.object[this.field.section][this.field.name];
								break;
							default:
								propertyValue = this.object[this.field.name];
								break;
							}
							return propertyValue;
						},
						isInput : function() {
							return (this.field.type == "text");
						},
						isTextArea : function() {
							return (this.field.type == "textarea");
						},
						isLicense : function() {
							return this.field.name == "license";
						},
						isCitation : function() {
							return this.field.name == "citations";
						}
					},
				methods:{
					onInput: function (event) {
					      this.$emit('input', event.target.value)
					    }
					}
				};
</script>