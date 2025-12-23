// pain-map.js
// Pain Map Widget (SVG Hotspots) converted from your HTML with minimal tweaks.

export function mountPainMapWidget(mountTarget = document.body) {
  const root = document.createElement("div");

  // Minimal tweak: scope the old `body { ... }` styles into a local host container
  // so mounting doesn't overwrite the entire app/page layout.
  root.innerHTML = `
    <style>
      :root{
        --cream:#fffaf5;
        --latte:#f4eadf;
        --mocha:#6f4e37;
        --espresso:#3e2723;
        --cocoa:#8d6e63;
        --gold: rgba(255, 193, 7, 0.55);
        --goldBorder: rgba(255, 193, 7, 0.85);
      }
      *{box-sizing:border-box}

      .pain-host{
        margin:0; padding:40px;
        font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
        background: linear-gradient(135deg,#f5f5f0 0%, #e8e3d8 100%);
        color: var(--espresso);
      }

      /* --- Small widget --- */
      .card{
        width: 340px;
        background: linear-gradient(145deg,var(--cream) 0%, var(--latte) 100%);
        border: 2px solid rgba(212,184,150,.9);
        border-radius: 18px;
        box-shadow: 0 20px 40px rgba(62,39,35,.18);
        padding: 18px;
        position: relative;
        user-select:none;
      }
      .card h3{margin:0 0 4px 0; font-size:15px; letter-spacing:-.02em}
      .muted{color: var(--cocoa); font-size:12px}
      .row{display:flex; align-items:flex-start; justify-content:space-between; gap:12px}
      .score{
        font-weight:800;
        font-size:26px;
        color: var(--mocha);
        line-height:1;
      }
      .dots{display:flex; gap:8px; margin-top:16px}
      .dot{
        width:8px; height:8px; border-radius:50%;
        background: rgba(212,184,150,.9);
        cursor:pointer;
      }
      .dot.active{background: var(--mocha); transform: scale(1.2)}
      .link{
        position:absolute; right:16px; bottom:12px;
        font-size:12px; color:#a67c52; text-decoration:none;
        cursor:pointer;
      }
      .link:hover{color:var(--mocha)}

      /* --- Modal --- */
      .overlay{
        position:fixed; inset:0;
        background: rgba(62,39,35,.82);
        backdrop-filter: blur(10px);
        display:none;
        align-items:center; justify-content:center;
        padding: 20px;
        z-index: 50;
      }
      .overlay.open{display:flex;}
      .modal{
        width:min(980px, 94vw);
        height:min(720px, 86vh);
        background: linear-gradient(145deg,var(--cream) 0%, var(--latte) 100%);
        border-radius: 24px;
        border: 3px solid rgba(212,184,150,.95);
        box-shadow: 0 40px 90px rgba(0,0,0,.35);
        overflow:hidden;
        display:flex;
        flex-direction:column;
      }
      .modalHeader{
        display:flex; align-items:center; justify-content:space-between;
        padding: 18px 22px;
      }
      .modalHeader .title{
        font-weight:800;
        letter-spacing:-.02em;
        font-size:18px;
      }
      .closeBtn{
        width:38px; height:38px;
        border-radius:12px;
        border: 1px solid rgba(212,184,150,.8);
        background: rgba(224,210,193,.9);
        cursor:pointer;
        color: var(--mocha);
        font-size:18px;
        line-height:0;
      }
      .closeBtn:hover{background: rgba(212,184,150,.95); transform: scale(1.03);}

      /* --- Body map area --- */
      .mapWrap{
        flex:1;
        padding: 18px 22px 24px;
        overflow:hidden;
      }
      .twoUp{
        height:100%;
        display:grid;
        grid-template-columns: 1fr 1fr;
        gap: 22px;
        align-items: stretch;
      }
      .panel{
        position:relative;
        border-radius: 18px;
        border: 1px solid rgba(212,184,150,.7);
        background: rgba(255,255,255,.55);
        overflow:hidden;
        display:flex;
        flex-direction:column;
      }
      .panelLabel{
        padding: 10px 12px;
        font-size:12px;
        color: var(--espresso);
        font-weight:700;
        border-bottom: 1px solid rgba(212,184,150,.55);
        background: rgba(255,250,245,.75);
      }
      .svgStage{
        flex:1;
        position:relative;
        display:flex;
        align-items:center;
        justify-content:center;
        padding: 10px;
      }

      /* IMPORTANT: make SVG responsive */
      svg.bodySVG{
        width: 100%;
        height: 100%;
        max-height: 540px;
        display:block;
      }

      /* Hotspots (SVG shapes) */
      .hotspot{
        fill: rgba(255,193,7,0.0);
        stroke: rgba(255,193,7,0.0);
        cursor: crosshair;
        transition: 160ms ease;
      }
      .hotspot:hover{
        fill: var(--gold);
        stroke: var(--goldBorder);
        stroke-width: 2.5;
      }

      /* Tooltip */
      .tip{
        position: fixed;
        z-index: 99;
        min-width: 210px;
        max-width: 260px;
        padding: 14px 16px;
        border-radius: 16px;
        background: linear-gradient(145deg, var(--espresso) 0%, #5d4037 100%);
        color: #fff;
        border: 2px solid rgba(255,193,7,.28);
        box-shadow: 0 18px 40px rgba(0,0,0,.35);
        pointer-events:none;
        opacity:0;
        transform: translateY(8px);
        transition: 140ms ease;
      }
      .tip.on{opacity:1; transform: translateY(0);}
      .tip .big{font-size:22px; font-weight:900; line-height:1; margin-bottom:4px;}
      .tip .small{font-size:12px; opacity:.9; line-height:1.25}
      .tip .sub{font-size:11px; opacity:.75; margin-top:6px}

      @media (max-width: 820px){
        .twoUp{grid-template-columns:1fr; }
        svg.bodySVG{max-height: 420px;}
      }
    </style>

    <div class="pain-host">
      <!-- Small preview widget -->
      <div class="card" id="previewCard" role="button" aria-label="Open detailed pain analysis">
        <div class="row">
          <div>
            <h3>Pain assessment</h3>
            <div class="muted" id="previewLoc">Lower back</div>
          </div>
          <div class="score" id="previewScore">7/10</div>
        </div>

        <div class="dots" id="dots"></div>
        <a class="link" href="#" id="openLink">Click here for detailed analysis →</a>
      </div>

      <!-- Modal -->
      <div class="overlay" id="overlay">
        <div class="modal" role="dialog" aria-modal="true" aria-label="Detailed pain assessment">
          <div class="modalHeader">
            <div class="title">Detailed pain map</div>
            <button class="closeBtn" id="closeBtn" aria-label="Close">×</button>
          </div>

          <div class="mapWrap">
            <div class="twoUp">
              <!-- Front -->
              <div class="panel">
                <div class="panelLabel">Front view</div>
                <div class="svgStage">
                  <svg class="bodySVG" viewBox="0 0 300 520" xmlns="http://www.w3.org/2000/svg">
                    <path d="M150 30c35 0 55 30 55 60 0 18-7 35-18 48v44c0 25 20 55 20 100 0 45-18 70-18 110 0 45 18 70 18 110H93c0-40 18-65 18-110 0-40-18-65-18-110 0-45 20-75 20-100v-44c-11-13-18-30-18-48 0-30 20-60 55-60z"
                          fill="#111" opacity=".9"/>

                    <circle class="hotspot" data-part="head" cx="150" cy="70" r="40"/>
                    <ellipse class="hotspot" data-part="neck" cx="150" cy="125" rx="22" ry="26"/>
                    <ellipse class="hotspot" data-part="chest" cx="150" cy="195" rx="65" ry="55"/>
                    <ellipse class="hotspot" data-part="abdomen" cx="150" cy="285" rx="70" ry="65"/>
                    <ellipse class="hotspot" data-part="left-arm" cx="85" cy="210" rx="26" ry="70"/>
                    <ellipse class="hotspot" data-part="right-arm" cx="215" cy="210" rx="26" ry="70"/>
                    <ellipse class="hotspot" data-part="left-leg" cx="130" cy="420" rx="28" ry="90"/>
                    <ellipse class="hotspot" data-part="right-leg" cx="170" cy="420" rx="28" ry="90"/>
                  </svg>
                </div>
              </div>

              <!-- Back -->
              <div class="panel">
                <div class="panelLabel">Back view</div>
                <div class="svgStage">
                  <svg class="bodySVG" viewBox="0 0 300 520" xmlns="http://www.w3.org/2000/svg">
                    <path d="M150 30c35 0 55 30 55 60 0 18-7 35-18 48v44c0 25 20 55 20 100 0 45-18 70-18 110 0 45 18 70 18 110H93c0-40 18-65 18-110 0-40-18-65-18-110 0-45 20-75 20-100v-44c-11-13-18-30-18-48 0-30 20-60 55-60z"
                          fill="#111" opacity=".9"/>

                    <circle class="hotspot" data-part="head" cx="150" cy="70" r="40"/>
                    <ellipse class="hotspot" data-part="neck" cx="150" cy="125" rx="22" ry="26"/>
                    <ellipse class="hotspot" data-part="upper-back" cx="150" cy="210" rx="80" ry="65"/>
                    <ellipse class="hotspot" data-part="lower-back" cx="150" cy="305" rx="70" ry="55"/>
                    <ellipse class="hotspot" data-part="left-glute" cx="130" cy="360" rx="35" ry="30"/>
                    <ellipse class="hotspot" data-part="right-glute" cx="170" cy="360" rx="35" ry="30"/>
                    <ellipse class="hotspot" data-part="left-leg" cx="130" cy="430" rx="28" ry="90"/>
                    <ellipse class="hotspot" data-part="right-leg" cx="170" cy="430" rx="28" ry="90"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cursor tooltip -->
      <div class="tip" id="tip">
        <div class="big" id="tipScore">—/10</div>
        <div class="small" id="tipLabel">Body part</div>
        <div class="sub" id="tipNote">Placeholder note (will be filled later)</div>
      </div>
    </div>
  `;

  mountTarget.appendChild(root);

  // ---------------- Original JS logic (scoped to this widget) ----------------

  // Placeholder pain data (swap later)
  const pain = {
    head:        { score: 3, label: "Head/temples", note: "Placeholder." },
    neck:        { score: 5, label: "Neck (cervical)", note: "Placeholder." },
    chest:       { score: 2, label: "Chest", note: "Placeholder." },
    abdomen:     { score: 1, label: "Abdomen", note: "Placeholder." },
    "left-arm":  { score: 4, label: "Left arm", note: "Placeholder." },
    "right-arm": { score: 6, label: "Right arm", note: "Placeholder." },
    "left-leg":  { score: 8, label: "Left leg", note: "Placeholder." },
    "right-leg": { score: 7, label: "Right leg", note: "Placeholder." },
    "upper-back":{ score: 4, label: "Upper back", note: "Placeholder." },
    "lower-back":{ score: 9, label: "Lower back", note: "Placeholder." },
    "left-glute":{ score: 6, label: "Left glute", note: "Placeholder." },
    "right-glute":{ score: 5, label: "Right glute", note: "Placeholder." },
  };

  // Preview carousel (simple click dots)
  const previewSlides = [
    { part: "lower-back" },
    { part: "right-leg" },
    { part: "right-arm" },
    { part: "neck" },
  ];

  const dotsWrap = root.querySelector("#dots");
  const previewScore = root.querySelector("#previewScore");
  const previewLoc = root.querySelector("#previewLoc");
  let slide = 0;

  function setPreview(i) {
    slide = i;
    [...dotsWrap.children].forEach((d, idx) =>
      d.classList.toggle("active", idx === i)
    );

    const part = previewSlides[i].part;
    const d = pain[part] || { score: "—", label: "—" };

    previewScore.textContent = `${d.score}/10`;
    previewLoc.textContent = d.label;

    previewScore.style.transform = "scale(0.96)";
    setTimeout(() => (previewScore.style.transform = "scale(1)"), 120);
  }

  previewSlides.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.addEventListener("click", (e) => {
      e.stopPropagation();
      setPreview(i);
    });
    dotsWrap.appendChild(dot);
  });
  setPreview(0);

  // Modal open/close
  const overlay = root.querySelector("#overlay");
  const openLink = root.querySelector("#openLink");
  const previewCard = root.querySelector("#previewCard");
  const closeBtn = root.querySelector("#closeBtn");

  // Tooltip
  const tip = root.querySelector("#tip");
  const tipScore = root.querySelector("#tipScore");
  const tipLabel = root.querySelector("#tipLabel");
  const tipNote = root.querySelector("#tipNote");
  let tipOn = false;

  function showTip(part, clientX, clientY) {
    const d = pain[part];
    if (!d) return;

    tipScore.textContent = `${d.score}/10`;
    tipLabel.textContent = d.label;
    tipNote.textContent = d.note;

    // Smart bounds
    const w = 260, h = 120;
    const x = Math.max(14, Math.min(window.innerWidth - w - 14, clientX + 14));
    const y = Math.max(14, Math.min(window.innerHeight - h - 14, clientY - 18));
    tip.style.left = x + "px";
    tip.style.top = y + "px";

    if (!tipOn) {
      tip.classList.add("on");
      tipOn = true;
    }
  }

  function hideTip() {
    tip.classList.remove("on");
    tipOn = false;
  }

  function openModal() {
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    hideTip();
  }

  // Listeners (store refs for cleanup)
  const onOverlayClick = (e) => { if (e.target === overlay) closeModal(); };
  const onKeyDown = (e) => { if (e.key === "Escape" && overlay.classList.contains("open")) closeModal(); };

  previewCard.addEventListener("click", openModal);
  openLink.addEventListener("click", (e) => { e.preventDefault(); openModal(); });
  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", onOverlayClick);
  document.addEventListener("keydown", onKeyDown);

  // Bind hover events to all SVG hotspots (scoped to this widget root)
  const hotspots = root.querySelectorAll(".hotspot");
  hotspots.forEach((el) => {
    el.addEventListener("mouseenter", (e) => {
      const part = el.getAttribute("data-part");
      showTip(part, e.clientX, e.clientY);
    });
    el.addEventListener("mousemove", (e) => {
      const part = el.getAttribute("data-part");
      showTip(part, e.clientX, e.clientY);
    });
    el.addEventListener("mouseleave", hideTip);
  });

  return {
    root,
    destroy() {
      // safety: ensure page scroll restored if destroyed while open
      document.body.style.overflow = "";

      document.removeEventListener("keydown", onKeyDown);
      overlay.removeEventListener("click", onOverlayClick);

      root.remove();
    },
  };
}
