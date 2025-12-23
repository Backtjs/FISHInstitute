// pain-widget.js
export function mountPainMapWidget(container) {
  container.innerHTML = `
    <style>
      :root{
        --cream:#fffaf5;
        --latte:#f4eadf;
        --line:#d4b896;
        --mocha:#6f4e37;
        --espresso:#3e2723;
        --cocoa:#8d6e63;
        --gold: rgba(255, 193, 7, 0.45);
        --goldBorder: rgba(255, 193, 7, 0.85);
      }
      .pain-root *{ box-sizing:border-box; }


      /* Preview card sized for long dashboard tile (~460 × 180) */
      .pain-root .previewCard{
        width:100%;
        height:100%;
        min-height:183px;
        background: linear-gradient(145deg,var(--cream) 0%, var(--latte) 100%);
        border: 2px solid var(--line);
        border-radius: 18px;
        box-shadow: 0 2px 4px rgba(62,39,35,.18);
        padding: 14px 16px;
        position: relative;
        user-select:none;
        cursor:pointer;
        display:flex;
        flex-direction:column;
        justify-content:space-between;
      }
      .pain-root .row{display:flex; justify-content:space-between; gap:12px}
      .pain-root .title{font-weight:800; letter-spacing:-.02em; font-size:15px}
      .pain-root .muted{color: var(--cocoa); font-size:12px; margin-top:4px}
      .pain-root .score{font-weight:900; font-size:26px; color: var(--mocha); line-height:1}
      .pain-root .dots{display:flex; gap:8px; margin-top:10px}
      .pain-root .dot{width:8px; height:8px; border-radius:99px; background: var(--line)}
      .pain-root .dot.active{background: var(--mocha); transform: scale(1.2)}
      .pain-root .link{
        align-self:flex-end;
        font-size:12px; color:#a67c52; text-decoration:none;
        cursor:pointer;
        margin-top:6px;
      }
      .pain-root .link:hover{color:var(--mocha)}


      /* Modal overlay + modal: same as original */
      .pain-root .overlay{
        position:fixed; inset:0;
        background: rgba(62,39,35,.82);
        backdrop-filter: blur(10px);
        display:none;
        align-items:center;
        justify-content:center;
        padding: 18px;
        z-index: 50;
      }
      .pain-root .overlay.open{display:flex;}
      .pain-root .modal{
        width:min(980px, 96vw);
        height:min(720px, 90vh);
        background: linear-gradient(145deg,var(--cream) 0%, var(--latte) 100%);
        border-radius: 24px;
        border: 3px solid var(--line);
        box-shadow: 0 40px 90px rgba(0,0,0,.35);
        overflow:hidden;
        display:flex;
        flex-direction:column;
      }
      .pain-root .modalHeader{
        display:flex; align-items:center; justify-content:space-between;
        padding: 16px 18px;
      }
      .pain-root .modalHeader .h{
        font-weight:900; font-size:18px; letter-spacing:-.02em;
      }
      .pain-root .closeBtn{
        width:38px; height:38px;
        border-radius:12px;
        border: 1px solid rgba(212,184,150,.8);
        background: rgba(224,210,193,.9);
        cursor:pointer;
        color: var(--mocha);
        font-size:18px;
      }
      .pain-root .closeBtn:hover{background: rgba(212,184,150,.95); transform: scale(1.03);}


      .pain-root .mapWrap{flex:1; padding: 14px 18px 18px; overflow:hidden;}
      .pain-root .twoUp{
        height:100%;
        display:grid;
        grid-template-columns: 1fr 1fr;
        gap: 18px;
        align-items: stretch;
      }
      .pain-root .panel{
        border-radius: 18px;
        border: 1px solid rgba(212,184,150,.7);
        background: rgba(255,255,255,.55);
        overflow:hidden;
        display:flex;
        flex-direction:column;
      }
      .pain-root .panelLabel{
        padding: 10px 12px;
        font-size:12px;
        font-weight:800;
        border-bottom: 1px solid rgba(212,184,150,.55);
        background: rgba(255,250,245,.75);
      }
      .pain-root .stage{
        flex:1;
        display:flex;
        align-items:center;
        justify-content:center;
        padding: 10px;
      }


      .pain-root svg.bodySVG{width:100%; height:100%; display:block;}


      .pain-root .hotspot{
        fill: none;
        stroke: none;
        pointer-events: all;
        cursor: crosshair;
        transition: 140ms ease;
      }
      .pain-root .hotspot:hover{

      }


      /* UPDATED: larger tooltip box */
      .pain-root .tip{
        position: fixed;
        z-index: 99;
        min-width: 260px;
        max-width: 380px;
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
      .pain-root .tip.on{opacity:1; transform: translateY(0);}
      .pain-root .tip .big{font-size:22px; font-weight:900; line-height:1; margin-bottom:4px;}
      .pain-root .tip .small{font-size:12px; opacity:.9; line-height:1.25}
      .pain-root .tip .sub{font-size:11px; opacity:.75; margin-top:6px; line-height:1.25;}


      @media (max-width: 820px){
        .pain-root .twoUp{grid-template-columns:1fr;}
      }
    </style>


    <div class="pain-root">
      <!-- Preview widget -->
      <div class="previewCard" id="previewCard" role="button" aria-label="Open detailed pain analysis">
        <div class="row">
          <div>
            <div class="title">Pain assessment</div>
            <div class="muted" id="previewLoc">Lower back</div>
          </div>
          <div class="score" id="previewScore">7/10</div>
        </div>
        <div class="dots" id="dots"></div>
        <a class="link" href="#" id="openLink">Click here for detailed analysis →</a>
      </div>


      <!-- Modal -->
      <div class="overlay" id="overlay">
        <div class="modal">
          <div class="modalHeader">
            <div class="h">Detailed pain map</div>
            <button class="closeBtn" id="closeBtn">×</button>
          </div>
          <div class="mapWrap">
            <div class="twoUp">
              <!-- FRONT PANEL -->
              <div class="panel">
                <div class="panelLabel">Front view</div>
                <div class="stage">
                  <svg class="bodySVG"
                       viewBox="0 0 360 658"
                       preserveAspectRatio="xMidYMid meet"
                       xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(0,658) scale(0.1,-0.1)" fill="#000000" stroke="none">
                      <path d="M1774 5859 c-45 -13 -125 -88 -153 -144 -49 -99 -72 -209 -80 -390
-7 -153 -10 -176 -34 -229 -15 -32 -27 -67 -27 -77 0 -21 -32 -45 -75 -55 -60
-13 -112 -52 -136 -100 -26 -54 -34 -125 -48 -399 -11 -218 -32 -326 -90 -477
-50 -132 -54 -145 -96 -318 -41 -171 -107 -374 -133 -409 -11 -15 -40 -32 -73
-42 -30 -9 -81 -30 -114 -46 -33 -17 -71 -34 -85 -38 -40 -12 -52 -25 -39 -41
14 -17 36 -18 92 -2 24 6 52 8 61 5 15 -6 13 -12 -16 -53 -18 -26 -53 -69 -77
-96 -47 -52 -49 -78 -6 -78 40 0 64 16 140 95 39 40 97 93 131 118 70 53 81
67 118 162 15 39 68 149 118 245 175 337 191 374 207 505 14 105 60 344 70
363 11 19 81 -272 81 -333 -1 -70 -15 -123 -60 -231 -84 -197 -131 -499 -110
-719 13 -145 40 -288 85 -455 77 -286 78 -298 80 -690 1 -398 -1 -380 91 -740
37 -143 47 -200 53 -310 9 -145 5 -166 -48 -284 -25 -54 -22 -85 9 -104 22
-13 185 -33 207 -25 26 10 28 33 24 280 -2 116 -6 153 -23 200 -30 82 -34 234
-13 451 18 180 17 280 -7 449 -10 73 -8 94 12 197 24 121 24 143 1 376 -7 72
-7 144 0 230 5 69 13 202 16 297 4 130 9 173 19 177 22 8 28 -13 30 -104 0
-47 9 -178 19 -292 18 -199 18 -213 1 -376 -18 -168 -18 -169 4 -300 20 -121
21 -139 9 -224 -16 -111 -16 -340 0 -458 6 -46 11 -142 11 -212 0 -106 -4
-140 -24 -205 -21 -70 -24 -98 -25 -270 -2 -223 -1 -223 79 -218 129 9 180 30
180 74 0 10 -15 49 -32 87 -33 69 -33 69 -32 219 2 146 3 156 53 350 98 382
109 472 90 734 -17 245 -7 348 65 637 75 301 87 373 93 565 9 264 -22 464
-100 648 -80 191 -84 251 -32 445 32 122 41 145 48 135 6 -7 57 -281 72 -384
19 -133 23 -146 101 -293 157 -297 194 -371 220 -437 37 -95 47 -108 123 -167
36 -28 100 -84 141 -124 81 -78 123 -102 146 -83 21 17 17 43 -12 70 -35 33
-114 137 -114 150 0 8 13 9 43 4 74 -15 121 -12 125 7 2 11 -8 20 -35 28 -21
7 -65 26 -98 43 -33 17 -84 38 -114 46 -68 21 -82 40 -127 166 -34 96 -53 166
-109 400 -15 61 -42 144 -60 185 -65 149 -92 308 -105 602 -13 323 -24 343
-227 413 -7 2 -15 17 -19 32 -4 15 -18 55 -32 88 -22 53 -26 76 -28 195 -4
281 -78 478 -203 542 -57 30 -132 36 -197 17z"/>


                      <!-- FRONT hotspots -->
                      <circle  class="hotspot" data-part="head"       cx="1850" cy="5550" r="300" />
                      <ellipse class="hotspot" data-part="neck"       cx="1850" cy="5100" rx="270" ry="150" />
                      <ellipse class="hotspot" data-part="chest"      cx="1850" cy="4550" rx="500" ry="350" />
                      <ellipse class="hotspot" data-part="abdomen"    cx="1850" cy="3750" rx="350" ry="250" />
                      <ellipse class="hotspot" data-part="left-arm"   cx="1200" cy="4700" rx="260" ry="800" />
                      <ellipse class="hotspot" data-part="right-arm"  cx="2400" cy="4700" rx="260" ry="800" />
                      <ellipse class="hotspot" data-part="left-leg"   cx="1600" cy="3000" rx="300" ry="600" />
                      <ellipse class="hotspot" data-part="right-leg"  cx="2000" cy="3000" rx="300" ry="600" />
                      <ellipse class="hotspot" data-part="right-knee" cx="2020" cy="2200" rx="150" ry="200" />
                      <ellipse class="hotspot" data-part="left-knee"  cx="1700" cy="2200" rx="150" ry="200" />
                    </g>
                  </svg>
                </div>
              </div>


              <!-- BACK PANEL -->
              <div class="panel">
                <div class="panelLabel">Back view</div>
                <div class="stage">
                  <svg class="bodySVG"
                       viewBox="0 0 310 604"
                       preserveAspectRatio="xMidYMid meet"
                       xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(0,604) scale(0.1,-0.1)" fill="#000000" stroke="none">
                      <path d="M1512 5685 c-91 -28 -160 -101 -197 -204 -41 -117 -58 -216 -59 -351
-1 -123 -4 -142 -30 -210 -15 -41 -32 -84 -36 -96 -5 -12 -25 -25 -51 -34
-161 -50 -183 -101 -193 -441 -8 -254 -35 -405 -104 -565 -17 -40 -40 -114
-51 -165 -24 -105 -104 -428 -131 -530 -26 -98 -35 -338 -16 -411 17 -64 58
-136 82 -145 40 -15 41 70 4 149 -17 35 -19 48 -11 71 16 40 26 33 41 -27 13
-55 36 -78 52 -54 4 7 6 24 3 38 -2 14 -9 70 -15 125 -5 55 -16 120 -24 145
-7 25 -11 59 -9 77 3 18 66 155 140 305 74 150 141 293 148 318 8 25 18 86 24
135 6 50 22 145 36 213 14 68 25 132 25 143 0 35 19 20 30 -23 6 -24 20 -79
31 -122 43 -166 36 -261 -30 -408 -35 -77 -64 -174 -88 -293 -14 -71 -18 -138
-17 -320 0 -212 2 -240 27 -359 15 -71 39 -170 53 -220 74 -273 94 -454 76
-695 -18 -223 11 -434 103 -771 19 -69 29 -136 36 -245 9 -160 2 -210 -42
-297 -47 -91 -11 -121 160 -132 80 -6 81 -3 79 225 -1 167 -4 202 -22 249 -26
72 -34 273 -15 425 17 145 17 324 0 460 -13 105 -13 116 9 230 23 125 23 142
0 353 -11 91 -11 142 -1 260 7 81 15 215 18 297 5 148 13 176 40 154 8 -8 12
-52 12 -151 1 -76 3 -142 5 -146 2 -4 9 -75 16 -157 9 -119 8 -173 -2 -260
-17 -149 -16 -282 4 -392 15 -82 15 -103 3 -210 -19 -154 -18 -232 1 -410 21
-196 16 -365 -15 -448 -21 -55 -23 -75 -21 -253 1 -107 4 -200 6 -207 9 -22
25 -23 120 -14 78 8 92 12 112 35 13 15 21 34 18 43 -2 9 -21 57 -40 106 l-35
91 9 139 c7 118 15 167 54 310 91 341 90 335 91 740 1 395 -1 371 74 667 80
314 86 350 85 593 0 282 -17 375 -111 614 -62 158 -66 222 -25 391 36 148 48
181 55 160 8 -22 64 -345 72 -410 10 -85 24 -118 180 -423 80 -157 145 -294
145 -305 0 -11 -9 -48 -20 -82 -11 -34 -20 -88 -20 -119 -1 -31 -5 -76 -10
-101 -16 -84 24 -108 48 -29 8 24 16 50 18 58 3 11 7 11 19 1 21 -17 19 -53
-5 -97 -21 -39 -28 -137 -11 -148 39 -23 133 203 116 278 -3 12 -9 76 -15 142
-5 66 -18 147 -29 180 -40 124 -80 275 -110 413 -17 79 -47 182 -67 230 -78
186 -100 307 -114 607 -14 328 -35 373 -193 415 -38 10 -48 18 -53 39 -3 14
-17 55 -31 91 -23 56 -27 87 -33 225 -11 244 -56 392 -146 475 -73 67 -154 90
-232 65z"/>


                      <!-- BACK hotspots -->
                      <circle  class="hotspot" data-part="head"        cx="1550" cy="5350" r="300" />
                      <ellipse class="hotspot" data-part="neck"        cx="1550" cy="4900" rx="260" ry="150" />
                      <ellipse class="hotspot" data-part="upper-back"  cx="1550" cy="4450" rx="750" ry="250" />
                      <ellipse class="hotspot" data-part="lower-back"  cx="1550" cy="3900" rx="650" ry="450" />
                      <ellipse class="hotspot" data-part="left-glute"  cx="1350" cy="3200" rx="340" ry="320" />
                      <ellipse class="hotspot" data-part="right-glute" cx="1750" cy="3200" rx="340" ry="320" />
                      <ellipse class="hotspot" data-part="left-leg"    cx="1450" cy="2400" rx="0" ry="0" />
                      <ellipse class="hotspot" data-part="right-leg"   cx="1650" cy="2400" rx="0" ry="0" />
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- Tooltip -->
      <div class="tip" id="tip">
        <div class="big" id="tipScore">—/10</div>
        <div class="small" id="tipLabel">Body part</div>
        <div class="sub" id="tipNote">Placeholder description.</div>
      </div>
    </div>
  `;


  const root = container.querySelector(".pain-root");


  // UPDATED: scores + notes as requested (everything else unchanged)
  const pain = {
    head:{
      score:6,
      label:"Head / temples",
      note:"subject takes a lot of unnecessary stress. intervention required"
    },
    neck:{
      score:7,
      label:"Neck",
      note:"subject when introduced to really emotionally draining stimuli, might have mild to severe neck and back pain"
    },
    chest:{
      score:"NA",
      label:"Chest",
      note:"we out here being respectful"
    },
    abdomen:{score:1,label:"Abdomen",note:"Placeholder."},
    "left-arm":{score:4,label:"Left arm",note:"Placeholder."},
    "right-arm":{score:6,label:"Right arm",note:"Placeholder."},

    "left-leg":{
      score:4,
      label:"Left leg",
      note:"subject has only recently started walking and hence there is some new found pain but fresh skin too"
    },
    "right-leg":{
      score:4,
      label:"Right leg",
      note:"subject has only recently started walking and hence there is some new found pain but fresh skin too"
    },

    "upper-back":{
      score:8,
      label:"Upper back",
      note:"more affected than the neck when subject is drained...might need a massage to sort it out"
    },
    "lower-back":{
      score:7,
      label:"Lower back",
      note:"subject is 22 now...it obv will have lower back pain"
    },

    "left-glute":{
      score:1,
      label:"Left glute",
      note:"subject used to roam around naked; has enough exposure to sunlight; no intervention required"
    },
    "right-glute":{
      score:1,
      label:"Right glute",
      note:"subject used to roam around naked; has enough exposure to sunlight; no intervention required"
    },

    "right-knee":{
      score:8,
      label:"Right knee",
      note:"subject was multitalented and this was a result of that"
    },
    "left-knee":{
      score:2,
      label:"Left knee",
      note:"subject doesn't walk that much to have this much pain"
    },
  };


  const previewSlides = [
    {part:"lower-back"},
    {part:"right-leg"},
    {part:"right-arm"},
    {part:"neck"}
  ];


  const dotsWrap     = root.querySelector("#dots");
  const previewScore = root.querySelector("#previewScore");
  const previewLoc   = root.querySelector("#previewLoc");
  let slide = 0;


  function setPreview(i){
    slide = i;
    [...dotsWrap.children].forEach((d, idx)=>d.classList.toggle("active", idx===i));
    const part = previewSlides[i].part;
    const d = pain[part];
    if(!d) return;
    previewScore.textContent = d.score + "/10";
    previewLoc.textContent = d.label;
    previewScore.style.transform = "scale(0.96)";
    setTimeout(()=> previewScore.style.transform = "scale(1)", 120);
  }


  previewSlides.forEach((_, i)=>{
    const dot = document.createElement("div");
    dot.className = "dot" + (i===0 ? " active" : "");
    dot.addEventListener("click",(e)=>{e.stopPropagation(); setPreview(i);});
    dotsWrap.appendChild(dot);
  });
  setPreview(0);


  const overlay     = root.querySelector("#overlay");
  const previewCard = root.querySelector("#previewCard");
  const openLink    = root.querySelector("#openLink");
  const closeBtn    = root.querySelector("#closeBtn");


  function openModal(){
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeModal(){
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    hideTip();
  }


  previewCard.addEventListener("click", openModal);
  openLink.addEventListener("click", e=>{e.preventDefault(); openModal();});
  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", e=>{if(e.target===overlay) closeModal();});
  document.addEventListener("keydown", e=>{if(e.key==="Escape" && overlay.classList.contains("open")) closeModal();});


  const tip      = root.querySelector("#tip");
  const tipScore = root.querySelector("#tipScore");
  const tipLabel = root.querySelector("#tipLabel");
  const tipNote  = root.querySelector("#tipNote");
  let tipOn = false;


  function showTip(part, clientX, clientY){
    const d = pain[part];
    if(!d) return;
    tipScore.textContent = d.score + "/10";
    tipLabel.textContent = d.label;
    tipNote.textContent  = d.note;


    /* UPDATED: larger clamp size to match the larger tooltip box */
    const w = 380, h = 180;
    const x = Math.max(12, Math.min(window.innerWidth - w - 12, clientX + 14));
    const y = Math.max(12, Math.min(window.innerHeight - h - 12, clientY - 18));
    tip.style.left = x + "px";
    tip.style.top  = y + "px";


    if(!tipOn){tip.classList.add("on"); tipOn = true;}
  }
  function hideTip(){
    tip.classList.remove("on");
    tipOn = false;
  }


  root.querySelectorAll(".hotspot").forEach(el=>{
    el.addEventListener("mouseenter", e=>{
      const part = el.getAttribute("data-part");
      showTip(part, e.clientX, e.clientY);
    });
    el.addEventListener("mousemove", e=>{
      const part = el.getAttribute("data-part");
      showTip(part, e.clientX, e.clientY);
    });
    el.addEventListener("mouseleave", hideTip);
  });
}
