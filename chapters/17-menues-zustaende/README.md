# Kapitel 17 · Menüs & Spielzustände

> Live-Demo: [`chapters/17-menues-zustaende/`](./index.html) auf GitHub Pages
> Baustein aus: `ui.showScreen()` (Ninja Fight)

## Worum es geht

Baut `ui.showScreen()` aus Ninja Fight nach — und zeigt einen echten
CSS-Bug aus der Entwicklung: eine gemeinsame Basisklasse verdunkelte
versehentlich auch den Spielbildschirm selbst.

## Die drei Demos

1. **Bildschirme als Zustandsmaschine** — `showScreen(name)` schaltet
   zwischen Start/Pause/Einstellungen, nie zwei gleichzeitig sichtbar.
2. **Der echte Bug** — eine gemeinsame `.screen`-Basisklasse verdunkelt
   auch den Spielbildschirm, live nachvollziehbar per Umschalter.
3. **ESC-Taste** — Tastatursteuerung für denselben Zustandswechsel wie
   bei Button-Klicks.

## Was man hier lernt

- Das Grundmuster für mehrere sich gegenseitig ausschließende
  Bildschirme: eine "aktiv"-Klasse, die immer nur auf einem Element sitzt
- Ein echter CSS-Spezifitätsfehler: eine Basisklasse, die für alle
  Bildschirme gedacht war, traf versehentlich auch den, der über dem
  eigentlichen Spiel liegt
- Wie ein ID-Selektor gezielt eine Klassen-Regel überschreiben kann,
  unabhängig davon, welche zusätzlichen Klassen ein Element trägt
- Tastatur- und Maus-Eingabe können denselben Zustandswechsel auslösen

## Dateien

```
17-menues-zustaende/
├── index.html      Lernseite mit 3 Demo-Tabs
├── chapter.css        Mock-Bildschirm-Styles, Bug-Reproduktion
├── chapter.js           alle drei Demos
└── README.md            diese Datei
```
