$(function(){
	const $place = $(".place");
	const $people = $(".people");
	const $year = $(".year");
	let t=0;
	let n=0;
	let w;
	let winHalf; 
	let topPos=0;
	let categoryFlag=false;

	AOS.init({
		easing: "ease-in-out-sine",
		duration:800,
		once: true
	});

	var mySwiper = new Swiper(".swiper-container", {
		spaceBetween: 20,
		slidesPerView: 1.3,
		centeredSlides : true,
		roundLengths: true,
		loop: true,
		loopAdditionalSlides: 30,
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		breakpoints : {
			768: {
				slidesPerView: 3,
				centeredSlides: true,
			},
		}
	});

	function numCounter(counter, max){
		let now = max;
		const handle = setInterval(() => {
			counter.text(Math.ceil(max - now));

			if(now < 1){
				clearInterval(handle);
			}
			const step = now / 10;
			now -= step;
		}, 50);
	}

	$("#header .menu a.tab").click(
		function(e){
			if($("#header").hasClass("active") == false){
				e.preventDefault();
				$("#header").addClass("active");
				$("body").addClass("fixed");
			}
			else{
				e.preventDefault();
				$("#header").removeClass("active");
				$("body").removeClass("fixed");
			}	
		}
	);
	$(".dim").click(
		function(){
			$("#header").removeClass("active");
			$("body").removeClass("fixed");
		}
	);

	$("#pc_gnb li").eq(n).find("a").addClass("active");
	$("#mo_gnb li").eq(n).find("a").addClass("active");

	$(window).scroll(function(){
    	t=$(window).scrollTop();

		if(t < $("#page1").offset().top-winHalf){
			n=0;
		}
		else if(t < $("#page2").offset().top-winHalf){
			n=1;
			if(!$place.text()){
				numCounter($place, 1200);
				numCounter($people, 4638);
				numCounter($year, 48);
			}
		}
		else if(t < $("#page3").offset().top-winHalf){
			n=2;
		}
		else if(t < $("#page4").offset().top-winHalf){
			n=3;
		}
		else if(t < $("#page5").offset().top-winHalf){
			n=4;
		}
		else if(t < $("#page6").offset().top-winHalf){
			n=5;
		}
		else{
			n=6;
		}
		
		if(t > 100){
			$(".on_top").addClass("active");
			$(".menu").addClass("active");
		}
		else{
			$(".on_top").removeClass("active");
			$(".menu").removeClass("active");
		}

		$("#pc_gnb li a").removeClass("active");
		$("#pc_gnb li").eq(n).find("a").addClass("active");
		$("#mo_gnb li a").removeClass("active");
		$("#mo_gnb li").eq(n).find("a").addClass("active");


		if(categoryFlag){
			return;
		}
		else{
			$("#page"+n).addClass("active");

			if(n == 5){
			categoryFlag=true;
			}
		}
	});
	$("#pc_gnb li").click(function(e){
		e.preventDefault();
		topPos=$(this).find("a").attr("href");
		topPos=$(topPos).offset().top;
		$("html").animate({scrollTop:topPos}, 400);
	});
	$("#mo_gnb li").click(function(e){
		e.preventDefault();
		$(".dim").trigger("click");
		topPos=$(this).find("a").attr("href");
		topPos=$(topPos).offset().top;
		$("html").delay(400).animate({scrollTop:topPos}, 400);
	});	
	$(".on_top").click(function(e){
		e.preventDefault();
		$("html").animate({scrollTop:0}, 400);
	});

	$(window).resize(function(){
		w=window.innerWidth;
		winHalf=$(window).height()/2;

		if(w >= 940){
			if($(".mobile").hasClass("active")){
				$(".dim").trigger("click");
			}
			if($("#header").hasClass("active")){
				$(".dim").trigger("click");
			}
		}
		$(window).trigger("scroll");
	});
	$(window).trigger("resize");
});