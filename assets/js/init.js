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

window.addEventListener("load", function () {
  const loader = document.querySelector(".loader-bg");

  setTimeout(() => {
    loader.style.opacity = "0";

    setTimeout(() => {
      loader.style.display = "none";
    }, 700);
  }, 900);
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
      scale: 1.08,
    });

    gsap.set([heading, text, button].filter(Boolean), {
      opacity: 0,
      y: 30,
    });

    tl.to(layer, {
      clipPath: `circle(${maxR}px at ${cx}px ${cy}px)`,
      scale: 1,
      duration: 2,
      ease: "power1.inOut",
    });

    tl.to(
      heading,
      {
        opacity: 1,
        y: 0,
        duration: 0.4,
      },
      "-=1.6",
    );

    tl.to(
      text,
      {
        opacity: 1,
        y: 0,
        duration: 0.35,
      },
      "-=1.4",
    );

    tl.to(
      button,
      {
        opacity: 1,
        y: 0,
        duration: 0.3,
      },
      "-=1.2",
    );
  }

  /* ===============================
     NAV ACTIVE
  =============================== */
  function updateNav(index) {
    navItems.forEach((n) => n.classList.remove("active"));
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
      },
    },
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
      totalEl.textContent =
        this.slides.length - this.loopedSlides * 2 || this.slides.length;
      currentEl.textContent = this.realIndex + 1;
    },

    slideChange: function () {
      currentEl.textContent = this.realIndex + 1;
    },
  },
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
            const value =
              counter.getAttribute("data-target") || counter.innerText.trim();

            counter.classList.add("impact-counter");

            buildRollingCounter(counter, value);
          });

          observer.disconnect();
        }
      });
    },

    { threshold: 0.5 },
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
        slidesPerView: 4,
      },
    },

    navigation: {
      nextEl: ".next",
      prevEl: ".prev",
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
      },
    },
  });
}

document.addEventListener("DOMContentLoaded", initPopularDestinationsSlider);

// Testimonial slider

const textSwiper = new Swiper(".testimonial-text", {
  slidesPerView: 1,
  loop: true,
  effect: "fade",
  fadeEffect: { crossFade: true },
  speed: 800,
  allowTouchMove: false,
});

const profileSwiper = new Swiper(".testimonial-profiles", {
  slidesPerView: 7,
  centeredSlides: true,
  spaceBetween: 60,
  loop: true,
  speed: 800,
  slideToClickedSlide: true,

  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },

  breakpoints: {
    0: { slidesPerView: 3, spaceBetween: 15 },
    576: { slidesPerView: 3, spaceBetween: 20 },
    768: { slidesPerView: 4, spaceBetween: 30 },
    1024: { slidesPerView: 7, spaceBetween: 60 },
  },

  on: {
    slideChange: function () {
      textSwiper.slideToLoop(this.realIndex);
    },
  },
});

// Booking Section Data

/* ==============================
   TRAVELER COUNTER
================================ */

let travelerCount = 0;

const travelerInput = document.getElementById("travelerCount");
const travelerContainer = document.getElementById("travelerCards");
const travelerWrapper = document.getElementById("travelerDetailsWrapper");

document.getElementById("addTraveler").onclick = function () {
  travelerCount++;

  travelerInput.value = travelerCount;

  generateTravelers();
};

document.getElementById("minusTraveler").onclick = function () {
  if (travelerCount > 0) {
    travelerCount--;

    travelerInput.value = travelerCount;

    generateTravelers();
  }
};

// Add traveller section
function triggerAddTraveler() {
  document.getElementById("addTraveler").click();
}

/* ==============================
   GENERATE TRAVELER FIELDS
================================ */

function generateTravelers() {
  let existing = document.querySelectorAll(".traveler-card").length;

  travelerWrapper.style.display = "block";

  /* ADD NEW */

  if (travelerCount > existing) {
    for (let i = existing + 1; i <= travelerCount; i++) {
      let card = document.createElement("div");

      card.className = "traveler-card";

      card.innerHTML = `

<div class="traveler-head">

<div class="traveler-title">
<span class="traveler-icon">👤</span>
<strong>Traveler ${i}</strong>
</div>

<button type="button"
class="removeTraveler"
onclick="removeTraveler(this)">✖</button>

</div>

<div class="traveler-grid">

<div class="field">
<label>Full Name</label>
<input type="text"
class="travelerName"
placeholder="Enter full name">
</div>

<div class="field">
<label>Date of Birth</label>
<input type="date"
class="travelerDOB"
onchange="calculateAge(this)">
</div>

<div class="field">
<label>Gender</label>
<select class="travelerType">
<option value="">Select</option>
<option value="male">Male</option>
<option value="female">Female</option>
<option value="child">Child</option>
</select>
</div>

<div class="field">
<label>Passport</label>
<input type="text" 
class="travelerPassport" 
placeholder="Passport Number">
</div>

<div class="field">
<label>Nationality</label>
<input type="text" 
class="travelerNationality" 
placeholder="Nationality">
</div>

<div class="field">
<label>Contact No.</label>
<input type="text" 
class="travelerPhone" 
placeholder="Contact Number">
</div>

<div class="field">
<label>Email</label>
<input type="email" 
class="travelerEmail" 
placeholder="Email">
</div>

<div class="field">
<label>Travel Mode</label>

<select class="travelerTransport" onchange="updateTransportPrice()">

<option value="">Select Transport</option>
<option value="bus">Bus</option>
<option value="train">Train</option>
<option value="cab">Private Cab</option>
<option value="flight">Airplane</option>

</select>

</div>

</div>

`;

      travelerContainer.appendChild(card);
    }
  }

  /* REMOVE EXTRA */

  if (travelerCount < existing) {
    for (let i = existing; i > travelerCount; i--) {
      travelerContainer.lastElementChild.remove();
    }
  }

  updateTravelerNumbers();
}

/* ==============================
   CALCULATE AGE
================================ */

function calculateAge(input) {
  let dob = new Date(input.value);
  let today = new Date();

  let age = today.getFullYear() - dob.getFullYear();

  let m = today.getMonth() - dob.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  input.setAttribute("data-age", age);
}

function removeTraveler(btn) {
  btn.closest(".traveler-card").remove();

  travelerCount--;

  if (travelerCount <= 0) {
    travelerCount = 0;
    travelerInput.value = 0;

    travelerContainer.innerHTML = "";
    travelerWrapper.style.display = "none";

    return;
  }

  travelerInput.value = travelerCount;

  updateTravelerNumbers();
}

/* ==============================
   UPDATE TRAVELER NUMBER
================================ */

function updateTravelerNumbers() {
  let cards = document.querySelectorAll(".traveler-card");

  cards.forEach((card, index) => {
    card.querySelector("strong").innerText = "Traveler " + (index + 1);
  });
}

/* ==============================
   VALIDATE BOOKING FORM
================================ */

function validateBooking() {
  let valid = true;

  const fields = [
    { id: "departure", error: "Departure city required" },
    { id: "destination", error: "Destination required" },
    { id: "travelDate", error: "Travel date required" },
    { id: "returnDate", error: "Return date required" },
    { id: "package", error: "Please select package" },
  ];

  fields.forEach((f) => {
    let el = document.getElementById(f.id);

    let error = el.parentElement.querySelector(".field-error");

    if (!error) {
      error = document.createElement("div");

      error.className = "field-error";

      el.parentElement.appendChild(error);
    }

    error.innerText = "";

    el.style.border = "1px solid #ddd";

    if (el.value === "") {
      error.innerText = f.error;

      el.style.border = "2px solid red";

      valid = false;
    }
  });

  return valid;
}

/* ==============================
   VALIDATE TRAVELERS
================================ */

function validateTravelers() {
  let names = document.querySelectorAll(".travelerName");
  let ages = document.querySelectorAll(".travelerDOB");
  let types = document.querySelectorAll(".travelerType");

  for (let i = 0; i < names.length; i++) {
    if (names[i].value.trim() === "") {
      alert("Please enter traveler name");
      names[i].focus();
      return false;
    }

    if (ages[i].value.trim() === "") {
      alert("Please enter traveler age");
      ages[i].focus();
      return false;
    }

    if (types[i].value === "") {
      alert("Please select traveler gender");
      types[i].focus();
      return false;
    }
  }

  return true;
}

/* ==============================
   SEARCH TRIP
================================ */

const searchBtn = document.getElementById("searchTrip");

if (searchBtn) {
  searchBtn.onclick = function (e) {
    e.preventDefault();

    if (!validateBooking()) return;

    generateTravelers();

    if (!validateTravelers()) return;

    openPopup();
  };
}

/* ==============================
   OPEN POPUP
================================ */

function openPopup() {
  const departure = document.getElementById("departure").value;

  const destination = document.getElementById("destination").value;

  const travel = document.getElementById("travelDate").value;

  const ret = document.getElementById("returnDate").value;

  const start = new Date(travel);
  const end = new Date(ret);

  const days = (end - start) / (1000 * 60 * 60 * 24);

  if (days <= 0) {
    alert("Return date must be after travel date");

    return;
  }

  const packageSelect = document.getElementById("package");

  const packagePrice = parseInt(
    packageSelect.options[packageSelect.selectedIndex].dataset.price,
  );

  const totalAmount = days * travelerCount * packagePrice;

  document.getElementById("p_amount").innerText = totalAmount;

  /* COUNT GENDER */

  let types = document.querySelectorAll(".travelerType");

  let men = 0;
  let women = 0;
  let children = 0;

  types.forEach((type) => {
    if (type.value === "male") men++;

    if (type.value === "female") women++;

    if (type.value === "child") children++;
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

  document.getElementById("bookingPopup").style.display = "flex";
}

/* ==============================
   SHOW TRAVELERS IN POPUP
================================ */

function showTravelerPopup() {
  let names = document.querySelectorAll(".travelerName");
  let dobs = document.querySelectorAll(".travelerDOB");
  let types = document.querySelectorAll(".travelerType");
  let transports = document.querySelectorAll(".travelerTransport");

  let list = "";

  for (let i = 0; i < names.length; i++) {
    let age = dobs[i].getAttribute("data-age") || "N/A";

    list += `

<div class="popup-traveler">

<span>${names[i].value}</span>
<span>Age ${age}</span>
<span>${types[i].value}</span>
<span>${transports[i].value || "-"}</span>

</div>
`;
  }

  document.getElementById("popupTravelerList").innerHTML = list;
}

/* ==============================
   CLOSE POPUP
================================ */

function closePopup() {
  document.getElementById("bookingPopup").style.display = "none";
}

/*==================
TRANSPORT TYPE
===================*/
function updateTransportPrice() {
  let transport = document.querySelector(".travelerTransport").value;

  let extra = 0;

  if (transport === "bus") {
    extra = 2000;
  } else if (transport === "train") {
    extra = 3500;
  } else if (transport === "cab") {
    extra = 6000;
  } else if (transport === "flight") {
    extra = 12000;
  }

  let base = parseInt(document.getElementById("p_amount").dataset.base);
  let total = base + extra;

  document.getElementById("p_amount").innerText = total;
}

/*==================
TRANSPORT DESTINATION WISE UPDATE
===================*/

function updateTransportOptions() {
  let destination = document.getElementById("destination").value.toLowerCase();

  let transports = document.querySelectorAll(".travelerTransport");

  transports.forEach((select) => {
    select.innerHTML = "";

    function addOption(val, text) {
      let opt = document.createElement("option");
      opt.value = val;
      opt.text = text;
      select.appendChild(opt);
    }

    addOption("", "Select Transport");

    if (destination === "maldives" || destination === "bali") {
      addOption("flight", "Airplane");
    } else if (destination === "goa") {
      addOption("bus", "Bus");
      addOption("train", "Train");
      addOption("flight", "Airplane");
    } else if (destination === "manali") {
      addOption("bus", "Bus");
      addOption("cab", "Private Cab");
    } else {
      addOption("bus", "Bus");
      addOption("train", "Train");
      addOption("cab", "Private Cab");
      addOption("flight", "Airplane");
    }
  });
}

/* ==============================
   CONFIRM BOOKING
================================ */

// function confirmTrip() {

//   document.getElementById("bookingPopup").style.display = "none";

//   alert("🎉 Thank you! Your trip request submitted.");

//   downloadReceipt();

// }
//// Confirm Button Info /////////////

function confirmTrip() {
  saveBooking();

  document.getElementById("bookingPopup").style.display = "none";
  alert("🎉 Thank you! Your trip request submitted.");
}

/* ==============================
   DOWNLOAD RECEIPT
================================ */

function downloadReceipt() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  /* CAPITALIZE FUNCTION */

  function capitalizeWords(str) {
    return str.replace(/\b\w/g, (c) => c.toUpperCase());
  }

  /* LOGO LOAD */

  let logo = new Image();
  logo.src = "./assets/images/logo-white.png";

  logo.onload = function () {
    /* HEADER */

    doc.setFillColor(20, 27, 52);
    doc.rect(0, 0, 210, 28, "F");

    doc.setDrawColor(204, 243, 47);
    doc.setLineWidth(1.2);
    doc.line(0, 28, 210, 28);

    doc.addImage(logo, "PNG", 15, 6, 28, 14);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);

    doc.text("Sky Route Travel Agency", 105, 17, { align: "center" });

    /* FORM DATA */

    let departure = document.getElementById("departure").value;
    let destination = document.getElementById("destination").value;
    let travel = document.getElementById("travelDate").value;
    let ret = document.getElementById("returnDate").value;

    let packageType = document.getElementById("package").value;
    let packageName =
      document.getElementById("package").selectedOptions[0].text;

    let amount = document.getElementById("p_amount").innerText;

    /* TRAVELER DATA */

    let names = document.querySelectorAll(".travelerName");
    let dobs = document.querySelectorAll(".travelerDOB");
    let genders = document.querySelectorAll(".travelerType");
    let passports = document.querySelectorAll(".travelerPassport");
    let phones = document.querySelectorAll(".travelerPhone");
    let transports = document.querySelectorAll(".travelerTransport");

    /* TITLE */

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);

    doc.text("Travel Booking Receipt", 105, 38, { align: "center" });
    doc.text("Booking ID : " + bookingCode, 20, 46);

    /* TRIP DETAILS */

    doc.setDrawColor(20, 27, 52);
    doc.setLineWidth(0.5);

    doc.rect(15, 50, 180, 35);

    doc.setFontSize(11);

    doc.text("Departure : " + departure, 20, 60);
    doc.text("Destination : " + destination, 20, 70);

    doc.text("Travel Date : " + travel, 110, 60);
    doc.text("Return Date : " + ret, 110, 70);

    /* PACKAGE FEATURES */

    let features = packageDetails[packageType].features;

    let featureHeight = features.length * 6;
    let boxHeight = 45 + featureHeight;

    /* SUMMARY BOX */

    doc.rect(15, 90, 180, boxHeight);

    doc.setFont("helvetica", "bold");
    doc.text("Total Travelers :", 20, 100);

    doc.setFont("helvetica", "normal");
    doc.text(travelerCount.toString(), 60, 100);

    doc.setFont("helvetica", "bold");
    doc.text("Days :", 110, 100);

    doc.setFont("helvetica", "normal");
    doc.text(document.getElementById("p_days").innerText, 125, 100);

    doc.setFont("helvetica", "bold");
    doc.text("Package :", 20, 110);

    doc.setFont("helvetica", "normal");
    doc.text(packageName, 45, 110);

    /* TRANSPORT TYPE */

    doc.setFont("helvetica", "bold");
    doc.text("Transport :", 20, 120);

    doc.setFont("helvetica", "normal");

    let transportList = [];

    transports.forEach((t) => {
      if (t.value !== "") {
        transportList.push(capitalizeWords(t.value));
      }
    });

    let transportText = transportList.join(", ");

    doc.text(transportText || "-", 45, 120);

    /* PACKAGE INCLUDES */

    doc.setFont("helvetica", "bold");
    doc.text("Package Includes:", 110, 110);

    doc.setFont("helvetica", "normal");

    let fy = 118;

    features.forEach((f) => {
      doc.text("- " + f, 110, fy);
      fy += 7;
    });
    /* EXTRA SPACE BELOW PACKAGE INCLUDES */
    fy += 5;

    /* TOTAL AMOUNT */

    let nextY = 90 + boxHeight + 10;

    doc.setFillColor(204, 243, 47);
    doc.rect(15, nextY, 180, 12, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);

    doc.text("Total Amount : Rs " + amount, 105, nextY + 8, {
      align: "center",
    });

    doc.setFont("helvetica", "normal");

    /* TRAVELER SECTION */

    let tableStartY = nextY + 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);

    doc.text("Traveler Details", 20, tableStartY);

    /* TABLE HEADER */

    let y = tableStartY + 8;

    doc.setDrawColor(20, 27, 52);
    doc.rect(15, y, 180, 10);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);

    doc.text("Name", 18, y + 7);
    doc.text("Age", 70, y + 7);
    doc.text("Gender", 90, y + 7);
    doc.text("Passport", 115, y + 7);
    doc.text("Phone", 150, y + 7);

    y += 15;

    doc.setFont("helvetica", "normal");

    /* TRAVELER DATA WITH PAGE BREAK */

    for (let i = 0; i < names.length; i++) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      let age = dobs[i].getAttribute("data-age") || "N/A";

      doc.rect(15, y - 5, 180, 10);

      doc.text(capitalizeWords(names[i].value), 18, y);
      doc.text(age.toString(), 70, y);
      doc.text(capitalizeWords(genders[i].value), 90, y);
      doc.text(passports[i].value || "-", 115, y);
      doc.text(phones[i].value || "-", 150, y);

      y += 10;
    }

    /* FOOTER */

    doc.setFontSize(10);

    /* QR CODE */

    let qrData =
      "http://localhost/SKY-ROUTE-TRAVEL-AGENCY/verify.php?code=" + bookingCode;

    let qr = new QRious({
      value: qrData,
      size: 120,
    });

    let qrImage = qr.toDataURL();

    doc.addImage(qrImage, "PNG", 165, 250, 30, 30);

    doc.setFontSize(8);
    doc.text("Scan to verify booking", 180, 285, { align: "center" });

    doc.text("Thank you for booking with Sky Route Travel Agency", 105, 285, {
      align: "center",
    });

    /* SAVE */

    doc.save("travel-booking-receipt.pdf");

    /* RESET FORM */

    setTimeout(() => {
      resetBookingForm();
    }, 1000);
  };
}

/* ==============================
   RESET FORM
================================ */

function resetBookingForm() {
  document.getElementById("departure").value = "";
  document.getElementById("destination").value = "";
  document.getElementById("travelDate").value = "";
  document.getElementById("returnDate").value = "";
  document.getElementById("package").value = "";

  document.getElementById("packagePopup").style.display = "none";

  travelerCount = 0;
  travelerInput.value = 0;

  travelerContainer.innerHTML = "";
  travelerWrapper.style.display = "none";

  /* IMPORTANT */
  window.history.replaceState({}, document.title, window.location.pathname);
}
/* ==============================
   BOOKING PACKAGE DETAILS
================================ */

const packageDetails = {
  budget: {
    title: "Budget Package",
    price: "₹2000 / day",
    features: [
      "2 Star Hotel",
      "Breakfast Included",
      "Shared Transport",
      "Basic Sightseeing",
    ],
  },

  standard: {
    title: "Standard Package",
    price: "₹3500 / day",
    features: [
      "3 Star Hotel",
      "Breakfast + Dinner",
      "Private Transport",
      "City Tour Guide",
    ],
  },

  luxury: {
    title: "Luxury Package",
    price: "₹6000 / day",
    features: [
      "4 Star Resort",
      "All Meals Included",
      "Private Cab",
      "Airport Pickup",
    ],
  },

  premium: {
    title: "Premium Package",
    price: "₹9000 / day",
    features: [
      "5 Star Resort",
      "All Meals Included",
      "Luxury Chauffeur Car",
      "Private Tour Guide",
      "Spa Access",
    ],
  },
};

function showPackageInfo() {
  const selected = document.getElementById("package").value;

  if (selected === "") return;

  const data = packageDetails[selected];

  document.getElementById("packageTitle").innerText = data.title;
  document.getElementById("packagePrice").innerText = data.price;

  const featureList = document.getElementById("packageFeatures");

  featureList.innerHTML = "";

  data.features.forEach((feature) => {
    const li = document.createElement("li");
    li.textContent = feature;

    featureList.appendChild(li);
  });

  document.getElementById("packagePopup").style.display = "flex";
}

function closePackagePopup() {
  document.getElementById("packagePopup").style.display = "none";
}

///// Booking Save In DB///////

let bookingCode = ""; // booking id store karne ke liye

function saveBooking() {
  let travelers = [];

  document.querySelectorAll(".traveler-card").forEach((card) => {
    let name = card.querySelector(".travelerName").value;
    let dob = card.querySelector(".travelerDOB").value;
    let gender = card.querySelector(".travelerType").value;

    let passport = card.querySelector(".travelerPassport").value;
    let nationality = card.querySelector(".travelerNationality").value;
    let phone = card.querySelector(".travelerPhone").value;
    let email = card.querySelector(".travelerEmail").value;
    let transport = card.querySelector(".travelerTransport").value;

    travelers.push({
      name: name,
      dob: dob,
      gender: gender,
      passport: passport,
      nationality: nationality,
      phone: phone,
      email: email,
      transport: transport,
    });
  });

  let data = {
    departure: document.getElementById("departure").value,
    destination: document.getElementById("destination").value,
    travelDate: document.getElementById("travelDate").value,
    returnDate: document.getElementById("returnDate").value,
    package: document.getElementById("package").value,
    totalTravelers: travelerCount,
    totalAmount: document.getElementById("p_amount").innerText,
    travelers: travelers,
  };

  fetch("backend/save_booking.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log("Booking saved", res);

      if (res.booking_code) {
        bookingCode = res.booking_code;

        /* DOWNLOAD RECEIPT */
        downloadReceipt();

        alert("Booking Confirmed! Your Booking ID: " + bookingCode);

        /* PAGE RESET */
        setTimeout(() => {
          resetBookingForm();
        }, 1500);
      }
    })
    .catch((err) => {
      console.error("Booking error:", err);
    });

  /*========================
SMOOTH SCROLL MAKE MY TRIP BUTTON
===========================*/
  const tripBtn = document.querySelector(".main-btn");

  if (tripBtn) {
    tripBtn.addEventListener("click", function (e) {
      e.preventDefault();

      const booking = document.querySelector("#bookingForm");

      if (booking) {
        booking.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  }

  /*
MOBILE HAMBURGER MENU 
*/
  document.addEventListener("DOMContentLoaded", function () {
    const offcanvasEl = document.querySelector("#mainMenu");

    if (!offcanvasEl) return;

    const offcanvas = new bootstrap.Offcanvas(offcanvasEl);

    document.querySelectorAll("#mainMenu .nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        offcanvas.hide();
      });
    });
  });

  // SMOOTH SCROLLING

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));

      if (target) {
        e.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });
}
/* ========================================
AUTO SCROLL TO BOOKING FORM IF URL HAS PARAMS 
============================================*/

/* ========================================
AUTO SCROLL TO BOOKING FORM IF URL HAS PARAMS 
============================================*/

document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);

  if (params.toString() !== "") {
    const booking = document.querySelector("#bookingForm");

    if (booking) {
      setTimeout(() => {
        booking.scrollIntoView({
          behavior: "smooth",
        });
      }, 600);
    }
  }
});

/* ===================================
AUTO FILL BOOKING FORM FROM URL
=================================== */

document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);

  const destination = params.get("destination");
  const packageType = params.get("package");
  const transportType = params.get("transport");

  /* =========================
  SET DESTINATION
  ========================= */

  if (destination) {
    const destinationInput = document.getElementById("destination");

    if (destinationInput) {
      destinationInput.value =
        destination.charAt(0).toUpperCase() + destination.slice(1);

      if (typeof updateTransportOptions === "function") {
        updateTransportOptions();
      }
    }
  }

  /* =========================
  SET PACKAGE
  ========================= */

  if (packageType) {
    const packageSelect = document.getElementById("package");

    if (packageSelect) {
      setTimeout(() => {
        const option = packageSelect.querySelector(
          `option[value="${packageType}"]`,
        );

        if (option) {
          packageSelect.value = packageType;

          /* trigger onchange */
          // packageSelect.dispatchEvent(new Event("change"));
          packageSelect.value = packageType;
        }
      }, 200);
    }
  }

  /* =========================
  SET TRANSPORT
  ========================= */

  if (transportType) {
    setTimeout(() => {
      const transportSelect = document.querySelector(".travelerTransport");

      if (transportSelect) {
        transportSelect.value = transportType;

        if (typeof updateTransportPrice === "function") {
          updateTransportPrice();
        }
      }
    }, 500);
  }
});

/*==========
DASHBOARD AUTO UPDATE
============*/

function loadBookings() {
  const table = document.getElementById("bookingTable");

  if (!table) return; // dashboard page nahi hai

  fetch("backend/get_bookings.php")
    .then((res) => res.json())
    .then((data) => {
      let html = "";

      data.forEach((b) => {
        html += `
<tr>
<td>${b.booking_code}</td>
<td>${b.departure}</td>
<td>${b.destination}</td>
<td>${b.travel_date}</td>
<td>${b.total_travelers}</td>
<td>${b.total_amount}</td>
<td>${b.status}</td>
</tr>
`;
      });

      table.innerHTML = html;
    })
    .catch((err) => {
      console.error("Booking load error:", err);
    });
}

loadBookings();

/* AUTO REFRESH */

setInterval(loadBookings, 5000);
