export function retrieveObjectList(fillObjectList,errorHandler){
		$.ajax({
			type : "GET",
			url : "knowledgeObject",
			xhrFields: {
			     withCredentials: true
			},
			success : function(response, tStatus, xhr) {
			//	console.log(xhr);
				fillObjectList(response);
			},
			error : function(response) {
				 errorHandler(response);
			}
		});
}

export function retrieveObject(uri, section, fillObjectContent){
	var endPoint = uri;
	if(section!=""){
		endPoint = endPoint+ "/"+section;
	}
	console.log("Endpoint:"+endPoint);
	$.ajax({
		type : "GET",
		url : "knowledgeObject/"+endPoint,
		xhrFields: {
		     withCredentials: true
		},
		success : function(response, tStatus, xhr) {
			fillObjectContent(response);
		},
		error : function(response) {
			//errorHandler(response);
		}
	});
}



export function loadFieldsConfig(fillFieldsConfig){
	$.getJSON("resources/json/fields.json", fillFieldsConfig);
}

export function overlayHeightResize() {
	var ol_pane_height = $(window).height();
	var boardHeight = (ol_pane_height - 180);
	var formHeight = (boardHeight - 80);
	var liHeight = (formHeight - 60);
	$('.ol_pane').css("height", ol_pane_height + "px");
	$('.overlay-board').css("height", boardHeight + "px");
	$('.entryform').css("height", formHeight + "px");
	$('ul#edittab>li').css("height", liHeight + "px");
	// console.log("Heights:Pane="+ol_pane_height+" Board="+boardHeight+" Form="+formHeight+"Li="+liHeight);
	return ol_pane_height;
}

export function autoresize() {
	var eid= $(this).text();
	var sh = $(this)[0].scrollHeight+5;
	$(this).css("height","0px");     //Reset height, so that it not only grows but also shrinks
	$(this).css('height',sh+ 'px');    //Set new height
	// console.log("New Height = "+sh);
}

export function backToTop() {
    $("html, body").animate({
        scrollTop: 0
    }, 600);
    return false;
}

export function setBannerbkSize(){
  		var vp_width=$(window).width();
  		if(vp_width>1584){
  			$("#bannerbk").css("width",vp_width+"px");
  		}
  	}

export function editTabNav(){
	$("ul#edittabs li").click(function(e) {
		var tabClass=".view";
		if($(this).parent().hasClass("inEdit")){
			tabClass=".inEdit";
		}
		if (!$(this).hasClass("active")) {
			var tabNum = $(this).index();
			var nthChild = tabNum + 1;
			$("ul#edittabs"+tabClass+" li.active").removeClass("active");
			$("ul#edittabs"+tabClass+"  li.middleout").removeClass("middleout");
			$(this).addClass("active");
			$(this).addClass("middleout");
			$("ul#edittab"+tabClass+"  li.active").removeClass("active");
			$("ul#edittab"+tabClass+"  li:nth-child(" + nthChild + ")").addClass("active");
		}
	});
}


export function retrieveUserList(fillUserList, errorHandler){
	$.ajax({
		type : "GET",
		url : "user",
		xhrFields: {
		     withCredentials: true
		},
		success : function(response, tStatus, xhr) {
			console.log(xhr);
			fillUserList(response);
		},
		error : function(response) {
			errorHandler(response);
		}
	});
}

export function getCurrentUser(getUser, errorHandler) {
	$.ajax({
		type : "GET",
		url : "user/me",
		success : function(response, tStatus, xhr) {
			// console.log(xhr);
			getUser(response);
		},
		error : function(response, tStatus, xhr) {
			// console.log(xhr);
			errorHandler(response);
		}
	});
}

export function setstartdate(){
	 var startdate=$("#startdatepicker").val();
	 var sstamp=new Date(startdate).getTime();
	 eventBus.$emit("startdate",sstamp);
//	console.log("Start date:"+ sstamp);
 }

export function setenddate(){
				var enddate=$("#enddatepicker").val();
				 var estamp=new Date(enddate).getTime();
				eventBus.$emit("enddate",estamp);
			//	console.log("End date:"+ estamp);
			 }

export function otScroll() {
//	var padLeft = 280;
    var navOffset = $(".header").offset().top;
    // console.log("Offset top: "+navOffset)
    $(".header").wrap('<div class="theadwrapper"></div>');
	$(".theadwrapper").height($(".header").outerHeight(false));

    $(window).scroll(function () {
    	var supportPageOffset = window.pageXOffset !== undefined;
    	var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");
 	    var x = supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft;
    	var y = supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
            var scrollPos = $(window).scrollTop();
//        if(scrollPos>60){
//        	$(".ot-backtotop").fadeIn('slow');
//        	$("#backtotop").fadeIn('slow');
//        }else{
//        	$(".ot-backtotop").fadeOut('slow');
//        	$("#backtotop").fadeOut('slow');
//        }
       if (scrollPos >= navOffset) {
            $(".header").addClass("fixed");
        } else {
            $(".header").removeClass("fixed");
        }
       $(".fixed").css("left",-x+"px");
    });
}

$(document).ready(function() {

	overlayHeightResize();

	$(window).resize(function(){
			overlayHeightResize();
		}
	);

})
