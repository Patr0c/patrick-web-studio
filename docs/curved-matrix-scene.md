# Curved Matrix Scene — 23.10.2026

Branch: `feat/curved-matrix-scene-20261023`, Basis `2846986`.
Quelle: Patricks aktuell bearbeitete `Digital-Rework-Zubehoer-v3(1).xcf`.
Native Arbeitsfläche 2560 × 1440; XCF 11, 8-Bit-RGB, 102 Ebeneneinträge einschließlich Gruppen. Alle aktiven und versteckten Ebenen wurden ausgelesen. Vollständige Positions-/Sichtbarkeitsanalyse: `assets/scene/source-layers.json`. Quellhash und aktive Geometrie: `assets/scene/geometry.json`.

## Bildaufbau

Die von Patrick veränderte Perspektive der Tischsegmente bildet die Vorlage. Autorisierte fotografische Retusche mit Bildgenerierung: gerissene/überlappende Glasflächen schließen, durchgehende Vorderkante, drei glaubwürdige Monitorrahmen und stabile Halterungen. Keine zusätzlichen Accessoires. Reparaturplatte nativ 1672 × 941, im bestehenden Referenzraster 2560 × 1440 registriert; keine Behauptung zusätzlicher echter 4K-Details. Original-Zubehör aus der neuen XCF unverändert exportiert, inklusive neu verteilter Knöpfe, verschobener Tastatur und Mauspad. Originale der früheren 1949×826-ORA bleiben archiviert.

Eine gemeinsame Bühne skaliert exakt alle nativen Koordinaten. Alle vier Ecken jeder Displayfläche werden per projektiver Homographie in der Grafik verankert, statt Inhalte nur rechteckig über die Perspektive zu legen. Sonne: x338/y151, 322×322; Lichtquelle x499/y312. Galaxie hinter Plattform, native Drehachse x1771/y953, Breite1936. Mobil bleibt der vollständige Tisch unten sichtbar; Sonne und lesbare Kopie stehen im freien Bereich darüber. Lichtkegel wird an die tatsächlich gerenderte Sonnenposition angepasst.

## Bewegung und Inhalte

- Links wechseln HRService, Villa Schwalbe und Gasthof Wagner alle12s. Nur die aktuelle Aufnahme spielt stumm; Hover/Fokus hält den Wechsel an. Direktauswahl und Pauseknopf vorhanden. Im reduzierten Bewegungsmodus und bei Save Data bleiben Poster stehen. Die Projektkarten unter dem Hero behalten Hoverstart, sofortiges Pausieren und Reset nach10s.
- Mitte: weichere domänenverzerrte, kurvige ASCII-/Pixelbänder, Weiß/Grau und Lasergrün. WebGL maximal220000Pixel/45fps; Canvas2D-Fallback480×220/20fps. Keine Extension installiert.
- Rechts: animiertes metallisches Ringmotiv und Live-Typografie „COMING SOON – Ihr Projekt“, verlinkt auf den vorhandenen Kontaktbereich.
- Tisch: ein begrenztes Canvas maximal1440×175, Atlas aus16 selbst gezeichneten unbekannten Zeichen, gekrümmte durchlaufende Wellenfelder, 30fps. Die Maske stammt aus der echten Tischfläche; Ränder, Tastatur, Maus, Mausrad und Knöpfe sind ausgespart. Kein ganzflächiger Grünfilter.
- Tastatur: originale separate Schriftalpha als Maske. Sattes #19E50F plus15 versetzte, kreisförmige Regenimpulse, begrenzte helle Kerne; kein Regenbogenwechsel und kein Licht auf den Tastenkappen außerhalb der Zeichen.
- Sonnenrotation `playbackRate=.6`, 40% weniger Winkelgeschwindigkeit. Bestehende33.5-s-Koronaretimings bleiben erhalten.
- Galaxie: 500s statt300s Desktop, 600s statt360s mobil (=40% weniger Winkelgeschwindigkeit). Feiner bläulich-perlmuttfarbener Sternenstaub wird einmal gezeichnet und dreht sich mit demselben Elterncontainer. Zusätzlich12–28 einzeln sanft aufleuchtende feste Sterne; keine dauernden Sternen-Canvas-Berechnungen.
- Licht: warme Hauptlichtführung aus der wirklichen Sonnenposition, weich gefiederter atmosphärischer Kegel, eng begrenzte Material-/Bodenreflexe. Alle19s ein zurückhaltender blau-violetter Galaxieimpuls in Richtung Tisch. Echte Alpha-Masken schützen Displayflächen; keine rechteckigen Lichtmasken.

Ein gemeinsamer Sichtbarkeitscontroller stoppt Canvas, CSS-Effekte und Monitorvideos bei Offscreen/verborgenem Tab/vollem Alt-Entwurf. Reduced Motion und Save Data berücksichtigt. Es sind nur ein Textmode-Renderer und ein Tischrenderer aktiv; der frühere `terminal.js`-Controller ist nicht mehr eingebunden. Physische Knöpfe behalten ausschließlich Pressfeedback und das vorhandene `desk:control`-Ereignis.

## Prüfung

Ressourcen, Projektlinks, interne Anker, neue Asset-Hashes, perspektivisch konvexe Displayquads, Original-ORA-Archiv, JavaScript-Syntax und `git diff --check` erfolgreich. Tatsächliches Chromium-Rendering: Desktop1348×936 sowie Telefon-Inhaltsbreiten375/305×844 ohne horizontale Überläufe. Alle drei Aufnahmen wurden im rotierenden linken Monitor gesehen; manuelle Auswahl geprüft. Vergleichsregler mit Ende/Pos1 geprüft; bei100% Alt-Entwurf alle Videos, Tischmatrix und Textmode angehalten. Sonne0.6× und Galaxie500s im DOM bestätigt. Browser stellt hier kein WebGL bereit: Canvas2D-Fallback wurde tatsächlich geprüft, GPU-Renderer und Firefox sowie physische Telefone nicht geprüft. Reduced Motion/Save Data Codepfade geprüft, keine Simulation eines physischen Geräts behauptet.

Alle anderen Abschnitte und neun Konzeptinhalte bleiben erhalten. Kein Push nach `main`; dessen Referenz vor Beginn: `1ad8b12eb5e822c209beaf938757b84212b099ae`.

## Verifizierte Entwicklungsvorschau

https://52b0a81b.patrick-web-studio.pages.dev

Funktionscommit `42680d5f9d1dbb9d48a3e296018f6a102f01107b`: Cloudflare Pages „Deployed successfully“ und GitHub `static-site` beide erfolgreich. Draft-PR #4 richtet sich gegen den vorherigen Entwicklungsbranch, nicht gegen main.
