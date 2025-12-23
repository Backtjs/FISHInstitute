// screen.js
export function mountScreenWidget(container) {
  container.innerHTML = `
    <style>
      .screen-card * { box-sizing: border-box; }

      .screen-card {
        background: #FFFBF5;
        border: 1px solid #D4B896;
        border-radius: 14px;
        box-shadow: 0 10px 24px rgba(62, 39, 35, 0.12);
        padding: 20px;
        max-width: 550px;
        width: 100%;
        height: 100%;
        position: relative;
        margin: 0 auto;
        display:flex;
        flex-direction:column;
        gap:16px;
      }

      .screen-card .widget__top {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .screen-card .widget__title {
        font-size: 14px;
        font-weight: 600;
        color: #6F4E37;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .screen-card .widget__nav {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 14px;
      }

      /* arrows/dots removed from DOM, but keep styles intact for everything else */

      .screen-card .chart {
        position: relative;
        padding: 10px 50px 10px 45px;
        flex:1;
      }

      .screen-card .chart__wrapper {
        position: relative;
        height: 100%;
      }

      .screen-card .chart__y-axis {
        position: absolute;
        left: -45px;
        bottom: 20px;
        top: 40px;
        display: flex;
        flex-direction: column-reverse;
        justify-content: space-between;
        font-size: 11px;
        color: #A67C52;
        font-weight: 500;
        text-align: right;
        width: 25px;
      }

      .screen-card .chart__y-label {
        position: absolute;
        left: -45px;
        top: 0;
        font-size: 12px;
        font-weight: 600;
        color: #6F4E37;
      }

      .screen-card .chart__reference {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 116px;
        border-top: 2px dashed #A67C52;
        pointer-events: none;
      }

      .screen-card .chart__reference-label {
        position: absolute;
        right: -50px;
        top: -10px;
        font-size: 10px;
        color: #A67C52;
        background: #FFFBF5;
        padding: 0 4px;
        font-weight: 500;
        white-space: nowrap;
      }

      .screen-card .chart__grid {
        display: flex;
        justify-content: space-around;
        align-items: flex-end;
        height: 240px;
        position: relative;
        bottom: -60px;
        padding-bottom: 0;
      }

      .screen-card .chart__column {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        transition: all 0.2s ease;
        flex: 0 0 70px;
      }

      .screen-card .chart__bar {
        width: 48px;
        background: #6F4E37;
        border-radius: 6px 6px 0 0;
        transition: all 0.25s ease;
        position: relative;
      }

      .screen-card .chart__column:hover .chart__bar {
        transform: scale(1.05);
        box-shadow: 0 6px 16px rgba(111, 78, 55, 0.4);
        opacity: 1;
      }

      .screen-card .chart__column:not(:hover) .chart__bar {
        opacity: 0.5;
      }

      .screen-card .chart__icon {
        margin-top: 10px;
        font-size: 24px;
        transition: all 0.2s ease;
        filter: grayscale(100%) brightness(0) saturate(100%)
          invert(30%) sepia(25%) saturate(1200%)
          hue-rotate(350deg) brightness(90%) contrast(90%);
      }

      .screen-card .chart__column:hover .chart__icon {
        transform: scale(1.1);
        opacity: 1;
      }

      .screen-card .chart__column:not(:hover) .chart__icon {
        opacity: 0.5;
      }

      /* footer strip */
      .screen-footer{
        background:#F5E6D3;
        border:1px solid #D4B896;
        border-radius:10px;
        padding:8px 14px;
        font-size:12px;
        color:#4A2C2A;
      }

      /* Tooltip */
      .screen-tooltip{
        position: fixed;
        z-index: 999;
        min-width: 220px;
        max-width: 260px;
        padding: 10px 12px;
        border-radius: 12px;
        background: #3e2723;
        color: #fff;
        border: 1px solid rgba(212,184,150,.7);
        box-shadow: 0 10px 30px rgba(0,0,0,.35);
        pointer-events: none;
        opacity: 0;
        transform: translateY(6px);
        transition: opacity .12s ease, transform .12s ease;
        font-size: 11px;
      }

      .screen-tooltip--on{
        opacity: 1;
        transform: translateY(0);
      }

      .screen-tooltip__icon{
        font-size: 18px;
        margin-bottom: 2px;
      }

      .screen-tooltip__title{
        font-weight: 700;
        font-size: 13px;
        margin-bottom: 4px;
      }

      .screen-tooltip__duration{
        font-size: 11px;
        opacity: .9;
        margin-bottom: 4px;
      }

      .screen-tooltip__note{
        font-size: 11px;
        line-height: 1.4;
        opacity: .9;
      }
    </style>

    <section class="card screen-card" aria-label="Screen time widget">
      <div class="widget__top">
        <h3 class="widget__title">Insta Screen Time Analysis</h3>
        <div class="widget__nav"></div>
      </div>

      <div class="chart">
        <div class="chart__wrapper">
          <div class="chart__y-label">Hours</div>

          <div class="chart__y-axis">
            <span>0</span>
            <span>2</span>
            <span>4</span>
            <span>6</span>
            <span>8</span>
            <span>10</span>
          </div>

          <div class="chart__reference">
            <span class="chart__reference-label">Recc.</span>
          </div>

          <div class="chart__grid" id="chartGrid"></div>
        </div>
      </div>

      <div class="screen-footer">
        This section shows how the subject utilises their time wasting capabilities in Insta reels.
      </div>
    </section>

    <div class="screen-tooltip" id="screenTooltip">
      <div class="screen-tooltip__icon" id="tooltipIcon"></div>
      <div class="screen-tooltip__title" id="tooltipTitle"></div>
      <div class="screen-tooltip__duration" id="tooltipDuration"></div>
      <div class="screen-tooltip__note" id="tooltipNote"></div>
    </div>
  `;

  const root      = container.querySelector(".screen-card");
  const chartGrid = root.querySelector("#chartGrid");

  const tooltip         = container.querySelector("#screenTooltip");
  const tooltipIcon     = container.querySelector("#tooltipIcon");
  const tooltipTitle    = container.querySelector("#tooltipTitle");
  const tooltipDuration = container.querySelector("#tooltipDuration");
  const tooltipNote     = container.querySelector("#tooltipNote");

  const chartData = [
    { icon: '🐾', value: 6.0, title: 'Cat Reels Exposure',
      note: 'Clinical note: Excessive feline content consumption detected. Dopamine dependency with high risk of procrastination.' },
    { icon: '💧', value: 0.4, title: 'Depressed Reels Exposure',
      note: 'Clinical note: Minimal engagement with melancholic content. Emotional regulation appears stable at present.' },
    { icon: '🌍', value: 4.5, title: 'Awareness Content Exposure',
      note: 'Clinical note: Subject demonstrates high social consciousness; empathy levels elevated and news anxiety within acceptable range.' },
    { icon: '🧠', value: 10.0, title: 'Brainrot Content Exposure',
      note: '⚠ Alert: Critical threshold exceeded. Cognitive function at risk; attention span fragmented and executive control compromised.' },
    { icon: '✨', value: 4.0, title: 'Self-Affirmation Content Exposure',
      note: 'Clinical note: Therapeutic content consumption within acceptable range. Subject shows good potential for self-compassion and resilience.' }
  ];

  function showTooltip(item, clientX, clientY){
    tooltipIcon.textContent = item.icon;
    tooltipTitle.textContent = item.title;
    tooltipDuration.textContent = `Duration: ${item.value.toFixed(1)} hours`;
    tooltipNote.textContent = item.note;

    const w = 260, h = 130;
    const x = Math.max(10, Math.min(window.innerWidth - w - 10, clientX + 12));
    const y = Math.max(10, Math.min(window.innerHeight - h - 10, clientY - 10));

    tooltip.style.left = x + "px";
    tooltip.style.top  = y + "px";
    tooltip.classList.add("screen-tooltip--on");
  }

  function hideTooltip(){
    tooltip.classList.remove("screen-tooltip--on");
  }

  chartData.forEach((item) => {
    const column = document.createElement("div");
    column.className = "chart__column";

    const bar = document.createElement("div");
    bar.className = "chart__bar";
    const barHeight = (item.value / 10) * 220;
    bar.style.height = `${barHeight}px`;

    const icon = document.createElement("div");
    icon.className = "chart__icon";
    icon.textContent = item.icon;

    column.appendChild(bar);
    column.appendChild(icon);

    column.addEventListener("mouseenter", (e) => {
      showTooltip(item, e.clientX, e.clientY);
    });

    column.addEventListener("mousemove", (e) => {
      showTooltip(item, e.clientX, e.clientY);
    });

    column.addEventListener("mouseleave", () => {
      hideTooltip();
    });

    column.tabIndex = 0;
    column.addEventListener("focus", () => {
      const rect = column.getBoundingClientRect();
      showTooltip(item, rect.left + rect.width / 2, rect.top);
    });

    column.addEventListener("blur", () => {
      hideTooltip();
    });

    chartGrid.appendChild(column);
  });
}
