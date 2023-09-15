$(function(){
	const list = $("#gnb a");
	$(".mail").click(function(e){
		e.preventDefault();
		$(".mailForm").fadeIn(300);
	})
	$(".close").click(function(e){
		e.preventDefault();
		$(".mailForm").fadeOut(300);
	})

	emailjs.init("gkpRW7D5CKQaWxhgo");
	$("input[name=submit]").click(function(e){
		const exptest = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;
		e.preventDefault();
		var data = {
			from_name : $("input[type=text]").val(),
			from_email : $("input[type=email]").val(),
			message : $("textarea").val()
		};
		if(exptest.test($("input[name = email]").val()) == true){
			emailjs.send('service_6uxxmlp', 'template_70nxt9u', data)
			.then(function(response) {
				alert('email sent successfully');
				console.log('email sent successfully', response.status, response.text);
			}, function(error) {
				alert('Please resend');
				console.log('FAILED...', error);
			});		
		}
	});
	// -------	email --------

	$(".tab").click(function(e){
		e.preventDefault();
		$("#header").toggleClass("on");
		$(".tab").text($("a.tab").text() == "Menu" ? "Close" : "Menu");
		if($("#header").hasClass("on")){
			$("body").css("overflow", "hidden")
		}
		else{
			$("body").css("overflow", "auto");
		}
	})
	// -------	floating menu --------
	
	$(window).scroll(function(){
		let currentSection = 0;
		let yOffset = $(window).scrollTop();

		if($(window).width() < 768){
			if(yOffset < $("#about").offset().top){
				currentSection = 0;
			}
			else if(yOffset < $("#project").offset().top){
				currentSection = 1;
			}
			else{
				currentSection = 2;
			}
		}
		else{
			if(0 < Math.floor($("#about").offset().left)){
				currentSection = 0;
			}
			else if(0 < Math.floor($("#project").offset().left)){
				currentSection = 1;
			}
			else{
				currentSection = 2;
			}
		}
		list.removeClass("active");
		list.eq(currentSection).addClass("active");
	})
	// -------	current scene --------

	function projectLink(){
		if(isMobile){
			$("pro-0 a").attr({href: "project1/index.html"});
			$(".pro-1 a").attr({href: "project2/index.html"});
			$(".pro-2 a").attr({href: "project3/mobile/index.html"});
		}
		else{
			$(".pro-0 a").attr({href: "project1/index.html"});
			$(".pro-1 a").attr({href: "project2/index.html"});
			$(".pro-2 a").attr({href: "project3/pc/index.html"});
		}
	}
	// -------	project link --------

	let sections = gsap.utils.toArray("section, footer");
	let scrollContainer = document.querySelector(".scroll-container");
	
	let getTotalWidth = () => {
		let width = 0;
		sections.forEach(el => width += el.offsetWidth);
		return width;
	} // scrollContainer total width

	function horizontal (){
		let scrollTween = gsap.to(sections, {
			x: () => - getTotalWidth() + window.innerWidth,
			ease: "none"
		});

		let horizontalScroll = ScrollTrigger.create({
			animation: scrollTween,
			trigger: scrollContainer,
			pin: true,
			scrub: true,
			end: () => "+=" + scrollContainer.offsetWidth,
		});

		let dragRatio = scrollContainer.offsetWidth / (window.innerWidth * (sections.length - 1));
		let drag = Draggable.create(".proxy", {
			trigger: scrollContainer,
			type: "x",
			onPress() {
				this.startScroll = horizontalScroll.scroll();
			},
			onDrag() {
				horizontalScroll.scroll(this.startScroll - (this.x - this.startX) * dragRatio);
			}
		})[0];

		const anchor = $(".float-txt a");
		const infoTitle =  $(".float-txt .title p");
		const infosummary =  $(".float-txt .summary em");
		const imageContainer = gsap.utils.toArray(".project-sec .images, footer");
		const imgS = gsap.utils.toArray(".pro-S");

		anchor.attr({href: "project1/index.html"});
		$('.float-count .current').text(1);
		$('.float-count .total').text(imgS.length);

		gsap.to('.float-count', {
			x: ($('#project').width()),
			ease: "none",
			scrollTrigger: {
				trigger: '#project',
				containerAnimation: scrollTween,
				start: "left 0%",
				scrub: true,
			},
		}); // project count sticky

		gsap.to('.float-txt', {
			x: $("#project").innerWidth(),
			ease: "none",
			scrollTrigger: {
				trigger: '#project',
				containerAnimation: scrollTween,
				start: "left 0%",
				scrub: true,
			}
		}); // project text sticky

		imgS.forEach((img, index) => {
			gsap.to(img, {
				x: -($(window).innerWidth()),
				ease: "none",
				scrollTrigger: {
					trigger: imageContainer[index + 1],
					containerAnimation: scrollTween,
					start: "left 100%",
					end: "left 0%",
					scrub: true,
				},
				onComplete: () => {
					if(index < 2){
						infoTitle.text($(`.pro-${index+1} .title p`).html());

						if(index === 1 && isMobile){
							anchor.attr({href: `project3/mobile/index.html`});
						}
						else if(index === 1 && !isMobile){
							anchor.attr({href: `project3/pc/index.html`});
						}
						else{
							anchor.attr({href: `project${index+2}/index.html`});
						}

						for(i=0; i<infosummary.length; i++){
							infosummary.eq(i).text($(`.pro-${index+1} .summary span`).eq(i).html());
							$('.float-count .current').text(index+2);
						}
						gsap.fromTo(anchor, {x: 100, opacity: 0}, {x: 0, opacity: 1, ease: 'Power2.inOut', delay: 0.1});
					}
				},
				onReverseComplete: () => {
					if(index > 0){
						infoTitle.text($(`.pro-${index-1} .title p`).html());
						anchor.attr({href: `project${index}/index.html`});
						for(i=0; i<infosummary.length; i++){
							infosummary.eq(i).text($(`.pro-${index-1} .summary span`).eq(i).html());
							$('.float-count .current').text(index);
						}
						gsap.fromTo(anchor, {x: 100, opacity: 0}, {x: 0, opacity: 1, ease: 'Power2.inOut', delay: 0.1});
					}	
				},
			})
		}); // project detail event

		function introduceImg(num, x, y){
			gsap.set($(`.about-${num}`),{
				y: window.innerHeight * y - $(`.about-${num}`).height() * y})
			gsap.to(
				$(`.about-${num}`),0.75,{
					x: -(window.innerWidth * x - $(`.about-${num}`).width() * x),
					ease: 'Power3.inOut',
					scrollTrigger: {
						trigger: `.about-${num}`,
						containerAnimation: scrollTween,
					}
				},
			);
		} // introduce image set

		introduceImg(0, 0.6, 0.1);
		introduceImg(1, 0.75, 0);
		introduceImg(2, 0.65, 0.9);
		introduceImg(3, 0.3, 0.5);
		introduceImg(4, 0, 0.1);
		introduceImg(5, 0, 1);
		introduceImg(6, 0.05, 0.9);
	}
	// -------	horizontal scroll --------

	const listClick = $("#gnb a, .scroll-arr a");
	let position = 0;
	listClick.click(function(e){
		e.preventDefault();
		position = $(this).attr("href");
		if($(window).width() < 768){
			position = $(position).offset().top;
			$("html").delay(300).animate({scrollTop : position}, 500);
		}
		else{
			ratio = $(position).offset().left - $("#keyvisual").offset().left;
			position = Math.round(($("body")[0].scrollHeight - window.innerHeight) * (ratio / (getTotalWidth() - window.innerWidth)));
			gsap.to(
				window, 0.5,
				{
					scrollTo: position,
					delay: 0.3,
				}
			);
		};
		if($("#header").hasClass("on")){
			$(".tab").trigger("click");
		}
	});
	// -------	gnb page move --------

	$(document).ready(function(){
		$(".container").css("display", "block");
		$("body").removeClass("before-load");
		list.eq(0).addClass("active");
		projectLink();

		if($(window).width() >= 768){	
			gsap.registerPlugin(ScrollTrigger);
			horizontal();
		}
		$(window).resize(() => {
			if($(window).width() >= 768){
				window.location.reload();
			}
		});
		$(window).on("orientationchange", () => {
			window.location.reload();
		})
		$(".loading").on("transitionend webkitTransitionEnd oTransitionEnd otransitionend", (e) => {
			document.body.removeChild(e.currentTarget);
		})
	});
})
