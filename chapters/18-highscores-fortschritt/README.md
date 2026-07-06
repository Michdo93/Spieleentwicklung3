# Kapitel 18 · Highscores & Levelfortschritt

> Live-Demo: [`chapters/18-highscores-fortschritt/`](./index.html) auf GitHub Pages
> Baustein aus: `localStorage`-Highscores, `winGame()`/`endGame()`, kumulative `lifeEnergy` (Ninja Fight)

## Worum es geht

Das letzte Kapitel: Ergebnisse dauerhaft speichern, die Bedingungen für
Sieg und Niederlage — und wie alle 17 vorigen Kapitel zusammen ein
vollständiges Spiel ergeben.

## Die drei Demos

1. **Highscores** — eine Liste mit `localStorage` speichern, sortieren,
   auf die Top 10 begrenzen.
2. **Sieg oder Niederlage?** — eine interaktive Simulation der
   Bedingungen aus `GameManager`: Tod, Zeitablauf mit Gegnern, oder alle
   Level geschafft.
3. **Alles zusammen** — die kumulative Lebenspunkte-Formel als Beispiel
   dafür, wie mehrere Kapitel zusammenspielen.

## Was man hier lernt

- `localStorage` als serverlose Alternative zu einer Datenbank für einfache
  Anwendungsfälle wie Highscores — GitHub Pages kann keinen eigenen Server
  betreiben, braucht dafür aber auch keinen
- Sieg/Niederlage-Bedingungen sind oft komplexer als "tot oder nicht" —
  ein Zeitablauf ist nur in Kombination mit anderen Bedingungen eine
  Niederlage
- Der Unterschied zwischen `+=` und `=` bei einer Formel, die über mehrere
  Level hinweg gelten soll

## Und jetzt?

Alle 18 Kapitel zusammen ergeben ein vollständiges, spielbares Ninja-
Fight-Spiel. Wer bis hierhin gefolgt ist, hat jede einzelne Technik
gesehen, die im fertigen Spiel steckt — vom leeren `<canvas>` in Kapitel 1
bis zur kompletten Spiellogik hier.

## Dateien

```
18-highscores-fortschritt/
├── index.html      Lernseite mit 3 Demo-Tabs
├── chapter.css        Panel-Styles
├── chapter.js           alle drei Demos
└── README.md            diese Datei
```
