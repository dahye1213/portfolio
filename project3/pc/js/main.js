$(function(){
		var swiper1 = new Swiper(".slider .mySwiper", {
		autoplay: {delay : 4000},
		loop: true,
		navigation: {
		  nextEl: ".slider .swiper-button-next",
		  prevEl: ".slider .swiper-button-prev",
		},
	});

	$("nav > ul > li").hover(
		function(){
			$(this).find("a").next(".sub").addClass("active");
		},
		function(){
			$(this).find("a").next(".sub").removeClass("active");
		}
	);
	$("nav > ul > li > a").focusin(function(){
		$(this).next(".sub").addClass("active");
	});
	$("nav li li:last-child a").focusout(function(){
		$(this).parents(".sub").removeClass("active");
	});

	$(function(){
		var sub_slider = new Swiper(".sub_slider .swiper-container", {
			slidesPerView: 3.15,
      		spaceBetween: 5,
			pagination: {
         		el: ".sub_slider .swiper-pagination",
         		type: "progressbar"
      		},
			breakpoints: {
         		640: {
            		slidesPerView: 3.15,
            		spaceBetween: 5
         		}
      		},
   		});
	});
});