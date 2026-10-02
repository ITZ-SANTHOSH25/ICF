/* ============================================================
   LIFELINK — Cinematic 3D scroll journey engine
   ============================================================ */
(function () {
  'use strict';

  const carousel   = document.getElementById('carousel');
  const scene      = document.getElementById('scene');
  const spacer     = document.querySelector('.scroll-spacer');
  const portal     = document.querySelector('.portal');
  const railFill   = document.getElementById('railFill');
  const panels     = Array.from(document.querySelectorAll('.panel'));
  const dots       = Array.from(document.querySelectorAll('.hud-dot'));

  const N          = panels.length;          // number of stages
  const STEP       = 360 / N;                // degrees between panels
  const TOTAL_ROT  = (N - 1) * STEP;         // rotation across the journey

  let radius       = 900;
  let scrollable   = 1;
  let progress     = 0;
  let targetProg   = 0;
  let smoothProg   = 0;
  let lastScroll   = 0;
  let velocity     = 0;
  const reduce     = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- layout ---------- */
  function measure() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const panelW = Math.min(vw * 0.92, 1080);
    radius = Math.max(300, panelW * 0.82);

    // perspective scales with viewport so the cylinder never clips oddly
    scene.style.perspective = Math.max(900, Math.min(vw * 1.15, 1900)) + 'px';

    // base transform for each panel on the cylinder
    panels.forEach((p, i) => {
      p.style.transform =
        `translate(-50%,-50%) rotateY(${i * STEP}deg) translateZ(${radius}px)`;
    });

    scrollable = Math.max(1, spacer.offsetHeight - vh);
  }

  /* ---------- scroll target ---------- */
  function readScroll() {
    const y = window.scrollY || window.pageYOffset;
    targetProg = Math.min(1, Math.max(0, y / scrollable));
    velocity = y - lastScroll;
    lastScroll = y;
  }

  /* ---------- main render loop ---------- */
  function render() {
    if (window.__lifelinkPaused) { requestAnimationFrame(render); return; }
    readScroll();

    // smooth follow for buttery motion
    smoothProg += (targetProg - smoothProg) * (reduce ? 1 : 0.12);
    progress = smoothProg;

    const angle = -progress * TOTAL_ROT;
    carousel.style.transform = `translateZ(${-radius}px) rotateY(${angle}deg)`;

    // per-panel depth: opacity / blur / pointer
    const velBlur = Math.min(Math.abs(velocity) * 0.045, 3);
    for (let i = 0; i < N; i++) {
      const eff = ((i * STEP) + angle) * Math.PI / 180;
      const front = Math.cos(eff);                 // 1 = facing camera
      const vis = Math.max(0, front);

      const op = 0.04 + 0.96 * Math.pow(vis, 1.4);
      const blur = (1 - vis) * 2.2 + velBlur;
      const sc = 0.92 + vis * 0.08;

      panels[i].style.opacity = op.toFixed(3);
      panels[i].style.filter = blur > 0.15 ? `blur(${blur.toFixed(2)}px)` : 'none';
      panels[i].style.zIndex = Math.round(vis * 100);
      panels[i].style.pointerEvents = vis > 0.55 ? 'auto' : 'none';

      // subtle scale pop on the front panel
      const inner = panels[i].firstElementChild;
      if (inner) inner.style.transform = `scale(${sc.toFixed(3)})`;
    }

    // ---- signature portal ring transition ----
    const stageFloat = progress * (N - 1);
    const d = Math.abs(stageFloat - Math.round(stageFloat)); // 0 at stage, .5 mid
    const t = Math.min(1, Math.max(0, (d - 0.05) / 0.45));  // 0..1
    const ringScale = 0.22 + t * 1.15;
    const ringOp = Math.pow(t, 1.3);
    const ringRot = progress * 220;

    portal.style.transform =
      `translate(-50%,-50%) scale(${ringScale.toFixed(3)}) rotate(${ringRot.toFixed(1)}deg)`;
    portal.style.opacity = ringOp.toFixed(3);

    // rail + dots
    railFill.style.height = (progress * 100).toFixed(1) + '%';
    const active = Math.round(stageFloat);
    dots.forEach((dot, i) => dot.classList.toggle('active', i === active));

    requestAnimationFrame(render);
  }

  /* ============================================================
     PARTICLE BACKGROUND
     ============================================================ */
  const pCanvas = document.getElementById('particles');
  const pCtx = pCanvas.getContext('2d');
  let particles = [];
  let streaks = [];
  let glowSprite = null;

  function makeGlow() {
    const s = document.createElement('canvas');
    s.width = s.height = 64;
    const c = s.getContext('2d');
    const g = c.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,80,96,1)');
    g.addColorStop(0.25, 'rgba(255,43,61,0.65)');
    g.addColorStop(1, 'rgba(255,43,61,0)');
    c.fillStyle = g;
    c.beginPath(); c.arc(32, 32, 32, 0, Math.PI * 2); c.fill();
    glowSprite = s;
  }

  function initParticles() {
    const w = window.innerWidth, h = window.innerHeight;
    const count = Math.round(Math.min(90, (w * h) / 22000));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2.4 + 0.6,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(Math.random() * 0.35 + 0.08),
        a: Math.random() * 0.5 + 0.15,
        tw: Math.random() * Math.PI * 2
      });
    }
    streaks = [];
    for (let i = 0; i < 5; i++) {
      streaks.push({
        x: Math.random() * w,
        y: Math.random() * h,
        len: Math.random() * 120 + 60,
        sp: Math.random() * 2 + 1,
        a: Math.random() * 0.12 + 0.04
      });
    }
  }

  function drawParticles() {
    if (window.__lifelinkPaused) { requestAnimationFrame(drawParticles); return; }
    const w = window.innerWidth, h = window.innerHeight;
    pCtx.clearRect(0, 0, w, h);

    const boost = 1 + Math.min(Math.abs(velocity) * 0.06, 3);

    // data streams (thin light streaks)
    pCtx.lineWidth = 1;
    streaks.forEach(s => {
      const grad = pCtx.createLinearGradient(s.x, s.y, s.x, s.y + s.len);
      grad.addColorStop(0, 'rgba(255,43,61,0)');
      grad.addColorStop(0.5, `rgba(255,43,61,${s.a})`);
      grad.addColorStop(1, 'rgba(255,43,61,0)');
      pCtx.strokeStyle = grad;
      pCtx.beginPath();
      pCtx.moveTo(s.x, s.y);
      pCtx.lineTo(s.x, s.y + s.len);
      pCtx.stroke();
      s.y += s.sp * boost;
      if (s.y > h + s.len) { s.y = -s.len; s.x = Math.random() * w; }
    });

    // glowing particles
    particles.forEach(p => {
      p.x += p.vx * boost;
      p.y += p.vy * boost;
      p.tw += 0.02;
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;

      const tw = 0.6 + 0.4 * Math.sin(p.tw);
      pCtx.globalAlpha = p.a * tw;
      const size = p.r * 7;
      pCtx.drawImage(glowSprite, p.x - size / 2, p.y - size / 2, size, size);
    });
    pCtx.globalAlpha = 1;

    requestAnimationFrame(drawParticles);
  }

  /* ============================================================
     ECG HEARTBEAT LINE
     ============================================================ */
  const eCanvas = document.getElementById('ecg');
  const eCtx = eCanvas.getContext('2d');
  let ecgOffset = 0;

  function gauss(t, c, w) { const d = t - c; return Math.exp(-(d * d) / (2 * w * w)); }
  function ecgWave(t) {
    // returns y offset in [-1, 0.3] (negative = up)
    return (
      -0.12 * gauss(t, 0.16, 0.022) +
       0.10 * gauss(t, 0.30, 0.007) -
       1.00 * gauss(t, 0.335, 0.009) +
       0.30 * gauss(t, 0.37, 0.009) -
       0.24 * gauss(t, 0.55, 0.032)
    );
  }

  function drawECG() {
    if (window.__lifelinkPaused) { requestAnimationFrame(drawECG); return; }
    const w = window.innerWidth, h = window.innerHeight;
    eCtx.clearRect(0, 0, w, h);

    const baseY = h * 0.62;
    const amp = Math.min(h * 0.16, 120);
    const period = 240;
    const cycles = w / period;

    ecgOffset += 0.0016 * (1 + Math.min(Math.abs(velocity) * 0.05, 2));

    eCtx.beginPath();
    for (let x = 0; x <= w; x += 2) {
      const t = ((x / period) + ecgOffset) % 1;
      const y = baseY + ecgWave(t) * amp;
      if (x === 0) eCtx.moveTo(x, y); else eCtx.lineTo(x, y);
    }
    eCtx.strokeStyle = 'rgba(255,43,61,0.45)';
    eCtx.lineWidth = 1.6;
    eCtx.shadowColor = 'rgba(255,43,61,0.9)';
    eCtx.shadowBlur = 12;
    eCtx.stroke();
    eCtx.shadowBlur = 0;

    requestAnimationFrame(drawECG);
  }

  /* ============================================================
     INTERACTIONS
     ============================================================ */
  // nav dots → jump to stage
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const stage = Number(dot.dataset.go);
      const y = (stage / (N - 1)) * scrollable;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  // donor login/register tabs
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const name = tab.dataset.tab;
      tab.parentElement.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t === tab));
      document.querySelectorAll('[data-form]').forEach(f => {
        f.classList.toggle('hidden', f.dataset.form !== name);
      });
    });
  });

  // prevent real form submit (prototype)
  document.querySelectorAll('form').forEach(f =>
    f.addEventListener('submit', e => e.preventDefault()));

  /* ============================================================
     BOOT
     ============================================================ */
  function resizeAll() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    [pCanvas, eCanvas].forEach(c => {
      c.width = window.innerWidth * dpr;
      c.height = window.innerHeight * dpr;
      c.style.width = window.innerWidth + 'px';
      c.style.height = window.innerHeight + 'px';
      c.getContext('2d').setTransform(dpr, 0, 0, dpr, 0, 0);
    });
    measure();
    initParticles();
  }

  makeGlow();
  resizeAll();
  window.addEventListener('resize', resizeAll);

  // gentle autoplay nudge on first load (parallax feel)
  requestAnimationFrame(render);
  requestAnimationFrame(drawParticles);
  requestAnimationFrame(drawECG);
})();
