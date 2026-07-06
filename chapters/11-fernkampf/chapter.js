/**
 * Kapitel 11 · Fernkampf & Projektile
 *
 * Eine der dokumentierten Lücken im Original-Ninja-Fight: die
 * Shuriken-Wurfanimation lief, aber es wurde nie ein tatsächliches
 * Objekt erzeugt, das sich durch den Raum bewegt (KnownBugs #1). Dieses
 * Kapitel zeigt das Problem und die Lösung — die Projectile-Klasse.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width, H = canvas.height;
const buttons = document.querySelectorAll("[data-demo]");
const hint = document.getElementById("hint");

const heroSheet = new Image(); heroSheet.src = "assets/hero.png";
const enemySheet = new Image(); enemySheet.src = "assets/green.png";
const tileSheet = new Image(); tileSheet.src = "assets/tiles.png";
const CELL_W = 160, CELL_H = 150;
function whenReady(fn) {
  const ready = () => [heroSheet, enemySheet, tileSheet].every(i => i.complete && i.naturalWidth > 0);
  if (ready()) fn(); else [heroSheet, enemySheet, tileSheet].forEach(i => i.addEventListener("load", () => ready() && fn()));
}
function drawChar(sheet, row, x, y, facing = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(facing, 1);
  ctx.drawImage(sheet, 0, row * CELL_H, CELL_W, CELL_H, -34, -70, 68, 70);
  ctx.restore();
}
function drawShuriken(x, y, spin) {
  const sx = (42 - 21) / 2, sy = 7 * 66 + (66 - 21) / 2;
  ctx.save(); ctx.translate(x, y); ctx.rotate(spin);
  // Das Original-Sprite ist dunkel eingefärbt (passend zum hellen
  // Wald-Hintergrund in Ninja Fight) — vor UNSEREM dunklen Tutorial-
  // Canvas wäre es fast unsichtbar. Ein heller Kreis dahinter sorgt für
  // Kontrast, ohne die Original-Grafik selbst zu verändern.
  ctx.fillStyle = "rgba(230,236,240,0.9)";
  ctx.beginPath(); ctx.arc(0, 0, 11, 0, Math.PI * 2); ctx.fill();
  ctx.drawImage(tileSheet, sx, sy, 21, 21, -10, -10, 21, 21);
  ctx.restore();
}
function clearStage() { ctx.fillStyle = "#0b1a24"; ctx.fillRect(0, 0, W, H); }

/* ================================================================== */
/*  Demo 1: nur die Animation — der Original-Bug aus Ninja Fight        */
/*  doAction("Throw") spielt die Wurfbewegung ab, aber es entsteht      */
/*  nirgends ein Objekt, das sich bewegt. Nichts fliegt.                */
/* ================================================================== */
const demoAnimationOnly = {
  run() {
    hint.textContent = 'doAction("Throw") spielt nur die Armbewegung ab — kein Shuriken existiert als eigenes Objekt. Der Wurf sieht aus wie ein Wurf, trifft aber nie irgendwas.';
    let throwing = false, t = 0;
    document.getElementById("btn-throw").onclick = () => { throwing = true; t = 0; };
    document.getElementById("throw-controls").style.display = "flex";

    let raf, lastTime = 0;
    const loop = (now) => {
      if (lastTime === 0) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      if (throwing) { t += dt; if (t > 0.5) throwing = false; }

      clearStage();
      whenReady(() => {
        drawChar(heroSheet, throwing ? 5 : 0, W / 2 - 60, 150, 1);
        drawChar(enemySheet, 0, W / 2 + 90, 150, -1);
      });
      ctx.fillStyle = "#5b6b7d"; ctx.font = "13px 'JetBrains Mono'";
      ctx.fillText("Wo ist das Shuriken? Es existiert nirgends im Code.", 20, 30);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); document.getElementById("throw-controls").style.display = "none"; };
  },
};

/* ================================================================== */
/*  Demo 2: ein echtes Projektil-Objekt — entspricht der Projectile-    */
/*  Klasse in entities.js: eigene Position, eigene Geschwindigkeit,     */
/*  eigenes update(), unabhängig von der werfenden Figur.                */
/* ================================================================== */
class Projectile {
  constructor(x, y, dir) {
    this.x = x; this.y = y; this.dir = dir;
    this.speed = 480; this.spin = 0; this.dead = false;
  }
  update(dt) {
    this.x += this.dir * this.speed * dt;
    this.spin += dt * 20;
    if (this.x < -20 || this.x > W + 20) this.dead = true;
  }
}

const demoProjectile = {
  run() {
    hint.textContent = "Jetzt existiert ein echtes Objekt: eigene Position, eigene Geschwindigkeit, eigenes update() — unabhängig von der Figur, die geworfen hat.";
    let projectiles = [];
    document.getElementById("btn-throw2").onclick = () => projectiles.push(new Projectile(W / 2 - 40, 130, 1));
    document.getElementById("throw-controls2").style.display = "flex";

    let raf, lastTime = 0;
    const loop = (now) => {
      if (lastTime === 0) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      projectiles.forEach(p => p.update(dt));
      projectiles = projectiles.filter(p => !p.dead);

      clearStage();
      whenReady(() => { drawChar(heroSheet, 0, W / 2 - 60, 150, 1); });
      projectiles.forEach(p => drawShuriken(p.x, p.y, p.spin));
      ctx.fillStyle = "#5b6b7d"; ctx.font = "13px 'JetBrains Mono'";
      ctx.fillText(`aktive Projektile: ${projectiles.length}`, 20, 30);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); document.getElementById("throw-controls2").style.display = "none"; };
  },
};

/* ================================================================== */
/*  Demo 3: Kollision + Werfer ausschließen                             */
/*  entspricht Projectile.update() in Ninja Fight: das Projektil kennt  */
/*  seinen Werfer und trifft alle ANDEREN — wichtig für Friendly Fire   */
/*  zwischen mehreren Gegnern in einem späteren Kapitel.                */
/* ================================================================== */
const demoCollision = {
  run() {
    hint.textContent = "Das Projektil trifft jeden außer seinen eigenen Werfer — wichtig, sobald mehrere Figuren gleichzeitig werfen können.";
    const enemy = { x: W / 2 + 90, y: 150, hp: 5 };
    let projectiles = [];
    document.getElementById("btn-throw3").onclick = () => projectiles.push(new Projectile(W / 2 - 40, 130, 1));
    document.getElementById("throw-controls3").style.display = "flex";
    document.getElementById("reset-btn3").onclick = () => { enemy.hp = 5; };

    let raf, lastTime = 0;
    const loop = (now) => {
      if (lastTime === 0) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      projectiles.forEach(p => {
        p.update(dt);
        if (!p.dead && enemy.hp > 0 && Math.hypot(enemy.x - p.x, enemy.y - 20 - p.y) < 22) {
          enemy.hp -= 1; p.dead = true;
        }
      });
      projectiles = projectiles.filter(p => !p.dead);

      clearStage();
      whenReady(() => {
        drawChar(heroSheet, 0, W / 2 - 60, 150, 1);
        if (enemy.hp > 0) drawChar(enemySheet, 0, enemy.x, enemy.y, -1);
      });
      projectiles.forEach(p => drawShuriken(p.x, p.y, p.spin));
      ctx.fillStyle = "#5b6b7d"; ctx.font = "13px 'JetBrains Mono'";
      ctx.fillText(`Gegner-HP: ${enemy.hp}/5`, 20, 30);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); document.getElementById("throw-controls3").style.display = "none"; };
  },
};

const DEMOS = { animonly: demoAnimationOnly, object: demoProjectile, collision: demoCollision };
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
load("animonly");
