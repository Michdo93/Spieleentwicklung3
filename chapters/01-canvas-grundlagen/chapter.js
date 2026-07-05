/**
 * Kapitel 1 · Canvas-Grundlagen & Game-Loop
 *
 * Der Ausgangspunkt für alles Weitere: ein <canvas>-Element, sein
 * 2D-Zeichenkontext, und die Schleife, die ein Spiel überhaupt erst zum
 * Leben erweckt. Die hier gezeigte zeitbasierte Loop-Struktur ist exakt
 * die, die in Ninja Fight (GameManager.loop()/update()/render()) zum
 * Einsatz kommt — nur ohne die ganze Spiellogik drumherum.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width, H = canvas.height;
const buttons = document.querySelectorAll("[data-demo]");
const hint = document.getElementById("hint");

function clearStage() {
  ctx.fillStyle = "#0b1a24";
  ctx.fillRect(0, 0, W, H);
}

/* ================================================================== */
/*  Demo 1: Statisches Zeichnen — kein Loop, nur ein einziger Aufruf    */
/* ================================================================== */
const demoStatic = {
  run() {
    hint.textContent = "Nur ein einziger draw-Aufruf. Ohne Loop passiert danach nichts mehr — das Bild steht fest.";
    clearStage();
    ctx.fillStyle = "#5fe0c9";
    ctx.fillRect(80, 120, 60, 60);
    ctx.strokeStyle = "#0a0e14"; ctx.lineWidth = 2;
    ctx.strokeRect(80, 120, 60, 60);
    return null; // kein Aufräumen nötig, da kein Loop läuft
  },
};

/* ================================================================== */
/*  Demo 2: Naiver Loop — ein fester Pixel-Schritt pro Frame            */
/*  Das Problem: Die Geschwindigkeit hängt von der Bildrate ab. Auf     */
/*  einem 30-Hz-Bildschirm wäre das Quadrat nur halb so schnell.        */
/* ================================================================== */
const demoNaive = {
  run() {
    hint.textContent = "square.x += 2 pro Frame — bei 60fps doppelt so schnell wie bei 30fps. Genau das Problem, das Demo 3 löst.";
    let x = 40;
    const frame = () => {
      x += 2; // fester Schritt, unabhängig von der tatsächlich vergangenen Zeit
      if (x > W - 40) x = 40;

      clearStage();
      ctx.fillStyle = "#ffb84d";
      ctx.fillRect(x, 120, 60, 60);
      ctx.strokeStyle = "#0a0e14"; ctx.lineWidth = 2;
      ctx.strokeRect(x, 120, 60, 60);

      raf = requestAnimationFrame(frame);
    };
    let raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  },
};

/* ================================================================== */
/*  Demo 3: Zeitbasierter Loop — dieselbe Struktur wie in Ninja Fight   */
/*  (GameManager.loop): Zeitdifferenz seit dem letzten Frame berechnen, */
/*  Bewegung mit dieser Differenz (dt) statt mit einem festen Wert      */
/*  skalieren. Läuft auf jedem Bildschirm gleich schnell.               */
/* ================================================================== */
const demoTimed = {
  run() {
    hint.textContent = "square.x += SPEED * dt — dieselbe Struktur wie GameManager.loop() in Ninja Fight. Läuft bei jeder Bildrate gleich schnell.";
    const SPEED = 140; // Pixel pro Sekunde, nicht pro Frame
    let x = 40;
    let lastTime = 0;

    const loop = (now) => {
      if (lastTime === 0) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05); // Sekunden seit letztem Frame
      lastTime = now;

      x += SPEED * dt;
      if (x > W - 40) x = 40;

      clearStage();
      ctx.fillStyle = "#a78bfa";
      ctx.fillRect(x, 120, 60, 60);
      ctx.strokeStyle = "#0a0e14"; ctx.lineWidth = 2;
      ctx.strokeRect(x, 120, 60, 60);
      ctx.fillStyle = "#5b6b7d";
      ctx.font = "13px 'JetBrains Mono'";
      ctx.fillText(`dt = ${dt.toFixed(4)}s`, 14, 24);

      raf = requestAnimationFrame(loop);
    };
    let raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  },
};

const DEMOS = { static: demoStatic, naive: demoNaive, timed: demoTimed };
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
load("static");
