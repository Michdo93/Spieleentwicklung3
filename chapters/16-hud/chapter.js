/**
 * Kapitel 16 · HUD & Spielstatus
 *
 * Baut drawHealthBar() und ui.updateHud() aus Ninja Fight nach — inklusive
 * einer echten Lektion aus der Praxis: die Balkenposition musste
 * nachträglich korrigiert werden, weil sie ursprünglich mitten im Kopf
 * der Figur lag statt darüber.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width, H = canvas.height;
const buttons = document.querySelectorAll("[data-demo]");
const hint = document.getElementById("hint");

const enemySheet = new Image(); enemySheet.src = "assets/red.png";
function whenReady(fn) { if (enemySheet.complete && enemySheet.naturalWidth > 0) fn(); else enemySheet.addEventListener("load", fn, { once: true }); }
function drawEnemy(x, y) { ctx.drawImage(enemySheet, 0, 0, 160, 150, x - 30, y - 62, 60, 62); }
function clearStage() { ctx.fillStyle = "#0b1a24"; ctx.fillRect(0, 0, W, H); }

// entspricht drawHealthBar() aus render.js
function drawHealthBar(x, y, hp, maxHp) {
  const w = 40, h = 5;
  const pct = Math.max(0, hp / maxHp);
  ctx.fillStyle = "rgba(5,7,10,0.7)"; ctx.fillRect(x - w / 2 - 1, y - 1, w + 2, h + 2);
  ctx.fillStyle = "#3a1010"; ctx.fillRect(x - w / 2, y, w, h);
  ctx.fillStyle = pct > 0.5 ? "#5fe07a" : pct > 0.25 ? "#ffb84d" : "#ff5555";
  ctx.fillRect(x - w / 2, y, w * pct, h);
}

/* ================================================================== */
/*  Demo 1: Balkenposition — die falsche und die richtige                */
/*  Die Sprite-Höhe ist größer als man vermuten würde (150px hohes       */
/*  Sheet, aber der Kopf beginnt erst bei ~61px Abstand vom Fußpunkt) —  */
/*  ein zu kleiner Abstand legt den Balken mitten in den Kopf.           */
/* ================================================================== */
const demoPosition = {
  run() {
    hint.textContent = "Regler bewegt den Balken vertikal — bei zu kleinem Abstand sitzt er im Kopf, nicht darüber.";
    let offset = 40;
    const slider = document.getElementById("offset-slider");
    slider.oninput = () => { offset = Number(slider.value); draw(); };
    document.getElementById("position-controls").style.display = "flex";

    function draw() {
      clearStage();
      whenReady(() => drawEnemy(W / 2, 150));
      drawHealthBar(W / 2, 150 - offset, 6, 10);
      ctx.fillStyle = offset < 61 ? "#ff6b6b" : "#5fe0c9";
      ctx.font = "13px 'JetBrains Mono'";
      ctx.fillText(`Abstand: ${offset}px  ${offset < 61 ? "(im Kopf!)" : "(richtig, über dem Kopf)"}`, 14, 24);
    }
    whenReady(draw); draw();
    return () => { slider.oninput = null; document.getElementById("position-controls").style.display = "none"; };
  },
};

/* ================================================================== */
/*  Demo 2: HUD-Text — Level, Punkte, Zeit                              */
/* ================================================================== */
const demoText = {
  run() {
    hint.textContent = "Ein einfaches HUD als DOM-Overlay — dieselben vier Werte wie in Ninja Fights #hud-Leiste.";
    document.getElementById("hud-demo").style.display = "flex";
    let points = 0, time = 120;
    document.getElementById("btn-add-point").onclick = () => { points++; updateHud(); };
    let raf, lastTime = 0;
    const loop = (now) => {
      if (lastTime === 0) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      time = Math.max(0, time - dt);
      updateHud();
      raf = requestAnimationFrame(loop);
    };
    function updateHud() {
      document.getElementById("hud-points").textContent = `Punkte: ${points}`;
      document.getElementById("hud-time").textContent = `Zeit: ${Math.ceil(time)}s`;
    }
    raf = requestAnimationFrame(loop);
    clearStage();
    return () => { cancelAnimationFrame(raf); document.getElementById("hud-demo").style.display = "none"; };
  },
};

/* ================================================================== */
/*  Demo 3: wann aktualisiert sich das HUD?                             */
/*  Lektion aus Ninja Fight: ui.updateHud() jeden Frame aufzurufen ist   */
/*  robuster, als es nur an einzelnen Stellen (z.B. nur bei Levelwechsel)*/
/*  aufzurufen — sonst verpasst man leicht Änderungen wie die Shuriken-  */
/*  Anzahl, die sich mitten im Spiel ändert.                             */
/* ================================================================== */
const demoUpdateTiming = {
  run() {
    hint.textContent = "Links: HUD aktualisiert nur bei Levelwechsel — verpasst die Shuriken-Änderung. Rechts: HUD aktualisiert jeden Frame — immer aktuell.";
    let shurikenCount = 3;
    document.getElementById("btn-use-shuriken").onclick = () => { shurikenCount = Math.max(0, shurikenCount - 1); };
    document.getElementById("timing-controls").style.display = "flex";

    let raf;
    // "nur bei Levelwechsel aktualisiert" — wird hier absichtlich NIE neu
    // gesetzt, um das Problem zu zeigen
    document.getElementById("hud-stale").textContent = `Shuriken: ${shurikenCount}`;

    const loop = () => {
      // "jeden Frame aktualisiert" — immer korrekt
      document.getElementById("hud-live").textContent = `Shuriken: ${shurikenCount}`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  },
};

const DEMOS = { position: demoPosition, text: demoText, timing: demoUpdateTiming };
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
load("position");
