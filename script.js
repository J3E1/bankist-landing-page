"use strict";
const btnScrollTo = document.querySelector(".btn--scroll-to");
const section1 = document.querySelector("#section--1");

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

const tabs = document.querySelectorAll(".operations__tab");
const tabsContainer = document.querySelector(".operations__tab-container");
const tabsContent = document.querySelectorAll(".operations__content");

const nav = document.querySelector(".nav");
const header = document.querySelector(".header");

const allSections = document.querySelectorAll(".section");
const slides = document.querySelectorAll(".slide");
const btnLeft = document.querySelector(".slider__btn--left");
const btnRight = document.querySelector(".slider__btn--right");

const imgTargets = document.querySelectorAll("img[data-src]");
const dotContainer = document.querySelector(".dots");
///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

btnsOpenModal.forEach((btn) => btn.addEventListener("click", openModal));
/*
for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener("click", openModal);
*/
btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

//Smooth Scrolling
btnScrollTo.addEventListener("click", () =>
  section1.scrollIntoView({ behavior: "smooth" })
);

// Page Navigation
// document.querySelectorAll(".nav__link").forEach((link) =>
//   link.addEventListener("click", (e) => {
//     e.preventDefault();
//     const id = e.target.getAttribute("href");
//     document.querySelector(id).scrollIntoView({ behavior: "smooth" });
//   })
// );
document.querySelector(".nav__links").addEventListener("click", (e) => {
  e.preventDefault();
  //Matching Strategy
  if (e.target.classList.contains("nav__link")) {
    const id = e.target.getAttribute("href");
    document.querySelector(id).scrollIntoView({ behavior: "smooth" });
  }
});

//Tabbed Component
tabsContainer.addEventListener("click", (e) => {
  //Closest Finds closest ancestor of of the element contains the class otherwise null
  const clickedTab = e.target.closest(".operations__tab");

  //Guard Clause
  if (!clickedTab) return;

  //Remove Active Classes
  tabs.forEach((tab) => tab.classList.remove("operations__tab--active"));
  tabsContent.forEach((tabContent) =>
    tabContent.classList.remove("operations__content--active")
  );

  //Active Tab
  clickedTab.classList.add("operations__tab--active");

  //Activate Content area
  document
    .querySelector(`.operations__content--${clickedTab.dataset.tab}`)
    .classList.add("operations__content--active");
});

//Menu fade animation
const handleHover = function (event) {
  if (event.target.classList.contains("nav__link")) {
    const link = event.target;
    const siblings = link.closest(".nav").querySelectorAll(".nav__link");
    const logo = link.closest(".nav").querySelector("img");

    siblings.forEach((sibling) => {
      if (sibling !== link) {
        sibling.style.opacity = this;
      }
      logo.style.opacity = this;
    });
  }
};

//Passing
nav.addEventListener("mouseover", handleHover.bind(0.5));
nav.addEventListener("mouseout", handleHover.bind(1));

//Sticky Nav
// const s1Cords = section1.getBoundingClientRect();

// window.addEventListener("scroll", () => {
//   if (window.scrollY > s1Cords.top) {
//     nav.classList.add("sticky");
//   } else {
//     nav.classList.remove("sticky");
//   }
// });
// console.log();
const navHeight = nav.getBoundingClientRect().height;

const headerCallback = (entries) => {
  const [entry] = entries;
  // console.log(entry);
  !entry.isIntersecting
    ? nav.classList.add("sticky")
    : nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(headerCallback, {
  root: null,
  rootMargin: `-${navHeight}px`,
  threshold: 0,
});
headerObserver.observe(header);
//Reveal Sections
const revealSection = (entries, observer) => {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSections.forEach((section) => {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

//Lazy Loading Images

const imgCallback = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener("load", () =>
    entry.target.classList.remove("lazy-img")
  );

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(imgCallback, {
  root: null,
  threshold: 0,
  rootMargin: "200px",
});
imgTargets.forEach((img) => {
  imgObserver.observe(img);
});

//Slider/////////////////////////////////////////////////////////////////////////

let currentSlide = 0;
const maxSlide = slides.length;

slides.forEach((slide, index) => (slide.style.translate = `${index * 100}% 0`));

//Creating the dots
const createDots = () => {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      "beforeend",
      `<button class="dots__dot" data-slide=${i}></button>`
    );
  });
};

//Activating the dots
const activateDots = (slide) => {
  document
    .querySelectorAll(".dots__dot")
    .forEach((dot) => dot.classList.remove("dots__dot--active"));
  document
    .querySelector(`.dots__dot[data-slide="${slide}"]`)
    .classList.add("dots__dot--active");
};

//Translating the overFlowed Images to right side
const goToSlide = (slide) => {
  slides.forEach((s, i) => (s.style.translate = `${(i - slide) * 100}% 0`));
  activateDots(slide);
};

const nextSlide = () => {
  if (currentSlide == maxSlide - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  goToSlide(currentSlide);
};

const prevSlide = () => {
  if (currentSlide == 0) {
    currentSlide = maxSlide - 1;
  } else {
    currentSlide--;
  }
  goToSlide(currentSlide);
};
//Initializing
const init = function () {
  createDots();

  goToSlide(0);
  activateDots(0);
};
init();
//EVent HAndlers
btnRight.addEventListener("click", nextSlide);
btnLeft.addEventListener("click", prevSlide);

document.addEventListener("keydown", (e) => {
  e.key === "ArrowRight" && nextSlide();
  e.key === "ArrowLeft" && prevSlide();
});

dotContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("dots__dot")) {
    const { slide } = e.target.dataset;
    goToSlide(slide);
  }
});

///////////////////////////////////////////////////////////////
// const header = document.querySelector(".header");
// const allSections = document.querySelectorAll(".section");
// const allButtons = document.getElementsByTagName("button");
/*
const message = document.createElement("div");
message.classList.add("cookie-message");
// message.textContent='We use cookies for improved functionality and analytics.'
message.innerHTML =
  'We use cookies for improved functionality and analytics.<button class="btn btn--close-cookie">Got it!</button>';
// header.prepend(message);
// header.append(message.cloneNode(true));
// header.before(message);
header.after(message);
document.querySelector(".btn--close-cookie").addEventListener("click", () =>
  //  message.remove()
  message.parentElement.removeChild(message)
);

//Styles
message.style.backgroundColor = "#37383d";
// console.log(getComputedStyle(message));
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + "px";
// document.documentElement.style.setProperty("--color-primary", "orangered");
//Attributes
const logo = document.querySelector(".nav__logo");
// console.log(logo.src);
logo.setAttribute("Designer", "Dunno");
// console.log(logo.getAttribute("src"));
//Class
logo.classList.contains("c");
//Data Attribute
// console.log(Number.parseInt(logo.dataset.versionNumber));




const h1 = document.querySelector("h1");
const eventH = () => {
  console.log("Mouse Entered");
  h1.removeEventListener("mouseenter", eventH);
};
h1.addEventListener("mouseenter", eventH);
// h1.onmouseleave = (e) => {
//   console.log("mouseLeave");
// };
*/

// const btnScrollTo = document.querySelector(".btn--scroll-to");
// const section1 = document.querySelector("#section--1");

// btnScrollTo.addEventListener("click", (e) => {
//   // const s1cords = section1.getBoundingClientRect(); //Section 1 Coordinates relative to the viewport

//   //Scrolling
//   // window.scrollTo({
//   //   left: s1cords.left + window.pageXOffset,
//   //   top: s1cords.top + window.pageYOffset,
//   //   behavior: "smooth",
//   // });
//   //Mordent Way
//   section1.scrollIntoView({ behavior: "smooth" });
// });

//rgb(255,255,255)
// const randomInt = (min, max) =>
//   Math.floor(Math.random() * (max - min + 1) + min);
// const randomColor = () =>
//   `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

// const changeClo = () => {
//   document.querySelector(".nav__link").style.backgroundColor = randomColor();
//   document.querySelector(".nav__links").style.backgroundColor = randomColor();
//   document.querySelector(".nav").style.backgroundColor = randomColor();
// };

// setInterval(changeClo, 100);
// const h1 = document.querySelector("h1");
// const observerCallback = (entries, observer) => {
//   entries.forEach((entry) => {
//     console.log(entry);
//   });
// };
// const observerOptions = {
//   root: null,
//   threshold: [0, 0.5],
// };

// const observer = new IntersectionObserver(observerCallback, observerOptions);
// observer.observe(section1);
/*
document.addEventListener("DOMContentLoaded", (e) =>
  console.log("DOM Loaded", e)
);
window.addEventListener("beforeunload", function (e) {
  e.preventDefault();
  console.table(e);
  e.returnValue = "";
});
*/
