/**
 * Kapitel 12 · Items & Power-Ups
 *
 * Ein Power-Up ist im Kern ein kleiner Cousin der Figuren aus den
 * vorigen Kapiteln: es fällt mit derselben Schwerkraft (Kapitel 5),
 * landet auf derselben Art Plattform (Kapitel 6) — nur ohne eigene
 * Steuerung. Dieses Kapitel baut PowerUp/collectPowerUp() aus Ninja
 * Fight nach.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width, H = canvas.height;
const buttons = document.querySelectorAll("[data-demo]");
const hint = document.getElementById("hint");
const statusEl = document.getElementById("status-display");

const tileSheet = new Image(); tileSheet.src = "assets/tiles.png";
const heroSheet = new Image(); heroSheet.src = "assets/hero.png";
const enemySheet = new Image(); enemySheet.src = "assets/blue.png";
const TILES = { Sword: { row: 6, w: 17, h: 65 }, Shuriken: { row: 7, w: 21, h: 21 }, Heart: { row: 8, w: 35, h: 30 } };
function whenReady(fn) {
  const ready = () => [tileSheet, heroSheet, enemySheet].every(i => i.complete && i.naturalWidth > 0);
  if (ready()) fn(); else [tileSheet, heroSheet, enemySheet].forEach(i => i.addEventListener("load", () => ready() && fn()));
}
function drawTile(name, x, y, scale = 1) {
  const def = TILES[name];
  const sx = (42 - def.w) / 2, sy = def.row * 66 + (66 - def.h) / 2;
  ctx.drawImage(tileSheet, sx, sy, def.w, def.h, x, y, def.w * scale, def.h * scale);
}
function drawChar(sheet, x, y, facing = 1) {
  // Bugfix: auf den echten Sprite-Anker zentrieren (siehe Kapitel 10) —
  // vorher landete die sichtbare Figur neben x, wodurch die Kollisions-
  // prüfung schon auf der unsichtbaren Fläche des Sprites auslöste,
  // bevor die gezeichnete Figur das Item optisch erreicht hatte.
  ctx.save(); ctx.translate(x, y); ctx.scale(facing, 1);
  ctx.drawImage(sheet, 0, 0, 160, 150, -11.25, -54.375, 60, 56.25);
  ctx.restore();
}
function clearStage() { ctx.fillStyle = "#0b1a24"; ctx.fillRect(0, 0, W, H); }
const GRAVITY = 1400;

/* ================================================================== */
/*  Demo 1: ein fallendes Item — dieselbe Schwerkraft/Landung wie eine  */
/*  Figur, nur ohne Steuerung (entspricht PowerUp.update())             */
/* ================================================================== */
class PowerUp {
  constructor(type, x, y) { this.type = type; this.x = x; this.y = y; this.vy = 0; this.landed = false; this.collected = false; }
  update(dt, platformY) {
    if (this.collected || this.landed) return;
    this.vy += GRAVITY * dt;
    const nextY = this.y + this.vy * dt;
    if (nextY >= platformY) { this.y = platformY; this.vy = 0; this.landed = true; }
    else this.y = nextY;
  }
}

const demoFalling = {
  run() {
    hint.textContent = "Genau wie eine Figur (Kapitel 5/6): Schwerkraft zieht das Item nach unten, bis es auf einer Plattform landet.";
    const platformY = 180;
    let item = new PowerUp("Heart", W / 2, -30);
    document.getElementById("btn-drop").onclick = () => { item = new PowerUp("Heart", 60 + Math.random() * (W - 120), -30); };
    document.getElementById("drop-controls").style.display = "flex";

    let raf, lastTime = 0;
    const loop = (now) => {
      if (lastTime === 0) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      item.update(dt, platformY);

      clearStage();
      ctx.fillStyle = "#663300"; ctx.fillRect(0, platformY, W, 8);
      whenReady(() => drawTile(item.type, item.x - 17, item.y - 30));
      ctx.fillStyle = "#5b6b7d"; ctx.font = "13px 'JetBrains Mono'";
      ctx.fillText(item.landed ? "gelandet — wartet aufs Einsammeln" : "fällt …", 14, 24);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); document.getElementById("drop-controls").style.display = "none"; };
  },
};

/* ================================================================== */
/*  Demo 2: sofortig vs. befristet vs. zählbasiert                     */
/*  entspricht collectPowerUp() — drei verschiedene Effekt-Arten        */
/* ================================================================== */
const demoEffects = {
  run() {
    hint.textContent = "Herz: sofortiger Effekt. Schwert: läuft nach 30 Sekunden automatisch ab. Shuriken: hat eine begrenzte Anzahl Verwendungen.";
    statusEl.style.display = "block";
    let hp = 5, hasSword = false, swordTimer = 0, shurikenCount = 0;

    function collect(type) {
      if (type === "Heart") hp = Math.min(10, hp + 2); // sofort, keine Nachwirkung
      else if (type === "Sword") { hasSword = true; swordTimer = 30; } // zeitbegrenzt
      else if (type === "Shuriken") shurikenCount += 3; // zählbegrenzt
    }
    ["Heart", "Sword", "Shuriken"].forEach(t => document.getElementById("btn-collect-" + t.toLowerCase()).onclick = () => collect(t));
    document.getElementById("throw-btn").onclick = () => { if (shurikenCount > 0) shurikenCount--; };
    document.getElementById("effect-controls").style.display = "flex";

    let raf, lastTime = 0;
    const loop = (now) => {
      if (lastTime === 0) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      if (hasSword && swordTimer > 0) { swordTimer -= dt; if (swordTimer <= 0) { hasSword = false; swordTimer = 0; } }

      clearStage();
      statusEl.innerHTML =
        `HP: ${hp}/10 &nbsp;·&nbsp; Schwert: ${hasSword ? swordTimer.toFixed(1) + "s übrig" : "keins"} &nbsp;·&nbsp; Shuriken: ${shurikenCount}`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); statusEl.style.display = "none"; document.getElementById("effect-controls").style.display = "none"; };
  },
};

/* ================================================================== */
/*  Demo 3: jeder kann es aufheben — auch der "Gegner"                 */
/*  entspricht PowerUp.update(): alle lebenden Figuren werden auf       */
/*  Kollision geprüft, nicht nur der Held. Wer zuerst da ist, bekommt   */
/*  es — auch der Gegner kann dem Helden ein Item wegschnappen.         */
/* ================================================================== */
const demoAnyone = {
  run() {
    hint.textContent = "Beide Figuren können dasselbe Item einsammeln — wer zuerst ankommt, bekommt es. Mit den Pfeiltasten den Helden steuern, der Gegner bewegt sich automatisch.";
    // Item jetzt auf derselben Bodenhöhe wie die Figuren (y=200) statt
    // schwebend darüber — vorher stand es optisch deutlich höher als die
    // Figuren, wodurch der x-Abstands-Trefftest nicht zur sichtbaren
    // Position passte
    let item = { x: W / 2, y: 200, collected: false };
    let heroX = 60, enemyX = W - 60, enemyDir = -1;
    const keys = {};
    const onDown = (e) => { keys[e.code] = true; };
    const onUp = (e) => { keys[e.code] = false; };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    document.getElementById("reset-item-btn").onclick = () => { item = { x: W / 2, y: 200, collected: false }; };
    document.getElementById("anyone-controls").style.display = "flex";

    let raf, lastTime = 0;
    const loop = (now) => {
      if (lastTime === 0) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (keys["ArrowLeft"]) heroX -= 120 * dt;
      if (keys["ArrowRight"]) heroX += 120 * dt;
      heroX = Math.max(20, Math.min(W - 20, heroX));

      enemyX += enemyDir * 75 * dt;
      if (enemyX < W / 2 - 60) enemyDir = 1;
      if (enemyX > W - 40) enemyDir = -1;

      // entspricht der Schleife über "alle lebenden Figuren" in PowerUp.update()
      if (!item.collected) {
        if (Math.abs(heroX - item.x) < 24) { item.collected = true; item.by = "Held"; }
        else if (Math.abs(enemyX - item.x) < 24) { item.collected = true; item.by = "Gegner"; }
      }

      clearStage();
      whenReady(() => {
        drawChar(heroSheet, heroX, 200, 1);
        drawChar(enemySheet, enemyX, 200, -1);
        // Schwert steht jetzt aufrecht AUF dem Boden (Unterkante bei
        // y=200), statt hoch in der Luft zu schweben
        if (!item.collected) drawTile("Sword", item.x - 6, item.y - 46, 0.7);
      });
      ctx.fillStyle = "#5b6b7d"; ctx.font = "13px 'JetBrains Mono'";
      ctx.fillText(item.collected ? `Eingesammelt von: ${item.by}` : "Item liegt bereit", 14, 24);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    canvas.setAttribute("tabindex", "0"); canvas.focus();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); document.getElementById("anyone-controls").style.display = "none"; };
  },
};

const DEMOS = { falling: demoFalling, effects: demoEffects, anyone: demoAnyone };
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
load("falling");
