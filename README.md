# Ninja Fight von Grund auf — Ein Spiel-Tutorial

Dieses Repo baut, **Kapitel für Kapitel**, exakt die Technik auf, die im
fertigen [Ninja-Fight-Spiel](https://michdo93.github.io/NinjaFight/) zum Einsatz kommt
— vom leeren `<canvas>` bis zum vollständigen 2D-Plattform-Kampfspiel mit
Sprite-Animation, Gegner-KI, Levels, Sound, Menüs und Highscores.

**Anders als die beiden vorigen Tutorial-Repos** (die ein bestehendes
Kursmaterial bzw. Buch Übung für Übung portiert haben) geht dieses Repo
**vom fertigen Ergebnis aus** und zerlegt es in eine sinnvolle Lernreihenfolge
— jedes Kapitel ein Baustein, den man tatsächlich im Endprodukt wiederfindet.

▶ **[Alle Kapitel ansehen](./index.html)** — 🎉 **alle 18 Kapitel sind vollständig.**

## Der Lernpfad

| # | Kapitel | Baustein aus Ninja Fight |
|---|---------|--------------------------|
| 01 | Canvas-Grundlagen & Game-Loop | `GameManager.loop()` |
| 02 | Sprites zeichnen | `drawNinja()`, `drawTile()` |
| 03 | Sprite-Animation | Sprite-Sheet-Zustände (Idle/Walk/Jump/…) |
| 04 | Tastatur- & Maus-Eingabe | `keys`-Objekt, Klick-Erkennung im Menü |
| 05 | Bewegung & Schwerkraft | `Hero.update()` (Sprung, `GRAVITY`) |
| 06 | Kollision & Plattformen | `findLanding()`, AABB-Kollision |
| 07 | Level-Daten & Tile-Rendering | `levels.js`, `buildLevel()` |
| 08 | Hindernisse & Gefahren | `checkHazards()` (Feuer/Stacheln/Wasser) |
| 09 | Leitern & Klettern | `wantsToClimb`-Logik in `Hero.update()` |
| 10 | Nahkampf & Hitboxen | `hitNearbyEnemies()`, Schadenstabelle |
| 11 | Fernkampf & Projektile | `Projectile`-Klasse |
| 12 | Items & Power-Ups | `PowerUp`-Klasse, `collectPowerUp()` |
| 13 | Gegner-KI: Bewegung | `hasSupportAhead()`, Patrouillenlogik |
| 14 | Gegner-KI: Kampf & Gegnertypen | `ENEMY_TYPES`, `HP_BY_TYPE`, `DAMAGE` |
| 15 | Sound & Musik | `SoundController` |
| 16 | HUD & Spielstatus | `drawHealthBar()`, `ui.updateHud()` |
| 17 | Menüs & Spielzustände | `ui.showScreen()`, Menü-Bildschirme |
| 18 | Highscores & Levelfortschritt | `localStorage`, `winGame()`/`endGame()` |

Der aktuelle Stand steht auch live oben auf der [Übersichtsseite](./index.html).

## Wie das Repo aufgebaut ist

```
/
├── index.html                     Übersichtsseite, verlinkt alle Kapitel
├── assets/
│   ├── css/site.css                 gemeinsames Stylesheet
│   └── js/chapters-data.js          Kapitel-Register
└── chapters/
    ├── 01-canvas-grundlagen/
    │   ├── index.html                 Lernseite: Erklärung + Demo
    │   ├── chapter.css                  kapitelspezifisches Styling
    │   ├── chapter.js                    die eigentliche Umsetzung
    │   └── README.md                     dieselbe Erklärung als Markdown
    └── ... (gleiche Struktur pro Kapitel)
```

Jedes Kapitel ist **eigenständig lauffähig**. Manche Kapitel verwenden
bewusst echte Assets aus dem Ninja-Fight-Projekt (Sprite-Sheets, Sounds),
damit man von Anfang an mit denselben Dateien arbeitet, die später im
fertigen Spiel stecken — statt mit austauschbaren Platzhaltern.

## Portierungsprinzipien

- **Kein Build-Schritt.** Reines HTML/CSS/JS.
- **Dieselbe Loop-Struktur von Anfang an.** Der zeitbasierte Game-Loop aus
  Kapitel 1 (`dt`-basierte Bewegung) zieht sich durch jedes weitere Kapitel
  — genau wie im fertigen Spiel.
- **Echte Assets statt Platzhalter.** Wo sinnvoll, werden echte Ninja-
  Fight-Sprites/-Sounds verwendet, keine Lorem-Ipsum-Grafiken.
- **Jedes Kapitel zeigt den Code-Ausschnitt aus dem fertigen Spiel**, den
  es erklärt — als Vergleich, nicht nur als Analogie.

## Lokal ansehen

```bash
python3 -m http.server 8000
# dann: http://localhost:8000
```

## Quelle / begleitendes Projekt

Ninja Fight — ein 2D-Plattform-Kampfspiel (HTML5 Canvas + Vanilla JS,
portiert & erweitert aus einem Adobe-Animate/ActionScript-3-Original).
Dieses Tutorial erklärt jede darin verwendete Technik einzeln und von
Grund auf.
