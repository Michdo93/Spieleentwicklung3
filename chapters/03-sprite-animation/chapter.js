/**
 * Kapitel 3 · Sprite-Animation
 *
 * Ein einzelner Frame (Kapitel 2) ist nur eine Pose. Eine Animation ist
 * nichts weiter als: mehrere Poses schnell genug nacheinander zeigen.
 * Dieses Kapitel baut Schritt für Schritt die Logik auf, die in Ninja
 * Fight als drawNinja()/CHARACTER_SHEET zum Einsatz kommt.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width, H = canvas.height;
const buttons = document.querySelectorAll("[data-demo]");
const hint = document.getElementById("hint");
const extraControls = document.getElementById("extra-controls");

const heroSheet = new Image();
heroSheet.src = "assets/hero.png";

// entspricht CHARACTER_SHEET in Ninja Fight: 8 Spalten, eine Zeile pro
// Zustand, 8 abgetastete Frames pro Zustand
const CELL_W = 160, CELL_H = 150;
const STATES = {
  Idle: { row: 0, count: 8, loop: true },
  Walk: { row: 1, count: 8, loop: true },
  Jump: { row: 2, count: 8, loop: false },
};

function clearStage() { ctx.fillStyle = "#0b1a24"; ctx.fillRect(0, 0, W, H); }
function whenReady(fn) {
  if (heroSheet.complete && heroSheet.naturalWidth > 0) fn();
  else heroSheet.addEventListener("load", fn, { once: true });
}
function drawFrame(state, frame, x, y, scale = 1) {
  const def = STATES[state];
  const sx = frame * CELL_W, sy = def.row * CELL_H;
  ctx.drawImage(heroSheet, sx, sy, CELL_W, CELL_H, x, y, CELL_W * scale, CELL_H * scale);
}

/* ================================================================== */
/*  Demo 1: Einzelbilder von Hand durchklicken                         */
/* ================================================================== */
const demoManual = {
  run() {
    hint.textContent = "Frame für Frame per Klick weiterschalten — eine Animation ist nur eine Liste von Posen.";
    extraControls.style.display = "flex";
    document.getElementById("manual-controls").style.display = "flex";
    document.getElementById("auto-controls").style.display = "none";
    document.getElementById("state-controls").style.display = "none";

    let frame = 0;
    function draw() {
      clearStage();
      drawFrame("Walk", frame, 170, 30, 0.9);
      ctx.fillStyle = "#5b6b7d"; ctx.font = "13px 'JetBrains Mono'";
      ctx.fillText(`Frame ${frame + 1} / ${STATES.Walk.count}`, 14, 24);
    }
    whenReady(draw);
    const next = () => { frame = (frame + 1) % STATES.Walk.count; draw(); };
    const prev = () => { frame = (frame - 1 + STATES.Walk.count) % STATES.Walk.count; draw(); };
    document.getElementById("btn-next").onclick = next;
    document.getElementById("btn-prev").onclick = prev;
    draw();
    return () => { document.getElementById("btn-next").onclick = null; document.getElementById("btn-prev").onclick = null; };
  },
};

/* ================================================================== */
/*  Demo 2: automatische, zeitbasierte Wiedergabe                      */
/*  entspricht der Kernzeile aus drawNinja():                          */
/*    let frame = Math.floor(t * fps); frame = frame % def.count;      */
/* ================================================================== */
const demoAuto = {
  run() {
    hint.textContent = "frame = Math.floor(t * fps) % count — dieselbe Formel wie in drawNinja(). Regler ändert die fps.";
    extraControls.style.display = "flex";
    document.getElementById("manual-controls").style.display = "none";
    document.getElementById("auto-controls").style.display = "flex";
    document.getElementById("state-controls").style.display = "none";

    const fpsSlider = document.getElementById("fps-slider");
    let t = 0, lastTime = 0, raf;
    const loop = (now) => {
      if (lastTime === 0) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      t += dt;

      const fps = Number(fpsSlider.value);
      const frame = Math.floor(t * fps) % STATES.Walk.count;

      clearStage();
      drawFrame("Walk", frame, 170, 30, 0.9);
      ctx.fillStyle = "#5b6b7d"; ctx.font = "13px 'JetBrains Mono'";
      ctx.fillText(`fps = ${fps}   Frame ${frame + 1}/${STATES.Walk.count}`, 14, 24);

      raf = requestAnimationFrame(loop);
    };
    whenReady(() => { raf = requestAnimationFrame(loop); });
    return () => cancelAnimationFrame(raf);
  },
};

/* ================================================================== */
/*  Demo 3: mehrere benannte Zustände — Loop vs. einmalig               */
/*  entspricht loopStates/def.count in drawNinja()                     */
/* ================================================================== */
const demoStates = {
  run() {
    hint.textContent = "Idle/Walk laufen endlos (loop=true), Jump läuft einmal durch und bleibt am letzten Frame stehen.";
    extraControls.style.display = "flex";
    document.getElementById("manual-controls").style.display = "none";
    document.getElementById("auto-controls").style.display = "none";
    document.getElementById("state-controls").style.display = "flex";

    let state = "Idle", t = 0, lastTime = 0, raf;
    function setState(s) { state = s; t = 0; }

    const loop = (now) => {
      if (lastTime === 0) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      t += dt;

      const def = STATES[state];
      const fps = state === "Idle" ? 6 : state === "Walk" ? 12 : 10;
      let frame = Math.floor(t * fps);
      frame = def.loop ? frame % def.count : Math.min(frame, def.count - 1);

      clearStage();
      drawFrame(state, frame, 170, 30, 0.9);
      ctx.fillStyle = "#5b6b7d"; ctx.font = "13px 'JetBrains Mono'";
      ctx.fillText(`state = "${state}"   Frame ${frame + 1}/${def.count}`, 14, 24);

      raf = requestAnimationFrame(loop);
    };
    whenReady(() => { raf = requestAnimationFrame(loop); });

    ["Idle", "Walk", "Jump"].forEach(s => {
      document.getElementById("btn-state-" + s.toLowerCase()).onclick = () => setState(s);
    });
    return () => {
      cancelAnimationFrame(raf);
      ["idle", "walk", "jump"].forEach(s => { document.getElementById("btn-state-" + s).onclick = null; });
    };
  },
};

const DEMOS = { manual: demoManual, auto: demoAuto, states: demoStates };
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
load("manual");
