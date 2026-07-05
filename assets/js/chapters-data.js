/**
 * Kapitel-Register für "Ninja Fight von Grund auf" — ein Schritt-für-
 * Schritt-Tutorial, das dieselben Techniken in derselben Reihenfolge
 * aufbaut, die im fertigen Ninja-Fight-Spiel (siehe Repo "NinjaFight")
 * tatsächlich zum Einsatz kommen. Jedes Kapitel ist eigenständig
 * lauffähig und baut auf den vorigen auf.
 *
 * status: "live"    -> bereits als HTML5/JS-Kapitel im Repo vorhanden
 *         "planned" -> noch nicht geschrieben (Karte im Index deaktiviert)
 */

const CHAPTERS = [
  { num: 1, slug: "01-canvas-grundlagen", title: "Canvas-Grundlagen & Game-Loop",
    desc: "Das <canvas>-Element, der 2D-Kontext, requestAnimationFrame und zeitbasierte Updates.",
    status: "live" },
  { num: 2, slug: "02-sprites-zeichnen", title: "Sprites zeichnen",
    desc: "Bilder laden, drawImage(), Positionierung, Skalierung und Blickrichtung (Spiegeln).",
    status: "live" },
  { num: 3, slug: "03-sprite-animation", title: "Sprite-Animation",
    desc: "Sprite-Sheets, Frame-Zyklen und benannte Zustände wie Idle/Walk/Jump.",
    status: "planned" },
  { num: 4, slug: "04-eingabe", title: "Tastatur- & Maus-Eingabe",
    desc: "Key-States statt Einzel-Events, Klick-Erkennung, Eingabe von Bewegung entkoppeln.",
    status: "planned" },
  { num: 5, slug: "05-bewegung-schwerkraft", title: "Bewegung & Schwerkraft",
    desc: "Geschwindigkeit, Beschleunigung, Sprungphysik — zeitbasiert statt frame-gezählt.",
    status: "planned" },
  { num: 6, slug: "06-kollision-plattformen", title: "Kollision & Plattformen",
    desc: "AABB-Kollision, Landung auf Kacheln, der Unterschied zwischen Trefferbox und Sprite.",
    status: "planned" },
  { num: 7, slug: "07-level-daten", title: "Level-Daten & Tile-Rendering",
    desc: "Datengetriebene Level statt Hardcoding, Kachel-Sheets, Level als austauschbare Daten.",
    status: "planned" },
  { num: 8, slug: "08-hindernisse", title: "Hindernisse & Gefahren",
    desc: "Feuer, Stacheln und Wasser als eigene Level-Element-Typen mit unterschiedlichem Verhalten.",
    status: "planned" },
  { num: 9, slug: "09-leitern", title: "Leitern & Klettern",
    desc: "Ein dritter Bewegungszustand neben Laufen/Springen, saubere Übergänge an den Leiterenden.",
    status: "planned" },
  { num: 10, slug: "10-nahkampf", title: "Nahkampf & Hitboxen",
    desc: "Schlag/Tritt, Trefferzonen vor der Figur, unterschiedliche Schadenswerte je Angriffsart.",
    status: "planned" },
  { num: 11, slug: "11-fernkampf", title: "Fernkampf & Projektile",
    desc: "Wurfwaffen als eigenständige, sich bewegende Objekte statt Teil der Angriffsanimation.",
    status: "planned" },
  { num: 12, slug: "12-items-powerups", title: "Items & Power-Ups",
    desc: "Aufsammeln, sofortige Effekte, zeit- und zählbegrenzte Fähigkeiten.",
    status: "planned" },
  { num: 13, slug: "13-gegner-ki-bewegung", title: "Gegner-KI: Bewegung", 
    desc: "Patrouillieren, Kantenerkennung statt blind herunterfallen, gelegentliches Springen/Klettern.",
    status: "planned" },
  { num: 14, slug: "14-gegner-ki-kampf", title: "Gegner-KI: Kampf & Gegnertypen",
    desc: "Aggro-Bereich, Angriffsauswahl, unterschiedliche Fähigkeiten/Werte je Gegnertyp.",
    status: "planned" },
  { num: 15, slug: "15-sound-musik", title: "Sound & Musik",
    desc: "Hintergrundmusik, Soundeffekte, Lautstärkeregelung, Umschalten zwischen Menü- und Spielmusik.",
    status: "planned" },
  { num: 16, slug: "16-hud", title: "HUD & Spielstatus",
    desc: "Lebensbalken, Punktestand, Timer — Spielzustand lesbar auf einen Blick.",
    status: "planned" },
  { num: 17, slug: "17-menues-zustaende", title: "Menüs & Spielzustände",
    desc: "Start-, Pause-, Einstellungs-, Anleitungs- und Credits-Bildschirm als Zustandsmaschine.",
    status: "planned" },
  { num: 18, slug: "18-highscores-fortschritt", title: "Highscores & Levelfortschritt",
    desc: "Speichern mit localStorage, Sieg-/Niederlage-Bedingungen, alles zu einem vollständigen Spiel zusammenfügen.",
    status: "planned" },
];

if (typeof module !== "undefined") module.exports = { CHAPTERS };
