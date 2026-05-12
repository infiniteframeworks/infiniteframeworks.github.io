
document.addEventListener('DOMContentLoaded', function () {

  document.querySelector('.hamburger').addEventListener('click', function () {
    document.getElementById('nav').classList.toggle('open');
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // ── Animated aurora spotlight ──────────────────────────────────────────
  const spotlight = document.querySelector('.spotlight');
  if (spotlight) {
    let t = 0;
    (function auroraLoop() {
      t += 0.004;
      const x1 = 20 + Math.sin(t * 0.7) * 14;
      const y1 = -5 + Math.cos(t * 0.5) * 10;
      const x2 = 80 + Math.sin(t * 0.4 + 1.2) * 12;
      const y2 = 20 + Math.cos(t * 0.6 + 2.1) * 14;
      const x3 = 50 + Math.sin(t * 0.3 + 2.5) * 18;
      const y3 = 105 + Math.cos(t * 0.8 + 0.8) * 8;
      spotlight.style.background = [
        `radial-gradient(circle at ${x1}% ${y1}%, rgba(148,163,253,0.18) 0, transparent 55%)`,
        `radial-gradient(circle at ${x2}% ${y2}%, rgba(56,189,248,0.22) 0, transparent 60%)`,
        `radial-gradient(circle at ${x3}% ${y3}%, rgba(59,130,246,0.32) 0, transparent 65%)`
      ].join(', ');
      requestAnimationFrame(auroraLoop);
    })();
  }

  // ── Hero canvas: fireflies + shooting stars ───────────────────────────
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';

  // Insert between spotlight and shimmer so shimmer washes over fireflies
  const shimmer = hero.querySelector('.shimmer-overlay');
  hero.insertBefore(canvas, shimmer);

  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // — Fireflies —
  function mkFirefly() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      opacity: 0,
      phase: 'dark',
      timer: Math.floor(Math.random() * 280),
      r: 1.4 + Math.random() * 1.6,
      hue: 195 + Math.floor(Math.random() * 65) // blue → cyan
    };
  }

  const fireflies = Array.from({ length: 32 }, mkFirefly);

  function tickFirefly(f) {
    f.vx += (Math.random() - 0.5) * 0.012;
    f.vy += (Math.random() - 0.5) * 0.012;
    const spd = Math.hypot(f.vx, f.vy);
    if (spd > 0.35) { f.vx = f.vx / spd * 0.35; f.vy = f.vy / spd * 0.35; }

    if (f.phase === 'dark') {
      if (--f.timer <= 0) f.phase = 'rising';
    } else if (f.phase === 'rising') {
      f.opacity = Math.min(1, f.opacity + 0.04);
      if (f.opacity === 1) { f.phase = 'lit'; f.timer = 8 + Math.floor(Math.random() * 18); }
    } else if (f.phase === 'lit') {
      if (--f.timer <= 0) f.phase = 'falling';
    } else {
      f.opacity = Math.max(0, f.opacity - 0.028);
      if (f.opacity === 0) { f.phase = 'dark'; f.timer = 100 + Math.floor(Math.random() * 220); }
    }

    f.x = (f.x + f.vx + canvas.width)  % canvas.width;
    f.y = (f.y + f.vy + canvas.height) % canvas.height;
  }

  function drawFirefly(f) {
    if (f.opacity <= 0.01) return;
    const glow = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r * 7);
    glow.addColorStop(0, `hsla(${f.hue},85%,78%,${f.opacity * 0.85})`);
    glow.addColorStop(1, `hsla(${f.hue},85%,65%,0)`);
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r * 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = `hsla(${f.hue},50%,98%,${f.opacity})`;
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r * 0.45, 0, Math.PI * 2);
    ctx.fill();
  }

  // — Shooting stars —
  const stars = [];

  function spawnStar(x, y) {
    const dir = Math.random() < 0.5 ? 1 : -1;
    const pitch = 0.18 + Math.random() * 0.25;
    const spd = 20 + Math.random() * 12;
    stars.push({
      x, y,
      vx: dir * Math.cos(pitch) * spd,
      vy: Math.sin(pitch) * spd,
      trail: [],
      life: 1.0,
      decay: 0.017 + Math.random() * 0.009
    });
  }

  hero.addEventListener('click', function (e) {
    const r = hero.getBoundingClientRect();
    spawnStar(e.clientX - r.left, e.clientY - r.top);
  });

  function tickDrawStar(s) {
    s.trail.push({ x: s.x, y: s.y });
    if (s.trail.length > 30) s.trail.shift();
    s.x += s.vx;
    s.y += s.vy;
    s.life -= s.decay;

    for (let i = 1; i < s.trail.length; i++) {
      const frac = i / s.trail.length;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(s.trail[i - 1].x, s.trail[i - 1].y);
      ctx.lineTo(s.trail[i].x,     s.trail[i].y);
      ctx.strokeStyle = `rgba(190,225,255,${frac * s.life * 0.82})`;
      ctx.lineWidth   = frac * 2.2 * s.life;
      ctx.lineCap     = 'round';
      ctx.stroke();
      ctx.restore();
    }

    const hd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 9);
    hd.addColorStop(0, `rgba(220,240,255,${s.life})`);
    hd.addColorStop(1, `rgba(110,170,255,0)`);
    ctx.fillStyle = hd;
    ctx.beginPath();
    ctx.arc(s.x, s.y, 9, 0, Math.PI * 2);
    ctx.fill();
  }

  // — Main loop —
  (function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const f of fireflies) { tickFirefly(f); drawFirefly(f); }
    for (let i = stars.length - 1; i >= 0; i--) {
      tickDrawStar(stars[i]);
      if (stars[i].life <= 0) stars.splice(i, 1);
    }
    requestAnimationFrame(loop);
  })();

});
