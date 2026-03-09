// =============Loader Start===========//
// window.addEventListener("load", function(){

//     const loader = document.querySelector(".loader-bg");

//     setTimeout(function(){

//         loader.style.opacity="0";
//         loader.style.transition="0.5s";

//         setTimeout(function(){
//             loader.style.display="none";
//         },500);

//     },800);

// });

window.addEventListener("load", function(){

    const loader = document.querySelector(".loader-bg");

    setTimeout(()=>{

        loader.style.opacity="0";

        setTimeout(()=>{
            loader.style.display="none";
        },700);

    },900);

});

// ===============Loader End==============//

// Nav Up Down

// 
// ==========================
// NAV UP / DOWN (Reusable)
// ==========================

(function () {

  const navbar = document.getElementById("navigation_bar");
  if (!navbar) return;

  let lastScrollTop = 0;
  const delta = 5;

  window.addEventListener("scroll", () => {

    const st = window.pageYOffset || document.documentElement.scrollTop;

    if (st <= 0) {
      navbar.classList.remove("nav-up", "nav-down");
      lastScrollTop = 0;
      return;
    }

    if (Math.abs(lastScrollTop - st) <= delta) return;

    if (st > lastScrollTop) {
      navbar.classList.remove("nav-down");
      navbar.classList.add("nav-up");
    } else {
      navbar.classList.remove("nav-up");
      navbar.classList.add("nav-down");
    }

    lastScrollTop = st;

  });

})();


// ///////////////////////

document.addEventListener("DOMContentLoaded", function () {

  if (typeof gsap === "undefined") return;
  if (typeof Swiper === "undefined") return;

  const navItems = document.querySelectorAll(".home-banner-nav .nav-item");

  /* ===============================
     GSAP ANIMATION FUNCTION
  =============================== */
  function animateSlide(slide) {

    if (!slide) return;

    const layer = slide.querySelector(".slide-zoom-layer");
    const heading = slide.querySelector("h1, h2");
    const text = slide.querySelector("p");
    const button = slide.querySelector(".main-btn");

    const tl = gsap.timeline();

    const r = layer.getBoundingClientRect();
    const cx = r.width / 2;
    const cy = r.height / 2;
    const maxR = Math.hypot(r.width, r.height);

    gsap.set(layer, {
      clipPath: `circle(12px at ${cx}px ${cy}px)`,
      scale: 1.08
    });

    gsap.set([heading, text, button].filter(Boolean), {
      opacity: 0,
      y: 30
    });

    tl.to(layer, {
      clipPath: `circle(${maxR}px at ${cx}px ${cy}px)`,
      scale: 1,
      duration: 2,
      ease: "power1.inOut"
    });

    tl.to(heading, {
      opacity: 1,
      y: 0,
      duration: 0.4
    }, "-=1.6");

    tl.to(text, {
      opacity: 1,
      y: 0,
      duration: 0.35
    }, "-=1.4");

    tl.to(button, {
      opacity: 1,
      y: 0,
      duration: 0.3
    }, "-=1.2");

  }

  /* ===============================
     NAV ACTIVE
  =============================== */
  function updateNav(index) {
    navItems.forEach(n => n.classList.remove("active"));
    navItems[index]?.classList.add("active");
  }

  /* ===============================
     SWIPER INIT
  =============================== */
  const bannerSwiper = new Swiper(".home-banner-slider", {

    loop: true,
    speed: 1000,
    effect: "fade",
    allowTouchMove: true,

    navigation: {
      nextEl: ".banner-next",
      prevEl: ".banner-prev",
    },

    pagination: {
      el: ".home-banner-dots",
      clickable: true,
    },

    on: {

      init: function () {
        updateNav(this.realIndex);
        animateSlide(this.slides[this.activeIndex]);
      },

      slideChangeTransitionStart: function () {
        updateNav(this.realIndex);
        animateSlide(this.slides[this.activeIndex]);
      }

    }

  });

  /* ===============================
     NAV CLICK CONTROL
  =============================== */
  navItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      bannerSwiper.slideToLoop(index);
    });
  });

});

const currentEl = document.querySelector(".slide-count .current");
const totalEl = document.querySelector(".slide-count .total");

const bannerSwiper = new Swiper(".home-banner-slider", {

  loop: false, // important for disabled state
  speed: 1000,
  effect: "fade",

  navigation: {
    nextEl: ".banner-next",
    prevEl: ".banner-prev",
  },

  on: {

    init: function () {
      totalEl.textContent = this.slides.length - this.loopedSlides * 2 || this.slides.length;
      currentEl.textContent = this.realIndex + 1;
    },

    slideChange: function () {
      currentEl.textContent = this.realIndex + 1;
    }

  }

});



// Countet section start

function initBusinessCounter() {

  const section = document.getElementById("counter-info");
  if (!section) return;

  const DIGIT_HEIGHT = 60;
  let played = false;

  function buildRollingCounter(el, value) {

    if (el.classList.contains("played")) return;
    el.classList.add("played");

    const text = value.toString().trim();
    el.innerHTML = "";

    [...text].forEach((char, index) => {

      // symbol handle (+ , .)
      if (char === "+" || char === "," || char === ".") {
        const sym = document.createElement("span");
        sym.className = "counter-symbol";
        sym.innerText = char;
        el.appendChild(sym);
        return;
      }

      if (!/\d/.test(char)) return;

      const digitCon = document.createElement("span");
      digitCon.className = "digit-con";

      const strip = document.createElement("span");
      strip.className = "digit-strip";

      // 0-9 twice for smooth rolling
      for (let i = 0; i <= 19; i++) {
        const d = document.createElement("span");
        d.innerText = i % 10;
        strip.appendChild(d);
      }

      digitCon.appendChild(strip);
      el.appendChild(digitCon);

      const digit = parseInt(char, 10);
      const target = -DIGIT_HEIGHT * (digit + 10);

      setTimeout(() => {
        strip.style.transition = "top 3.5s cubic-bezier(.22,.61,.36,1)";
        strip.style.top = target + "px";
      }, index * 200);

    });

  }

  const observer = new IntersectionObserver(

    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting && !played) {

          played = true;

          section.querySelectorAll(".counter").forEach((counter) => {

            const value = counter.getAttribute("data-target") || counter.innerText.trim();

            counter.classList.add("impact-counter");

            buildRollingCounter(counter, value);

          });

          observer.disconnect();

        }

      });

    },

    { threshold: 0.5 }

  );

  observer.observe(section);

}


// run when page load
document.addEventListener("DOMContentLoaded", function () {
  initBusinessCounter();
});


// Popular destination section start
function initPopularDestinationsSlider() {

  const slider = document.querySelector(".popular-destinations-slider");
  if (!slider) return;

  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");

  const swiper = new Swiper(slider, {
    slidesPerView: 1,
    spaceBetween: 40,
    loop: true,
    speed: 600,
    allowTouchMove: true,

    autoplay: {
      delay: 2800,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },

    breakpoints: {
      992: {
        slidesPerView: 4
      }
    },

    navigation: {
      nextEl: ".next",
      prevEl: ".prev"
    },

    on: {
      init: function () {
        nextBtn.classList.add("active");
        prevBtn.classList.remove("active");
      },

      slideNextTransitionStart: function () {
        nextBtn.classList.add("active");
        prevBtn.classList.remove("active");
      },

      slidePrevTransitionStart: function () {
        prevBtn.classList.add("active");
        nextBtn.classList.remove("active");
      }
    }

  });

}

document.addEventListener("DOMContentLoaded", initPopularDestinationsSlider);


// Testimonial slider

const profileSwiper = new Swiper(".testimonial-profiles",{

slidesPerView:7,
centeredSlides:true,
spaceBetween:60,
loop:true,
speed:800,
slideToClickedSlide:true,

autoplay:{
delay:3000,
disableOnInteraction:false
},

breakpoints:{

0:{ slidesPerView:3, spaceBetween:15 },
576:{ slidesPerView:3, spaceBetween:20 },
768:{ slidesPerView:4, spaceBetween:25 },
1024:{ slidesPerView:7, spaceBetween:30 }

}

});


const textSwiper = new Swiper(".testimonial-text",{

slidesPerView:1,
loop:true,
effect:"fade",
fadeEffect:{crossFade:true},
speed:800,
allowTouchMove:false

});


/* IMPORTANT */
profileSwiper.on("slideChange", function () {
textSwiper.slideToLoop(profileSwiper.realIndex);
});



// Booking Section Data 
/* ==============================
   TRAVELER COUNTER
================================ */

/* ==============================
   TRAVELER COUNTER
================================ */

let travelerCount = 1;

const travelerInput = document.getElementById("travelerCount");
const travelerContainer = document.getElementById("travelerCards");
const travelerWrapper = document.getElementById("travelerDetailsWrapper");

document.getElementById("addTraveler").onclick = function () {

travelerCount++;

travelerInput.value = travelerCount;

generateTravelers(travelerCount);

};

document.getElementById("minusTraveler").onclick = function () {

if (travelerCount > 1) {

travelerCount--;

travelerInput.value = travelerCount;

generateTravelers(travelerCount);

}

};



/* ==============================
   GENERATE TRAVELER FIELDS
================================ */

function generateTravelers(total){

let existing = document.querySelectorAll(".traveler-card").length;

travelerWrapper.style.display = "block";

/* ADD NEW TRAVELERS */

if(total > existing){

for(let i = existing + 1; i <= total; i++){

let card = document.createElement("div");

card.className = "traveler-card";

card.innerHTML = `

<div class="traveler-head">

<strong>Traveler ${i}</strong>

<button type="button"
class="removeTraveler"
onclick="removeTraveler(this)">✕</button>

</div>

<div class="traveler-grid">

<input type="text"
class="travelerName"
placeholder="Name">

<input type="number"
class="travelerAge"
placeholder="Age">

<select class="travelerType">

<option value="">Type</option>
<option value="men">Man</option>
<option value="women">Woman</option>
<option value="child">Child</option>
<option value="other">Other</option>

</select>

</div>

`;

travelerContainer.appendChild(card);

}

}


/* REMOVE EXTRA */

if(total < existing){

for(let i = existing; i > total; i--){

travelerContainer.lastElementChild.remove();

}

}

}



/* ==============================
   REMOVE TRAVELER
================================ */

function removeTraveler(btn){

if(travelerCount === 1) return;

btn.closest(".traveler-card").remove();

travelerCount--;

travelerInput.value = travelerCount;

}



/* ==============================
   VALIDATE BOOKING FORM
================================ */

function validateBooking(){

let valid = true;

const fields = [
{ id:"departure", error:"Departure city required"},
{ id:"destination", error:"Destination required"},
{ id:"travelDate", error:"Travel date required"},
{ id:"returnDate", error:"Return date required"},
{ id:"package", error:"Please select package"}
];

fields.forEach(f => {

let el = document.getElementById(f.id);

let error = el.parentElement.querySelector(".field-error");

if(!error){

error = document.createElement("div");

error.className="field-error";

el.parentElement.appendChild(error);

}

error.innerText="";

el.style.border="1px solid #ddd";

if(el.value === ""){

error.innerText=f.error;

el.style.border="2px solid red";

valid=false;

}

});

return valid;

}



/* ==============================
   VALIDATE TRAVELER DETAILS
================================ */

function validateTravelers(){

let names = document.querySelectorAll(".travelerName");
let ages = document.querySelectorAll(".travelerAge");
let types = document.querySelectorAll(".travelerType");

for(let i=0;i<names.length;i++){

if(names[i].value.trim() === ""){
alert("Please enter traveler name");
names[i].focus();
return false;
}

if(ages[i].value.trim() === ""){
alert("Please enter traveler age");
ages[i].focus();
return false;
}

if(types[i].value === ""){
alert("Please select traveler type");
types[i].focus();
return false;
}

}

return true;

}



/* ==============================
   SEARCH TRIP
================================ */

document.getElementById("searchTrip").onclick = function(e){

e.preventDefault();

if(!validateBooking()) return;

generateTravelers(travelerCount);

if(!validateTravelers()) return;

openPopup();

};



/* ==============================
   PACKAGE SELECT -> CLOSE TRAVELER
================================ */

document.getElementById("package").addEventListener("change",function(){

travelerWrapper.style.display="none";

});



/* ==============================
   OPEN POPUP
================================ */

function openPopup(){

const departure = document.getElementById("departure").value;
const destination = document.getElementById("destination").value;
const travel = document.getElementById("travelDate").value;
const ret = document.getElementById("returnDate").value;

const start = new Date(travel);
const end = new Date(ret);

const days = (end-start)/(1000*60*60*24);

if(days <= 0){

alert("Return date must be after travel date");

return;

}

const packagePrice = parseInt(document.getElementById("package").value);

const totalAmount = days * travelerCount * packagePrice;


/* COUNT MEN WOMEN CHILDREN */
let types = document.querySelectorAll(".travelerType");

let men = 0;
let women = 0;
let children = 0;

types.forEach(type => {

if(type.value === "men"){
men++;
}

if(type.value === "women"){
women++;
}

if(type.value === "child"){
children++;
}

});


document.getElementById("p_departure").innerText = departure;
document.getElementById("p_destination").innerText = destination;
document.getElementById("p_travel").innerText = travel;
document.getElementById("p_return").innerText = ret;

document.getElementById("p_men").innerText = men;
document.getElementById("p_women").innerText = women;
document.getElementById("p_children").innerText = children;

document.getElementById("p_travelers").innerText = travelerCount;
document.getElementById("p_days").innerText = days;
document.getElementById("p_amount").innerText = totalAmount;

showTravelerPopup();

document.getElementById("bookingPopup").style.display="flex";

}



/* ==============================
   SHOW TRAVELER DETAILS
================================ */


function showTravelerPopup(){

let names = document.querySelectorAll(".travelerName");
let ages = document.querySelectorAll(".travelerAge");
let types = document.querySelectorAll(".travelerType");

let list="";

for(let i=0;i<names.length;i++){

list += `
<div class="popup-traveler">

<span>${names[i].value}</span>

<span>Age ${ages[i].value}</span>

<span>${types[i].value}</span>

</div>
`;

}

document.getElementById("popupTravelerList").innerHTML = list;

}



/* ==============================
   CLOSE POPUP
================================ */

function closePopup(){

document.getElementById("bookingPopup").style.display="none";

}



/* ==============================
   CONFIRM BOOKING
================================ */

function confirmTrip(){

document.getElementById("bookingPopup").style.display="none";

alert("🎉 Thank you! Your trip request submitted.");

downloadReceipt();

}



/* ==============================
   DOWNLOAD RECEIPT
================================ */

function downloadReceipt(){

const { jsPDF } = window.jspdf;
const doc = new jsPDF();

/* GET DATA */

let departure = document.getElementById("departure").value;
let destination = document.getElementById("destination").value;
let travel = document.getElementById("travelDate").value;
let ret = document.getElementById("returnDate").value;

let packageName =
document.getElementById("package").selectedOptions[0].text;

let amount = parseInt(document.getElementById("p_amount").innerText);

let men = document.getElementById("p_men").innerText;
let women = document.getElementById("p_women").innerText;
let children = document.getElementById("p_children").innerText;


/* OUTER BORDER */

doc.rect(10,10,190,277);


/* HEADER */

doc.setFontSize(18);
doc.text("Travel Booking Receipt",105,20,{align:"center"});


/* BOOKING DETAILS BOX */

doc.setFontSize(12);

doc.rect(15,30,180,35);

doc.text("Departure : " + departure,20,40);
doc.text("Destination : " + destination,20,50);

doc.text("Travel Date : " + travel,110,40);
doc.text("Return Date : " + ret,110,50);


/* TRAVELER SUMMARY */

doc.rect(15,70,180,35);

doc.text("Men : " + men,20,80);
doc.text("Women : " + women,20,90);
doc.text("Children : " + children,20,100);

doc.text("Total Travelers : " + travelerCount,110,80);
doc.text("Package : " + packageName,110,90);


/* TOTAL AMOUNT BOX */

doc.setFontSize(14);

doc.rect(15,110,180,15);

doc.text("Total Amount : Rs " + amount,105,120,{align:"center"});


/* TRAVELER DETAILS */

doc.setFontSize(12);

doc.text("Traveler Details",20,140);


/* TABLE HEADER */

doc.rect(15,145,180,10);

doc.text("Name",25,152);
doc.text("Age",160,152);


/* TABLE ROWS */

let names = document.querySelectorAll(".travelerName");
let ages = document.querySelectorAll(".travelerAge");

let y = 160;

for(let i=0;i<names.length;i++){

doc.rect(15,y-5,180,10);

doc.text(names[i].value,25,y);
doc.text(ages[i].value.toString(),160,y);

y+=10;

}


/* FOOTER */

doc.setFontSize(10);

doc.text(
"Thank you for booking with Sky Route Travel Agency",
105,
280,
{align:"center"}
);


/* SAVE FILE */

doc.save("travel-booking-receipt.pdf");


/* RESET FORM */

resetBookingForm();

}



/* ==============================
   RESET FORM
================================ */

function resetBookingForm(){

document.getElementById("departure").value="";
document.getElementById("destination").value="";
document.getElementById("travelDate").value="";
document.getElementById("returnDate").value="";
document.getElementById("package").value="";

travelerCount = 1;

travelerInput.value = 1;

travelerContainer.innerHTML="";

travelerWrapper.style.display="none";

}