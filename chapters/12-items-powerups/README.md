# Kapitel 12 · Items & Power-Ups

> Live-Demo: [`chapters/12-items-powerups/`](./index.html) auf GitHub Pages
> Baustein aus: `PowerUp`-Klasse, `collectPowerUp()` (Ninja Fight)

## Worum es geht

Ein Power-Up ist im Kern ein kleiner Cousin der Figuren aus den vorigen
Kapiteln — es fällt mit derselben Schwerkraft, landet auf derselben Art
Plattform, nur ohne eigene Steuerung.

## Die drei Demos

1. **Ein fallendes Item** — dieselbe Schwerkraft/Landung wie eine Figur,
   nur ohne Steuerung.
2. **Drei Effekt-Arten** — sofortig (Herz), zeitbegrenzt (Schwert, 30s-
   Timer), zählbegrenzt (Shuriken, Munitionszähler).
3. **Jeder kann es aufheben** — Held und Gegner werden beide auf Kollision
   geprüft, wer zuerst ankommt, bekommt das Item.

## Was man hier lernt

- Ein Power-Up braucht keine neue Physik — dieselbe Schwerkraft und
  Landungslogik wie jede andere Figur reicht
- Drei grundverschiedene Effekt-Muster: sofortig (keine Nachwirkung),
  zeitbegrenzt (eigener Countdown-Timer), zählbegrenzt (Zähler statt Timer)
- Warum es sich lohnt, die Kollisionsprüfung eines Items gegen **alle**
  Figuren laufen zu lassen, nicht nur gegen den Spieler — das ermöglicht
  das "Gegner klaut Item"-Verhalten ganz ohne Sonderfall-Code

## Dateien

```
12-items-powerups/
├── index.html      Lernseite mit 3 Demo-Tabs
├── chapter.css        Tab-Leiste, Status-Anzeige
├── chapter.js           alle drei Demos, PowerUp-Klasse
├── assets/
│   ├── tiles.png            enthält Heart/Sword/Shuriken-Sprites
│   ├── hero.png              echtes Sprite-Sheet aus Ninja Fight
│   └── blue.png               echtes Gegner-Sprite-Sheet
└── README.md            diese Datei
```
