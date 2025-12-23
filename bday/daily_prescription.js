// daily_prescription.js

const pills = [
  "Give wet food to snowy",
  "Compliment jv",
  "Saying I love you to palak",
  "Take meeshu out to froyoland",
  "Teach JV how to play among us",
  "Get your specs repaired",
  "Remind yourself you are pretty",
  "Pray",
  "Give him another compliment",
  "Forgive yourself"
];

const LS_KEY = "daily_prescription_done_v1";

function loadDone() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return Array(10).fill(false);
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length !== 10) return Array(10).fill(false);
    return parsed.map(Boolean);
  } catch {
    return Array(10).fill(false);
  }
}

function saveDone(doneArr) {
  localStorage.setItem(LS_KEY, JSON.stringify(doneArr));
}

export function mountDailyPrescriptionWidget(container) {
  container.innerHTML = `
    <style>
      .dpres, .dpres * { box-sizing: border-box; }

      .dpres{
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

      .dpres__title{
        margin:0;
        text-align:center;
        font-size:14px;
        font-weight:900;
        letter-spacing:.14em;
        text-transform:uppercase;
        color:#6F4E37;
        line-height:1.05;
      }

      .dpres__nav{
        margin-top:10px;
        display:flex;
        align-items:center;
        justify-content:center;
        gap:10px;
      }

      /* 2 rows of 5 dots */
      .dpres__dots{
        display:grid;
        grid-template-columns: repeat(5, 7px);
        grid-auto-rows: 7px;
        gap:6px 6px;
        align-content:center;
        justify-content:center;
      }

      .dpres__dot{
        width:7px;
        height:7px;
        border-radius:999px;
        border:2px solid rgba(111,78,55,.35);
        background:transparent;
        padding:0;
        cursor:pointer;
      }

      /* currently selected pill */
      .dpres__dot[aria-selected="true"]{
        background:rgba(111,78,55,.78);
        border-color:rgba(111,78,55,.78);
      }

      /* done pill indicator (lighter brown) */
      .dpres__dot.is-done{
        background:rgba(166,124,82,.55);
        border-color:rgba(166,124,82,.55);
      }

      /* if selected + done: keep it readable */
      .dpres__dot.is-done[aria-selected="true"]{
        background:rgba(166,124,82,.75);
        border-color:rgba(111,78,55,.78);
      }

      .dpres__arrow{
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
      .dpres__arrow:hover{ transform:translateY(-1px); background:#fff; }
      .dpres__arrow:active{ transform:translateY(0px); }

      .dpres__content{
        flex:1;
        min-height:0;
        display:flex;
        align-items:center;
        justify-content:center;
      }

      /* UPDATED: reduced font size to fit longer text better */
      .dpres__text{
        font-size:10px;
        font-weight:950;
        color:#3E2723;
        letter-spacing:.2px;
        text-align:center;
        line-height:1.12;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
        max-width:100%;
        cursor:pointer;
        transition:opacity .12s ease;
      }

      .dpres__text.is-done{
        opacity:.35;
      }

      .fade-out{ animation:dp-fade-out .22s forwards; }
      .fade-in { animation:dp-fade-in  .22s forwards; }

      @keyframes dp-fade-out { to{ opacity:0; transform:translateY(2px); } }
      @keyframes dp-fade-in  { from{ opacity:0; transform:translateY(-2px); } to{ opacity:1; transform:translateY(0); } }

      @media (prefers-reduced-motion: reduce){
        .fade-out,.fade-in{ animation:none; }
        .dpres__arrow{ transition:none; }
      }
    </style>

    <section class="dpres" aria-label="Daily prescription">
      <h3 class="dpres__title">Daily Prescription</h3>

      <div class="dpres__nav" aria-label="Prescription navigation">
        <button class="dpres__arrow" id="dpPrevBtn" type="button" aria-label="Previous pill">‹</button>
        <div class="dpres__dots" id="dpDots" role="tablist" aria-label="Pills"></div>
        <button class="dpres__arrow" id="dpNextBtn" type="button" aria-label="Next pill">›</button>
      </div>

      <div class="dpres__content">
        <div class="dpres__text" id="dpText" title="Click to toggle done">Give wet food to snowy</div>
      </div>
    </section>
  `;

  const textEl   = container.querySelector("#dpText");
  const dotsWrap = container.querySelector("#dpDots");
  const prevBtn  = container.querySelector("#dpPrevBtn");
  const nextBtn  = container.querySelector("#dpNextBtn");

  let activeIndex = 0;
  let isAnimating = false;
  const done = loadDone();

  function renderDots() {
    dotsWrap.innerHTML = "";
    pills.forEach((_, i) => {
      const btn = document.createElement("button");
      btn.className = "dpres__dot";
      btn.type = "button";
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-label", `Item ${i + 1}`);
      btn.setAttribute("aria-selected", i === activeIndex ? "true" : "false");
      btn.tabIndex = i === activeIndex ? 0 : -1;

      if (done[i]) btn.classList.add("is-done");

      btn.addEventListener("click", () => {
        if (isAnimating || i === activeIndex) return;
        setSlide(i);
      });

      dotsWrap.appendChild(btn);
    });
  }

  function updateDots() {
    [...dotsWrap.children].forEach((dot, idx) => {
      dot.setAttribute("aria-selected", idx === activeIndex ? "true" : "false");
      dot.tabIndex = idx === activeIndex ? 0 : -1;
      dot.classList.toggle("is-done", !!done[idx]);
    });
  }

  function applyDoneUI() {
    textEl.classList.toggle("is-done", !!done[activeIndex]);
    updateDots();
  }

  function setSlide(i) {
    if (isAnimating) return;
    isAnimating = true;

    textEl.classList.add("fade-out");
    setTimeout(() => {
      activeIndex = i;
      textEl.textContent = pills[activeIndex];

      textEl.classList.remove("fade-out");
      textEl.classList.add("fade-in");

      applyDoneUI();

      setTimeout(() => {
        textEl.classList.remove("fade-in");
        isAnimating = false;
      }, 220);
    }, 220);
  }

  function nextSlide() { setSlide((activeIndex + 1) % pills.length); }
  function prevSlide() { setSlide((activeIndex - 1 + pills.length) % pills.length); }

  // toggle done/undone on click
  textEl.addEventListener("click", () => {
    done[activeIndex] = !done[activeIndex];
    saveDone(done);
    applyDoneUI();
  });

  nextBtn.addEventListener("click", () => {
    if (isAnimating) return;
    nextSlide();
  });

  prevBtn.addEventListener("click", () => {
    if (isAnimating) return;
    prevSlide();
  });

  // init
  renderDots();
  setSlide(0);
}
