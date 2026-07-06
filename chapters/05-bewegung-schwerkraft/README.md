# Kapitel 5 · Bewegung & Schwerkraft

> Live-Demo: [`chapters/05-bewegung-schwerkraft/`](./index.html) auf GitHub Pages
> Baustein aus: `Hero.update()`, `GRAVITY`, `JUMP_SPEED` (Ninja Fight)

## Worum es geht

Kapitel 4 hat Tasten direkt in Position übersetzt (`x += SPEED*dt`). Für
einen Sprung reicht das nicht — dieses Kapitel führt Geschwindigkeit als
eigenen Wert ein und baut daraus exakt die Sprungphysik aus
`Hero.update()`.

## Die drei Demos

1. **Position vs. Geschwindigkeit** — konstante Bewegung vs. eine
   Geschwindigkeit, die sich selbst über Zeit verändert.
2. **Schwerkraft** — `vy += GRAVITY*dt; y += vy*dt;`, dieselben zwei
   Zeilen wie in Ninja Fight.
3. **Sprung** — Leertaste setzt einen einmaligen negativen `vy`-Anstoß,
   danach übernimmt dieselbe Schwerkraft wie in Demo 2.

## Was man hier lernt

- Warum Beschleunigung (Sprünge, Schwerkraft) einen eigenen
  Geschwindigkeitswert braucht statt direkter Positionsänderung
- Dass Schwerkraft nur eine sich ständig erhöhende Fallgeschwindigkeit ist
- Dass ein Sprung keine eigene Physik ist — nur ein einmaliger Anstoß nach
  oben, auf den dieselbe Schwerkraft wie beim Fallen wirkt
- Warum die Landungsprüfung `vy >= 0` verlangt (nicht beim Hochfliegen
  "landen")

## Dateien

```
05-bewegung-schwerkraft/
├── index.html      Lernseite mit 3 Demo-Tabs
├── chapter.css        Tab-Leiste
├── chapter.js           alle drei Demos
└── README.md            diese Datei
```
