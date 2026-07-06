# Kapitel 11 · Fernkampf & Projektile

> Live-Demo: [`chapters/11-fernkampf/`](./index.html) auf GitHub Pages
> Baustein aus: `Projectile`-Klasse (Ninja Fight)

## Worum es geht

Eine der dokumentierten Lücken im Original-Ninja-Fight: die Shuriken-
Wurfanimation lief, aber es wurde nie ein tatsächliches Objekt erzeugt,
das sich durch den Raum bewegt (KnownBugs #1). Dieses Kapitel zeigt das
Problem und die Lösung.

## Die drei Demos

1. **Nur Animation (Bug)** — der Original-Zustand: eine Wurfbewegung
   ohne jedes Objekt, das tatsächlich fliegt.
2. **Echtes Objekt** — die `Projectile`-Klasse: eigene Position, eigene
   Geschwindigkeit, eigenes `update()`.
3. **Kollision** — das Projektil kennt seinen Werfer und trifft alle
   anderen Figuren.

## Was man hier lernt

- Der Unterschied zwischen "eine Animation abspielen" und "ein Objekt
  erzeugen, das eigenständig existiert" — ein Wurf braucht beides, nicht
  nur die Animation
- Wie ein Projektil als eigene Klasse mit eigener `update()`-Methode
  unabhängig von seinem Werfer funktioniert
- Warum ein Projektil seinen eigenen Werfer kennen und ausschließen sollte
  — die Grundlage für Friendly Fire in einem späteren Kapitel

## Dateien

```
11-fernkampf/
├── index.html      Lernseite mit 3 Demo-Tabs
├── chapter.css        Tab-Leiste
├── chapter.js           alle drei Demos, Projectile-Klasse
├── assets/
│   ├── hero.png            echtes Sprite-Sheet aus Ninja Fight
│   ├── green.png            echtes Gegner-Sprite-Sheet
│   └── tiles.png             enthält das Shuriken-Sprite
└── README.md            diese Datei
```
