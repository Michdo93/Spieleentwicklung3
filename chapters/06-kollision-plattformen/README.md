# Kapitel 6 · Kollision & Plattformen

> Live-Demo: [`chapters/06-kollision-plattformen/`](./index.html) auf GitHub Pages
> Baustein aus: `overlaps()`, `rectOf()`, `findLanding()` (Ninja Fight)

## Worum es geht

Kapitel 5 ist gegen einen fest einprogrammierten Bodenwert gesprungen. Ein
echtes Level braucht mehrere Plattformen an unterschiedlichen Stellen —
dieses Kapitel baut dafür exakt `findLanding()` aus Ninja Fight nach.

## Die drei Demos

1. **AABB-Kollision** — der Grundtest, den `overlaps()`/`rectOf()` im
   ganzen Spiel wiederverwenden (Schwert-Treffer, Projektile, Gefahren).
2. **Landung** — `findLanding()`: horizontal drüber + eben noch drüber +
   jetzt (fast) drauf = Landung erkannt.
3. **Mehrere Plattformen** — derselbe Test in einer Schleife, plus die
   Trefferbox-vs-Sprite-Unterscheidung sichtbar gemacht.

## Was man hier lernt

- Der AABB-Test: zwei Rechtecke überlappen sich, wenn sie sich auf beiden
  Achsen gleichzeitig überschneiden
- Warum "Landung" mehr Bedingungen braucht als reines "überlappt gerade" —
  sonst würde man auch von unten gegen eine Plattform "landen"
- Wie man mit mehreren Plattformen umgeht (dieselbe Prüfung, die höchste
  passende merken)
- Dass die Trefferbox einer Figur bewusst kleiner sein kann als ihr
  gezeichnetes Sprite — das fühlt sich beim Spielen fairer an

## Dateien

```
06-kollision-plattformen/
├── index.html      Lernseite mit 3 Demo-Tabs
├── chapter.css        Tab-Leiste
├── chapter.js           alle drei Demos
└── README.md            diese Datei
```
