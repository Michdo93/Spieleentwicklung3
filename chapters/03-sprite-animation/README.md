# Kapitel 3 · Sprite-Animation

> Live-Demo: [`chapters/03-sprite-animation/`](./index.html) auf GitHub Pages
> Baustein aus: `drawNinja()`, `CHARACTER_SHEET` (Ninja Fight)

## Worum es geht

Ein einzelner Frame (Kapitel 2) ist nur eine Pose. Eine Animation ist
nichts weiter als: mehrere Poses schnell genug nacheinander zeigen. Dieses
Kapitel baut Schritt für Schritt die Logik auf, die `drawNinja()` in
Ninja Fight tatsächlich verwendet.

## Die drei Demos

1. **Von Hand** — Frame für Frame per Klick durch die Walk-Animation
   schalten. Reines Prinzip, keine Automatik.
2. **Automatisch (Zeit)** — `frame = Math.floor(t * fps) % count`, dieselbe
   Formel wie in `drawNinja()`. Ein Regler verändert die Abspielgeschwindigkeit.
3. **Mehrere Zustände** — Idle/Walk laufen endlos, Jump läuft einmal durch
   und bleibt am letzten Frame stehen.

## Was man hier lernt

- Ein Sprite-Sheet ist eine Tabelle: Zeilen = Zustände, Spalten = Frames
- Die eine Formel, die Zeit in einen Frame-Index übersetzt
- Der Unterschied zwischen `% count` (Endlosschleife) und
  `Math.min(x, count-1)` (einmalig, am Ende stehen bleiben) — und warum
  beide im selben Spiel gebraucht werden

## Dateien

```
03-sprite-animation/
├── index.html      Lernseite mit 3 Demo-Tabs
├── chapter.css        Tab-Leiste, Regler-Styles
├── chapter.js          alle drei Demos
├── assets/hero.png       echtes Sprite-Sheet aus Ninja Fight
└── README.md            diese Datei
```
