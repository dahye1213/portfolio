(() => {
// swiper Set
const swiper = new Swiper(".mySwiper", {
	slidesPerView: 1.5,
	spaceBetween: 40,
	centeredSlides: true,
	navigation: {
		nextEl: ".swiper-button-next",
		prevEl: ".swiper-button-prev",
	},
	breakpoints: {
		768: {
			slidesPerView: 1.5,
		},
		1024: {
			slidesPerView: 'auto',
			centeredSlides: false,
		}
	},
});

// layout Set
let yOffset = 0;
let currentScene = 0;
const $swiperInner = document.querySelectorAll(".swiper-slide .inner");
let listHeight = 0;
const listArray = [];
const sceneInfo = [
	{
		type : 'sticky',
		heightNum : 15,
		scrollHeight : 0,
		objs : {
			container : document.querySelector('#header'),
			inner : document.querySelector('#header .inner'),
			keytext : document.querySelector('.keytext'),
			canvas : document.querySelector('#video-canvas'),
			context : document.querySelector('#video-canvas').getContext('2d'),
			videoImages : [],
		},
		values : {
			keytext_opacity_in : [0, 1, {start: 0.6, end: 0.7}],
			imageCount : 160,
			imageSequence : [0, 159],
		},
	},
	{
		type : 'normal',
		scrollHeight : 0,
		objs : {
			container : document.querySelector('#product'),
			inner : document.querySelector('#product > .inner'),
			campaign : document.querySelector('.campaign'),
		},
		values : {
			campaign_radius : [20, 0, {start : 0, end : 0.2}],
			campaign_margin : [40, 0, {start: 0, end : 0.2}],
		}
	},
	{
		type : 'sticky',
		heightNum : 10,
		scrollHeight : 0,
		objs : {
			container : document.querySelector('#history'),
			inner : document.querySelector('#history .inner'),
			poster : document.querySelector('.poster'),
			poster_contents : document.querySelector('.poster-image'),
			description : document.querySelector('.description'),
			descriptionLi : document.querySelector('.description').children[0].children,
		},
		values : {
			descriptionLiA_pos : [0,  0, {start: 0.15, end: 0.2}],
			descriptionLiB_pos : [0,  0, {start: 0.35, end: 0.4}],
			descriptionLiC_pos : [0,  0, {start: 0.55, end: 0.6}],
			descriptionLiD_pos : [0,  0, {start: 0.75, end: 0.8}],
			descriptionLiE_pos : [0,  0, {start: 0.95, end: 1}],

			descriptionLiA_opacity_in : [0, 1, {start: 0, end: 0.05}],
			descriptionLiA_opacity_out : [1, 0, {start: 0.15, end: 0.2}],
			descriptionLiB_opacity_in : [0, 1, {start: 0.2, end: 0.25}],
			descriptionLiB_opacity_out : [1, 0, {start: 0.35, end: 0.4}],
			descriptionLiC_opacity_in : [0, 1, {start: 0.4, end: 0.45}],
			descriptionLiC_opacity_out : [1, 0, {start: 0.55, end: 0.6}],
			descriptionLiD_opacity_in : [0, 1, {start: 0.6, end: 0.65}],
			descriptionLiD_opacity_out : [1, 0, {start: 0.75, end: 0.8}],
			descriptionLiE_opacity_in : [0, 1, {start: 0.8, end: 0.85}],
			descriptionLiE_opacity_out : [1, 0, {start: 0.95, end: 1}],
		},
	},
];
function canvasImage() {
	let imgElem;
	for(i=0; i<sceneInfo[0].values.imageCount; i++){
		imgElem = new Image();
		imgElem.src = `./video/IMG_${i + 1}.jpg`;
		sceneInfo[0].objs.videoImages.push(imgElem);
	}
}
function swiperImg(){
	for(i=0; i<$swiperInner.length; i++){
		$swiperInner[i].style.background = `url(images/product-name-${i}.png)`;
		$swiperInner[i].style.backgroundSize = 'cover';
	}
}
canvasImage();
swiperImg();
function setLayout() {
	const heightRatio = window.innerHeight / 1080;
	let totalScrollHeight = 0;
	yOffset = window.pageYOffset;
	// scene Heihgt
	for(i=0; i<sceneInfo.length; i++){
		if(sceneInfo[i].type === 'sticky'){
			sceneInfo[i].scrollHeight = window.innerHeight * sceneInfo[i].heightNum;
		}
		else if(sceneInfo[i].type === 'normal'){
			sceneInfo[i].scrollHeight = sceneInfo[i].objs.inner.offsetHeight;
		}
		sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
	}
	// history Height
	if(window.innerWidth < 1024 && window.innerWidth / window.innerHeight > 0.5){
		document.querySelector(".poster").style.height = '50vh';
	}
	for(i=0; i<sceneInfo[2].objs.descriptionLi.length; i++){
		listHeight = listHeight + sceneInfo[2].objs.descriptionLi[i].offsetHeight;
		listArray.push(listHeight);
	}
	// current Scene
	for(i=0; i<sceneInfo.length; i++){
		totalScrollHeight += sceneInfo[i].scrollHeight;
		if(totalScrollHeight >= yOffset){
			currentScene = i;
			break;
		}
	}
	document.body.setAttribute('id', `current-scene-${currentScene}`);
	sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`;
}

// scroll Animation Set
let rafId;
let rafState;
let prevScrollHeight = 0;
let delayedYOffset = 0;
let acc = 0.1;
let sceneChange = false;
function calcValues(infoValues, currentYOffset){
	let result;
	const scrollRatio = currentYOffset / sceneInfo[currentScene].scrollHeight;
	const scrollHeight = sceneInfo[currentScene].scrollHeight;

	if(infoValues.length === 3){
		const partScrollStart = infoValues[2].start * scrollHeight;
		const partScrollEnd = infoValues[2].end * scrollHeight;
		const partScrollHeight = partScrollEnd - partScrollStart;

		if(currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd){
			result = (currentYOffset - partScrollStart) / partScrollHeight * (infoValues[1] - infoValues[0]) + infoValues[0];
		}
		else if(currentYOffset < partScrollStart){
			result = infoValues[0];
		}
		else if(currentYOffset > partScrollEnd){
			result = infoValues[1];
		}
	}
	else{
		result = scrollRatio * (infoValues[1] - infoValues[0]) + infoValues[0];
	}
	return result;
}
function playAnimation(){
	const objs = sceneInfo[currentScene].objs;
	const infoValues = sceneInfo[currentScene].values;
	const currentYOffset = yOffset - prevScrollHeight;
	const scrollHeight = sceneInfo[currentScene].scrollHeight
	const scrollRatio = currentYOffset / scrollHeight;

	switch (currentScene){
		case 0 :
			if(scrollRatio <= 0.7){
				objs.keytext.style.opacity = calcValues(infoValues.keytext_opacity_in, currentYOffset);	
			}
			break;
		case 1 :
			if(scrollRatio <= 0.2){
				objs.campaign.style.borderTopLeftRadius = `${calcValues(infoValues.campaign_radius, currentYOffset)}px`;
				if(window.innerWidth > 1024){
					objs.campaign.style.marginLeft = `${Math.round(calcValues(infoValues.campaign_margin, currentYOffset))}px`;
				}
			}
			break;
		case 2 :
			infoValues.descriptionLiA_pos[1] = listArray[0];
			infoValues.descriptionLiB_pos[0] = listArray[0];
			infoValues.descriptionLiB_pos[1] = listArray[1];
			infoValues.descriptionLiC_pos[0] = listArray[1];
			infoValues.descriptionLiC_pos[1] = listArray[2];
			infoValues.descriptionLiD_pos[0] = listArray[2];
			infoValues.descriptionLiD_pos[1] = listArray[3];
			infoValues.descriptionLiE_pos[0] = listArray[3];
			infoValues.descriptionLiE_pos[1] = listArray[4];

			if(scrollRatio <= 0.05){
				objs.poster.style.background = 'url(images/kitkat-history-0.jpeg) no-repeat center center';
				objs.poster.style.backgroundSize = 'cover';
				objs.inner.style.background = 'url(images/history-background-0.png) no-repeat center center';
				objs.descriptionLi[0].style.opacity = calcValues(infoValues.descriptionLiA_opacity_in, currentYOffset);
			}
			else{
				objs.descriptionLi[0].style.opacity = calcValues(infoValues.descriptionLiA_opacity_out, currentYOffset);
				objs.description.style.marginTop = `-${calcValues(infoValues.descriptionLiA_pos, currentYOffset)}px`;
			}
			if(scrollRatio <= 0.25){
				objs.descriptionLi[1].style.opacity = calcValues(infoValues.descriptionLiB_opacity_in, currentYOffset);
			}
			else{
				objs.poster.style.background = 'url(images/kitkat-history-1.jpeg) no-repeat center center';
				objs.poster.style.backgroundSize = 'cover';
				objs.inner.style.background = 'url(images/history-background-1.png) no-repeat center center';
				objs.descriptionLi[1].style.opacity = calcValues(infoValues.descriptionLiB_opacity_out, currentYOffset);
				objs.description.style.marginTop = `-${calcValues(infoValues.descriptionLiB_pos, currentYOffset)}px`;
			}
			if(scrollRatio <= 0.45){
				objs.descriptionLi[2].style.opacity = calcValues(infoValues.descriptionLiC_opacity_in, currentYOffset);
			}
			else{
				objs.poster.style.background = 'url(images/kitkat-history-2.jpeg) no-repeat center center';
				objs.poster.style.backgroundSize = 'cover';
				objs.inner.style.background = 'url(images/history-background-2.png) no-repeat center center';
				objs.descriptionLi[2].style.opacity = calcValues(infoValues.descriptionLiC_opacity_out, currentYOffset);
				objs.description.style.marginTop = `-${calcValues(infoValues.descriptionLiC_pos, currentYOffset)}px`;
			}
			if(scrollRatio <= 0.65){
				objs.descriptionLi[3].style.opacity = calcValues(infoValues.descriptionLiD_opacity_in, currentYOffset);
			}
			else{
				objs.poster.style.background = 'url(images/kitkat-history-3.jpeg) no-repeat center center';
				objs.poster.style.backgroundSize = 'cover';
				objs.inner.style.background = 'url(images/history-background-3.png) no-repeat center center';
				objs.descriptionLi[3].style.opacity = calcValues(infoValues.descriptionLiD_opacity_out, currentYOffset);
				objs.description.style.marginTop = `-${calcValues(infoValues.descriptionLiD_pos, currentYOffset)}px`;
			}
			if(scrollRatio <= 0.85){
				objs.descriptionLi[4].style.opacity = calcValues(infoValues.descriptionLiE_opacity_in, currentYOffset);
			}
			else{
				objs.poster.style.background = 'url(images/kitkat-history-4.jpeg) no-repeat center center';
				objs.poster.style.backgroundSize = 'cover';
				objs.inner.style.background = 'url(images/history-background-4.png) no-repeat center center';
			}	
			break;
	}
}
function scrollLoop(){
	sceneChange = false;
	prevScrollHeight = 0;
	for(i=0; i<currentScene; i++){
		prevScrollHeight += sceneInfo[i].scrollHeight;
	}
	if(yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight){
		sceneChange = true;
		currentScene++;
		document.body.setAttribute('id', `current-scene-${currentScene}`);
	}
	if(yOffset < prevScrollHeight){
		sceneChange = true;
		if(currentScene === 0) return;
		currentScene--;
		document.body.setAttribute('id', `current-scene-${currentScene}`);
	}
	if(sceneChange) return;
	playAnimation();
}
function loop(){
	delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;
	if(!sceneChange){
		if(currentScene === 0) {
			const currentYOffset = delayedYOffset - prevScrollHeight;
			const objs = sceneInfo[currentScene].objs;
			const infoValues = sceneInfo[currentScene].values;
			let sequence = Math.round(calcValues(infoValues.imageSequence, currentYOffset));
			if(objs.videoImages[sequence]){
				objs.context.drawImage(objs.videoImages[sequence], 0, 0);
			}
		}
	}
	rafId = requestAnimationFrame(loop);
	if(Math.abs(yOffset - delayedYOffset) < 1){
		cancelAnimationFrame(rafId);
		rafState = false;
	}
}

// swiper popup
const wrapper = document.querySelector(".swiper-wrapper");
const swiperCircle = document.querySelectorAll("a.circle");
const popup = document.querySelector(".popup");
const popupLi = document.querySelectorAll(".popup .contents li");
const btn = document.querySelector("button.close");
const dim = document.querySelector(".dim");

wrapper.addEventListener("click", e => {
	e.preventDefault();
	for(i=0; i<swiperCircle.length; i++){
		swiperCircle[i].index = i;
		popupLi[i].classList.remove("active");
	}
	n = e.target.parentElement.index;
	popup.classList.add("on");
	document.body.style.overflow = "hidden";
	popupLi[n].classList.add("active");
})
btn.addEventListener("click", () => {
	popup.classList.remove("on");
	document.body.style.overflow = "auto";
})
dim.addEventListener("click", () => {
	popup.classList.remove("on");
	document.body.style.overflow = "auto";
})


// page Move Button
const nav = document.querySelector("#gnb");
const navLi = document.querySelectorAll("#gnb li");
const moveTop = document.querySelector(".top");
nav.addEventListener("click", e => {
	e.preventDefault();
	for(i=0; i<navLi.length; i++){
		navLi[i].index = i;
	}
	n = e.target.parentElement.index;
	window.scrollTo({top: sceneInfo[n+1].objs.container.offsetTop, left: 0, behavior: 'smooth'});
})
moveTop.addEventListener("click", () => {
	window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
});

// event collection
window.addEventListener("load", () => {
	setLayout();
	sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0], 0, 0);
	sceneInfo[2].objs.poster.style.background = 'url(images/kitkat-history-0.jpeg) no-repeat center center';
	sceneInfo[2].objs.poster.style.backgroundSize = 'cover';
	sceneInfo[2].objs.inner.style.background = 'url(images/history-background-0.png) no-repeat center center';
	window.addEventListener("scroll", () => {
		yOffset = window.pageYOffset;
		scrollLoop();
		if(!rafState) {
			rafId = requestAnimationFrame(loop);
			rafState = true;
		}
		if(yOffset > sceneInfo[0].scrollHeight){
			moveTop.classList.add("active");
		}
		else{
			moveTop.classList.remove("active");
		}
	});
	window.addEventListener("resize", () => {
		// if (window.innerWidth > 900) {
		// 	window.location.reload();
		// }
		setLayout();
	});
	window.addEventListener("orientationchange", setLayout);
})


})();