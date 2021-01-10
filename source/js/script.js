let headerToggle = document.querySelector('.header__toggle')
let headerMenu = document.querySelector('.header__menu')
let swiperBg = document.querySelector('.swiper-background')
headerToggle.addEventListener('click', (e) => {
	headerToggle.classList.toggle('open')
	headerMenu.classList.toggle('header__menu--opened')
})

// Slider
let mySwiper = new Swiper('.swiper-container', {
	speed: 600,
	slidesPerView: 1.8,
	centeredSlides: true,
	spaceBetween: 30,
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
})

let slides = document.querySelectorAll('.slide')
let slide1 = document.querySelector('.slide-1')
let slide2 = document.querySelector('.slide-2')
let slide3 = document.querySelector('.slide-3')
mySwiper.on('slideChange', function (e) {
	if (e.activeIndex == 0) {
		slides.forEach((slide) => {
			slide.classList.remove('show')
		})
		slide1.classList.add('show')
	} else if (e.activeIndex == 1) {
		slides.forEach((slide) => {
			slide.classList.remove('show')
		})
		slide2.classList.add('show')
	} else if (e.activeIndex == 2) {
		slides.forEach((slide) => {
			slide.classList.remove('show')
		})
		slide3.classList.add('show')
	}
})

// SVG Animation
new Vivus('anime', { duration: 200 })

// Tooltip
let slider = document.querySelector('.slider')
let tooltip = document.querySelector('.tooltip-cursor')
slider.addEventListener('mousemove', fn, true)

function fn(e) {
	e.stopPropagation()
	let rect = this.getBoundingClientRect()
	tooltip.style.left = e.clientX - rect.left + 'px'
	tooltip.style.top = e.clientY - rect.top + 'px'
}

// Parallax
document.body.addEventListener('mousemove', (e) => {
	parallaxed(e)
})

function parallaxed(e) {
	let amountMovedX = (e.clientX * -0.3) / 8
	let amountMovedY = (e.clientY * -0.3) / 8
	let x = document.querySelector('.parallaxed')
	x.style.transform = 'translate(' + amountMovedX + 'px,' + amountMovedY + 'px)'
}
