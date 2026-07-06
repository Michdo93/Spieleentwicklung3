/**
 * Kapitel 10 · Nahkampf & Hitboxen
 *
 * Kapitel 6 hat AABB-Kollision für Landung genutzt — dieselbe Technik
 * erkennt auch Treffer. Dieses Kapitel baut den Angriffs-Teil aus
 * Hero.update() nach: eine Trefferzone vor der Figur, die je nach
 * Blickrichtung wandert, mit einer Sperre gegen Mehrfachtreffer.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width, H = canvas.height;
const buttons = document.querySelectorAll("[data-demo]");
const hint = document.getElementById("hint");
const hpDisplay = document.getElementById("hp-display");

const heroSheet = new Image(); heroSheet.src = "assets/hero.png";
const enemySheet = new Image(); enemySheet.src = "assets/blue.png";
const CELL_W = 160, CELL_H = 150;
function whenReady(fn) {
  const ready = () => heroSheet.complete && heroSheet.naturalWidth > 0 && enemySheet.complete && enemySheet.naturalWidth > 0;
  if (ready()) fn(); else { heroSheet.addEventListener("load", () => ready() && fn()); enemySheet.addEventListener("load", () => ready() && fn()); }
}
function drawFrame(sheet, row, x, y, facing = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(facing, 1);
  ctx.drawImage(sheet, 0, row * CELL_H, CELL_W, CELL_H, -34, -70, 68, 70);
  ctx.restore();
}
function clearStage() { ctx.fillStyle = "#0b1a24"; ctx.fillRect(0, 0, W, H); }
function overlaps(a, b) { return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top; }
function rectOf(x, y, w, h) { return { left: x, right: x + w, top: y, bottom: y + h }; }

/* ================================================================== */
/*  Demo 1: Trefferzone vor der Figur, abhängig von der Blickrichtung   */
/* ================================================================== */
const demoHitbox = {
  run() {
    hint.textContent = "Die Trefferzone (gestrichelt) liegt immer VOR der Figur — bei facing=1 rechts, bei facing=-1 links davon.";
    let facing = 1;
    function draw() {
      clearStage();
      whenReady(() => drawFrame(heroSheet, 0, W / 2, 150, facing));
      const range = 46;
      const hitBox = rectOf(W / 2 + (facing > 0 ? 0 : -range), 150 - 40, range, 30);
      ctx.strokeStyle = "#ff6b6b"; ctx.lineWidth = 2; ctx.setLineDash([5, 4]);
      ctx.strokeRect(hitBox.left, hitBox.top, range, 30);
      ctx.setLineDash([]);
      ctx.fillStyle = "#5b6b7d"; ctx.font = "13px 'JetBrains Mono'";
      ctx.fillText(`facing = ${facing}`, 14, 24);
    }
    whenReady(draw);
    const btn = document.getElementById("flip-btn");
    const handler = () => { facing *= -1; draw(); };
    btn.addEventListener("click", handler);
    document.getElementById("flip-controls").style.display = "flex";
    return () => { btn.removeEventListener("click", handler); document.getElementById("flip-controls").style.display = "none"; };
  },
};

/* ================================================================== */
/*  Demo 2: attackHitDone — genau ein Treffer pro Angriff               */
/*  Ohne diese Sperre würde jeder einzelne Frame, in dem die Zone       */
/*  überlappt, erneut Schaden anrichten — bei einer 0,3s-Animation      */
/*  wären das rund 18 Treffer statt einem.                              */
/* ================================================================== */
const demoOneHit = {
  run() {
    hint.textContent = "Ohne Sperre (oben): jeder Frame der Angriffsanimation trifft erneut. Mit attackHitDone (unten): genau einmal pro Angriff.";
    let hitsWithoutGuard = 0, hitsWithGuard = 0;
    let attacking = false, attackHitDone = false, attackTimer = 0;

    function attack() {
      if (attacking) return;
      attacking = true; attackHitDone = false; attackTimer = 0.3;
    }
    const btn = document.getElementById("attack-btn");
    btn.addEventListener("click", attack);
    document.getElementById("attack-controls").style.display = "flex";

    let lastTime = 0, raf;
    const loop = (now) => {
      if (lastTime === 0) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (attacking) {
        attackTimer -= dt;
        // OHNE Sperre: trifft jeden Frame während des Angriffs
        hitsWithoutGuard++;
        // MIT Sperre: nur beim ersten Mal
        if (!attackHitDone) { hitsWithGuard++; attackHitDone = true; }
        if (attackTimer <= 0) attacking = false;
      }

      clearStage();
      ctx.fillStyle = "#5b6b7d"; ctx.font = "13px 'JetBrains Mono'";
      ctx.fillText(`ohne Sperre:  ${hitsWithoutGuard} Treffer`, 20, 60);
      ctx.fillStyle = "#ff6b6b"; ctx.fillRect(20, 75, Math.min(300, hitsWithoutGuard * 6), 16);
      ctx.fillStyle = "#5b6b7d";
      ctx.fillText(`mit attackHitDone:  ${hitsWithGuard} Treffer`, 20, 130);
      ctx.fillStyle = "#5fe0c9"; ctx.fillRect(20, 145, Math.min(300, hitsWithGuard * 6), 16);
      ctx.fillStyle = attacking ? "#ffb84d" : "#5b6b7d";
      ctx.fillText(attacking ? "Angriff läuft …" : "Bereit — auf 'Angreifen' klicken", 20, 190);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); btn.removeEventListener("click", attack); document.getElementById("attack-controls").style.display = "none"; };
  },
};

/* ================================================================== */
/*  Demo 3: unterschiedlicher Schaden je Angriffsart                    */
/*  entspricht der DAMAGE-Tabelle aus entities.js                       */
/* ================================================================== */
const DAMAGE = { Hit: 1, Kick: 2, Sword: 10 };
const RANGE = { Hit: 30, Kick: 34, Sword: 46 };

const demoDamage = {
  run() {
    hint.textContent = "Drei Angriffsarten, drei Reichweiten, drei Schadenswerte — dieselbe Trefferzone-Logik, nur mit anderen Zahlen.";
    hpDisplay.style.display = "block";
    let enemyX = W / 2 + 70, enemyHp = 30, attackTimer = 0, attackHitDone = false, currentAttack = null;
    const heroX = W / 2 - 20;

    function attack(type) {
      if (attackTimer > 0) return;
      currentAttack = type; attackTimer = 0.3; attackHitDone = false;
    }
    ["Hit", "Kick", "Sword"].forEach(type => {
      document.getElementById("btn-" + type.toLowerCase()).addEventListener("click", () => attack(type));
    });
    document.getElementById("damage-controls").style.display = "flex";
    document.getElementById("reset-btn").addEventListener("click", () => { enemyHp = 30; });

    let lastTime = 0, raf;
    const loop = (now) => {
      if (lastTime === 0) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (attackTimer > 0) {
        attackTimer -= dt;
        if (!attackHitDone) {
          const range = RANGE[currentAttack];
          const hitBox = rectOf(heroX, 150 - 40, range, 30);
          const enemyBox = rectOf(enemyX - 20, 150 - 60, 40, 60);
          if (overlaps(hitBox, enemyBox)) { enemyHp = Math.max(0, enemyHp - DAMAGE[currentAttack]); attackHitDone = true; }
        }
      }

      clearStage();
      whenReady(() => {
        drawFrame(heroSheet, 0, heroX, 150, 1);
        if (enemyHp > 0) drawFrame(enemySheet, 0, enemyX, 150, -1);
      });
      if (attackTimer > 0) {
        const range = RANGE[currentAttack];
        ctx.strokeStyle = "#ff6b6b"; ctx.lineWidth = 2; ctx.setLineDash([5, 4]);
        ctx.strokeRect(heroX, 150 - 40, range, 30);
        ctx.setLineDash([]);
      }
      hpDisplay.textContent = `Gegner-HP: ${enemyHp}/30   letzter Angriff: ${currentAttack || "–"}`;

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); document.getElementById("damage-controls").style.display = "none"; };
  },
};

const DEMOS = { hitbox: demoHitbox, onehit: demoOneHit, damage: demoDamage };
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
load("hitbox");
