/**
 * Kapitel 9 · Leitern & Klettern
 *
 * Ein dritter Bewegungszustand neben Laufen und Springen — mit einer
 * echten Lektion aus der Entwicklung von Ninja Fight: eine falsch
 * berechnete Leiter-Kollisionszone ließ Spieler und Gegner am unteren
 * Leiterende ins Leere fallen. Dieses Kapitel zeigt den Fehler live und
 * die Korrektur.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width, H = canvas.height;
const buttons = document.querySelectorAll("[data-demo]");
const hint = document.getElementById("hint");

const GRAVITY = 1400, JUMP_SPEED = 620, CLIMB_SPEED = 110;
function clearStage() { ctx.fillStyle = "#0b1a24"; ctx.fillRect(0, 0, W, H); }

function drawScene(platformY, ladder, x, y, climbing) {
  clearStage();
  ctx.fillStyle = "#663300";
  ctx.fillRect(0, 40, 40, platformY - 40 + 10); // linke Säule (oben)
  ctx.fillRect(0, 40, 200, 10);
  ctx.fillRect(0, platformY, 200, 10); // untere Plattform

  // Leiter-Kollisionszone sichtbar machen (gestrichelt)
  ctx.strokeStyle = "#ffb84d"; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
  ctx.strokeRect(ladder.left, ladder.top, ladder.right - ladder.left, ladder.bottom - ladder.top);
  ctx.setLineDash([]);
  ctx.fillStyle = "rgba(255,184,77,0.15)";
  ctx.fillRect(ladder.left, ladder.top, ladder.right - ladder.left, ladder.bottom - ladder.top);

  // Leiter-Sprossen
  ctx.strokeStyle = "#845232"; ctx.lineWidth = 2;
  for (let ry = ladder.top + 6; ry < ladder.bottom - 4; ry += 10) {
    ctx.beginPath(); ctx.moveTo(ladder.left + 2, ry); ctx.lineTo(ladder.right - 2, ry); ctx.stroke();
  }

  ctx.fillStyle = climbing ? "#a78bfa" : "#5fe0c9";
  ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI * 2); ctx.fill();
}

/* ================================================================== */
/*  Demo 1: die zu groß berechnete Leiter-Zone — der echte Bug          */
/*  In einer frühen Version wurde beim Zusammenfassen der Leiter-        */
/*  Sprossen zu einer Zone versehentlich ZWEIMAL eine Kachelhöhe         */
/*  addiert — die Zone reichte dadurch weit unter den Boden.             */
/* ================================================================== */
const demoBug = {
  run() {
    hint.textContent = "Nach unten klettern, bis ans Ende — die (falsch berechnete) Zone reicht unter den Boden, die Figur fällt durch.";
    const platformY = 200;
    const rungTop = 80, rungBottom = 160; // letzte tatsächliche Sprosse bei y=160
    // FALSCH: hier wird die Kachelhöhe (24) UND zusätzlich noch einmal
    // eine ganze Kachelhöhe drauf addiert — genau der Fehler, der in
    // Ninja Fight steckte (siehe mergeLadderColumns() vor dem Fix)
    const ladder = { left: 80, right: 105, top: rungTop, bottom: rungBottom + 24 + 24 };

    let x = 92, y = rungTop, vy = 0, onLadder = false;
    const keys = {};
    const onDown = (e) => { keys[e.code] = true; e.preventDefault(); };
    const onUp = (e) => { keys[e.code] = false; };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);

    let raf, lastTime = 0;
    const loop = (now) => {
      if (lastTime === 0) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Bugfix: solange man sich IN der Leiterzone befindet (und nicht
      // seitlich aussteigt), ist die Schwerkraft komplett aufgehoben —
      // auch ohne hoch/runter zu drücken. Wer klettert, rutscht nicht
      // von selbst herunter; man hält sich an einer Sprosse fest und
      // bewegt sich nur, wenn man aktiv hoch oder runter drückt.
      const inZone = x > ladder.left - 4 && x < ladder.right + 4 && y > ladder.top - 6 && y < ladder.bottom + 6;
      onLadder = inZone && !keys["ArrowLeft"] && !keys["ArrowRight"];

      if (onLadder) {
        vy = 0;
        if (keys["ArrowUp"]) y -= CLIMB_SPEED * dt;
        else if (keys["ArrowDown"]) y += CLIMB_SPEED * dt;
        y = Math.max(ladder.top, Math.min(ladder.bottom, y)); // die FALSCHE (zu große) Zone
      } else {
        if (keys["ArrowLeft"]) x -= 100 * dt;
        if (keys["ArrowRight"]) x += 100 * dt;
      }

      if (!onLadder) {
        vy += GRAVITY * dt;
        const nextY = y + vy * dt;
        // Landung wird nur bei y <= platformY+2 erkannt — steht die Figur
        // (wegen der zu großen Zone) schon TIEFER als das, wird das nie
        // mehr wahr: sie fällt durch den scheinbar "festen" Boden.
        if (nextY >= platformY && y <= platformY + 2 && vy >= 0) { y = platformY; vy = 0; }
        else { y = nextY; if (y > H + 40) { x = 92; y = rungTop; vy = 0; } }
      }

      drawScene(platformY, ladder, x, y, onLadder);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    canvas.setAttribute("tabindex", "0"); canvas.focus();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  },
};

/* ================================================================== */
/*  Demo 2: die korrigierte Zone — bottom endet exakt auf Plattformhöhe */
/* ================================================================== */
const demoFixed = {
  run() {
    hint.textContent = "Dieselbe Leiter, jetzt endet die Zone exakt auf Plattformhöhe — Herunterklettern funktioniert und die Landung greift sofort.";
    const platformY = 200;
    const rungTop = 80, rungBottom = 160;
    // RICHTIG: die Zone endet genau eine Sprossen-Distanz unter der
    // letzten Sprosse — exakt auf Plattformhöhe, kein Überschuss
    const ladder = { left: 80, right: 105, top: rungTop, bottom: rungBottom + 24 };

    let x = 92, y = rungTop, vy = 0, onLadder = false;
    const keys = {};
    const onDown = (e) => { keys[e.code] = true; e.preventDefault(); };
    const onUp = (e) => { keys[e.code] = false; };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);

    let raf, lastTime = 0;
    const loop = (now) => {
      if (lastTime === 0) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Schwerkraft ist innerhalb der Leiterzone komplett aufgehoben —
      // auch ohne hoch/runter zu drücken (siehe Kapitel-Erklärung)
      const inZone = x > ladder.left - 4 && x < ladder.right + 4 && y > ladder.top - 6 && y < ladder.bottom + 6;
      onLadder = inZone && !keys["ArrowLeft"] && !keys["ArrowRight"];

      if (onLadder) {
        vy = 0;
        if (keys["ArrowUp"]) y -= CLIMB_SPEED * dt;
        else if (keys["ArrowDown"]) y += CLIMB_SPEED * dt;
        y = Math.max(ladder.top, Math.min(ladder.bottom, y));
      } else {
        if (keys["ArrowLeft"]) x -= 100 * dt;
        if (keys["ArrowRight"]) x += 100 * dt;
      }

      if (!onLadder) {
        vy += GRAVITY * dt;
        const nextY = y + vy * dt;
        if (nextY >= platformY && y <= platformY + 2 && vy >= 0) { y = platformY; vy = 0; }
        else { y = nextY; if (y > H + 40) { x = 92; y = rungTop; vy = 0; } }
      }

      drawScene(platformY, ladder, x, y, onLadder);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    canvas.setAttribute("tabindex", "0"); canvas.focus();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  },
};

/* ================================================================== */
/*  Demo 3: vollständige Integration — Leiter verbindet zwei            */
/*  Plattformen, freies Laufen/Springen/Klettern kombiniert             */
/* ================================================================== */
const demoFull = {
  run() {
    hint.textContent = "Alles zusammen: über die untere Plattform laufen, an die Leiter heranlaufen, hochklettern, oben normal weiterlaufen.";
    const platforms = [{ y: 200, x: 0, w: 200 }, { y: 90, x: 160, w: 200 }];
    const ladder = { left: 175, right: 200, top: 90, bottom: 200 };
    let x = 40, y = 190, vy = 0, onLadder = false, onGround = false;
    const keys = {};
    const onDown = (e) => { keys[e.code] = true; e.preventDefault(); };
    const onUp = (e) => { keys[e.code] = false; };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);

    function findLanding(nextY) {
      let best = null;
      platforms.forEach(p => {
        if (x > p.x && x < p.x + p.w && y <= p.y + 2 && nextY >= p.y) {
          if (!best || p.y < best.y) best = { y: p.y };
        }
      });
      return best;
    }

    let raf, lastTime = 0;
    const loop = (now) => {
      if (lastTime === 0) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // Schwerkraft ist innerhalb der Leiterzone komplett aufgehoben —
      // auch ohne hoch/runter zu drücken (siehe Kapitel-Erklärung)
      const inZone = x > ladder.left - 4 && x < ladder.right + 4 && y > ladder.top - 6 && y < ladder.bottom + 6;
      onLadder = inZone && !keys["ArrowLeft"] && !keys["ArrowRight"];

      if (onLadder) {
        vy = 0;
        if (keys["ArrowUp"]) y -= CLIMB_SPEED * dt;
        else if (keys["ArrowDown"]) y += CLIMB_SPEED * dt;
        y = Math.max(ladder.top, Math.min(ladder.bottom, y));
      } else {
        if (keys["ArrowLeft"]) x -= 130 * dt;
        if (keys["ArrowRight"]) x += 130 * dt;
        x = Math.max(10, Math.min(W - 10, x));
      }

      if (!onLadder) {
        if (keys["Space"] && onGround) { vy = -JUMP_SPEED; onGround = false; }
        vy += GRAVITY * dt;
        const nextY = y + vy * dt;
        const landing = findLanding(nextY);
        if (landing && vy >= 0) { y = landing.y; vy = 0; onGround = true; }
        else { y = nextY; onGround = false; if (y > H + 40) { x = 40; y = 190; vy = 0; } }
      } else {
        onGround = false;
      }

      clearStage();
      ctx.fillStyle = "#663300";
      platforms.forEach(p => ctx.fillRect(p.x, p.y, p.w, 10));
      ctx.strokeStyle = "#845232"; ctx.lineWidth = 2;
      for (let ry = ladder.top + 6; ry < ladder.bottom; ry += 10) {
        ctx.beginPath(); ctx.moveTo(ladder.left + 4, ry); ctx.lineTo(ladder.right - 4, ry); ctx.stroke();
      }
      ctx.fillStyle = onLadder ? "#a78bfa" : "#5fe0c9";
      ctx.beginPath(); ctx.arc(x, y - 6, 12, 0, Math.PI * 2); ctx.fill();

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    canvas.setAttribute("tabindex", "0"); canvas.focus();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  },
};

const DEMOS = { bug: demoBug, fixed: demoFixed, full: demoFull };
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
load("bug");
