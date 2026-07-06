# Kapitel 7 · Level-Daten & Tile-Rendering

> Live-Demo: [`chapters/07-level-daten/`](./index.html) auf GitHub Pages
> Baustein aus: `levels.js`, `buildLevel()`, `drawTile()` (Ninja Fight)

## Worum es geht

Kapitel 6 hat Plattformen direkt im Code definiert. Das reicht für eine
Demo, aber nicht für ein Spiel mit vielen Leveln. Dieses Kapitel trennt
"was steht wo" (Daten) von "was bedeutet das" (Code).

## Die drei Demos

1. **Hartkodiert vs. Daten** — derselbe Level, einmal als direkte
   `fillRect()`-Aufrufe, einmal als Datenliste.
2. **buildLevel()** — eine flache `{type,x,y}`-Liste wird nach Bedeutung
   sortiert (Plattformen/Leitern/Gefahren).
3. **Level austauschen** — derselbe Rendering-Code zeichnet zwei völlig
   unterschiedliche Level, nur die Datenliste ändert sich.

## Was man hier lernt

- Warum hartkodierte Level-Geometrie bei mehreren Leveln schnell
  unhaltbar wird
- Level als reine Daten (`{ type, x, y }`) statt als Code beschreiben —
  genau das Format von `levels.js`
- `buildLevel()` als der eine Ort, an dem Rohdaten einmal nach Bedeutung
  sortiert werden, damit der Rest des Spiels nie wieder rohe Typnamen
  anfassen muss
- Der eigentliche Gewinn: ein neuer Level braucht keine Code-Änderung,
  nur eine neue Datenliste

## Dateien

```
07-level-daten/
├── index.html      Lernseite mit 3 Demo-Tabs
├── chapter.css        Tab-Leiste
├── chapter.js           alle drei Demos
├── assets/tiles.png       echtes Kachel-Sheet aus Ninja Fight
└── README.md            diese Datei
```
