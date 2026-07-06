/**
 * Kapitel 17 · Menüs & Spielzustände
 *
 * Baut ui.showScreen() aus Ninja Fight nach — und zeigt einen echten
 * CSS-Bug aus der Entwicklung: eine gemeinsame Basisklasse für alle
 * Bildschirme legte versehentlich einen abdunkelnden Hintergrund auch
 * über den Spielbildschirm selbst, der während des Spiels über dem
 * Canvas liegt.
 */

const buttons = document.querySelectorAll("[data-demo]");
const hint = document.getElementById("hint");
const panels = { screens: document.getElementById("panel-screens"), bug: document.getElementById("panel-bug"), esc: document.getElementById("panel-esc") };

/* ================================================================== */
/*  Demo 1: showScreen() — nur ein Bildschirm ist je aktiv               */
/* ================================================================== */
const ui1 = {
  showScreen(name) {
    document.querySelectorAll("#mock-frame-1 .mock-screen").forEach(s => s.classList.remove("active"));
    const el = document.getElementById("mock-" + name);
    if (el) el.classList.add("active");
    document.getElementById("current-screen-label").textContent = `aktueller Bildschirm: "${name}"`;
  },
};
["start", "pause", "settings"].forEach(name => {
  document.getElementById("btn-screen-" + name).addEventListener("click", () => ui1.showScreen(name));
});

/* ================================================================== */
/*  Demo 2: der echte Bug — .screen-Basisklasse verdunkelt ALLES,        */
/*  auch #screen-game, der während des Spiels über dem Canvas liegt.     */
/* ================================================================== */
document.getElementById("btn-toggle-bug").addEventListener("click", () => {
  const frame = document.getElementById("mock-frame-2");
  frame.classList.toggle("bug-active");
  const fixed = frame.classList.contains("bug-active");
  document.getElementById("bug-status").textContent = fixed
    ? "FEHLERHAFT: #screen-game erbt den dunklen Hintergrund der Basisklasse .screen"
    : "KORRIGIERT: #screen-game { background: none; } überschreibt die Basisklasse gezielt";
});

/* ================================================================== */
/*  Demo 3: ESC-Taste pausiert/setzt fort                               */
/* ================================================================== */
let gameRunning = false;
function startMockGame() {
  gameRunning = true;
  document.getElementById("mock-frame-3").classList.remove("paused");
  document.getElementById("esc-status").textContent = "Spiel läuft — ESC drücken zum Pausieren";
}
function toggleEscPause() {
  if (!gameRunning) return;
  const frame = document.getElementById("mock-frame-3");
  frame.classList.toggle("paused");
  const paused = frame.classList.contains("paused");
  document.getElementById("esc-status").textContent = paused ? "Pausiert — ESC oder 'Weiter' zum Fortsetzen" : "Spiel läuft — ESC drücken zum Pausieren";
}
document.getElementById("btn-start-game").addEventListener("click", startMockGame);
document.getElementById("btn-resume").addEventListener("click", toggleEscPause);
window.addEventListener("keydown", (e) => { if (e.code === "Escape" && panels.esc.style.display !== "none") { toggleEscPause(); e.preventDefault(); } });

/* ================================================================== */
const HINTS = {
  screens: 'showScreen(name) entfernt die "active"-Klasse von allen Bildschirmen und setzt sie nur auf den gewünschten — nie zwei Bildschirme gleichzeitig sichtbar.',
  bug: "Auf 'Bug umschalten' klicken — das Canvas-Ersatzfeld wird plötzlich abgedunkelt, obwohl gar kein Menü-Bildschirm aktiv sein soll.",
  esc: "ESC pausiert und setzt fort — echte Tastatursteuerung für Zustandswechsel, nicht nur Buttons.",
};
function show(key) {
  Object.entries(panels).forEach(([k, el]) => el.style.display = k === key ? "block" : "none");
  hint.textContent = HINTS[key];
}
buttons.forEach(b => b.addEventListener("click", () => {
  buttons.forEach(x => x.classList.remove("btn-active"));
  b.classList.add("btn-active");
  show(b.dataset.demo);
}));
show("screens");
