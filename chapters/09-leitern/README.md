# Kapitel 9 · Leitern & Klettern

> Live-Demo: [`chapters/09-leitern/`](./index.html) auf GitHub Pages
> Baustein aus: `wantsToClimb`-Logik, `mergeLadderColumns()` (Ninja Fight)

## Worum es geht

Ein dritter Bewegungszustand neben Laufen und Springen — mit einer echten
Lektion aus der Entwicklung von Ninja Fight: eine falsch berechnete
Kollisionszone ließ Figuren am unteren Leiterende ins Leere fallen.

## Die drei Demos

1. **Der Bug** — die Leiter-Kollisionszone reicht (durch eine doppelt
   addierte Kachelhöhe) unter den Boden. Nach unten klettern und loslassen
   lässt die Figur durchfallen.
2. **Die Korrektur** — dieselbe Leiter, die Zone endet exakt an der
   richtigen Stelle.
3. **Volle Integration** — Laufen, Springen und Klettern kombiniert in
   einem kleinen Level mit zwei Plattformen.

## Was man hier lernt

- Klettern als eigener Zustand: Schwerkraft aus, Position direkt von der
  Tastatur gesteuert, begrenzt auf die Leiterzone
- Warum "nur klettern, wenn ausschließlich hoch/runter gedrückt wird" ganz
  ohne Gedächtnis über mehrere Frames funktioniert — sofortiger,
  eindeutiger Übergang
- Eine echte Lehre aus der Praxis: ein Off-by-one-Fehler bei einer
  Kollisionsbox-Berechnung, der erst beim tatsächlichen Durchtesten bis
  ans Ende sichtbar wurde
- Warum es sich lohnt, Kollisionszonen beim Entwickeln sichtbar zu machen

## Dateien

```
09-leitern/
├── index.html      Lernseite mit 3 Demo-Tabs
├── chapter.css        Tab-Leiste
├── chapter.js           alle drei Demos
└── README.md            diese Datei
```
