/**
 * Kapitel 4 · Tastatur- & Maus-Eingabe
 *
 * Der Baustein, der ein bewegliches Rechteck (Kapitel 1) zu etwas macht,
 * das man tatsächlich STEUERN kann. Das hier aufgebaute keys-Objekt ist
 * wortwörtlich dieselbe Struktur wie GameManager.keys in Ninja Fight.
 */

const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const W = canvas.width, H = canvas.height;
const buttons = document.querySelectorAll("[data-demo]");
const hint = document.getElementById("hint");
const log = document.getElementById("event-log");
const logWrap = document.getElementById("event-log-wrap");

function clearStage() { ctx.fillStyle = "#0b1a24"; ctx.fillRect(0, 0, W, H); }
function trace(msg) { log.textContent = msg + "\n" + log.textContent; }

/* ================================================================== */
/*  Demo 1: rohe Tastatur-Events                                       */
/*  Zeigt das Problem: ein Event feuert einmal, nicht "solange gehalten"*/
/* ================================================================== */
const demoRawEvents = {
  run() {
    hint.textContent = "Jeder Tastendruck erzeugt ein einzelnes Event — nicht 'ist gerade gedrückt', sondern 'wurde gerade gedrückt/losgelassen'.";
    logWrap.style.display = "block";
    log.textContent = "";
    clearStage();
    ctx.fillStyle = "#5b6b7d"; ctx.font = "14px 'JetBrains Mono'";
    ctx.fillText("Tippe eine beliebige Taste …", 20, H / 2);

    const onDown = (e) => trace(`keydown:  key="${e.key}"  code="${e.code}"`);
    const onUp = (e) => trace(`keyup:    key="${e.key}"  code="${e.code}"`);
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => { window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  },
};

/* ================================================================== */
/*  Demo 2: das Key-State-Objekt — exakt GameManager.keys aus           */
/*  Ninja Fight. keydown setzt ein Flag auf true, keyup wieder auf     */
/*  false; der Game-Loop fragt die Flags ab, statt auf Events zu       */
/*  reagieren.                                                          */
/* ================================================================== */
const demoKeyState = {
  run() {
    hint.textContent = "keydown setzt keys.right = true, keyup setzt es zurück auf false — der Loop fragt das Flag jeden Frame ab.";
    logWrap.style.display = "none";

    // entspricht exakt GameManager.keys in Ninja Fight
    const keys = { left: false, right: false, up: false, down: false };

    function keyDown(e) {
      switch (e.code) {
        case "ArrowLeft": case "KeyA": keys.left = true; break;
        case "ArrowRight": case "KeyD": keys.right = true; break;
        case "ArrowUp": case "KeyW": keys.up = true; break;
        case "ArrowDown": case "KeyS": keys.down = true; break;
      }
    }
    function keyUp(e) {
      switch (e.code) {
        case "ArrowLeft": case "KeyA": keys.left = false; break;
        case "ArrowRight": case "KeyD": keys.right = false; break;
        case "ArrowUp": case "KeyW": keys.up = false; break;
        case "ArrowDown": case "KeyS": keys.down = false; break;
      }
    }
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

    let x = W / 2, y = H / 2;
    let raf;
    const SPEED = 180;
    let lastTime = 0;
    const loop = (now) => {
      if (lastTime === 0) lastTime = now;
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      // der Loop fragt nur die Flags ab — er weiß nichts von Events
      if (keys.left) x -= SPEED * dt;
      if (keys.right) x += SPEED * dt;
      if (keys.up) y -= SPEED * dt;
      if (keys.down) y += SPEED * dt;
      x = Math.max(20, Math.min(W - 20, x));
      y = Math.max(20, Math.min(H - 20, y));

      clearStage();
      ctx.fillStyle = "#5fe0c9";
      ctx.beginPath(); ctx.arc(x, y, 20, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#5b6b7d"; ctx.font = "13px 'JetBrains Mono'";
      ctx.fillText(`keys = { left:${keys.left}, right:${keys.right}, up:${keys.up}, down:${keys.down} }`, 14, 24);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    canvas.setAttribute("tabindex", "0");
    canvas.focus();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };
  },
};

/* ================================================================== */
/*  Demo 3: Maus-Klicks erkennen — derselbe Rechteck-Trefftest wie      */
/*  bei der Charakter-Auswahl per Klick oder bei jedem Menü-Button      */
/* ================================================================== */
const demoClick = {
  run() {
    hint.textContent = "Klick-Koordinaten in Canvas-Koordinaten umrechnen, dann ein Rechteck-Trefftest — derselbe Trick für Menü-Buttons wie für Charakter-Auswahl.";
    logWrap.style.display = "block";
    log.textContent = "";

    const box = { x: W / 2 - 60, y: H / 2 - 40, w: 120, h: 80 };
    function draw(hover) {
      clearStage();
      ctx.fillStyle = hover ? "#ffb84d" : "#5fe0c9";
      ctx.fillRect(box.x, box.y, box.w, box.h);
      ctx.strokeStyle = "#0a0e14"; ctx.lineWidth = 2;
      ctx.strokeRect(box.x, box.y, box.w, box.h);
      ctx.fillStyle = "#0a0e14"; ctx.font = "13px 'JetBrains Mono'";
      ctx.fillText("Klick mich", box.x + 18, box.y + box.h / 2 + 4);
    }
    draw(false);

    function toCanvasCoords(e) {
      // WICHTIG: e.clientX/Y sind Bildschirmkoordinaten — man muss die
      // Position des Canvas auf der Seite abziehen, sonst passt der
      // Trefftest nicht, sobald das Canvas nicht bei (0,0) beginnt.
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    function isInside(p) {
      return p.x > box.x && p.x < box.x + box.w && p.y > box.y && p.y < box.y + box.h;
    }

    const onMove = (e) => draw(isInside(toCanvasCoords(e)));
    const onClick = (e) => {
      const p = toCanvasCoords(e);
      trace(`Klick bei (${p.x.toFixed(0)}, ${p.y.toFixed(0)}) — ${isInside(p) ? "GETROFFEN" : "daneben"}`);
    };
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("click", onClick);
    return () => { canvas.removeEventListener("mousemove", onMove); canvas.removeEventListener("click", onClick); };
  },
};

const DEMOS = { raw: demoRawEvents, state: demoKeyState, click: demoClick };
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
load("raw");
