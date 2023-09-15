$(function(){
	var mainSwiper=new Swiper(".mainSwiper", {
		speed: 1200,
		effect: "fade",
		fadeEffect: {
			crossFade: true,
		},
		autoplay: {
			delay: 5000,
		},
		pagination: {
			el: ".swiper-pagination",
		},
	});
	$("#header .top .tab").click(
		function(e){
			e.preventDefault();
			$(".floating_menu").addClass("active");
			$("body").addClass("fixed");
		}
	);
	$(".floating_menu .title .tab").click(
		function(e){
			e.preventDefault();
			$(".floating_menu").removeClass("active");
			$("body").removeClass("fixed");

		}
	);
	$(".list > ul > li").click(
		function(e){
			e.preventDefault();

			if($(this).hasClass("active") == false){
				$(".list > ul > li").removeClass("active");
				$(this).addClass("active");
				$(".list ul ul").slideUp(300);
				$(this).children("ul").slideDown(300);
			}
			else{
				$(this).removeClass("active");
				$(this).children("ul").slideUp(300);
			}
		}
	);
	$(function(){
		var sub_slider=new Swiper("#sub_slider .swiper-container", {
			slidesPerView: 1.3,
      		spaceBetween: 12,
			pagination: {
         		el: "#sub_slider .swiper-pagination",
         		type: "progressbar"
      		},
      		navigation: {
         		nextEl: "#sub_slider .swiper-button-next",
         		prevEl: "#sub_slider .swiper-button-prev",
      		},
			breakpoints: {
         		640: {
            		slidesPerView: 3.5,
            		spaceBetween: 5
         		}
      		},
			on: {
         		init: function(){
            		var subSliderLength=$("#sub_slider .swiper-slide").length;
            		$("#sub_slider .tot").text(" /"+subSliderLength);
         		},
         		slideChange: function(){
            		var currentSlider=sub_slider.activeIndex;
            		currentSlider+=1;
            		$("#sub_slider .num").text(currentSlider);
         		}
      		}
   		});
	});
	var t=0;

	$(window).scroll(function(){
		t=$(window).scrollTop();
		if(t > 60){
			$("#header .top").addClass("scroll");
		}
		else{
			$("#header .top").removeClass("scroll");
		}
		if(t > 100){
			$(".go_top").addClass("scroll");
		}
		else{
			$(".go_top").removeClass("scroll");
		}
	});

	$(".swiper-slide .label a").click(function(e){
		e.preventDefault();
		if($(this).hasClass("active") == false){
			$(this).addClass("active");
		}
		else{
			$(this).removeClass("active");
		}	
	});
	$("#best .list ul li .icon a:first-child").click(function(e){
		e.preventDefault();
		if($(this).hasClass("active") == false){
			$(this).addClass("active");
		}
		else{
			$(this).removeClass("active");
		}	
	});
});