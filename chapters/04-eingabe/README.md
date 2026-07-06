# Kapitel 4 · Tastatur- & Maus-Eingabe

> Live-Demo: [`chapters/04-eingabe/`](./index.html) auf GitHub Pages
> Baustein aus: `GameManager.keys`, `keyDown()`/`keyUp()` (Ninja Fight)

## Worum es geht

Der Baustein, der ein bewegliches Rechteck (Kapitel 1) zu etwas macht, das
man tatsächlich steuern kann.

## Die drei Demos

1. **Rohe Events** — `keydown`/`keyup` feuern einmal pro Tastendruck, kein
   Zustand, nur Momentaufnahmen.
2. **Key-State-Objekt** — genau `GameManager.keys` aus Ninja Fight: Events
   setzen nur Flags, der Loop fragt sie jeden Frame ab.
3. **Maus-Klicks** — Koordinaten umrechnen (`getBoundingClientRect()`),
   dann ein normaler Rechteck-Trefftest.

## Was man hier lernt

- Warum rohe Tastatur-Events allein nicht reichen, um "Taste wird
  gehalten" abzubilden
- Das Key-State-Muster: Eingabe-Erkennung und Bewegungslogik vollständig
  trennen — Events setzen nur Flags, die eigentliche Logik fragt sie ab
- `e.key` (Zeichen, Layout-abhängig) vs. `e.code` (physische Taste,
  Layout-unabhängig) — und warum Ninja Fight durchgehend `e.code` verwendet
- Mausklick-Koordinaten in Canvas-Koordinaten umrechnen, bevor man einen
  Trefftest macht

## Dateien

```
04-eingabe/
├── index.html      Lernseite mit 3 Demo-Tabs
├── chapter.css        Tab-Leiste, Log-Panel
├── chapter.js           alle drei Demos
└── README.md            diese Datei
```
