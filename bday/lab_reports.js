// lab_reports.js
export function mountLabReportsWidget(container) {
  container.innerHTML = `
    <style>
      .labs-card, .labs-card * { box-sizing: border-box; }

      .labs-card{
        width:100%;
        height:100%;
        background:#FFFBF5;
        border:1px solid #D4B896;
        border-radius:16px;
        box-shadow:0 18px 40px rgba(62,39,35,.14);
        padding:16px 16px 14px;
        display:flex;
        flex-direction:column;
        overflow:hidden;
        position:relative;
        user-select:none;
      }

      .labs-head{
        display:flex;
        align-items:flex-start;
        justify-content:space-between;
        gap:12px;
        margin-bottom:10px;
      }

      .labs-title{
        margin:0;
        font-size:14px;
        font-weight:800;
        letter-spacing:.6px;
        text-transform:uppercase;
        color:#6F4E37;
        line-height:1.15;
      }

      .labs-sub{
        margin:4px 0 0;
        font-size:12px;
        color:#A67C52;
      }

      .labs-nav{ display:flex; gap:8px; align-items:center; }

      .labs-btn{
        width:34px; height:34px;
        border-radius:999px;
        border:2px solid rgba(111,78,55,.35);
        background:rgba(255,255,255,.55);
        color:#6F4E37;
        display:grid;
        place-items:center;
        cursor:pointer;
        transition:transform .12s ease, background .12s ease;
      }
      .labs-btn:hover{ transform:translateY(-1px); background:#fff; }
      .labs-btn:active{ transform:translateY(0px); }

      .labs-viewport{
        flex:1;
        position:relative;
        overflow:hidden;
        border-radius:14px;
        border:1px solid rgba(212,184,150,.7);
        background:rgba(245,230,211,.55);
        display:flex;
        flex-direction:column;
        min-height:0;
      }

      /* top 50% */
      .labs-top{
        flex:1 1 50%;
        min-height:0;
        position:relative;
        overflow:hidden;
        border-bottom:1px solid rgba(212,184,150,.65);
      }

      .labs-track{
        height:100%;
        display:flex;
        transition:transform .35s cubic-bezier(.2,.7,.2,1);
        will-change:transform;
      }

      /* bottom 50% */
      .labs-bottom{
        flex:1 1 50%;
        min-height:0;
        padding:12px;
        display:flex;
      }

      .labs-detail{
        width:100%;
        background:rgba(255,255,255,.60);
        border:1px solid rgba(212,184,150,.80);
        border-radius:12px;
        padding:12px;
        box-shadow:0 10px 28px rgba(62,39,35,.10);
        display:flex;
        flex-direction:column;
        justify-content:space-between;
        gap:8px;
      }

      .labs-detail h5{
        margin:0;
        font-size:12px;
        letter-spacing:.5px;
        text-transform:uppercase;
        color:#6F4E37;
      }
      .labs-detail p{
        margin:0;
        font-size:12px;
        color:#3E2723;
        line-height:1.25;
        font-weight:650;
      }

      .labs-detail-footer{
        display:flex;
        align-items:center;
        justify-content:space-between;
        gap:10px;
      }

      .labs-detail .muted{
        color:#A67C52;
        font-size:11px;
        font-weight:800;
      }

      /* NEW: left tools (Reset / Undo) */
      .labs-tools{
        display:flex;
        align-items:center;
        gap:10px;
      }

      .labs-tool-btn{
        border:0;
        background:transparent;
        padding:0;
        color:#6F4E37;
        font-weight:900;
        font-size:11px;
        text-transform:uppercase;
        letter-spacing:.4px;
        cursor:pointer;
        text-decoration:underline;
        text-underline-offset:2px;
      }
      .labs-tool-btn:hover{ color:#3E2723; }
      .labs-tool-btn:disabled{
        opacity:.45;
        cursor:not-allowed;
        text-decoration:none;
      }

      /* goals link lower-right */
      .labs-goals-link{
        border:0;
        background:transparent;
        padding:0;
        color:#6F4E37;
        font-weight:900;
        font-size:11px;
        text-transform:uppercase;
        letter-spacing:.4px;
        cursor:pointer;
        text-decoration:underline;
        text-underline-offset:2px;
      }
      .labs-goals-link:hover{ color:#3E2723; }

      .labs-slide{
        width:100%;
        flex:0 0 100%;
        padding:14px 14px 12px;
        display:flex;
        flex-direction:column;
        gap:10px;
        height:100%;
      }

      .labs-slide-title{
        display:flex;
        justify-content:space-between;
        align-items:flex-end;
        gap:12px;
      }

      .labs-slide-title h4{
        margin:0;
        font-size:13px;
        font-weight:800;
        color:#3E2723;
        letter-spacing:.2px;
      }

      .labs-slide-title span{
        font-size:12px;
        color:#A67C52;
        font-weight:700;
      }

      .labs-rings{
        display:grid;
        grid-template-columns: 1fr 1fr;
        gap:14px;
        align-items:start;
        margin-top:2px;
      }

      .ring{
        background:rgba(255,255,255,.55);
        border:1px solid rgba(212,184,150,.75);
        border-radius:14px;
        padding:12px 10px 12px;
        display:flex;
        flex-direction:column;
        align-items:center;
        gap:0px;
        transition:opacity .18s ease, transform .18s ease, box-shadow .18s ease;
        position:relative;
        outline:none;
        cursor:pointer;
        touch-action: manipulation;
      }
      .ring.is-dim{ opacity:.45; }
      .ring.is-focus{
        box-shadow:0 18px 34px rgba(62,39,35,.16);
        transform:translateY(-1px);
      }

      .ring svg{ width:108px; height:108px; display:block; overflow:visible; }

      .ring .track{
        stroke:rgba(111,78,55,.18);
        stroke-width:12;
        fill:none;
      }

      /* base lap 0..1 */
      .ring .prog{
        stroke:#6F4E37;
        stroke-width:12;
        fill:none;
        stroke-linecap:round;
        filter: drop-shadow(0 8px 14px rgba(111,78,55,.25));
      }

      /* overflow lap 1..2 as separate stroke */
      .ring .over{
        stroke:#6F4E37;
        stroke-width:7;
        fill:none;
        stroke-linecap:round;
        opacity:0;
        filter: drop-shadow(0 6px 12px rgba(111,78,55,.22));
      }

      .ring .center{
        font-size:15px;
        font-weight:950;
        fill:#3E2723;
      }

      .labs-dots{
        display:flex;
        justify-content:center;
        gap:7px;
        margin-top:10px;
      }

      .labs-dot{
        width:8px; height:8px;
        border-radius:999px;
        border:2px solid rgba(111,78,55,.35);
        background:transparent;
        cursor:pointer;
      }
      .labs-dot.is-on{ background:rgba(111,78,55,.55); }

      /* Goals dialog */
      .labs-dialog{
        border:1px solid rgba(212,184,150,.95);
        border-radius:14px;
        padding:14px;
        background:rgba(255,251,245,.98);
        box-shadow:0 24px 60px rgba(62,39,35,.20);
        max-width:540px;
        width:calc(100vw - 40px);
      }
      .labs-dialog::backdrop{
        background:rgba(62,39,35,.25);
        backdrop-filter: blur(2px);
      }
      .labs-dialog h4{
        margin:0 0 10px;
        font-size:12px;
        letter-spacing:.5px;
        text-transform:uppercase;
        color:#6F4E37;
      }

      /* fallback when <dialog> isn't supported and we set [open] */
      dialog[open]{
        position:fixed;
        inset:auto;
        left:50%;
        top:50%;
        transform:translate(-50%,-50%);
        z-index:9999;
      }

      .goal-grid{
        display:flex;
        flex-direction:column;
        gap:10px;
        margin-top:8px;
      }

      .goal-row{
        display:grid;
        grid-template-columns: 1fr 130px 44px;
        align-items:center;
        gap:10px;
        padding:10px;
        border:1px solid rgba(212,184,150,.75);
        background:rgba(255,255,255,.65);
        border-radius:12px;
      }

      .goal-row .label{
        font-size:12px;
        font-weight:900;
        color:#3E2723;
        line-height:1.2;
      }

      .goal-row input[type="number"]{
        width:100%;
        padding:9px 10px;
        border-radius:10px;
        border:1px solid rgba(212,184,150,.95);
        outline:none;
        background:#fff;
        font-weight:900;
        color:#3E2723;
      }

      .goal-row .unit{
        font-size:12px;
        font-weight:900;
        color:#A67C52;
        text-align:right;
      }

      .goal-actions{
        display:flex;
        justify-content:flex-end;
        gap:10px;
        margin-top:12px;
      }

      .goal-btn{
        border-radius:12px;
        border:1px solid rgba(212,184,150,.95);
        background:rgba(255,255,255,.7);
        color:#6F4E37;
        font-weight:900;
        cursor:pointer;
        padding:10px 12px;
      }
      .goal-btn.primary{
        background:#6F4E37;
        color:#FFFBF5;
        border-color:#6F4E37;
      }

      @media (prefers-reduced-motion: reduce){
        .labs-track{ transition:none; }
        .ring{ transition:none; }
      }
    </style>

    <section class="labs-card" aria-label="Lab reports rings widget">
      <div class="labs-head">
        <div>
          <h3 class="labs-title">Lab reports</h3>
          <p class="labs-sub">Swipe cards • Hover rings • Double click ring to update</p>
        </div>
        <div class="labs-nav">
          <button class="labs-btn" type="button" id="labsPrev" aria-label="Previous">‹</button>
          <button class="labs-btn" type="button" id="labsNext" aria-label="Next">›</button>
        </div>
      </div>

      <div class="labs-viewport" id="labsViewport">
        <div class="labs-top" id="labsTop">
          <div class="labs-track" id="labsTrack"></div>
        </div>

        <div class="labs-bottom">
          <div class="labs-detail" aria-live="polite">
            <div>
              <h5 id="detailTitle">NOTE</h5>
              <p id="detailBody">Hover a ring to see details here.</p>
            </div>

            <div class="labs-detail-footer">
              <!-- NEW: buttons to the left of Goals -->
              <div class="labs-tools">
                <button class="labs-tool-btn" type="button" id="resetAll">Reset</button>
                <button class="labs-tool-btn" type="button" id="undoBtn">Undo</button>
              </div>

              <div>
                <span class="muted" id="detailMeta">—</span>
                &nbsp;•&nbsp;
                <button class="labs-goals-link" type="button" id="openGoals">Goals</button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div class="labs-dots" id="labsDots" aria-label="Slides"></div>

      <dialog class="labs-dialog" id="goalsDialog" aria-label="Goals dialog">
        <div>
          <h4>Goals</h4>
          <div class="goal-grid" id="goalGrid"></div>
          <div class="goal-actions">
            <button class="goal-btn" type="button" id="goalCancel">Cancel</button>
            <button class="goal-btn primary" type="button" id="goalSave">Save</button>
          </div>
        </div>
      </dialog>
    </section>
  `;

  const ringOrder = [
    { key:"steps",  label:"No. of steps during the day",            unit:"steps", goalDefault: 10000, min: 1,  step: 1,   integerOnly:true,  color:"#6F4E37" },
    { key:"water",  label:"No. of litres of water in the day",      unit:"L",     goalDefault: 2,     min: 0,  step: 0.1, integerOnly:false, color:"#A67C52" },
    { key:"acne",   label:"No. of times acne checked in the day",   unit:"times", goalDefault: 100,   min: 0,  step: 1,   integerOnly:true,  color:"#6F4E37" },
    { key:"bloated",label:"No. of times felt bloated",              unit:"times", goalDefault: 50,    min: 0,  step: 1,   integerOnly:true,  color:"#A67C52" },
    { key:"pretty", label:"No. of times felt pretty",               unit:"times", goalDefault: 25,    min: 25, step: 1,   integerOnly:true,  color:"#6F4E37",
      minMsg:`someone great once said: Who says you are not perfect?` },
    { key:"snowy",  label:"No. of times ignored by snowy",          unit:"times", goalDefault: 30,    min: 0,  step: 1,   integerOnly:true,  color:"#A67C52" },
    { key:"sleepy", label:"No. of times felt sleepy",               unit:"times", goalDefault: 50,    min: 0,  step: 1,   integerOnly:true,  color:"#6F4E37" },
    { key:"hungry", label:"No. of times felt hungry",               unit:"times", goalDefault: 50,    min: 0,  step: 1,   integerOnly:true,  color:"#A67C52" },
    { key:"amongus",label:"No. of hours played among us",           unit:"hrs",   goalDefault: 1,     min: 0,  step: 1,   integerOnly:true,  color:"#6F4E37" },
  ];

  const completedDefaults = {
    steps: 27500,
    water: 2.2,
    acne: 4,
    bloated: 3,
    pretty: 25,
    snowy: 11,
    sleepy: 3,
    hungry: 6,
    amongus: 7,
  };

  const LS_GOAL = "labs_goal_v4_";
  const LS_DONE = "labs_done_v4_";

  function loadNum(key, fallback) {
    const raw = localStorage.getItem(key); // [web:353]
    if (raw == null) return fallback;
    const n = Number(raw);
    return Number.isFinite(n) ? n : fallback;
  }
  function saveNum(key, value) { localStorage.setItem(key, String(value)); } // [web:242]

  const goals = {};
  const done = {};
  ringOrder.forEach(r => {
    goals[r.key] = loadNum(LS_GOAL + r.key, r.goalDefault);
    done[r.key] = loadNum(LS_DONE + r.key, completedDefaults[r.key] ?? 0);
  });

  // Undo history (max 22)
  const HISTORY_MAX = 22;
  const history = []; // each entry: { changes: [{store:"done"|"goals", key, prev, next}] }

  function pushHistory(changes) {
    if (!changes || changes.length === 0) return;
    history.push({ changes });
    if (history.length > HISTORY_MAX) history.shift();
    updateUndoUI();
  }

  const slides = [];
  for (let i = 0; i < ringOrder.length; i += 2) {
    slides.push({
      title: "Labs",
      meta: "2 rings • daily",
      ringKeys: ringOrder.slice(i, i + 2).map(x => x.key),
    });
  }

  const track = container.querySelector("#labsTrack");
  const dots = container.querySelector("#labsDots");
  const topSwipe = container.querySelector("#labsTop");

  const detailTitle = container.querySelector("#detailTitle");
  const detailBody = container.querySelector("#detailBody");
  const detailMeta = container.querySelector("#detailMeta");

  const openGoalsBtn = container.querySelector("#openGoals");
  const goalsDialog = container.querySelector("#goalsDialog");
  const goalGrid = container.querySelector("#goalGrid");
  const goalCancel = container.querySelector("#goalCancel");
  const goalSave = container.querySelector("#goalSave");

  const resetAllBtn = container.querySelector("#resetAll");
  const undoBtn = container.querySelector("#undoBtn");

  let index = 0;
  let activeKey = ringOrder[0].key;

  function updateUndoUI() {
    undoBtn.disabled = history.length === 0;
  }

  function clamp(i) {
    const n = slides.length;
    return (i % n + n) % n;
  }

  function metaFor(key) { return ringOrder.find(x => x.key === key); }

  function fmtDone(key) {
    const meta = metaFor(key);
    const v = Number(done[key] || 0);
    return meta?.key === "water" ? String(Math.round(v * 10) / 10) : String(Math.round(v));
  }

  function fmtGoal(key) {
    const meta = metaFor(key);
    const g = Number(goals[key] || 0);
    return meta?.key === "water" ? String(Math.round(g * 10) / 10) : String(Math.round(g));
  }

  // steps ring-only formatting
  function fmtStepsK(n) {
    const v = Number(n || 0) / 1000;
    const rounded = Math.round(v * 10) / 10;
    const s = String(rounded);
    return (s.endsWith(".0") ? s.slice(0, -2) : s) + "k";
  }

  function fmtRingDone(key) {
    if (key === "steps") return fmtStepsK(done[key]);
    return fmtDone(key);
  }

  function fmtRingGoal(key) {
    if (key === "steps") return fmtStepsK(goals[key]);
    return fmtGoal(key);
  }

  function setCenterText(key) {
    container.querySelectorAll(`[data-center="${key}"]`).forEach(t => {
      t.textContent = `${fmtRingDone(key)}/${fmtRingGoal(key)}`;
    });
  }

  function setAllCenterText() {
    ringOrder.forEach(r => setCenterText(r.key));
  }

  function ringHTML(key) {
    const meta = metaFor(key);
    const color = meta?.color || "#6F4E37";
    const R = 44;
    const C = 2 * Math.PI * R;

    return `
      <div class="ring" tabindex="0" role="button" aria-label="${meta?.label || key}" data-key="${key}">
        <svg viewBox="0 0 120 120" data-key="${key}">
          <g transform="translate(60 60) rotate(-90) translate(-60 -60)">
            <circle class="track" cx="60" cy="60" r="${R}"></circle>
            <circle class="prog" cx="60" cy="60" r="${R}"
              stroke="${color}"
              stroke-dasharray="${C.toFixed(2)}"
              stroke-dashoffset="${C.toFixed(2)}"></circle>
            <circle class="over" cx="60" cy="60" r="${R}"
              stroke="${color}"
              stroke-dasharray="${C.toFixed(2)}"
              stroke-dashoffset="${C.toFixed(2)}"></circle>
          </g>
          <text x="60" y="68" text-anchor="middle" class="center" data-center="${key}">
            ${fmtRingDone(key)}/${fmtRingGoal(key)}
          </text>
        </svg>
      </div>
    `;
  }

  function render() {
    track.innerHTML = slides.map((s, si) => `
      <div class="labs-slide" data-slide="${si}">
        <div class="labs-slide-title">
          <h4>${s.title}</h4>
          <span>${s.meta}</span>
        </div>
        <div class="labs-rings">
          ${s.ringKeys.map(k => ringHTML(k)).join("")}
        </div>
      </div>
    `).join("");

    dots.innerHTML = slides
      .map((_, i) => `<button class="labs-dot ${i===0?"is-on":""}" type="button" aria-label="Go to slide ${i+1}"></button>`)
      .join("");

    bindRingEvents();
    [...dots.children].forEach((d, i) => d.addEventListener("click", () => setIndex(i)));
  }

  function setIndex(next) {
    index = clamp(next);
    track.style.transform = `translateX(${-index * 100}%)`;
    [...dots.children].forEach((d, i) => d.classList.toggle("is-on", i === index));
    animateSlide(index);

    const slideEl = track.querySelector(`.labs-slide[data-slide="${index}"]`);
    const firstRing = slideEl?.querySelector(".ring");
    if (firstRing) {
      activeKey = firstRing.dataset.key;
      updateDetail(activeKey);
    }
  }

  function updateDetail(key) {
    const meta = metaFor(key);
    detailTitle.textContent = (meta?.label || key).toUpperCase();
    detailBody.textContent = `Completed ${fmtDone(key)}/${fmtGoal(key)} ${meta?.unit ? "(" + meta.unit + ")" : ""}.`;
    detailMeta.textContent = `Double click ring to +${key === "steps" ? "200" : "1"}.`;
  }

  function bindRingEvents() {
    container.querySelectorAll(".ring").forEach(ringEl => {
      const key = ringEl.dataset.key;

      ringEl.addEventListener("pointerenter", () => {
        const sibs = ringEl.parentElement.querySelectorAll(".ring");
        sibs.forEach(s => s.classList.toggle("is-dim", s !== ringEl));
        ringEl.classList.add("is-focus");
        activeKey = key;
        updateDetail(key);
      });

      ringEl.addEventListener("pointerleave", () => {
        const sibs = ringEl.parentElement.querySelectorAll(".ring");
        sibs.forEach(s => s.classList.remove("is-dim"));
        ringEl.classList.remove("is-focus");
      });

      ringEl.addEventListener("focus", () => {
        const sibs = ringEl.parentElement.querySelectorAll(".ring");
        sibs.forEach(s => s.classList.toggle("is-dim", s !== ringEl));
        ringEl.classList.add("is-focus");
        activeKey = key;
        updateDetail(key);
      });

      ringEl.addEventListener("blur", () => {
        const sibs = ringEl.parentElement.querySelectorAll(".ring");
        sibs.forEach(s => s.classList.remove("is-dim"));
        ringEl.classList.remove("is-focus");
      });

      ringEl.addEventListener("dblclick", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const inc = key === "steps" ? 200 : 1;
        const prev = Number(done[key]) || 0;
        const next = prev + inc;

        done[key] = next;
        saveNum(LS_DONE + key, done[key]);

        pushHistory([{ store: "done", key, prev, next }]);

        setCenterText(key);
        updateDetail(key);
        animateSlide(index);
      });
    });
  }

  container.querySelector("#labsPrev").addEventListener("click", () => setIndex(index - 1));
  container.querySelector("#labsNext").addEventListener("click", () => setIndex(index + 1));

  // Swipe (guarded pointer capture)
  let startX = null;

  topSwipe.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".ring, button, input, dialog")) return;
    startX = e.clientX;
    topSwipe.setPointerCapture?.(e.pointerId);
  });

  topSwipe.addEventListener("pointerup", (e) => {
    try { topSwipe.releasePointerCapture?.(e.pointerId); } catch {}
    if (startX == null) return;

    const dx = e.clientX - startX;
    startX = null;

    if (Math.abs(dx) < 40) return;
    if (dx < 0) setIndex(index + 1);
    else setIndex(index - 1);
  });

  topSwipe.addEventListener("pointercancel", (e) => {
    try { topSwipe.releasePointerCapture?.(e.pointerId); } catch {}
    startX = null;
  });

  // Ring animation (base + overflow)
  const running = new Map();

  function cancelAnim(svg) {
    const prev = running.get(svg);
    if (prev) cancelAnimationFrame(prev);
    running.delete(svg);
  }

  function animateRing(svg, durationMs = 820) {
    const key = svg.dataset.key;
    const prog = svg.querySelector(".prog");
    const over = svg.querySelector(".over");
    if (!prog || !over) return;

    const value = Number(done[key] || 0);
    const goal = Math.max(0.0001, Number(goals[key] || 1));
    const loopsTarget = Math.max(0, value / goal);

    const r = Number(prog.getAttribute("r") || 44);
    const C = 2 * Math.PI * r;

    cancelAnim(svg);

    const t0 = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);

    const tick = (t) => {
      const p = Math.min(1, (t - t0) / durationMs);
      const eased = ease(p);
      const current = loopsTarget * eased;

      const base = Math.min(1, current);
      const overflow = Math.min(1, Math.max(0, current - 1));

      prog.style.strokeDasharray = `${C.toFixed(2)}`;
      prog.style.strokeDashoffset = `${(C * (1 - base)).toFixed(2)}`;

      if (loopsTarget > 1) {
        over.style.opacity = "0.95";
        over.style.strokeDasharray = `${C.toFixed(2)}`;
        over.style.strokeDashoffset = `${(C * (1 - overflow)).toFixed(2)}`;
      } else {
        over.style.opacity = "0";
        over.style.strokeDashoffset = `${C.toFixed(2)}`;
      }

      if (p < 1) {
        const raf = requestAnimationFrame(tick);
        running.set(svg, raf);
      } else {
        running.delete(svg);
      }
    };

    const raf = requestAnimationFrame(tick);
    running.set(svg, raf);
  }

  function animateSlide(i) {
    const slideEl = track.querySelector(`.labs-slide[data-slide="${i}"]`);
    if (!slideEl) return;
    slideEl.querySelectorAll("svg").forEach((svg, k) => {
      setTimeout(() => animateRing(svg, 800 + k * 90), 30 + k * 60);
    });
  }

  // Goals popup
  function buildGoalPopup() {
    goalGrid.innerHTML = ringOrder.map(r => {
      const val = goals[r.key];
      return `
        <div class="goal-row" data-goalrow="${r.key}">
          <div class="label">${r.label}</div>
          <input
            type="number"
            inputmode="decimal"
            id="goal_${r.key}"
            data-key="${r.key}"
            value="${val}"
            min="${r.min}"
            step="${r.step}"
          />
          <div class="unit">${r.unit}</div>
        </div>
      `;
    }).join("");

    goalGrid.querySelectorAll('input[type="number"]').forEach(inp => {
      inp.addEventListener("input", () => {
        const key = inp.dataset.key;
        const meta = metaFor(key);
        if (!meta) return;

        const raw = inp.value;
        const n = Number(raw);

        if (key === "steps") {
          const ok = Number.isFinite(n) && Number.isInteger(n) && n > 0;
          if (raw !== "" && !ok) alert("wrong value");
          return;
        }

        if (key === "pretty") {
          if (Number.isFinite(n) && n < meta.min) {
            alert(meta.minMsg);
            inp.value = String(meta.min);
          }
        }
      });
    });
  }

  function openGoals() {
    buildGoalPopup();
    if (typeof goalsDialog.showModal === "function") goalsDialog.showModal();
    else goalsDialog.setAttribute("open", "");
  }

  function closeGoals() {
    if (typeof goalsDialog.close === "function") goalsDialog.close();
    else goalsDialog.removeAttribute("open");
  }

  openGoalsBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    openGoals();
  });

  goalCancel.addEventListener("click", () => closeGoals());

  goalSave.addEventListener("click", () => {
    const changes = [];

    for (const meta of ringOrder) {
      const inp = goalGrid.querySelector(`#goal_${meta.key}`);
      if (!inp) continue;

      const n = Number(inp.value);

      if (meta.key === "steps") {
        const ok = Number.isFinite(n) && Number.isInteger(n) && n > 0;
        if (!ok) { alert("wrong value"); return; }
      }

      if (!Number.isFinite(n)) return;

      if (meta.key === "pretty" && n < meta.min) {
        alert(meta.minMsg);
        inp.value = String(meta.min);
        return;
      }

      const prev = Number(goals[meta.key]);
      const next = n;

      if (prev !== next) {
        goals[meta.key] = next;
        saveNum(LS_GOAL + meta.key, next);
        changes.push({ store: "goals", key: meta.key, prev, next });
      }
    }

    if (changes.length) pushHistory(changes);

    setAllCenterText();
    updateDetail(activeKey);
    animateSlide(index);
    closeGoals();
  });

  // Reset / Undo
  resetAllBtn.addEventListener("click", () => {
    const changes = [];
    ringOrder.forEach(r => {
      const key = r.key;
      const prev = Number(done[key]) || 0;
      const next = 0;
      if (prev !== next) {
        done[key] = next;
        saveNum(LS_DONE + key, next);
        changes.push({ store: "done", key, prev, next });
      }
    });

    if (changes.length) pushHistory(changes);

    setAllCenterText();
    updateDetail(activeKey);
    animateSlide(index);
  });

  undoBtn.addEventListener("click", () => {
    const last = history.pop();
    updateUndoUI();
    if (!last) return;

    // revert in reverse order
    for (let i = last.changes.length - 1; i >= 0; i--) {
      const c = last.changes[i];
      if (c.store === "done") {
        done[c.key] = c.prev;
        saveNum(LS_DONE + c.key, c.prev);
      } else if (c.store === "goals") {
        goals[c.key] = c.prev;
        saveNum(LS_GOAL + c.key, c.prev);
      }
    }

    setAllCenterText();
    updateDetail(activeKey);
    animateSlide(index);
  });

  // init
  render();
  setIndex(0);
  updateUndoUI();
}
