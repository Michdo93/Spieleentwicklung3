/**
 * Kapitel 14 · Gegner-KI: Kampf & Gegnertypen
 *
 * Bewegung (Kapitel 13) allein macht noch keinen Gegner gefährlich.
 * Dieses Kapitel baut die Angriffsentscheidung aus Enemy.update() nach:
 * je nach Abstand zum Ziel ein anderer Angriff, je nach Gegnertyp
 * überhaupt erst verfügbar — inklusive Friendly Fire zwischen Gegnern.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width, H = canvas.height;
const buttons = document.querySelectorAll("[data-demo]");
const hint = document.getElementById("hint");

const sheets = {};
["hero", "blue", "green", "red", "white"].forEach(n => { sheets[n] = new Image(); sheets[n].src = `assets/${n}.png`; });
function whenReady(fn) {
  const ready = () => Object.values(sheets).every(i => i.complete && i.naturalWidth > 0);
  if (ready()) fn(); else Object.values(sheets).forEach(i => i.addEventListener("load", () => ready() && fn()));
}
function drawChar(name, row, x, y, facing = 1, scale = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(facing, 1);
  ctx.drawImage(sheets[name], 0, row * 150, 160, 150, -32 * scale, -66 * scale, 64 * scale, 66 * scale);
  ctx.restore();
}
function clearStage() { ctx.fillStyle = "#0b1a24"; ctx.fillRect(0, 0, W, H); }

/* ================================================================== */
/*  Demo 1: Aggro-Bereich & Angriffsauswahl                             */
/*  entspricht dem Entscheidungsbaum in Enemy.update():                 */
/*  nah = Nahkampf, mittel = Shuriken (falls vorhanden), nah-mittel =    */
/*  Schwert (falls vorhanden)                                           */
/* ================================================================== */
const demoAggro = {
  run() {
    hint.textContent = "Ziehe den Helden mit der Maus — je nach Abstand wechselt die Angriffsentscheidung des Gegners.";
    let heroX = W / 2 + 120;
    const enemyX = W / 2 - 60;
    const enemyType = { canShuriken: true, canSword: true }; // White: kann beides

    function decide(dist) {
      if (dist < 40) return "Nahkampf (Hit/Kick)";
      if (dist < 260 && enemyType.canShuriken) return "Shuriken werfen";
      if (dist < 60 && enemyType.canSword) return "Schwert";
      return "außer Reichweite — nur beobachten";
    }
    function onMove(e) { const r = canvas.getBoundingClientRect(); heroX = Math.max(20, Math.min(W - 20, e.clientX - r.left)); draw(); }
    canvas.addEventListener("mousemove", onMove);

    function draw() {
      const dist = Math.abs(heroX - enemyX);
      clearStage();
      // Reichweiten-Ringe zur Veranschaulichung
      ctx.strokeStyle = "rgba(255,107,107,0.4)"; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.arc(enemyX, 150, 40, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = "rgba(255,184,77,0.4)";
      ctx.beginPath(); ctx.arc(enemyX, 150, 260, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);

      whenReady(() => {
        drawChar("hero", 0, heroX, 150, heroX > enemyX ? 1 : -1);
        drawChar("white", 0, enemyX, 150, heroX > enemyX ? 1 : -1);
      });
      ctx.fillStyle = "#5b6b7d"; ctx.font = "13px 'JetBrains Mono'";
      ctx.fillText(`Abstand: ${dist.toFixed(0)}px   →  ${decide(dist)}`, 14, 24);
    }
    draw();
    return () => canvas.removeEventListener("mousemove", onMove);
  },
};

/* ================================================================== */
/*  Demo 2: vier Gegnertypen, vier Fähigkeitsprofile                    */
/*  entspricht ENEMY_TYPES + HP_BY_TYPE aus entities.js                 */
/* ================================================================== */
const ENEMY_TYPES = {
  Blue: { canShuriken: false, canSword: false, hp: 10 },
  Green: { canShuriken: true, canSword: false, hp: 20 },
  Red: { canShuriken: false, canSword: true, hp: 30 },
  White: { canShuriken: true, canSword: true, hp: 50 },
};

const demoTypes = {
  run() {
    hint.textContent = "Vier Gegnertypen — jeder mit eigenen HP und eigenen Spezialfähigkeiten. Alle können zusätzlich Schlagen und Treten.";
    whenReady(() => {
      clearStage();
      const names = Object.keys(ENEMY_TYPES);
      names.forEach((name, i) => {
        const x = 80 + i * 100;
        drawChar(name.toLowerCase(), 0, x, 150, 1, 0.8);
        const def = ENEMY_TYPES[name];
        ctx.fillStyle = "#5b6b7d"; ctx.font = "11px 'JetBrains Mono'"; ctx.textAlign = "center";
        ctx.fillText(name, x, 175);
        ctx.fillText(`${def.hp} HP`, x, 190);
        ctx.fillStyle = def.canShuriken ? "#ffd23f" : "#3a4657";
        ctx.fillText("Shuriken", x, 204);
        ctx.fillStyle = def.canSword ? "#cccccc" : "#3a4657";
        ctx.fillText("Schwert", x, 218);
        ctx.textAlign = "left";
      });
    });
    return null;
  },
};

/* ================================================================== */
/*  Demo 3: Friendly Fire — ein Angriff trifft auch andere Gegner        */
/*  entspricht hitNearbyEnemies() / Projectile mit Werfer-Ausschluss     */
/* ================================================================== */
const demoFriendlyFire = {
  run() {
    hint.textContent = "Der grüne Ninja wirft in Richtung des Helden — steht ein anderer Gegner im Weg, trifft es ihn versehentlich.";
    let redHp = 30;
    document.getElementById("btn-throw").onclick = () => throwShuriken();
    document.getElementById("reset-btn").onclick = () => { redHp = 30; };
    document.getElementById("ff-controls").style.display = "flex";

    const thrower = { x: 60, y: 150 };
    const bystander = { x: 180, y: 150 }; // steht im Weg
    const heroX = W - 60;
    let projectiles = [];

    function throwShuriken() { projectiles.push({ x: thrower.x + 18, y: thrower.y - 30, dead: false }); }

    let raf, lastTime = 0;
    const loop = (now) => {
      if (lastTime === 0) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      projectiles.forEach(p => {
        if (p.dead) return;
        p.x += 480 * dt;
        // entspricht Projectile.update(): trifft jeden AUSSER den Werfer —
        // hier steht "bystander" (ein anderer Gegner) zufällig im Weg
        if (redHp > 0 && Math.hypot(bystander.x - p.x, bystander.y - 20 - p.y) < 22) { redHp = Math.max(0, redHp - 5); p.dead = true; }
        if (p.x > W + 20) p.dead = true;
      });
      projectiles = projectiles.filter(p => !p.dead);

      clearStage();
      whenReady(() => {
        drawChar("green", 0, thrower.x, thrower.y, 1);
        if (redHp > 0) drawChar("red", 0, bystander.x, bystander.y, 1);
        drawChar("hero", 0, heroX, 150, -1);
      });
      projectiles.forEach(p => { ctx.fillStyle = "#cfd6dd"; ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2); ctx.fill(); });
      ctx.fillStyle = "#5b6b7d"; ctx.font = "13px 'JetBrains Mono'";
      ctx.fillText(`Red (Zufalls-Opfer): ${redHp}/30 HP`, 14, 24);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); document.getElementById("ff-controls").style.display = "none"; };
  },
};

const DEMOS = { aggro: demoAggro, types: demoTypes, friendlyfire: demoFriendlyFire };
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
load("aggro");
