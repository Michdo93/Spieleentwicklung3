/**
 * Kapitel 15 · Sound & Musik
 *
 * Baut SoundController aus Ninja Fight nach: Hintergrundmusik, die je
 * nach Spielzustand wechselt, kurze Soundeffekte, die schnell
 * hintereinander auslösbar sein müssen, und eine gemeinsame
 * Lautstärkeregelung für alles zusammen.
 */

const buttons = document.querySelectorAll("[data-demo]");
const hint = document.getElementById("hint");
const panels = { music: document.getElementById("panel-music"), sfx: document.getElementById("panel-sfx"), volume: document.getElementById("panel-volume") };

/* ================================================================== */
/*  SoundController — entspricht der Klasse in Ninja Fight              */
/* ================================================================== */
class SoundController {
  constructor() {
    this.menuMusic = new Audio("assets/Game-Menu.mp3");
    this.gameMusic = new Audio("assets/Lost-Jungle.mp3");
    this.swordSfx = new Audio("assets/sword.mp3");
    this.coinsSfx = new Audio("assets/Coins.mp3");
    this.menuMusic.loop = true;
    this.gameMusic.loop = true;
    this.volume = 0.6;
    this.applyVolume();
  }
  applyVolume() {
    [this.menuMusic, this.gameMusic, this.swordSfx, this.coinsSfx].forEach(a => a.volume = this.volume);
  }
  changeVolume(v) { this.volume = Math.max(0, Math.min(1, v)); this.applyVolume(); }
  // WICHTIG: die jeweils andere Musik zuerst stoppen — sonst würden
  // Menü- und Spielmusik gleichzeitig übereinander laufen
  playMenuMusic() { this.gameMusic.pause(); this.menuMusic.currentTime = 0; this.menuMusic.play().catch(() => {}); }
  playGameMusic() { this.menuMusic.pause(); this.gameMusic.currentTime = 0; this.gameMusic.play().catch(() => {}); }
  stopAll() { this.menuMusic.pause(); this.gameMusic.pause(); }
  // currentTime = 0 vor jedem Abspielen erlaubt schnelles Nacheinander-
  // Auslösen, ohne auf das Ende des vorigen Sounds warten zu müssen
  playSword() { this.swordSfx.currentTime = 0; this.swordSfx.play().catch(() => {}); }
  playCoins() { this.coinsSfx.currentTime = 0; this.coinsSfx.play().catch(() => {}); }
}

const sound = new SoundController();

/* ================================================================== */
/*  Demo 1: Musik abspielen & zwischen Menü/Spiel wechseln              */
/* ================================================================== */
document.getElementById("btn-menu-music").addEventListener("click", () => { sound.playMenuMusic(); updateStatus("Menü-Musik läuft"); });
document.getElementById("btn-game-music").addEventListener("click", () => { sound.playGameMusic(); updateStatus("Spiel-Musik läuft"); });
document.getElementById("btn-stop-music").addEventListener("click", () => { sound.stopAll(); updateStatus("Musik gestoppt"); });
function updateStatus(msg) { document.getElementById("music-status").textContent = msg; }

/* ================================================================== */
/*  Demo 2: Soundeffekte — mehrfach schnell hintereinander auslösbar    */
/* ================================================================== */
let swordCount = 0, coinsCount = 0;
function updateSfxDisplay() {
  document.getElementById("sfx-count").textContent =
    `Schwert: ${swordCount}× · Münzen: ${coinsCount}× (beide unabhängig zählbar, auch mehrfach schnell hintereinander)`;
}
document.getElementById("btn-sword-sfx").addEventListener("click", () => {
  sound.playSword();
  swordCount++;
  updateSfxDisplay();
});
document.getElementById("btn-coins-sfx").addEventListener("click", () => {
  sound.playCoins();
  coinsCount++;
  updateSfxDisplay();
});
updateSfxDisplay();

/* ================================================================== */
/*  Demo 3: gemeinsame Lautstärke für alles                             */
/* ================================================================== */
document.getElementById("volume-slider").addEventListener("input", (e) => {
  sound.changeVolume(Number(e.target.value) / 100);
  document.getElementById("volume-value").textContent = `${e.target.value}%`;
});
document.getElementById("btn-test-volume").addEventListener("click", () => sound.playSword());

/* ================================================================== */
const HINTS = {
  music: "Menü- und Spielmusik schließen sich gegenseitig aus — playMenuMusic() stoppt automatisch die Spielmusik und umgekehrt.",
  sfx: "currentTime = 0 vor jedem play() erlaubt, denselben Sound mehrfach schnell hintereinander abzuspielen, ohne auf das Ende zu warten.",
  volume: "Ein Regler steuert die Lautstärke für Musik UND Soundeffekte gleichzeitig — jede Audio-Datei bekommt denselben volume-Wert zugewiesen.",
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
show("music");
