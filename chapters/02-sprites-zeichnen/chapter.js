/**
 * Kapitel 2 · Sprites zeichnen
 *
 * Bilder laden und mit drawImage() zeichnen — in drei zunehmend
 * nützlichen Varianten. Als Beispielbild dient das echte Sprite-Sheet
 * des Helden aus Ninja Fight (assets/hero.png), nicht ein abstraktes
 * Platzhalterbild — genau dieses Bild kommt später in Kapitel 3 (Sprite-
 * Animation) wieder vor.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width, H = canvas.height;
const buttons = document.querySelectorAll("[data-demo]");
const hint = document.getElementById("hint");
const extraControls = document.getElementById("extra-controls");

const heroSheet = new Image();
heroSheet.src = "assets/hero.png";
// Kenngrößen des Sheets (siehe spritedata.js in Ninja Fight): 8 Spalten,
// 8 Zeilen, jede Zelle 160×150px. Zeile 0 = Idle, Spalte 0 = erster Frame.
const CELL_W = 160, CELL_H = 150;

function clearStage() {
  ctx.fillStyle = "#0b1a24";
  ctx.fillRect(0, 0, W, H);
}
function whenReady(fn) {
  if (heroSheet.complete && heroSheet.naturalWidth > 0) fn();
  else heroSheet.addEventListener("load", fn, { once: true });
}

/* ================================================================== */
/*  Demo 1: drawImage() in seinen drei Formen                          */
/* ================================================================== */
const demoBasics = {
  run() {
    hint.textContent = "Oben: das ganze Sprite-Sheet (3 Argumente). Unten: nur eine Zelle daraus ausgeschnitten (9 Argumente).";
    extraControls.style.display = "none";
    whenReady(() => {
      clearStage();

      // Form 1: drawImage(img, x, y) — Originalgröße, keine Skalierung
      // Das ganze Sheet ist 1280×1200px — viel zu groß fürs Canvas, daher
      // hier bewusst mit Form 2 verkleinert dargestellt:
      ctx.drawImage(heroSheet, 0, 0, heroSheet.width, heroSheet.height, 20, 10, 300, 281);
      ctx.strokeStyle = "#ffb84d"; ctx.lineWidth = 1;
      ctx.strokeRect(20, 10, 300, 281);
      ctx.fillStyle = "#ffb84d"; ctx.font = "11px 'JetBrains Mono'";
      ctx.fillText("ganzes Sheet (verkleinert)", 20, 300);

      // Form 2: drawImage(img, sx,sy,sw,sh, dx,dy,dw,dh) — nur eine Zelle
      // (Zeile 0 = Idle, Spalte 0 = erster Frame) in Originalgröße
      ctx.drawImage(heroSheet, 0, 0, CELL_W, CELL_H, 340, 60, CELL_W, CELL_H);
      ctx.strokeStyle = "#5fe0c9"; ctx.lineWidth = 1;
      ctx.strokeRect(340, 60, CELL_W, CELL_H);
      ctx.fillStyle = "#5fe0c9";
      ctx.fillText("eine Zelle (ausgeschnitten)", 340, 220);
    });
    return null;
  },
};

/* ================================================================== */
/*  Demo 2: Skalierung & Position per Regler                           */
/* ================================================================== */
const demoScale = {
  run() {
    hint.textContent = "Reglerwerte verändern nur die letzten vier drawImage()-Argumente (dx, dy, dw, dh) — die Quelle bleibt gleich.";
    extraControls.style.display = "flex";
    document.getElementById("scale-controls").style.display = "flex";
    document.getElementById("flip-controls").style.display = "none";

    const scaleSlider = document.getElementById("scale-slider");
    const xSlider = document.getElementById("x-slider");

    function draw() {
      const scale = Number(scaleSlider.value) / 100;
      const x = Number(xSlider.value);
      clearStage();
      const dw = CELL_W * scale, dh = CELL_H * scale;
      ctx.drawImage(heroSheet, 0, 0, CELL_W, CELL_H, x, H - dh - 10, dw, dh);
      ctx.fillStyle = "#5b6b7d"; ctx.font = "13px 'JetBrains Mono'";
      ctx.fillText(`scale=${scale.toFixed(2)}  dw=${dw.toFixed(0)}px  dh=${dh.toFixed(0)}px`, 14, 24);
    }
    whenReady(draw);
    scaleSlider.oninput = draw;
    xSlider.oninput = draw;
    draw();
    return () => { scaleSlider.oninput = null; xSlider.oninput = null; };
  },
};

/* ================================================================== */
/*  Demo 3: Blickrichtung spiegeln — dieselbe Technik wie in            */
/*  Ninja Fight's drawNinja(): ctx.scale(facing, 1) vor dem Zeichnen.   */
/* ================================================================== */
const demoFlip = {
  run() {
    hint.textContent = 'ctx.scale(facing, 1) mit facing = 1 oder -1 — exakt die Technik aus drawNinja() in Ninja Fight.';
    extraControls.style.display = "flex";
    document.getElementById("scale-controls").style.display = "none";
    document.getElementById("flip-controls").style.display = "flex";

    let facing = 1;
    function draw() {
      clearStage();
      ctx.save();
      // Erst zum Mittelpunkt der Figur verschieben, DANN spiegeln —
      // sonst würde die Spiegelung auch die Position verschieben.
      ctx.translate(W / 2, H / 2 + 60);
      ctx.scale(facing, 1);
      // Weil wir schon verschoben haben, zeichnen wir relativ zu (0,0):
      ctx.drawImage(heroSheet, 0, 0, CELL_W, CELL_H, -CELL_W / 2, -CELL_H + 20, CELL_W, CELL_H);
      ctx.restore();
      ctx.fillStyle = "#5b6b7d"; ctx.font = "13px 'JetBrains Mono'";
      ctx.fillText(`facing = ${facing}`, 14, 24);
    }
    whenReady(draw);
    const btn = document.getElementById("flip-btn");
    const handler = () => { facing *= -1; draw(); };
    btn.addEventListener("click", handler);
    draw();
    return () => btn.removeEventListener("click", handler);
  },
};

const DEMOS = { basics: demoBasics, scale: demoScale, flip: demoFlip };
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
load("basics");
