<template id='ol-narrow-pane-template'>
<transition name='modal'>
<div class='modal-mask'>

	<div class='ol_narrow_pane'>
		<div class='sidebar_close'>
			<h3>CLOSE</h3>
			<div class='ot-r-btn ot-close'  v-on:click='closeOverlay'>
		       <div class='greenroundbutton' > </div>
		       <div class='btnContent'><img src='../assets/images/Close_Icon.png' width="10px"/></div>
		</div>
			
		</div>
		<div class='overlay-top'>
		</div>
		<div class='overlay-board'>
				<div class='overlay-title'>
					<slot name='ol-title'></slot>
				</div>
				<div class='entryform' id='entry_form'>
					<slot name='ol-form'></slot>
				</div>
		</div>
		<div class='overlay-alert'>
					<div class='alert-box processing'><slot name='ol-processing'></slot></div>
					<div class='alert-box success'><slot name='ol-success'></slot></div>
					<div class='alert-box failure'><slot name='ol-failure'></slot></div>
					<div class='alert-box warning'><slot name='ol-warning'></slot></div>
		</div>
	</div>
	
	</div>
	</transition>
</template>
<script>
import eventBus from '../components/eventBus.js';
export default {
  name: 'olnpane',
  props: ['layerid', 'left'],
  created: function () {
    var self = this  // eslint-disable-line
    eventBus.$on('editObj', function () {
      document.body.classList.toggle('noscroll', true);
      self.$el.style.right = '0px';
    });
  },
  methods: {
    closeOverlay: function () {
      this.$el.style.right = '-540px';
      eventBus.$emit('hideOverlay',this.layerid); // eslint-disable-line
    }
  }
};
</script>
<style scoped>
.ol_narrow_pane{
	position: absolute;
    right: 0px;
    width: 550px;
    margin: 0px auto;
    background-color: #fff;
    height: 100%;
    transition: all 2s ease;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity 1s ease;
}

.modal-enter {
	  opacity: 0;
	}

	.modal-leave-active {
	  opacity: 0;
	}

	.modal-enter .ol_narrow_pane,
	.modal-leave-active .ol_narrow_pane {
	  right: -540px;
	}

	
.sidebar_close {
    background-color:#fff;
	color: #b3b3b3;
    position:absolute;
    height: 100%;
    width:60px;
    text-align:center;
    border-right: 1px solid #e6e6e6;
	transition: color 0.5s ease;
}

.sidebar_close:hover {
	color: #666666;
}

.sidebar_close h3{
    position:absolute;
    line-height:60px;
    vertical-align:middle;
    top:40px;
    left:10px;
    font-size:14px;
    -webkit-transform: rotate(270deg);
    -moz-transform: rotate(270deg);
    -ms-transform: rotate(270deg);
    -o-transform: rotate(270deg);
    transform: rotate(270deg);
	transition: color 0.5s ease;
color: #b3b3b3;
}
#close_overlay {
    position: relative;
    top:10px;
    width:28px;
    height:28px;
}
.ot-close {
	position: relative;
	top: 11px;
	left: 11px;
}
.ot-close .greenroundbutton {
	width: 28px;
    height: 28px;
box-shadow: none;
}
.ot-close .btnContent {
	postion: relative;
	top: -24px;
left: 0px;
}

.sidebar_close:hover h3{
	color: #666666;
}
.sidebar_close:hover .greenroundbutton{
	  transform: scale(1.2);
	  margin: auto;
}
.overlay-top {
    height: 120px;
    width: 494px;
    position: absolute;
    top: 0;
    left: 60px;
    background-color: #fff;

}
.overlay-title {
	padding:0px 22px;
}
.overlay-board {
    position: absolute;
    background: white;
    width: 494px;
    top: 120px;
    left: 60px;
    padding: 0px 0px;
}

.overlay-alert {
    height: 60px;
    width: 494px;
    position: absolute;
    bottom:0px;
    left: 60px;
    background-color: #fff;

}
.alert-box {
	position:absolute;
	left:47px;
	bottom:0px;
	padding: 15px;
    margin-bottom: 20px;
    border: 1px solid transparent;
    border-radius: 10px;
    width:400px;
}

.success {
    color: #3c763d;
    background-color: #dff0d8;
    border-color: #d6e9c6;
    display: none;
}

.processing{
	   border-color: #d6e9c6;
    display: none;

}
.failure {
    color: #a94442;
    background-color: #f2dede;
    border-color: #ebccd1;
    display: none;
}

.warning {
    color: #8a6d3b;
    background-color: #fcf8e3;
    border-color: #faebcc;
    display: none;
}
.entryform {
	height: 600px;
    padding: 16px 22px;
    margin-top:0px;
    }
.noscroll { overflow: hidden; }

</style>
