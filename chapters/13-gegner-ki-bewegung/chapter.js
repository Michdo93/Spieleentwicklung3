/**
 * Kapitel 13 · Gegner-KI: Bewegung
 *
 * Das Original-Ninja-Fight hatte für Gegner überhaupt keine KI — die
 * *Controller.as-Klassen waren leere Rümpfe. Die hier aufgebaute
 * Patrouillenlogik mit Kantenerkennung war eine der Nacharbeiten, die
 * beim Testen des fertigen Spiels selbst nötig wurden (Gegner fielen zu
 * oft von Plattformen).
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width, H = canvas.height;
const buttons = document.querySelectorAll("[data-demo]");
const hint = document.getElementById("hint");

const enemySheet = new Image(); enemySheet.src = "assets/blue.png";
function whenReady(fn) { if (enemySheet.complete && enemySheet.naturalWidth > 0) fn(); else enemySheet.addEventListener("load", fn, { once: true }); }
function drawEnemy(x, y, facing) {
  ctx.save(); ctx.translate(x, y); ctx.scale(facing, 1);
  ctx.drawImage(enemySheet, 0, 150, 160, 150, -26, -58, 52, 58);
  ctx.restore();
}
function clearStage() { ctx.fillStyle = "#0b1a24"; ctx.fillRect(0, 0, W, H); }
const GRAVITY = 1400, ENEMY_SPEED = 90;

/* ================================================================== */
/*  Demo 1: naive Patrouille — läuft blind zwischen zwei X-Werten hin   */
/*  und her, ohne zu prüfen, ob unter ihr noch Boden ist. Auf einer     */
/*  Plattform, die kürzer ist als der Patrouillenbereich, führt das     */
/*  direkt zum Sturz.                                                   */
/* ================================================================== */
const demoNaive = {
  run() {
    hint.textContent = "Patrouille zwischen zwei festen X-Werten — ohne zu prüfen, ob die Plattform überhaupt so weit reicht. Die Figur läuft blind über die Kante.";
    const platform = { x: 60, y: 180, w: 140 }; // Plattform kürzer als der Patrouillenbereich!
    let x = 90, y = platform.y, vy = 0, facing = 1, onGround = true;
    const patrolLeft = 60, patrolRight = 260; // reicht über die Plattform hinaus

    let raf, lastTime = 0;
    const loop = (now) => {
      if (lastTime === 0) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      x += facing * ENEMY_SPEED * dt;
      if (x <= patrolLeft) { x = patrolLeft; facing = 1; }
      if (x >= patrolRight) { x = patrolRight; facing = -1; }

      vy += GRAVITY * dt;
      const nextY = y + vy * dt;
      if (x > platform.x && x < platform.x + platform.w && y <= platform.y + 2 && nextY >= platform.y) { y = platform.y; vy = 0; onGround = true; }
      else { y = nextY; onGround = false; if (y > H + 60) { x = 90; y = platform.y; vy = 0; onGround = true; } }

      clearStage();
      ctx.fillStyle = "#663300"; ctx.fillRect(platform.x, platform.y, platform.w, 8);
      whenReady(() => drawEnemy(x, y, facing));
      ctx.fillStyle = "#5b6b7d"; ctx.font = "13px 'JetBrains Mono'";
      ctx.fillText(`onGround = ${onGround}`, 14, 24);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  },
};

/* ================================================================== */
/*  Demo 2: mit Kantenerkennung — entspricht hasSupportAhead()          */
/*  Vor jeder Bewegung wird geprüft, ob ein Stück voraus noch Boden ist.*/
/*  Ist das nicht der Fall, dreht die Figur um, statt weiterzulaufen.   */
/* ================================================================== */
const demoEdge = {
  run() {
    hint.textContent = "hasSupportAhead() prüft vor jedem Schritt: ist da vorne noch Boden? Wenn nicht, umdrehen statt herunterfallen.";
    const platform = { x: 60, y: 180, w: 140 };
    let x = 90, y = platform.y, vy = 0, facing = 1, onGround = true;

    function hasSupportAhead(lookAhead) {
      const aheadX = x + facing * lookAhead;
      return aheadX > platform.x - 4 && aheadX < platform.x + platform.w + 4;
    }

    let raf, lastTime = 0;
    const loop = (now) => {
      if (lastTime === 0) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (!hasSupportAhead(26)) facing *= -1; // Kante erkannt -> umdrehen
      else x += facing * ENEMY_SPEED * dt;

      vy += GRAVITY * dt;
      const nextY = y + vy * dt;
      if (x > platform.x && x < platform.x + platform.w && y <= platform.y + 2 && nextY >= platform.y) { y = platform.y; vy = 0; onGround = true; }
      else { y = nextY; onGround = false; }

      clearStage();
      ctx.fillStyle = "#663300"; ctx.fillRect(platform.x, platform.y, platform.w, 8);
      whenReady(() => drawEnemy(x, y, facing));
      ctx.fillStyle = "#5b6b7d"; ctx.font = "13px 'JetBrains Mono'";
      ctx.fillText(`onGround = ${onGround}  (bleibt immer true)`, 14, 24);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  },
};

/* ================================================================== */
/*  Demo 3: gelegentliches Springen — für ein lebendigeres Verhalten,   */
/*  ohne die Kantenerkennung zu verlieren (Sprung nur, wenn vorne       */
/*  noch Boden ist)                                                      */
/* ================================================================== */
const demoJump = {
  run() {
    hint.textContent = "Wie Demo 2, plus gelegentliches zufälliges Springen — aber nur, wenn auch nach dem Sprung noch Boden erwartet wird.";
    const platform = { x: 30, y: 180, w: 260 };
    let x = 90, y = platform.y, vy = 0, facing = 1, onGround = true, jumpCooldown = 1;

    function hasSupportAhead(lookAhead) {
      const aheadX = x + facing * lookAhead;
      return aheadX > platform.x - 4 && aheadX < platform.x + platform.w + 4;
    }

    let raf, lastTime = 0;
    const loop = (now) => {
      if (lastTime === 0) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      jumpCooldown -= dt;

      const supported = hasSupportAhead(26);
      if (!supported) facing *= -1;
      else x += facing * ENEMY_SPEED * dt;

      if (supported && onGround && jumpCooldown <= 0 && Math.random() < 0.01) {
        vy = -420; onGround = false; jumpCooldown = 1.5 + Math.random() * 2;
      }

      vy += GRAVITY * dt;
      const nextY = y + vy * dt;
      if (x > platform.x && x < platform.x + platform.w && y <= platform.y + 2 && nextY >= platform.y) { y = platform.y; vy = 0; onGround = true; }
      else { y = nextY; onGround = false; }

      clearStage();
      ctx.fillStyle = "#663300"; ctx.fillRect(platform.x, platform.y, platform.w, 8);
      whenReady(() => drawEnemy(x, y, facing));
      ctx.fillStyle = "#5b6b7d"; ctx.font = "13px 'JetBrains Mono'";
      ctx.fillText(`onGround = ${onGround}`, 14, 24);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  },
};

const DEMOS = { naive: demoNaive, edge: demoEdge, jump: demoJump };
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
load("naive");
