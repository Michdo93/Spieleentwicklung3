/**
 * Kapitel 6 · Kollision & Plattformen
 *
 * Kapitel 5 hat einen Sprung gebaut, aber nur gegen einen fest
 * einprogrammierten Bodenwert (GROUND_Y). Ein echtes Level braucht
 * mehrere Plattformen an unterschiedlichen Stellen — dieses Kapitel baut
 * dafür exakt findLanding() aus Ninja Fight nach.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width, H = canvas.height;
const buttons = document.querySelectorAll("[data-demo]");
const hint = document.getElementById("hint");

const GRAVITY = 1400, JUMP_SPEED = 620;
function clearStage() { ctx.fillStyle = "#0b1a24"; ctx.fillRect(0, 0, W, H); }

// entspricht overlaps()/rectOf() in render.js — die Grundfunktionen für
// jede Rechteck-Kollision im ganzen Spiel
function rectOf(x, y, w, h) { return { left: x, right: x + w, top: y, bottom: y + h }; }
function overlaps(a, b) { return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top; }

/* ================================================================== */
/*  Demo 1: AABB-Kollision — zwei Rechtecke, ein einziger Test          */
/* ================================================================== */
const demoAABB = {
  run() {
    hint.textContent = "Bewege das grüne Rechteck mit der Maus — overlaps() prüft alle vier Seiten auf einmal.";
    const fixed = rectOf(200, 100, 100, 80);
    let mx = 60, my = 60;

    function draw() {
      const moving = rectOf(mx, my, 60, 60);
      const hit = overlaps(moving, fixed);

      clearStage();
      ctx.fillStyle = "rgba(255,107,107,0.35)";
      ctx.fillRect(fixed.left, fixed.top, fixed.right - fixed.left, fixed.bottom - fixed.top);
      ctx.fillStyle = hit ? "#5fe0c9" : "#ffb84d";
      ctx.fillRect(moving.left, moving.top, 60, 60);

      ctx.fillStyle = "#5b6b7d"; ctx.font = "13px 'JetBrains Mono'";
      ctx.fillText(`overlaps() = ${hit}`, 14, 24);
    }
    function onMove(e) {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left - 30; my = e.clientY - r.top - 30;
      draw();
    }
    canvas.addEventListener("mousemove", onMove);
    draw();
    return () => canvas.removeEventListener("mousemove", onMove);
  },
};

/* ================================================================== */
/*  Demo 2: Landung auf EINER Plattform — entspricht findLanding()      */
/* ================================================================== */
const demoLanding = {
  run() {
    hint.textContent = "findLanding() prüft: bin ich horizontal über der Plattform, UND war ich eben noch drüber, UND bin ich jetzt (fast) drauf?";
    const platform = { x: 140, y: 180, w: 160 };
    let x = W / 2, y = 20, vy = 0, onGround = false;

    const onKey = (e) => { if (e.code === "Space" && onGround) { vy = -JUMP_SPEED; onGround = false; e.preventDefault(); } };
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      x = e.clientX - r.left;
    };
    window.addEventListener("keydown", onKey);
    canvas.addEventListener("mousemove", onMove);

    function findLanding(nextY) {
      // exakt dieselbe Prüfung wie in Hero.findLanding()/Enemy.findLanding()
      if (x > platform.x && x < platform.x + platform.w && y <= platform.y + 2 && nextY >= platform.y) {
        return { y: platform.y };
      }
      return null;
    }

    let lastTime = 0, raf;
    const loop = (now) => {
      if (lastTime === 0) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      vy += GRAVITY * dt;
      const nextY = y + vy * dt;
      const landing = findLanding(nextY);
      if (landing && vy >= 0) { y = landing.y; vy = 0; onGround = true; }
      else { y = nextY; onGround = false; if (y > H + 40) { y = 20; vy = 0; } }

      clearStage();
      ctx.fillStyle = "#663300";
      ctx.fillRect(platform.x, platform.y, platform.w, 10);
      ctx.fillStyle = onGround ? "#5fe0c9" : "#a78bfa";
      ctx.beginPath(); ctx.arc(x, y, 13, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#5b6b7d"; ctx.font = "13px 'JetBrains Mono'";
      ctx.fillText(`onGround = ${onGround}`, 14, 24);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    canvas.setAttribute("tabindex", "0"); canvas.focus();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", onKey); canvas.removeEventListener("mousemove", onMove); };
  },
};

/* ================================================================== */
/*  Demo 3: mehrere Plattformen + Trefferbox ≠ Sprite                  */
/*  Reale Charaktere haben eine kleinere, unsichtbare Trefferbox als    */
/*  ihr gezeichnetes Sprite — sichtbar gemacht als gestrichelter Rahmen.*/
/* ================================================================== */
const demoMulti = {
  run() {
    hint.textContent = "Gestrichelt: die tatsächliche (kleinere) Trefferbox. Durchgezogen: wie groß die Figur gezeichnet wird — bewusst unterschiedlich groß.";
    const platforms = [
      { x: 20, y: 220, w: 150 },
      { x: 220, y: 160, w: 120 },
      { x: 380, y: 100, w: 100 },
    ];
    let x = 60, y = 20, vy = 0, onGround = false;
    const keys = { left: false, right: false };

    const onDown = (e) => {
      if (e.code === "ArrowLeft") keys.left = true;
      if (e.code === "ArrowRight") keys.right = true;
      if (e.code === "Space" && onGround) { vy = -JUMP_SPEED; onGround = false; }
      e.preventDefault();
    };
    const onUp = (e) => { if (e.code === "ArrowLeft") keys.left = false; if (e.code === "ArrowRight") keys.right = false; };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);

    function findLanding(nextY) {
      let best = null;
      platforms.forEach(p => {
        if (x > p.x && x < p.x + p.w && y <= p.y + 2 && nextY >= p.y) {
          if (!best || p.y < best.y) best = { y: p.y };
        }
      });
      return best;
    }

    let lastTime = 0, raf;
    const loop = (now) => {
      if (lastTime === 0) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (keys.left) x -= 140 * dt;
      if (keys.right) x += 140 * dt;
      x = Math.max(15, Math.min(W - 15, x));

      vy += GRAVITY * dt;
      const nextY = y + vy * dt;
      const landing = findLanding(nextY);
      if (landing && vy >= 0) { y = landing.y; vy = 0; onGround = true; }
      else { y = nextY; onGround = false; if (y > H + 40) { x = 60; y = 20; vy = 0; } }

      clearStage();
      ctx.fillStyle = "#663300";
      platforms.forEach(p => ctx.fillRect(p.x, p.y, p.w, 10));

      // Sprite: groß und leicht versetzt gezeichnet …
      ctx.fillStyle = "#5fe0c9";
      ctx.beginPath(); ctx.arc(x, y - 6, 22, 0, Math.PI * 2); ctx.fill();
      // … Trefferbox: klein, das ist die tatsächlich für Kollision genutzte Größe
      ctx.strokeStyle = "#ffb84d"; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
      ctx.strokeRect(x - 8, y - 16, 16, 16);
      ctx.setLineDash([]);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    canvas.setAttribute("tabindex", "0"); canvas.focus();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  },
};

const DEMOS = { aabb: demoAABB, landing: demoLanding, multi: demoMulti };
let cleanup = null;
function load(key) {
  if (cleanup) cleanup();
  cleanup = DEMOS[key].run() || null;
}
buttons.forEach(b => b.addEventListener("click", () => {
  buttons.forEach(x => x.classList.remove("btn-active"));
  b.classList.add("btn-active");
  load(b.dataset.demo);
}));
load("aabb");
