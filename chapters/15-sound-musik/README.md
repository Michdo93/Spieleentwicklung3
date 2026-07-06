# Kapitel 15 · Sound & Musik

> Live-Demo: [`chapters/15-sound-musik/`](./index.html) auf GitHub Pages
> Baustein aus: `SoundController` (Ninja Fight)

## Worum es geht

Baut `SoundController` aus Ninja Fight nach: Hintergrundmusik, die je nach
Spielzustand wechselt, kurze Soundeffekte, und eine gemeinsame
Lautstärkeregelung für alles zusammen.

## Die drei Demos

1. **Musik wechseln** — Menü- und Spielmusik schließen sich gegenseitig
   aus, jede `play…Music()`-Methode stoppt zuerst die andere.
2. **Soundeffekte** — `currentTime = 0` vor jedem `play()` erlaubt
   schnelles, wiederholtes Auslösen desselben Sounds.
3. **Lautstärke** — ein Regler beeinflusst Musik und Soundeffekte
   gleichzeitig über einen gemeinsamen Lautstärke-Wert.

## Original-Audiodateien

Alle vier Sounds in diesem Kapitel (`Game-Menu.mp3`, `Lost-Jungle.mp3`,
`sword.mp3`, `Coins.mp3`) sind unveränderte Original-Assets aus Ninja
Fight.

## Was man hier lernt

- Warum sich wechselnde Musikstücke gegenseitig explizit stoppen müssen,
  statt sich darauf zu verlassen, dass nur eines "gemeint" ist
- Der `currentTime = 0`-Trick für wiederholt auslösbare Soundeffekte
- Eine gemeinsame Lautstärke für mehrere `Audio`-Objekte lässt sich mit
  einer einzigen Schleife umsetzen

## Dateien

```
15-sound-musik/
├── index.html      Lernseite mit 3 Demo-Tabs
├── chapter.css        Panel-Styles
├── chapter.js           SoundController-Klasse, alle drei Demos
├── assets/
│   ├── Game-Menu.mp3       Original-Menümusik
│   ├── Lost-Jungle.mp3      Original-Spielmusik
│   ├── sword.mp3             Original-Soundeffekt
│   └── Coins.mp3              Original-Soundeffekt
└── README.md            diese Datei
```
