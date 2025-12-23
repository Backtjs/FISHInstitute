// vitals.js

const vitalsSlides = [
  {
    label: "Mood",
    value: "5",
    unit: "/10",
    note: "Advise: Subject tries everything, yet coffee improves mood in the end."
  },
  {
    label: "Energy",
    value: "42",
    unit: "%",
    note: "Info: Subject's energy generally on the sleepy end; easily affected by external factors."
  },
  {
    label: "Caffeine level",
    value: "2",
    unit: " cups",
    note: "⚠ Alert: Subject can be lured into a strange van if it smells of good coffee."
  },
  {
    label: "Headache",
    value: "Moderate",
    unit: "",
    note: "Info: Subject can be easily stimulated. Advise: Be wary of your stupid actions."
  },
  {
    label: "Social energy",
    value: "10",
    unit: "%",
    note: "Clinical note: Subject has a serious case of what it calls 'FOBI' (Fear of Being Interacted-with)."
  },
  {
    label: "Boredness",
    value: "Very High",
    unit: "",
    note: "Subject claims boring is comfortable. No intervention required."
  },
  {
    label: "Hunger index",
    value: "20",
    unit: "%",
    note: "Observation: Usually peaks at night after good conversation. Plan snack protocol accordingly."
  },
  {
    label: "Sleepiness",
    value: "99.99",
    unit: "%",
    note: "⚠ Alert: Subject prefers sleep as best procrastination method. Pre-sleep schedule enforcement recommended."
  },
  {
    label: "Mood swings",
    value: "Low",
    unit: "",
    note: "Advise: Subject can go silent all of a sudden. Make sure you disturb it during deep focus to test stability."
  }
];

export function initVitalsWidget(container) {
  container.innerHTML = `
    <style>
      .vitals {
        background:#FFFBF5;
        border:1px solid #D4B896;
        border-radius:14px;
        box-shadow:0 6px 16px rgba(62,39,35,0.12);
        padding:10px 12px;
        width:100%;
        height:100%;              /* fill the tile */
        display:flex;
        flex-direction:column;
      }

      .vitals__top{
        display:flex;
        justify-content:space-between;
        align-items:center;
        margin-bottom:8px;
      }

      .vitals__title{
        font-size:16px;
        font-weight:700;
        letter-spacing:.08em;
        text-transform:uppercase;
        color:#6F4E37;
      }

      .vitals__nav{
        display:flex;
        align-items:center;
        gap:6px;
      }

      .vitals__arrow{
        width:20px;
        height:20px;
        border-radius:999px;
        border:1px solid #6F4E37;
        background:#FFFBF5;
        color:#6F4E37;
        font-size:11px;
        font-weight:600;
        display:flex;
        align-items:center;
        justify-content:center;
        cursor:pointer;
        padding:0;
      }

      .vitals__arrow:hover{
        background:#6F4E37;
        color:#fff;
      }

      .vitals__dots{
        display:flex;
        gap:4px;
      }

      .vitals__dot{
        width:5px;
        height:5px;
        border-radius:999px;
        border:1px solid #A67C52;
        background:transparent;
        padding:0;
        cursor:pointer;
      }

      .vitals__dot[aria-selected="true"]{
        background:#6F4E37;
      }

      .vitals__content{
        flex:1;                  /* take remaining height */
        display:flex;
        align-items:flex-start;
      }

      .vitals__slide{
        width:100%;
        font-size:11px;
        display:flex;
        flex-direction:column;
      }

      .vitals__header{
        display:flex;
        justify-content:space-between;
        align-items:baseline;
        margin-bottom:4px;
      }

      .vitals__label{
        font-size:20px;   
        font-weight:600;
        color:#3E2723;
      }

      .vitals__value{
        font-size:14px;
        font-weight:700;
        color:#6F4E37;
      }

      .vitals__unit{
        font-size:16px;
        margin-left:2px;
      }

      .vitals__note{
        font-size:13px;
        line-height:1.3;
        color:#4A2C2A;
      }

      .slide-out-left{ animation:vitals-out-left .3s forwards; }
      .slide-in-left{  animation:vitals-in-left  .3s forwards; }
      .slide-out-right{animation:vitals-out-right .3s forwards; }
      .slide-in-right{ animation:vitals-in-right  .3s forwards; }

      @keyframes vitals-out-left{
        to{ transform:translateX(-12px); opacity:0; }
      }
      @keyframes vitals-in-left{
        from{ transform:translateX(12px); opacity:0; }
        to  { transform:translateX(0); opacity:1; }
      }
      @keyframes vitals-out-right{
        to{ transform:translateX(12px); opacity:0; }
      }
      @keyframes vitals-in-right{
        from{ transform:translateX(-12px); opacity:0; }
        to  { transform:translateX(0); opacity:1; }
      }
    </style>

    <section class="vitals" aria-label="Today's vitals">
      <div class="vitals__top">
        <h3 class="vitals__title">Today's Vitals</h3>

        <div class="vitals__nav">
          <button class="vitals__arrow" id="vitalsPrevBtn" type="button" aria-label="Previous vital">‹</button>
          <div class="vitals__dots" id="vitalsDots" role="tablist" aria-label="Vitals pages"></div>
          <button class="vitals__arrow" id="vitalsNextBtn" type="button" aria-label="Next vital">›</button>
        </div>
      </div>

      <div class="vitals__content">
        <div class="vitals__slide" id="vitalsSlide">
          <div class="vitals__header">
            <div class="vitals__label" id="vitalsLabel">Mood</div>
            <div class="vitals__value" id="vitalsValue">
              5<span class="vitals__unit">/10</span>
            </div>
          </div>

          <div class="vitals__note" id="vitalsNote">
            Advise: Subject tries everything, yet coffee improves mood in the end.
          </div>
        </div>
      </div>
    </section>
  `;

  const labelEl  = container.querySelector("#vitalsLabel");
  const valueEl  = container.querySelector("#vitalsValue");
  const noteEl   = container.querySelector("#vitalsNote");
  const slideEl  = container.querySelector("#vitalsSlide");
  const dotsWrap = container.querySelector("#vitalsDots");
  const prevBtn  = container.querySelector("#vitalsPrevBtn");
  const nextBtn  = container.querySelector("#vitalsNextBtn");

  let activeIndex = 0;
  let autoRotateTimer = null;
  let isAnimating = false;

  function renderDots() {
    dotsWrap.innerHTML = "";
    vitalsSlides.forEach((s, i) => {
      const btn = document.createElement("button");
      btn.className = "vitals__dot";
      btn.type = "button";
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-label", `Vital ${i + 1}: ${s.label}`);
      btn.setAttribute("aria-selected", i === activeIndex ? "true" : "false");
      btn.tabIndex = i === activeIndex ? 0 : -1;

      btn.addEventListener("click", () => {
        if (isAnimating || i === activeIndex) return;
        resetAutoRotate();
        setSlide(i, i > activeIndex ? "next" : "prev");
      });

      dotsWrap.appendChild(btn);
    });
  }

  function updateDots() {
    [...dotsWrap.children].forEach((dot, idx) => {
      dot.setAttribute("aria-selected", idx === activeIndex ? "true" : "false");
      dot.tabIndex = idx === activeIndex ? 0 : -1;
    });
  }

  function setSlide(i, direction = "next") {
    if (isAnimating) return;
    isAnimating = true;

    const outClass = direction === "next" ? "slide-out-left" : "slide-out-right";
    const inClass  = direction === "next" ? "slide-in-left"  : "slide-in-right";

    slideEl.classList.add(outClass);

    setTimeout(() => {
      activeIndex = i;
      const s = vitalsSlides[activeIndex];

      labelEl.textContent = s.label;
      valueEl.innerHTML = `${s.value}<span class="vitals__unit">${s.unit}</span>`;
      noteEl.textContent = s.note;

      updateDots();

      slideEl.classList.remove(outClass);
      slideEl.classList.add(inClass);

      setTimeout(() => {
        slideEl.classList.remove(inClass);
        isAnimating = false;
      }, 300);
    }, 300);
  }

  function nextSlide() {
    setSlide((activeIndex + 1) % vitalsSlides.length, "next");
  }

  function prevSlide() {
    setSlide((activeIndex - 1 + vitalsSlides.length) % vitalsSlides.length, "prev");
  }

  function startAutoRotate() {
    autoRotateTimer = setInterval(nextSlide, 6900);
  }

  function resetAutoRotate() {
    clearInterval(autoRotateTimer);
    startAutoRotate();
  }

  nextBtn.addEventListener("click", () => {
    if (isAnimating) return;
    resetAutoRotate();
    nextSlide();
  });

  prevBtn.addEventListener("click", () => {
    if (isAnimating) return;
    resetAutoRotate();
    prevSlide();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      if (isAnimating) return;
      resetAutoRotate();
      prevSlide();
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      if (isAnimating) return;
      resetAutoRotate();
      nextSlide();
    }
  });

  renderDots();
  startAutoRotate();
}
