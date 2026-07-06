# Kapitel 16 · HUD & Spielstatus

> Live-Demo: [`chapters/16-hud/`](./index.html) auf GitHub Pages
> Baustein aus: `drawHealthBar()`, `ui.updateHud()` (Ninja Fight)

## Worum es geht

Baut `drawHealthBar()` und `ui.updateHud()` aus Ninja Fight nach —
inklusive einer echten Lektion aus der Praxis: die Balkenposition musste
nachträglich korrigiert werden, weil sie ursprünglich mitten im Kopf der
Figur lag statt darüber.

## Die drei Demos

1. **Balkenposition** — ein Regler zeigt live, ab welchem Abstand der
   Balken tatsächlich über dem Kopf statt mitten drin sitzt.
2. **HUD-Text** — ein einfaches DOM-Overlay mit Punktestand und Timer.
3. **Wann aktualisieren?** — nur bei Ereignissen vs. jeden Frame,
   nebeneinander verglichen.

## Was man hier lernt

- Ein Lebensbalken ist im Kern nur ein zweites, proportional skaliertes
  Rechteck über einem Hintergrundrechteck
- Bei sprite-basierten Figuren ist der "richtige" Abstand für UI-Elemente
  über dem Kopf nicht offensichtlich — der sichtbare Bereich des Sprites
  muss tatsächlich vermessen werden, nicht geschätzt
- Warum `updateHud()` jeden Frame aufzurufen robuster ist als es nur an
  einzelnen Stellen zu tun — jede vergessene Stelle sonst führt zu
  kurzzeitig falschen Anzeigen

## Dateien

```
16-hud/
├── index.html      Lernseite mit 3 Demo-Tabs
├── chapter.css        Tab-Leiste, HUD-/Timing-Anzeigen
├── chapter.js           alle drei Demos, drawHealthBar()
├── assets/red.png          echtes Gegner-Sprite-Sheet aus Ninja Fight
└── README.md            diese Datei
```
