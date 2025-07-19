const swiper = new Swiper('.slider-wrapper', {
  loop: false,
  grabCursor: true,
  spaceBetween: 32,
  slidesPerView: 3,
  // Pagination bullets
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    dynamicBullets: true
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // Responsive breakpoints
  breakpoints: {
    0: {
      slidesPerView: 1
    },
    800: {
      slidesPerView: 2
    },
    1340: {
      slidesPerView: 3
    }
  }
});