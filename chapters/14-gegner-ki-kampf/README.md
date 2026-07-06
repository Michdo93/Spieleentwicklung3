# Kapitel 14 · Gegner-KI: Kampf & Gegnertypen

> Live-Demo: [`chapters/14-gegner-ki-kampf/`](./index.html) auf GitHub Pages
> Baustein aus: `ENEMY_TYPES`, `HP_BY_TYPE`, Angriffsentscheidung in `Enemy.update()` (Ninja Fight)

## Worum es geht

Bewegung (Kapitel 13) allein macht noch keinen Gegner gefährlich. Dieses
Kapitel baut die Angriffsentscheidung aus `Enemy.update()` nach: je nach
Abstand ein anderer Angriff, je nach Gegnertyp überhaupt erst verfügbar.

## Die drei Demos

1. **Aggro-Bereich** — die Angriffsentscheidung ändert sich live mit dem
   Abstand zum Ziel.
2. **Gegnertypen** — vier Typen mit unterschiedlichen HP und
   Spezialfähigkeiten (Shuriken/Schwert).
3. **Friendly Fire** — ein Projektil trifft jeden außer seinem Werfer,
   auch andere Gegner.

## Was man hier lernt

- Ein einfacher Entscheidungsbaum nach Abstand reicht für glaubwürdiges
  Angriffsverhalten — die Prüfreihenfolge (Nahkampf zuerst) ist dabei
  wichtig
- Fähigkeiten und Lebenspunkte lassen sich sauber an den Gegnertyp koppeln,
  statt für jeden Typ eigenen Code zu schreiben
- Ein generisches "trifft jeden außer dem Werfer"-Muster (aus Kapitel 11)
  bringt Friendly Fire quasi gratis mit — ganz ohne eigene Team-Logik

## Dateien

```
14-gegner-ki-kampf/
├── index.html      Lernseite mit 3 Demo-Tabs
├── chapter.css        Tab-Leiste
├── chapter.js           alle drei Demos
├── assets/
│   ├── hero.png            echte Sprite-Sheets aus Ninja Fight
│   ├── blue.png
│   ├── green.png
│   ├── red.png
│   └── white.png
└── README.md            diese Datei
```
