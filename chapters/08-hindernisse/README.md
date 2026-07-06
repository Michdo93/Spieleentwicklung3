# Kapitel 8 · Hindernisse & Gefahren

> Live-Demo: [`chapters/08-hindernisse/`](./index.html) auf GitHub Pages
> Baustein aus: `checkHazards()` (Hero und Enemy, Ninja Fight)

## Worum es geht

Nicht jedes Level-Element ist eine Plattform zum Draufstehen. Dieses
Kapitel baut `checkHazards()` nach — dieselbe Funktion existiert (fast
wortgleich) für Held und Gegner in Ninja Fight.

## Die drei Demos

1. **Wasser** — überraschenderweise keine Gefahr, sondern eine ganz
   normale Plattform (`PLATFORM_TYPES`).
2. **Feuer** — Schaden über Zeit mit `invulnTimer`-Abklingzeit, damit
   nicht jeder einzelne Frame trifft.
3. **Stacheln** — dieselbe Abklingzeit-Technik, nur mit höherem
   Schadenswert.

## Was man hier lernt

- Nicht jedes visuell "gefährlich wirkende" Level-Element muss auch eine
  Gefahr sein (Wasser als Gegenbeispiel)
- Warum kontinuierlicher Schaden eine Abklingzeit braucht — ohne sie würde
  ein Frame-Loop mit 60fps auch 60 Treffer pro Sekunde verursachen
- Die Reihenfolge "erst prüfen, dann Timer runterzählen" und warum sie
  wichtig ist
- Wie sich ein neuer Gefahrentyp mit minimalem Zusatzcode einführen lässt,
  sobald das Grundmuster (Abklingzeit + Schadenswert) einmal steht

## Dateien

```
08-hindernisse/
├── index.html      Lernseite mit 3 Demo-Tabs
├── chapter.css        Tab-Leiste, HP-Anzeige
├── chapter.js           alle drei Demos
├── assets/tiles.png       echtes Kachel-Sheet aus Ninja Fight
└── README.md            diese Datei
```
