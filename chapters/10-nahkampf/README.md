# Kapitel 10 · Nahkampf & Hitboxen

> Live-Demo: [`chapters/10-nahkampf/`](./index.html) auf GitHub Pages
> Baustein aus: `hitNearbyEnemies()`, `attackHitDone`, `DAMAGE` (Ninja Fight)

## Worum es geht

Kapitel 6 hat AABB-Kollision für Landung genutzt — dieselbe Technik
erkennt auch Treffer. Dieses Kapitel baut den Angriffs-Teil aus
`Hero.update()` nach.

## Die drei Demos

1. **Trefferzone** — die Angriffszone liegt immer vor der Figur, ihre
   Position hängt von der Blickrichtung ab.
2. **Ein Treffer pro Angriff** — der `attackHitDone`-Sperrmechanismus im
   direkten Vergleich: ohne Sperre zählt jeder Frame, mit Sperre genau
   einer pro Angriff.
3. **Schaden je Angriffsart** — Schlag/Tritt/Schwert mit unterschiedlicher
   Reichweite und unterschiedlichem Schaden, dieselbe Trefferzonen-Logik.

## Was man hier lernt

- Wie sich eine Trefferzone abhängig von der Blickrichtung links oder
  rechts der Figur platzieren lässt — eine Formel für beide Richtungen
- Warum eine mehrere Frames dauernde Angriffsanimation ohne Sperre
  mehrfach treffen würde, und wie ein einfaches Flag das verhindert
- Die `DAMAGE`-Tabelle: Reichweite und Schaden sind bewusst gekoppelt,
  eine größere Waffe trifft weiter und härter

## Dateien

```
10-nahkampf/
├── index.html      Lernseite mit 3 Demo-Tabs
├── chapter.css        Tab-Leiste, HP-Anzeige
├── chapter.js           alle drei Demos
├── assets/
│   ├── hero.png           echtes Sprite-Sheet aus Ninja Fight
│   └── blue.png            echtes Gegner-Sprite-Sheet
└── README.md            diese Datei
```
