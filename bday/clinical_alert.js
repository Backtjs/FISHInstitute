// clinical_alerts.js

const alertsSlides = [
  { text: "Alert: Cat reels overdose—purring is now a coping mechanism." },
  { text: "Alert: Brainrot level high; thoughts buffering at 3%." },
  { text: "Alert: Coffee deficit detected; mood stuck on “loading…”." },
  { text: "Alert: Lower back complaining again; age 22 acting 72." },
  { text: "Alert: Among Us training pending; sus behavior unclassified." },
  { text: "Alert: CAPTCHA fatigue—patient now dreams in 3×4 grids." },
  { text: "Alert: Self-compliment prescription missed; confidence dipping." },
  { text: "Alert: Froyo exposure recommended; sweetness may improve prognosis." },
  { text: "Alert: “I love you” dose overdue; relationship vitals unstable." },
  { text: "Alert: Specs repair overdue; vision now running in 144p." },
];

export function mountClinicalAlertsWidget(container) {
  container.innerHTML = `
    <style>
      .calerts, .calerts * { box-sizing: border-box; }

      .calerts{
        width:100%;
        height:100%;
        background:#FFFBF5;
        border:1px solid #D4B896;
        border-radius:18px;
        box-shadow:0 18px 40px rgba(62,39,35,.14);
        padding:16px 16px 14px;
        display:flex;
        flex-direction:column;
        overflow:hidden;
        user-select:none;
      }

      .calerts__title{
        margin:0;
        text-align:center;
        font-size:14px;
        font-weight:900;
        letter-spacing:.14em;
        text-transform:uppercase;
        color:#6F4E37;
        line-height:1.05;
      }

      .calerts__nav{
        margin-top:10px;
        display:flex;
        align-items:center;
        justify-content:center;
        gap:10px;
      }

      .calerts__dots{
        display:grid;
        grid-template-columns: repeat(5, 7px);
        grid-auto-rows: 7px;
        gap:6px 6px;
        align-content:center;
        justify-content:center;
      }

      .calerts__dot{
        width:7px;
        height:7px;
        border-radius:999px;
        border:2px solid rgba(111,78,55,.35);
        background:transparent;
        padding:0;
        cursor:pointer;
      }
      .calerts__dot[aria-selected="true"]{
        background:rgba(111,78,55,.75);
        border-color:rgba(111,78,55,.75);
      }

      .calerts__arrow{
        width:36px;
        height:36px;
        border-radius:999px;
        border:2px solid rgba(111,78,55,.55);
        background:rgba(255,255,255,.55);
        color:#6F4E37;
        font-size:18px;
        font-weight:900;
        display:grid;
        place-items:center;
        cursor:pointer;
        padding:0;
        transition:transform .12s ease, background .12s ease;
        line-height:1;
      }
      .calerts__arrow:hover{ transform:translateY(-1px); background:#fff; }
      .calerts__arrow:active{ transform:translateY(0px); }

      .calerts__content{
        flex:1;
        min-height:0;
        display:flex;
        align-items:center;
        justify-content:center;
      }

      /* UPDATED: multi-line + 11px */
      .calerts__text{
        font-size:11px;
        font-weight:950;
        color:#3E2723;
        letter-spacing:.2px;
        text-align:center;
        line-height:1.35;

        white-space: normal;
        overflow-wrap: anywhere;

        max-width:100%;
      }

      .fade-out{ animation:ca-fade-out .22s forwards; }
      .fade-in { animation:ca-fade-in  .22s forwards; }

      @keyframes ca-fade-out { to{ opacity:0; transform:translateY(2px); } }
      @keyframes ca-fade-in  { from{ opacity:0; transform:translateY(-2px); } to{ opacity:1; transform:translateY(0); } }

      @media (prefers-reduced-motion: reduce){
        .fade-out,.fade-in{ animation:none; }
        .calerts__arrow{ transition:none; }
      }
    </style>

    <section class="calerts" aria-label="Clinical alerts">
      <h3 class="calerts__title">Clinical Alerts</h3>

      <div class="calerts__nav" aria-label="Alert navigation">
        <button class="calerts__arrow" id="caPrevBtn" type="button" aria-label="Previous alert">‹</button>
        <div class="calerts__dots" id="caDots" role="tablist" aria-label="Alerts pages"></div>
        <button class="calerts__arrow" id="caNextBtn" type="button" aria-label="Next alert">›</button>
      </div>

      <div class="calerts__content">
        <div class="calerts__text" id="caText">Alert 1</div>
      </div>
    </section>
  `;

  const textEl   = container.querySelector("#caText");
  const dotsWrap = container.querySelector("#caDots");
  const prevBtn  = container.querySelector("#caPrevBtn");
  const nextBtn  = container.querySelector("#caNextBtn");

  let activeIndex = 0;
  let autoRotateTimer = null;
  let isAnimating = false;

  function renderDots() {
    dotsWrap.innerHTML = "";
    alertsSlides.forEach((_, i) => {
      const btn = document.createElement("button");
      btn.className = "calerts__dot";
      btn.type = "button";
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-label", `Alert ${i + 1}`);
      btn.setAttribute("aria-selected", i === activeIndex ? "true" : "false");
      btn.tabIndex = i === activeIndex ? 0 : -1;

      btn.addEventListener("click", () => {
        if (isAnimating || i === activeIndex) return;
        resetAutoRotate();
        setSlide(i);
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

  function setSlide(i) {
    if (isAnimating) return;
    isAnimating = true;

    textEl.classList.add("fade-out");
    setTimeout(() => {
      activeIndex = i;
      textEl.textContent = alertsSlides[activeIndex].text;

      updateDots();

      textEl.classList.remove("fade-out");
      textEl.classList.add("fade-in");

      setTimeout(() => {
        textEl.classList.remove("fade-in");
        isAnimating = false;
      }, 220);
    }, 220);
  }

  function nextSlide() { setSlide((activeIndex + 1) % alertsSlides.length); }
  function prevSlide() { setSlide((activeIndex - 1 + alertsSlides.length) % alertsSlides.length); }

  function startAutoRotate() {
    autoRotateTimer = setInterval(nextSlide, 3000);
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

  renderDots();
  startAutoRotate();
  setSlide(0);
}
