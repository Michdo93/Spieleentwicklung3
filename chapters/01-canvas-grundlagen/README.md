# Kapitel 1 · Canvas-Grundlagen & Game-Loop

> Live-Demo: [`chapters/01-canvas-grundlagen/`](./index.html) auf GitHub Pages
> Baustein aus: `GameManager.loop()` (Ninja Fight)

## Worum es geht

Der Ausgangspunkt für alles Weitere: ein `<canvas>`-Element, sein
2D-Zeichenkontext, und die Schleife, die ein Standbild zu einem Spiel
macht.

## Die drei Demos

1. **Statisches Zeichnen** — ein einziger `fillRect()`-Aufruf, kein Loop.
   Das Bild steht für immer fest.
2. **Naiver Loop** — `requestAnimationFrame()` mit einem festen Schritt pro
   Frame. Funktioniert, aber die Geschwindigkeit hängt von der Bildrate ab.
3. **Zeitbasierter Loop** — dieselbe Struktur wie `GameManager.loop()` in
   Ninja Fight: die tatsächlich vergangene Zeit (`dt`) wird gemessen und
   die Bewegung damit skaliert. Läuft auf jedem Gerät gleich schnell.

## Was man hier lernt

- Dass ein `<canvas>` ohne Loop nur ein Standbild ist
- Warum "ein fester Pixel-Schritt pro Frame" eine verlockende, aber
  fehlerhafte erste Lösung ist
- Die `dt`-basierte Loop-Struktur, die im gesamten restlichen Tutorial und
  im fertigen Ninja-Fight-Spiel wiederverwendet wird

## Dateien

```
01-canvas-grundlagen/
├── index.html      Lernseite mit 3 Demo-Tabs
├── chapter.css        Tab-Leiste
├── chapter.js          alle drei Loop-Varianten
└── README.md            diese Datei
```
