# Kapitel 2 · Sprites zeichnen

> Live-Demo: [`chapters/02-sprites-zeichnen/`](./index.html) auf GitHub Pages
> Baustein aus: `drawNinja()`, `drawTile()` (Ninja Fight)

## Worum es geht

Bilder laden und mit `drawImage()` zeichnen — in drei zunehmend nützlichen
Varianten, am Beispiel des echten Helden-Sprite-Sheets aus Ninja Fight.

## Die drei Demos

1. **drawImage()-Formen** — das ganze Sheet (3 Argumente) vs. ein
   ausgeschnittener Frame (9 Argumente: Quellrechteck + Zielrechteck).
2. **Skalierung & Position** — zwei Regler verändern nur die Zielrechteck-
   Argumente, die Bilddatei bleibt unverändert.
3. **Blickrichtung spiegeln** — `ctx.scale(-1, 1)` für links/rechts, ohne
   zwei separate Bilder zu brauchen.

## Was man hier lernt

- Bilder laden ist asynchron — vor dem ersten Zeichnen muss man warten
- Die drei `drawImage()`-Formen und wann welche sinnvoll ist
- Die 9-Argumente-Form (Quell- + Zielrechteck) als Grundlage für alle
  Sprite-Sheet-Arbeit — direkt weitergeführt in Kapitel 3
- `translate()` → `scale()` → zeichnen relativ zu `(0,0)` als Standardmuster
  für Spiegelungen, exakt wie in `drawNinja()`

## Dateien

```
02-sprites-zeichnen/
├── index.html      Lernseite mit 3 Demo-Tabs
├── chapter.css        Tab-Leiste, Regler-Styles
├── chapter.js          alle drei Demos
├── assets/
│   ├── hero.png          echtes Sprite-Sheet aus Ninja Fight
│   └── tiles.png          echtes Kachel-Sheet aus Ninja Fight
└── README.md            diese Datei
```
