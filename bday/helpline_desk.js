// helpline_desk.js

const staff = [
  {
    name: "Dr. Snowy",
    role: "Senior doctor",
    blurb: 'Joined 1 yr ago, Showed tremendous growth',
    info: "meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow meow ",
    photo: "./Snowy.jpg",
    phone: "+910000000001",
  },
  {
    name: "JV",
    role: "Junior Nurse",
    blurb: "Joined 7 yrs ago, can't wait to quit!!!",
    info: "But you're asking for it. You're dying for it!",
    photo: "./jv.jpg",
    phone: "+910000000002",
  },
  {
    name: "Palak",
    role: "Senior Nurse",
    blurb: 'Joined 3 yrs ago, proved to be the "best" asset',
    info: "Thank you for being my second home...for breaking down these walls",
    photo: "./Palak.jpeg",
    phone: "+910000000003",
  },
  {
    name: "Meeshu",
    role: "Head Nurse",
    blurb: "Took birth in the same hospital, serving every day ever since",
    info: "Thank you for being always there for me :)",
    photo: "./meeshu.jpeg",
    phone: "+910000000004",
  },
];

export function mountHelplineDeskWidget(container) {
  container.innerHTML = `
    <style>
      .hdesk, .hdesk * { box-sizing: border-box; }

      .hdesk{
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

      .hdesk__title{
        margin:0;
        text-align:center;
        font-size:14px;
        font-weight:900;
        letter-spacing:.14em;
        text-transform:uppercase;
        color:#6F4E37;
        line-height:1.05;
      }

      .hdesk__nav{
        margin-top:10px;
        display:flex;
        align-items:center;
        justify-content:center;
        gap:10px;
      }

      .hdesk__dots{
        display:grid;
        grid-template-columns: repeat(2, 7px);
        grid-auto-rows: 7px;
        gap:6px 6px;
        align-content:center;
        justify-content:center;
      }

      .hdesk__dot{
        width:7px;
        height:7px;
        border-radius:999px;
        border:2px solid rgba(111,78,55,.35);
        background:transparent;
        padding:0;
        cursor:pointer;
      }
      .hdesk__dot[aria-selected="true"]{
        background:rgba(111,78,55,.78);
        border-color:rgba(111,78,55,.78);
      }

      .hdesk__arrow{
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
      .hdesk__arrow:hover{ transform:translateY(-1px); background:#fff; }
      .hdesk__arrow:active{ transform:translateY(0px); }

      .hdesk__content{
        flex:1;
        min-height:0;
        display:flex;
        align-items:center;
        justify-content:center;
      }

      .hdesk__card{
        width:100%;
        max-width:340px;
        display:flex;
        flex-direction:column;
        align-items:center;
        text-align:center;
        gap:6px;
      }

      .hdesk__name{
        font-size:28px;
        font-weight:950;
        color:#3E2723;
        letter-spacing:.2px;
        line-height:1.05;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
        max-width:100%;
      }

      .hdesk__role{
        font-size:13px;
        font-weight:900;
        color:#A67C52;
        letter-spacing:.08em;
        text-transform:uppercase;
        line-height:1.1;
      }

      /* NEW: blurb line */
      .hdesk__blurb{
        margin-top:6px;
        font-size:12px;
        font-weight:850;
        color:#3E2723;
        opacity:.72;
        line-height:1.25;
        max-width:92%;
      }

      .hdesk__actions{
        margin-top:12px;
        display:flex;
        gap:12px;
        align-items:center;
        justify-content:center;
      }

      .hdesk__iconBtn{
        width:44px;
        height:44px;
        border-radius:999px;
        border:2px solid rgba(111,78,55,.55);
        background:rgba(255,255,255,.60);
        color:#6F4E37;
        display:grid;
        place-items:center;
        cursor:pointer;
        text-decoration:none;
        font-weight:950;
        transition:transform .12s ease, background .12s ease;
      }
      .hdesk__iconBtn:hover{ transform:translateY(-1px); background:#fff; }
      .hdesk__iconBtn:active{ transform:translateY(0px); }

      .hdesk__phoneSvg{
        width:18px;
        height:18px;
        display:block;
      }

      .fade-out{ animation:hd-fade-out .22s forwards; }
      .fade-in { animation:hd-fade-in  .22s forwards; }

      @keyframes hd-fade-out { to{ opacity:0; transform:translateY(2px); } }
      @keyframes hd-fade-in  { from{ opacity:0; transform:translateY(-2px); } to{ opacity:1; transform:translateY(0); } }

      /* ---- Info dialog ---- */
      .hdesk__dialog{
        border:1px solid rgba(212,184,150,.95);
        border-radius:16px;
        padding:16px;
        background:rgba(255,251,245,.98);
        box-shadow:0 24px 60px rgba(62,39,35,.20);
        width:min(720px, calc(100vw - 40px));
      }
      .hdesk__dialog::backdrop{
        background:rgba(62,39,35,.25);
        backdrop-filter: blur(2px);
      }

      dialog[open]{
        position:fixed;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%);
        z-index:9999;
      }

      .hdesk__modalGrid{
        display:grid;
        grid-template-columns: 3fr 7fr; /* 30:70 */
        gap:14px;
        align-items:start;
      }

      .hdesk__left{
        display:flex;
        flex-direction:column;
        align-items:center;
        text-align:center;
        gap:10px;
        padding-right:6px;
      }

      .hdesk__avatar{
        width:108px;
        height:108px;
        border-radius:999px;
        overflow:hidden;
        border:2px solid rgba(111,78,55,.35);
        background:rgba(255,255,255,.65);
        display:grid;
        place-items:center;
      }
      .hdesk__avatar img{
        width:100%;
        height:100%;
        object-fit:cover;
        display:block;
      }

      .hdesk__modalName{
        font-size:16px;
        font-weight:950;
        color:#3E2723;
        line-height:1.1;
      }

      .hdesk__modalRole{
        font-size:11px;
        font-weight:950;
        color:#A67C52;
        letter-spacing:.1em;
        text-transform:uppercase;
      }

      .hdesk__right{
        border-left:1px solid rgba(212,184,150,.75);
        padding-left:14px;
      }

      .hdesk__infoText{
        margin:0;
        font-size:13px;
        font-weight:800;
        line-height:1.35;
        color:#3E2723;
        white-space:pre-wrap;
      }

      .hdesk__modalActions{
        display:flex;
        justify-content:flex-end;
        margin-top:14px;
        gap:10px;
      }

      .hdesk__closeBtn{
        border-radius:12px;
        border:1px solid rgba(212,184,150,.95);
        background:rgba(255,255,255,.7);
        color:#6F4E37;
        font-weight:950;
        cursor:pointer;
        padding:10px 12px;
      }

      @media (prefers-reduced-motion: reduce){
        .fade-out,.fade-in{ animation:none; }
        .hdesk__arrow,.hdesk__iconBtn{ transition:none; }
      }
    </style>

    <section class="hdesk" aria-label="Helpline desk">
      <h3 class="hdesk__title">Helpline Desk</h3>

      <div class="hdesk__nav" aria-label="Helpline navigation">
        <button class="hdesk__arrow" id="hdPrevBtn" type="button" aria-label="Previous contact">‹</button>
        <div class="hdesk__dots" id="hdDots" role="tablist" aria-label="Contacts"></div>
        <button class="hdesk__arrow" id="hdNextBtn" type="button" aria-label="Next contact">›</button>
      </div>

      <div class="hdesk__content">
        <div class="hdesk__card" id="hdCard">
          <div class="hdesk__name" id="hdName">Dr. Snowy</div>
          <div class="hdesk__role" id="hdRole">Senior doctor</div>

          <!-- NEW -->
          <div class="hdesk__blurb" id="hdBlurb"></div>

          <div class="hdesk__actions">
            <a class="hdesk__iconBtn" id="hdCallBtn" href="tel:+910000000001" aria-label="Call">
              <svg class="hdesk__phoneSvg" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.2 1 .3 2 .5 3 .5.5 0 .9.4.9.9V20c0 .5-.4.9-.9.9C10.4 20.9 3.1 13.6 3.1 4.4c0-.5.4-.9.9-.9H7c.5 0 .9.4.9.9 0 1 .2 2 .5 3 .1.4 0 .9-.2 1.2L6.6 10.8z"/>
              </svg>
            </a>

            <button class="hdesk__iconBtn" id="hdInfoBtn" type="button" aria-label="More info">I</button>
          </div>
        </div>
      </div>

      <dialog class="hdesk__dialog" id="hdDialog" aria-label="Contact info">
        <div class="hdesk__modalGrid">
          <div class="hdesk__left">
            <div class="hdesk__avatar">
              <img id="hdModalImg" alt="" src="./snowy.jpeg" />
            </div>
            <div>
              <div class="hdesk__modalName" id="hdModalName">Dr. Snowy</div>
              <div class="hdesk__modalRole" id="hdModalRole">Senior doctor</div>
            </div>
          </div>

          <div class="hdesk__right">
            <p class="hdesk__infoText" id="hdModalInfo">woof woof</p>
            <div class="hdesk__modalActions">
              <button class="hdesk__closeBtn" id="hdCloseBtn" type="button">Close</button>
            </div>
          </div>
        </div>
      </dialog>
    </section>
  `;

  const nameEl = container.querySelector("#hdName");
  const roleEl = container.querySelector("#hdRole");
  const blurbEl = container.querySelector("#hdBlurb");
  const cardEl = container.querySelector("#hdCard");

  const dotsWrap = container.querySelector("#hdDots");
  const prevBtn = container.querySelector("#hdPrevBtn");
  const nextBtn = container.querySelector("#hdNextBtn");

  const callBtn = container.querySelector("#hdCallBtn");
  const infoBtn = container.querySelector("#hdInfoBtn");

  const dialog = container.querySelector("#hdDialog");
  const closeBtn = container.querySelector("#hdCloseBtn");
  const modalImg = container.querySelector("#hdModalImg");
  const modalName = container.querySelector("#hdModalName");
  const modalRole = container.querySelector("#hdModalRole");
  const modalInfo = container.querySelector("#hdModalInfo");

  let activeIndex = 0;
  let isAnimating = false;
  let timer = null;

  function renderDots() {
    dotsWrap.innerHTML = "";
    staff.forEach((_, i) => {
      const btn = document.createElement("button");
      btn.className = "hdesk__dot";
      btn.type = "button";
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-label", `Contact ${i + 1}`);
      btn.setAttribute("aria-selected", i === activeIndex ? "true" : "false");
      btn.tabIndex = i === activeIndex ? 0 : -1;

      btn.addEventListener("click", () => {
        if (isAnimating || i === activeIndex) return;
        resetAuto();
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

  function applySlide(i) {
    const s = staff[i];
    nameEl.textContent = s.name;
    roleEl.textContent = s.role;
    blurbEl.textContent = s.blurb;
    callBtn.setAttribute("href", `tel:${s.phone}`);
  }

  function setSlide(i) {
    if (isAnimating) return;
    isAnimating = true;

    cardEl.classList.add("fade-out");
    setTimeout(() => {
      activeIndex = i;
      applySlide(activeIndex);
      updateDots();

      cardEl.classList.remove("fade-out");
      cardEl.classList.add("fade-in");

      setTimeout(() => {
        cardEl.classList.remove("fade-in");
        isAnimating = false;
      }, 220);
    }, 220);
  }

  function nextSlide() { setSlide((activeIndex + 1) % staff.length); }
  function prevSlide() { setSlide((activeIndex - 1 + staff.length) % staff.length); }

  function startAuto() { timer = setInterval(nextSlide, 5000); }
  function resetAuto() { clearInterval(timer); startAuto(); }

  prevBtn.addEventListener("click", () => { if (!isAnimating) { resetAuto(); prevSlide(); } });
  nextBtn.addEventListener("click", () => { if (!isAnimating) { resetAuto(); nextSlide(); } });

  function openDialog() {
    const s = staff[activeIndex];
    modalImg.src = s.photo;
    modalImg.alt = s.name;
    modalName.textContent = s.name;
    modalRole.textContent = s.role;
    modalInfo.textContent = s.info;

    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
  }

  function closeDialog() {
    if (typeof dialog.close === "function") dialog.close();
    else dialog.removeAttribute("open");
  }

  infoBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    openDialog();
  });

  closeBtn.addEventListener("click", closeDialog);

  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) closeDialog();
  });

  // init
  applySlide(0);
  renderDots();
  startAuto();
}
