(function ($) {

		// $("html").niceScroll({cursorwidth: '10', zindex: 9999,cursorcolor: "#e7e7e7", cursorborder:"1px solid #e7e7e7", cursorborderradius: "10px",autohidemode: false, zindex: 999 });
		$(window).scrollTop(100);
		$(document).on('click', 'a[href^="#"]', function(event){
		    event.preventDefault();
		    $('html, body').animate({
		        scrollTop: $( $.attr(this, 'href') ).offset().top-60
		    }, 800);
		});
		$.force_appear();
		$('a[href^="#"]').on('click touchend', function(e) {
			$(".customizedanchor").removeClass("customizedanchor");
			var el = $(this);
			var link = el.attr('href');
			if(link!="#"){
				$(link).addClass("customizedanchor");
			}
		});
		jQuery('.sidenav li:first-child').addClass('active');
		$('.dropdown').on('show.bs.dropdown', function(e){
		  $(this).find('.dropdown-menu').first().stop(true, true).slideDown(300);
		});

		$('.dropdown').on('hide.bs.dropdown', function(e){
		  $(this).find('.dropdown-menu').first().stop(true, true).slideUp(200);
		});
		if (Modernizr.mq("screen and (max-width:1024px)")) {
					jQuery("body").toggleClass("body");
			} else {
				var s = skrollr.init({
					mobileDeceleration: 1,
					edgeStrategy: 'set',
					forceHeight: true,
					smoothScrolling: true,
					smoothScrollingDuration: 300,
						easing: {
							WTF: Math.random,
							inverted: function(p) {
								return 1-p;
							}
						}
					});
			}

			onload = onresize = function() {
				var viewport_width = $(window).width();
				var viewport_height = $(window).height();

				if(viewport_width>991){
					$(".navbar-nav-m").css("height","auto");
					}else{
					$(".navbar-nav-m").height(viewport_height-60);
				}
		};

			$('.navbar-collapse').on('hidden.bs.collapse', function () {
				  $(".navbar-toggle").removeClass("active");
					$('body').css('overflow', 'scroll');
					$('body').css('position', 'relative');
				});

				$('.navbar-collapse').on('show.bs.collapse', function () {
					$(".navbar-toggle").addClass("active");
					$('body').css('overflow', 'hidden');
					$('body').css('position', 'fixed');
				});
	//scroll menu
		jQuery('.appear').appear();
		jQuery(".appear").on("appear", function(data) {
			var id = $(this).attr("id");
			jQuery('.sidenav li').removeClass('active');
			jQuery(".sidenav a[href='#" + id + "']").parent().addClass("active");
		});

		// $(window).scroll(_.throttle(function(){
		// 		var st = $(window).scrollTop();
		// 		var wh= $(window).height();
		// 		var id = $(".sidenav>li.active:first>a").attr("href");
		// 		var pos = $(id).offset();
		// 		var h = $(id).outerHeight();
		// 		var ratio = (pos.top+h -st-wh+200)/h;
		// 		if(ratio<0) {
		// 			ratio=0;
		// 		}if(ratio>1){
		// 				ratio=1;
		// 		}
		// 		var stub_h= 40*ratio;
		// 	 $(".sidenav>li.active>span.stub").css("height",stub_h+"px");
		// },50))

})(jQuery);
