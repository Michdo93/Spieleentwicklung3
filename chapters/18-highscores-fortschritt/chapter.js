/**
 * Kapitel 18 · Highscores & Levelfortschritt
 *
 * Das letzte Kapitel: Ergebnisse dauerhaft speichern (localStorage) und
 * die Bedingungen, die entscheiden, ob ein Durchlauf ein Sieg oder eine
 * Niederlage war — inklusive der kumulativen Lebenspunkte-Formel, die
 * Level über Level hinweg mitzählt.
 */

const buttons = document.querySelectorAll("[data-demo]");
const hint = document.getElementById("hint");
const panels = { storage: document.getElementById("panel-storage"), winlose: document.getElementById("panel-winlose"), together: document.getElementById("panel-together") };

const HIGHSCORE_KEY = "tutorial_highscores"; // eigener Schlüssel, kollidiert nicht mit Ninja Fight selbst

/* ================================================================== */
/*  Demo 1: Highscores mit localStorage                                 */
/* ================================================================== */
function loadHighscores() {
  try { return JSON.parse(localStorage.getItem(HIGHSCORE_KEY) || "[]"); }
  catch (e) { return []; }
}
function saveHighscore(name, points, level) {
  const list = loadHighscores();
  list.push({ name: name || "Anonymous", points, level });
  list.sort((a, b) => b.points - a.points);
  localStorage.setItem(HIGHSCORE_KEY, JSON.stringify(list.slice(0, 10)));
}
function renderHighscores() {
  const list = loadHighscores();
  const el = document.getElementById("highscore-list");
  el.textContent = list.length === 0 ? "Noch keine Einträge." : list.map((e, i) => `${i + 1}. ${e.name} — ${e.points} Punkte (Level ${e.level})`).join("\n");
}
document.getElementById("btn-save-score").addEventListener("click", () => {
  const name = document.getElementById("score-name").value.trim() || "Spieler";
  const points = Math.floor(Math.random() * 50) + 1;
  const level = Math.floor(Math.random() * 10) + 1;
  saveHighscore(name, points, level);
  renderHighscores();
});
document.getElementById("btn-clear-scores").addEventListener("click", () => { localStorage.removeItem(HIGHSCORE_KEY); renderHighscores(); });

/* ================================================================== */
/*  Demo 2: Sieg oder Niederlage?                                       */
/*  entspricht winGame() vs. endGame() in GameManager                    */
/* ================================================================== */
function evaluateOutcome(levelNum, maxLevels, heroAlive, enemiesRemaining, timeUp) {
  if (!heroAlive) return { won: false, reason: "Der Held ist gestorben." };
  if (timeUp && enemiesRemaining > 0) return { won: false, reason: "Zeit abgelaufen, aber noch Gegner übrig." };
  if (levelNum >= maxLevels) return { won: true, reason: "Alle Level ohne Tod abgeschlossen!" };
  return { won: null, reason: "Spiel läuft noch weiter." };
}
function updateOutcomeDisplay() {
  const levelNum = Number(document.getElementById("sim-level").value);
  const heroAlive = document.getElementById("sim-alive").checked;
  const enemiesRemaining = Number(document.getElementById("sim-enemies").value);
  const timeUp = document.getElementById("sim-timeup").checked;
  const result = evaluateOutcome(levelNum, 10, heroAlive, enemiesRemaining, timeUp);
  const el = document.getElementById("outcome-display");
  el.textContent = result.won === true ? `🏆 SIEG — ${result.reason}` : result.won === false ? `💀 NIEDERLAGE — ${result.reason}` : `▶ ${result.reason}`;
  el.style.color = result.won === true ? "#5fe0c9" : result.won === false ? "#ff6b6b" : "#5b6b7d";
}
["sim-level", "sim-alive", "sim-enemies", "sim-timeup"].forEach(id => document.getElementById(id).addEventListener("input", updateOutcomeDisplay));

/* ================================================================== */
/*  Demo 3: alles zusammen — kumulative Lebenspunkte über Level          */
/*  entspricht this.lifeEnergy += 10 * levelNum in nextLevel()           */
/* ================================================================== */
const demoLifeEnergy = {
  run() {
    let lifeEnergy = 0, levelNum = 0;
    function nextLevel() {
      levelNum++;
      lifeEnergy += 10 * levelNum; // aufaddieren, nicht zurücksetzen
      render();
    }
    function takeDamage() { lifeEnergy = Math.max(0, lifeEnergy - 7); render(); }
    function render() {
      document.getElementById("life-log").textContent =
        `Level ${levelNum}: +${10 * levelNum} -> Lebensenergie insgesamt: ${lifeEnergy}\n` + document.getElementById("life-log").textContent;
    }
    document.getElementById("btn-next-level").onclick = nextLevel;
    document.getElementById("btn-take-damage").onclick = takeDamage;
    document.getElementById("life-controls").style.display = "flex";
    document.getElementById("life-log").textContent = "";
    return () => { document.getElementById("life-controls").style.display = "none"; };
  },
};
let cleanup3 = null;

/* ================================================================== */
const HINTS = {
  storage: "localStorage übersteht einen Seitenneuladen — Einträge speichern, Seite neu laden, sie sind noch da.",
  winlose: "Regler und Kontrollkästchen verändern die Simulation live — probiere verschiedene Kombinationen aus.",
  together: "Die kumulative Formel aus GameManager.nextLevel(): jedes Level fügt Lebenspunkte hinzu, statt sie zurückzusetzen.",
};
function show(key) {
  Object.entries(panels).forEach(([k, el]) => el.style.display = k === key ? "block" : "none");
  hint.textContent = HINTS[key];
  if (key === "storage") renderHighscores();
  if (key === "winlose") updateOutcomeDisplay();
  if (cleanup3) { cleanup3(); cleanup3 = null; }
  if (key === "together") cleanup3 = demoLifeEnergy.run();
}
buttons.forEach(b => b.addEventListener("click", () => {
  buttons.forEach(x => x.classList.remove("btn-active"));
  b.classList.add("btn-active");
  show(b.dataset.demo);
}));
show("storage");
