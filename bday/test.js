// test.js
// Coffee × Mood widget scaled for dashboard tiles

export function mountCoffeeMoodWidget(mountTarget = document.body) {
  const root = document.createElement("div");
  root.innerHTML = `
    <style>
      /* Only style inside the widget */
      .coffee-card * { box-sizing: border-box; }

      /* Small card inside dashboard tile (~265 × 155) */
      .coffee-card{
        background: #FFFBF5;
        border: 1px solid #D4B896;
        border-radius: 14px;
        box-shadow: 0 10px 24px rgba(62, 39, 35, 0.12);
        padding: 18px 20px;
        width: 100%;
        height: 100%;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        display:flex;
        flex-direction:column;
        justify-content:space-between;
      }
      .coffee-card:hover{
        transform: translateY(-2px);
        box-shadow: 0 12px 28px rgba(62, 39, 35, 0.16);
      }
      .coffee-card__title{
        font-size: 13px;
        font-weight: 600;
        color: #6F4E37;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 4px;
      }
      .coffee-card__subtitle{
        font-size: 11px;
        color: #A67C52;
        margin-bottom: 8px;
      }
      .coffee-card__preview{
        flex:1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content:center;
        gap: 8px;
      }
      .coffee-icon{
        font-size: 34px;
        animation: float 3s ease-in-out infinite;
      }
      @keyframes float{
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-6px); }
      }
      .click-hint{
        font-size: 10px;
        color: #A67C52;
        text-align: center;
        padding: 6px 10px;
        background: #F5E6D3;
        border-radius: 14px;
        border: 1px solid #D4B896;
      }

      /* Modal overlay and modal keep original dimensions */
      .modal-overlay{
        display: none;
        position: fixed;
        inset: 0;
        background: rgba(62, 39, 35, 0.5);
        backdrop-filter: blur(4px);
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      .modal-overlay.active{
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 1;
      }

      .coffee-modal{
        background: #FFFBF5;
        border: 2px solid #D4B896;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(62, 39, 35, 0.25);
        padding: 32px;
        max-width: 600px;
        width: 90%;
        position: relative;
        transform: scale(0.92);
        transition: transform 0.3s ease;
      }
      .modal-overlay.active .coffee-modal{
        transform: scale(1);
      }

      .modal-close{
        position: absolute;
        top: 16px;
        right: 16px;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid #6F4E37;
        background: #fff;
        color: #6F4E37;
        font-size: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        line-height: 1;
      }
      .modal-close:hover{
        background: #6F4E37;
        color: #fff;
        transform: rotate(90deg);
      }

      .modal-title{
        font-size: 24px;
        font-weight: 700;
        color: #3E2723;
        margin-bottom: 8px;
      }
      .modal-subtitle{
        font-size: 14px;
        color: #A67C52;
        margin-bottom: 24px;
      }

      .coffee-content{
        display: flex;
        gap: 32px;
        align-items: center;
      }

      .coffee-cup-container{
        flex: 0 0 200px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 14px;
      }

      .coffee-cup{
        width: 140px;
        height: 180px;
        position: relative;
        cursor: pointer;
        transition: transform 0.2s ease;
      }
      .coffee-cup:hover{ transform: scale(1.05); }
      .coffee-cup:active{ transform: scale(0.98); }

      .cup-body{
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        height: 140px;
        background: #E8D5C4;
        border: 3px solid #6F4E37;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: inset 0 2px 8px rgba(0,0,0,0.05);
      }

      .coffee-fill{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 0%;
        background: linear-gradient(180deg, #8B5A3C 0%, #6F4E37 100%);
        transition: height 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1;
      }

      .cup-handle{
        position: absolute;
        right: -12px;
        top: 50%;
        transform: translateY(-50%);
        width: 40px;
        height: 60px;
        background: #E8D5C4;
        border: 3px solid #6F4E37;
        border-left: none;
        border-radius: 0 50% 50% 0;
        box-shadow: inset 0 1px 4px rgba(0,0,0,0.05);
      }
      .cup-handle::before{
        content: '';
        position: absolute;
        left: 8px;
        top: 50%;
        transform: translateY(-50%);
        width: 24px;
        height: 40px;
        background: #f0f4f8;
        border-radius: 0 50% 50% 0;
      }

      .cup-logo-container{
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        pointer-events: none;
        z-index: 2;
      }
      .cup-logo{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(-90deg);
        font-size: 22px;
        font-weight: 900;
        letter-spacing: 2px;
        white-space: nowrap;
        font-family: "Arial Black", sans-serif;
      }
      .cup-logo-brown{ color: #6F4E37; z-index: 2; }
      .cup-logo-cream{
        color: #FFFBF5;
        z-index: 3;
        clip-path: inset(0 100% 0 0);
        transition: clip-path 0.6s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .steam{
        position: absolute;
        top: -35px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 8px;
        opacity: 0;
        transition: opacity 0.4s ease;
      }
      .steam.active{ opacity: 1; }
      .steam-line{
        width: 3px;
        height: 25px;
        background: linear-gradient(180deg, transparent, #A67C52, transparent);
        border-radius: 50px;
        animation: steam-rise 2s ease-in-out infinite;
      }
      .steam-line:nth-child(2){ animation-delay: 0.3s; }
      .steam-line:nth-child(3){ animation-delay: 0.6s; }

      @keyframes steam-rise{
        0% { transform: translateY(0) scaleY(1); opacity: 0; }
        50% { opacity: 1; }
        100% { transform: translateY(-15px) scaleY(1.5); opacity: 0; }
      }

      .coffee-counter{
        font-size: 14px;
        font-weight: 600;
        color: #6F4E37;
        text-align: center;
        padding: 8px 16px;
        background: #F5E6D3;
        border-radius: 20px;
        border: 1px solid #D4B896;
        width: 100%;
      }

      .reset-btn{
        margin-top: 6px;
        padding: 10px 20px;
        background: #6F4E37;
        color: #fff;
        border: none;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        width: 100%;
      }
      .reset-btn:hover{
        background: #5A3E2B;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(111, 78, 55, 0.3);
      }
      .reset-btn:active{ transform: translateY(0); }

      .mood-photo-container{
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .mood-photo{
        width: 100%;
        height: 320px;
        border-radius: 16px;
        border: 2px solid #D4B896;
        overflow: hidden;
        position: relative;
        background: #F5E6D3;
      }
      .mood-photo img{
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: opacity 0.5s ease;
      }
      .photo-placeholder{
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #A67C52;
        font-size: 14px;
        text-align: center;
        padding: 20px;
      }
      .photo-placeholder-icon{
        font-size: 48px;
        margin-bottom: 12px;
        opacity: 0.5;
      }
      .mood-label{
        font-size: 16px;
        font-weight: 700;
        color: #3E2723;
        text-align: center;
        padding: 12px;
        background: #F5E6D3;
        border-radius: 12px;
        border: 1px solid #D4B896;
      }

      @media (max-width: 640px){
        .coffee-content{ flex-direction: column; }
        .coffee-cup-container{ flex: unset; width: 100%; }
        .mood-photo{ height: 260px; }
      }
    </style>

    <!-- Small card (clickable) -->
    <div class="coffee-card" id="coffeeCard">
      <h3 class="coffee-card__title">Coffee × Mood</h3>
      <p class="coffee-card__subtitle">Interactive mood tracker</p>
      <div class="coffee-card__preview">
        <div class="coffee-icon">☕</div>
        <div class="click-hint">Click to explore</div>
      </div>
    </div>

    <!-- Modal overlay (unchanged size) -->
    <div class="modal-overlay" id="modalOverlay" aria-hidden="true">
      <div class="coffee-modal" role="dialog" aria-modal="true" aria-label="Coffee mood modal">
        <button class="modal-close" id="modalClose" type="button" aria-label="Close">×</button>

        <h2 class="modal-title">Coffee × Shifa's Mood</h2>
        <p class="modal-subtitle">Click the cup to pour coffee and watch the mood improve ☕</p>

        <div class="coffee-content">
          <div class="coffee-cup-container">
            <div class="coffee-cup" id="coffeeCup" title="Click to pour coffee">
              <div class="steam" id="steam">
                <div class="steam-line"></div>
                <div class="steam-line"></div>
                <div class="steam-line"></div>
              </div>

              <div class="cup-body">
                <div class="cup-logo-container">
                  <div class="cup-logo cup-logo-brown">NESCAFÉ</div>
                  <div class="cup-logo cup-logo-cream" id="cupLogoCream">NESCAFÉ</div>
                </div>
                <div class="coffee-fill" id="coffeeFill"></div>
              </div>

              <div class="cup-handle"></div>
            </div>

            <div class="coffee-counter" id="coffeeCounter">0 cups</div>
            <button class="reset-btn" id="resetBtn" type="button">Reset</button>
          </div>

          <div class="mood-photo-container">
            <div class="mood-photo" id="moodPhoto"></div>
            <div class="mood-label" id="moodLabel">Mood: Sleepy &amp; Grumpy</div>
          </div>
        </div>
      </div>
    </div>
  `;

  mountTarget.appendChild(root);

  const coffeeCard   = root.querySelector("#coffeeCard");
  const modalOverlay = root.querySelector("#modalOverlay");
  const modalClose   = root.querySelector("#modalClose");

  const coffeeCup    = root.querySelector("#coffeeCup");
  const coffeeFill   = root.querySelector("#coffeeFill");
  const cupLogoCream = root.querySelector("#cupLogoCream");

  const coffeeCounter= root.querySelector("#coffeeCounter");
  const moodPhoto    = root.querySelector("#moodPhoto");
  const moodLabel    = root.querySelector("#moodLabel");
  const resetBtn     = root.querySelector("#resetBtn");
  const steam        = root.querySelector("#steam");

  let cupLevel = 0;
  const maxLevel = 5;

  // UPDATED: real media in this order:
  // 1 -> C1.png
  // 2 -> C2.png
  // 3 -> C3.gif
  // 4 -> C4.gif
  // 5 -> C5.jpg
  const moodStates = [
    { level: 0, fill: 0,   mood: "Sleepy & Grumpy",     photo: null,     placeholder: "Level 0: Pre-coffee mood" },
    { level: 1, fill: 20,  mood: "Slightly Awake",      photo: "C1.png", placeholder: "" },
    { level: 2, fill: 40,  mood: "Getting Better",      photo: "C2.png", placeholder: "" },
    { level: 3, fill: 60,  mood: "Energized",           photo: "C3.gif", placeholder: "" },
    { level: 4, fill: 80,  mood: "Happy & Productive",  photo: "C4.gif", placeholder: "" },
    { level: 5, fill: 100, mood: "Caffeinated Bliss ✨", photo: "C5.jpg", placeholder: "" },
  ];

  function openModal() {
    modalOverlay.classList.add("active");
    modalOverlay.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    modalOverlay.classList.remove("active");
    modalOverlay.setAttribute("aria-hidden", "true");
  }

  coffeeCard.addEventListener("click", openModal);
  modalClose.addEventListener("click", closeModal);

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("active")) closeModal();
  });

  coffeeCup.addEventListener("click", () => {
    if (cupLevel < maxLevel) {
      cupLevel++;
      updateCoffeeState();
    }
  });

  resetBtn.addEventListener("click", () => {
    cupLevel = 0;
    updateCoffeeState();
  });

  function updateCoffeeState() {
    const state = moodStates[cupLevel];

    coffeeFill.style.height = `${state.fill}%`;

    const clipRight = 100 - state.fill;
    cupLogoCream.style.clipPath = `inset(0 ${clipRight}% 0 0)`;

    coffeeCounter.textContent = `${cupLevel} cup${cupLevel !== 1 ? "s" : ""}`;
    moodLabel.textContent = `Mood: ${state.mood}`;

    if (state.photo) {
      moodPhoto.innerHTML = `<img src="${state.photo}" alt="Shifa mood level ${cupLevel}">`;
    } else {
      moodPhoto.innerHTML = `
        <div class="photo-placeholder">
          <div class="photo-placeholder-icon">📷</div>
          <div>Insert Shifa's photo here<br/>(${state.placeholder})</div>
        </div>
      `;
    }

    steam.classList.toggle("active", cupLevel >= 3);
  }

  updateCoffeeState();

  return {
    root,
    destroy() {
      root.remove();
    },
  };
}
