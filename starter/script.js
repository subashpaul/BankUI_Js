'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const scrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');
const imgTargets = document.querySelectorAll('img[data-src]')
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left')
const btnRight = document.querySelector('.slider__btn--right')
const dotContainer = document.querySelector('.dots')

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));


btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

scrollTo.addEventListener('click', () => {
  section1.scrollIntoView({ behavior: 'smooth' })
});

// /////////////////////////////////////////////////////////////////
// document.querySelectorAll('.nav__link').forEach((link) => {
//   link.addEventListener('click', (e) => {
//     e.preventDefault();
//     const id = link.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   })
// })

// the same above function using event delegation
document.querySelector('.nav__links').addEventListener('click', (e) => {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
})

// Tabbed Component
tabsContainer.addEventListener('click', (e) => {
  const clicked = e.target.closest('.operations__tab');

  //  Guard Clause
  if (!clicked) return;

  // Remove actice classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Activate tab
  clicked.classList.add('operations__tab--active');

  // Activate content area
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');
})

// Menu fade animation
const handleHover = (e, opacity) => {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('nav').querySelector('img');

    siblings.forEach(el => {
      if (el != link)
        el.style.opacity = opacity;
    })
    logo.style.opacity = opacity;

  }
}
nav.addEventListener('mouseover', (e) => {
  handleHover(e, 0.5);
})
nav.addEventListener('mouseout', (e) => {
  handleHover(e, 1);
})

// Sticky navigation
// const initialCoords = section1.getBoundingClientRect();
// // console.log(initialCoords);

// window.addEventListener('scroll', function () {
//   // console.log(window.scrollY);

//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

// Sticky navigation using Intersection Observer API
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height
const stickyNav = (entries) => {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
}

const headObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
  // rootMargin: `-90px`,
})
headObserver.observe(header);

// Reveal section
const allSections = document.querySelectorAll('.section')
const revealSelection = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return
  entry.target.classList.remove('section--hidden')
}
const sectionObserver = new IntersectionObserver(revealSelection, {
  root: null,
  threshold: 0.15
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
})

// Lazy loading images

const loading = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () => {

    entry.target.classList.remove('lazy-img')
  })
  observer.unobserve(entry.target)
}
const imgObserver = new IntersectionObserver(loading, {
  root: null,
  threshold: 0,
  rootMargin: '200px'
})
imgTargets.forEach(img => {
  imgObserver.observe(img);
})

// Slider
const Slider = () => {
  let currSlide = 0
  const maxSlides = slides.length;

  // Functions
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * i}%)`
  })

  const goToSlide = (slide) => {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`
    })
  }

  const createDots = () => {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML('beforeend', `<button class="dots__dot" data-slide="${i}"></button>`)
    })
  }

  dotContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDots(slide);
    }
  })

  const activateDots = (slide) => {
    document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'))
    document.querySelector(`.dots__dot[data-slide='${slide}']`).classList.add(`dots__dot--active`)
  }

  // Next slide
  const nextSlide = () => {
    currSlide = (currSlide + 1) % maxSlides;
    goToSlide(currSlide)
    activateDots(currSlide)
  }

  // Previous Slide
  const prevSlide = () => {
    if (currSlide === 0) {
      currSlide = maxSlides - 1
    }
    else {
      currSlide--
    }
    goToSlide(currSlide);
    activateDots(currSlide)
  }

  // Slider initilalization function
  const init = () => {
    goToSlide(0);
    createDots();
    activateDots(0)
  }
  init();

  // Event Listeners
  btnRight.addEventListener('click', nextSlide)
  btnLeft.addEventListener('click', prevSlide);
  document.addEventListener('keydown', (e) => {
    e.key === 'ArrowRight' && nextSlide();
    e.key === 'ArrowLeft' && prevSlide();
  })
}

Slider();



