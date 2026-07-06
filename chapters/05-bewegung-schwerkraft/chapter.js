/**
 * Kapitel 5 · Bewegung & Schwerkraft
 *
 * Kapitel 4 hat Tasten in Bewegung übersetzt — aber direkt in Position
 * (x += SPEED*dt). Für einen Sprung reicht das nicht: die Geschwindigkeit
 * selbst muss sich über Zeit verändern (Schwerkraft zieht nach unten).
 * Dieses Kapitel führt Geschwindigkeit als eigenen Wert ein und baut
 * daraus exakt die Sprungphysik aus Hero.update() in Ninja Fight.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width, H = canvas.height;
const buttons = document.querySelectorAll("[data-demo]");
const hint = document.getElementById("hint");

// dieselben Werte wie in Ninja Fight (render.js)
const GRAVITY = 1400;   // px/s² — wie schnell die Fallgeschwindigkeit zunimmt
const JUMP_SPEED = 620; // px/s — Anfangsgeschwindigkeit nach oben

function clearStage() { ctx.fillStyle = "#0b1a24"; ctx.fillRect(0, 0, W, H); }
const GROUND_Y = 220;

/* ================================================================== */
/*  Demo 1: Position vs. Geschwindigkeit                               */
/*  Direkt die Position zu verändern (wie in Kapitel 4) funktioniert    */
/*  für gleichförmige Bewegung — aber Beschleunigung braucht einen      */
/*  eigenen Geschwindigkeitswert, der sich selbst verändert.            */
/* ================================================================== */
const demoVelocity = {
  run() {
    hint.textContent = "Links: x += SPEED*dt (konstant). Rechts: vx wird selbst schneller — Beschleunigung statt konstanter Geschwindigkeit.";
    let xConst = 40, xAccel = 40, vxAccel = 0;
    let lastTime = 0, raf;
    const loop = (now) => {
      if (lastTime === 0) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      xConst += 90 * dt; // konstante Geschwindigkeit
      vxAccel += 60 * dt; // die Geschwindigkeit selbst wächst
      xAccel += vxAccel * dt;
      if (xConst > W - 30) xConst = 40;
      if (xAccel > W - 30) { xAccel = 40; vxAccel = 0; }

      clearStage();
      ctx.fillStyle = "#5fe0c9"; ctx.fillRect(xConst - 15, 60, 30, 30);
      ctx.fillStyle = "#ffb84d"; ctx.fillRect(xAccel - 15, 160, 30, 30);
      ctx.fillStyle = "#5b6b7d"; ctx.font = "13px 'JetBrains Mono'";
      ctx.fillText("konstante Geschwindigkeit", 14, 50);
      ctx.fillText(`beschleunigt — v = ${vxAccel.toFixed(0)}px/s`, 14, 150);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  },
};

/* ================================================================== */
/*  Demo 2: Schwerkraft — Geschwindigkeit wächst jeden Frame            */
/* ================================================================== */
const demoGravity = {
  run() {
    hint.textContent = "vy += GRAVITY * dt, y += vy * dt — genau diese zwei Zeilen erzeugen jeden Fall in Ninja Fight.";
    let y = 20, vy = 0;
    let lastTime = 0, raf;
    const loop = (now) => {
      if (lastTime === 0) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      vy += GRAVITY * dt;
      y += vy * dt;
      if (y > GROUND_Y - 15) { y = GROUND_Y - 15; vy = 0; }

      clearStage();
      ctx.fillStyle = "#663300"; ctx.fillRect(0, GROUND_Y, W, 4);
      ctx.fillStyle = "#ffb84d";
      ctx.beginPath(); ctx.arc(W / 2, y, 15, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#5b6b7d"; ctx.font = "13px 'JetBrains Mono'";
      ctx.fillText(`vy = ${vy.toFixed(0)} px/s`, 14, 24);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  },
};

/* ================================================================== */
/*  Demo 3: der vollständige Sprung — exakt Hero.update() aus           */
/*  Ninja Fight: Space setzt vy auf einen negativen Anfangswert (nach   */
/*  oben), danach übernimmt dieselbe Schwerkraft wie in Demo 2.         */
/* ================================================================== */
const demoJump = {
  run() {
    hint.textContent = 'Leertaste drücken, während der Kreis auf dem Boden steht — vy = -JUMP_SPEED, danach zieht GRAVITY ihn zurück.';
    let y = GROUND_Y - 15, vy = 0, onGround = true;
    let lastTime = 0, raf;

    const onKey = (e) => {
      if (e.code === "Space" && onGround) { vy = -JUMP_SPEED; onGround = false; e.preventDefault(); }
    };
    window.addEventListener("keydown", onKey);

    const loop = (now) => {
      if (lastTime === 0) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // entspricht exakt dem Sprung-Teil aus Hero.update()
      vy += GRAVITY * dt;
      const nextY = y + vy * dt;
      if (nextY >= GROUND_Y - 15 && vy >= 0) { y = GROUND_Y - 15; vy = 0; onGround = true; }
      else { y = nextY; onGround = false; }

      clearStage();
      ctx.fillStyle = "#663300"; ctx.fillRect(0, GROUND_Y, W, 4);
      ctx.fillStyle = onGround ? "#5fe0c9" : "#a78bfa";
      ctx.beginPath(); ctx.arc(W / 2, y, 15, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#5b6b7d"; ctx.font = "13px 'JetBrains Mono'";
      ctx.fillText(`vy = ${vy.toFixed(0)} px/s   onGround = ${onGround}`, 14, 24);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    canvas.setAttribute("tabindex", "0");
    canvas.focus();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", onKey); };
  },
};

const DEMOS = { velocity: demoVelocity, gravity: demoGravity, jump: demoJump };
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
load("velocity");
