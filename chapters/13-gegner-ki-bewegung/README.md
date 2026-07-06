# Kapitel 13 · Gegner-KI: Bewegung

> Live-Demo: [`chapters/13-gegner-ki-bewegung/`](./index.html) auf GitHub Pages
> Baustein aus: `hasSupportAhead()`, Patrouillenlogik (Ninja Fight)

## Worum es geht

Das Original-Ninja-Fight hatte für Gegner überhaupt keine KI — die
`*Controller.as`-Klassen waren leere Rümpfe. Die hier aufgebaute
Patrouillenlogik mit Kantenerkennung war eine der Nacharbeiten, die erst
beim tatsächlichen Testen des fertigen Spiels nötig wurden (Gegner fielen
zu oft von Plattformen).

## Die drei Demos

1. **Naive Patrouille** — feste X-Grenzen, ohne zu wissen, wie lang die
   Plattform tatsächlich ist. Führt direkt zum Sturz.
2. **Kantenerkennung** — `hasSupportAhead()`: vor jedem Schritt prüfen, ob
   voraus noch Boden ist, sonst umdrehen.
3. **Plus Springen** — gelegentliches zufälliges Springen, nur wenn die
   Kantenerkennung "sicher" meldet.

## Was man hier lernt

- Warum feste Patrouillengrenzen nicht ausreichen — sie wissen nichts von
  der tatsächlichen Plattformgeometrie
- Wie ein einfacher Vorausschau-Test (`hasSupportAhead()`) Kanten
  zuverlässig erkennt, unabhängig von der Plattformlänge
- Warum ein zufälliges Verhalten (Springen) immer zuerst die
  Sicherheitsprüfung respektieren muss, sonst unterläuft es die
  eigentliche Absicherung

## Dateien

```
13-gegner-ki-bewegung/
├── index.html      Lernseite mit 3 Demo-Tabs
├── chapter.css        Tab-Leiste
├── chapter.js           alle drei Demos
├── assets/blue.png        echtes Gegner-Sprite-Sheet aus Ninja Fight
└── README.md            diese Datei
```
