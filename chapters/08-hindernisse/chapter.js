/**
 * Kapitel 8 · Hindernisse & Gefahren
 *
 * Nicht jedes Level-Element ist eine Plattform zum Draufstehen. Dieses
 * Kapitel baut checkHazards() nach — dieselbe Funktion existiert (fast
 * wortgleich) für Hero UND Enemy in Ninja Fight, weil beide denselben
 * Gefahren ausgesetzt sind.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width, H = canvas.height;
const buttons = document.querySelectorAll("[data-demo]");
const hint = document.getElementById("hint");
const hpDisplay = document.getElementById("hp-display");

const tileSheet = new Image();
tileSheet.src = "assets/tiles.png";
const TILE_CELL_W = 42, TILE_CELL_H = 66;
const TILES = {
  Floor: { row: 0, w: 41, h: 21 },
  WaterGround: { row: 1, w: 40, h: 18 },
  Knives: { row: 4, w: 18, h: 16 },
};
function whenReady(fn) { if (tileSheet.complete && tileSheet.naturalWidth > 0) fn(); else tileSheet.addEventListener("load", fn, { once: true }); }
function drawTile(name, x, y, frame = 0) {
  const def = TILES[name];
  const sx = frame * TILE_CELL_W + (TILE_CELL_W - def.w) / 2, sy = def.row * TILE_CELL_H + (TILE_CELL_H - def.h) / 2;
  ctx.drawImage(tileSheet, sx, sy, def.w, def.h, x, y, def.w, def.h);
}
function drawFlame(x, y, w, h) {
  // y ist jetzt die Basis (Bodenkontakt) — die Flamme wächst nach OBEN
  const flick = 0.7 + Math.sin(performance.now() / 90 + x) * 0.3;
  ctx.fillStyle = `rgba(255,${100 + flick * 80},60,0.95)`;
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y - h);
  ctx.quadraticCurveTo(x + w, y - h * 0.6, x + w / 2, y + 4);
  ctx.quadraticCurveTo(x, y - h * 0.6, x + w / 2, y - h);
  ctx.fill();
}
function clearStage() { ctx.fillStyle = "#0b1a24"; ctx.fillRect(0, 0, W, H); }

/* ================================================================== */
/*  Demo 1: Wasser ist begehbar — keine Gefahr                         */
/*  Wichtiger Punkt aus dem Konzept: WaterGround gehört zu den          */
/*  PLATFORM_TYPES, nicht zu den Gefahren. Man kann drüber laufen.      */
/* ================================================================== */
const demoWater = {
  run() {
    hint.textContent = "WaterGround ist eine ganz normale Plattform (PLATFORM_TYPES) — keine Gefahr, man läuft einfach drüber wie über Boden.";
    hpDisplay.style.display = "none";
    let x = 40;
    const keys = {};
    const onDown = (e) => { keys[e.code] = true; };
    const onUp = (e) => { keys[e.code] = false; };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);

    let raf, lastTime = 0;
    const loop = (now) => {
      if (lastTime === 0) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      if (keys["ArrowLeft"]) x -= 140 * dt;
      if (keys["ArrowRight"]) x += 140 * dt;
      x = Math.max(10, Math.min(W - 30, x));

      clearStage();
      whenReady(() => {
        for (let gx = 0; gx < W; gx += 40) {
          drawTile("WaterGround", gx, 160);
          // ein kleines Stück Wasser ÜBER der eigentlichen Kachel, damit
          // sichtbar wird, dass man auf der Wasseroberfläche steht statt
          // im Wasser zu versinken
          const wobble = Math.sin(performance.now() / 400 + gx) * 1.5;
          ctx.fillStyle = "rgba(88,184,243,0.55)";
          ctx.fillRect(gx, 158 + wobble, 40, 3);
        }
        ctx.fillStyle = "#5fe0c9";
        ctx.beginPath(); ctx.arc(x + 10, 148, 12, 0, Math.PI * 2); ctx.fill();
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    canvas.setAttribute("tabindex", "0"); canvas.focus();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  },
};

/* ================================================================== */
/*  Demo 2: Feuer — Schaden über Zeit, mit Abklingzeit (invulnTimer)    */
/*  entspricht checkHazards() für Flame in Hero/Enemy                   */
/* ================================================================== */
const demoFlame = {
  run() {
    hint.textContent = "Steh in der Flamme — 1 Schaden pro Kontakt, aber erst nach 0,6s Abklingzeit wieder. Ohne diese Sperre würde jeder einzelne Frame Schaden anrichten (60× pro Sekunde!).";
    hpDisplay.style.display = "block";
    // Bugfix: flame.y muss die BASIS der Flamme sein (Bodenhöhe, hier
    // 160 — dieselbe Höhe, auf der die Figur steht), nicht ihre
    // Oberkante. Vorher stand hier y:138, wodurch footY (immer 160)
    // nie in den Prüfbereich fiel und niemals Schaden ausgelöst wurde.
    const flame = { x: 220, y: 160, w: 26, h: 34 };
    let x = 40, hp = 10, invulnTimer = 0;
    const keys = {};
    const onDown = (e) => { keys[e.code] = true; };
    const onUp = (e) => { keys[e.code] = false; };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);

    let raf, lastTime = 0;
    const loop = (now) => {
      if (lastTime === 0) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      if (keys["ArrowLeft"]) x -= 140 * dt;
      if (keys["ArrowRight"]) x += 140 * dt;
      x = Math.max(10, Math.min(W - 30, x));

      if (invulnTimer > 0) invulnTimer -= dt;
      // entspricht exakt dem Flame-Teil von checkHazards()
      const footX = x + 10, footY = 160;
      if (invulnTimer <= 0 && footX > flame.x - 2 && footX < flame.x + flame.w && footY > flame.y - flame.h && footY <= flame.y + 4) {
        hp = Math.max(0, hp - 1);
        invulnTimer = 0.6;
      }

      clearStage();
      ctx.fillStyle = "#663300"; ctx.fillRect(0, 160, W, 6);
      drawFlame(flame.x, flame.y, flame.w, flame.h);
      ctx.fillStyle = invulnTimer > 0 ? "#ffb84d" : "#5fe0c9";
      ctx.beginPath(); ctx.arc(x + 10, 148, 12, 0, Math.PI * 2); ctx.fill();

      hpDisplay.textContent = `HP: ${hp}/10   Abklingzeit: ${invulnTimer > 0 ? invulnTimer.toFixed(1) + "s" : "bereit"}`;
      if (hp <= 0) { hp = 10; }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    canvas.setAttribute("tabindex", "0"); canvas.focus();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  },
};

/* ================================================================== */
/*  Demo 3: Stacheln — höherer Einzelschaden, dieselbe Abklingzeit-Idee */
/* ================================================================== */
const demoKnives = {
  run() {
    hint.textContent = "Stacheln ziehen 5 statt 1 HP ab (dieselbe Abklingzeit-Technik). Wichtig: das gilt hier für Gegner — der HELD stirbt in Ninja Fight beim Kontakt mit Stacheln sofort, ganz ohne Abklingzeit (siehe Erklärung unten).";
    hpDisplay.style.display = "block";
    const knives = { x: 220, y: 144, w: 18, h: 16 };
    let x = 40, hp = 10, invulnTimer = 0;
    const keys = {};
    const onDown = (e) => { keys[e.code] = true; };
    const onUp = (e) => { keys[e.code] = false; };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);

    let raf, lastTime = 0;
    const loop = (now) => {
      if (lastTime === 0) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      if (keys["ArrowLeft"]) x -= 140 * dt;
      if (keys["ArrowRight"]) x += 140 * dt;
      x = Math.max(10, Math.min(W - 30, x));

      if (invulnTimer > 0) invulnTimer -= dt;
      const footX = x + 10, footY = 160;
      if (invulnTimer <= 0 && footX > knives.x && footX < knives.x + knives.w && footY > knives.y && footY < knives.y + knives.h + 6) {
        hp = Math.max(0, hp - 5);
        invulnTimer = 0.6;
      }

      clearStage();
      ctx.fillStyle = "#663300"; ctx.fillRect(0, 160, W, 6);
      whenReady(() => drawTile("Knives", knives.x, knives.y));
      ctx.fillStyle = invulnTimer > 0 ? "#ffb84d" : "#5fe0c9";
      ctx.beginPath(); ctx.arc(x + 10, 148, 12, 0, Math.PI * 2); ctx.fill();

      hpDisplay.textContent = `HP: ${hp}/10   Abklingzeit: ${invulnTimer > 0 ? invulnTimer.toFixed(1) + "s" : "bereit"}`;
      if (hp <= 0) hp = 10;

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    canvas.setAttribute("tabindex", "0"); canvas.focus();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  },
};

const DEMOS = { water: demoWater, flame: demoFlame, knives: demoKnives };
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
load("water");
