# Rauchglas-Workstation – aktueller GIMP-Import

Verbindliche Quelle: Patricks `Tisch einzelteile(1).ora`. Die XCF bleibt die GIMP-Referenz.
Die Skizze zeigt bewusst den alten Tisch; ausschließlich Anordnung und Größenverhältnisse werden übernommen. Das aktive Motiv ist der neue Rauchglas-Tisch mit **drei** Hauptmonitoren und vier kleinen Displays.

## Originalraster und Ebenen

Canvas **1949 × 826 Pixel**. Alle 16 Original-PNGs sind bytegleich unter `assets/desk/original/` archiviert. SHA-256, Labels, Originalversätze und Alpha-Bounds stehen in `geometry.json`; die Originalstruktur in `original-stack.xml`. Negative/off-canvas Versätze bleiben erhalten.

| Ebene | x | y | Breite × Höhe |
| --- | ---: | ---: | --- |
| Haupt Monitor 1 Links | 90 | 113 | 557 × 258 |
| Hauptmonitor 2 Mitte | 669 | 115 | 554 × 255 |
| Hauptmonitor 3 Rechts | 1246 | 115 | 554 × 255 |
| Monitor 1 klein links außen | 309 | 446 | 318 × 138 |
| Monitor 2 klein links innen | 309 | 446 | 630 × 138 |
| Monitor 3 klein rechts innen | 309 | 446 | 945 × 138 |
| Monitor 4 klein rechts außen | 309 | 446 | 1277 × 138 |
| Weiße Beschriftung Tastatur | 561 | 619 | 709 × 199 |
| Tastatur blank | 561 | 619 | 709 × 199 |
| Mausrad | 1337 | 684 | 22 × 17 |
| Maus ohne Mausrad | 1300 | 685 | 110 × 100 |
| Roter Knopf | 287 | 648 | 113 × 92 |
| Orangener Knopf | 400 | 644 | 112 × 89 |
| Grüner Knopf | 1482 | 642 | 101 × 91 |
| Mauspad | 502 | 648 | 977 × 163 |
| Workstation basic | -174 | -83 | 2240 × 1360 |

Die vier kleinen Displayebenen haben absichtlich denselben x/y-Versatz und unterschiedliche transparente linke Ränder. Maßgeblich sind ihre **tatsächlichen Alpha-Bounds**, nicht bloß die Dateirechtecke. Der Gehäuselayer hat 2240 × 1360 Pixel bei −174/−83; der 1949×826-Canvas endet wie Patricks GIMP-Datei an der Tischvorderkante. Die Webseite verankert genau diese Kante bei `bottom:0`. Unterhalb des Canvas liegende Ständer werden nicht als zusätzliche Elemente neu gezeichnet.

## Darstellung

- Ein gemeinsames proportional skaliertes CSS-Koordinatensystem für alle 16 Ebenen. Kein Strecken, keine unabhängigen verschobenen Monitor-Crops.
- Links: unveränderte DIGITAL/REWORK-Typografie mit vorhandener 7.6-s-Animation und Projektlink.
- Mitte: feine animierte Zeichenkommunikation und Vektor-Telemetrie. Rechts: bestehende Überschrift, Beschreibung und CTA.
- Vier kleine hochauflösende Originaldiagnostiken bleiben sichtbar. Zusätzliche schmale Scan-/Radareffekte ersetzen keine Geometrie und zeichnen keine zweiten Globen über die vorhandenen Anzeigen.
- Die drei grünen Hinweisfelder (Vorher, Dein neues Design, Ausgewählte Arbeiten) passen sich an die neue Gerätelage an. ResizeObserver misst nur Größenänderungen; keine JS-Frame-Schleife.
- Mobil bleibt das gesamte Gerät am unteren Szenenrand sichtbar. Die bestehende lesbare Textkopie liegt separat oberhalb auf dunklem Glas; der Vergleichsgriff sitzt darunter und verdeckt keinen CTA. Mindesthöhe mobil 810 px.
- Sonne/Korona, Originalgalaxie und Sternenfilm behalten ihre Dateien und Controller. Sämtliche Abschnitte nach dem Hero bleiben bytegleich zur Basis 7813470.

## Autorisierter Tastatur-Feinschliff

Patrick hat diesmal ausdrücklich Oberflächen-Feinschliff freigegeben. Ausschließlich die separate blanke Tastatur wird durch eine behutsame Bildbearbeitungsfassung mit saubereren Graphitflächen/Keycap-Kanten ergänzt. Keine Neuzeichnung der Workstation, Knöpfe, Monitore oder des Tisches. Ihre native Quellgrafik bleibt archiviert. Die Arbeitsfassung verwendet die ursprüngliche Alpha-Silhouette und dieselben logischen 709×199-Pixel-Koordinaten; die 2127×597-PNG trägt feinere Textur für hochauflösende Ausgabegeräte. Das ist kein behaupteter zusätzlicher Detailgewinn durch bloßes Hochskalieren: Die Textur stammt aus einer neuen nativen 2172×724-Retusche, die Alpha-Geometrie aus der Originalebene.

`keyboard-labels.svg` setzt echte QWERTZ-Beschriftung an gemessene Tastenmittelpunkte. Die originale weiße PNG-Beschriftung bleibt archiviert; im aktiven Hero wird sie **einmal** durch die schärfere Vektorebene ersetzt. Keine zweite aufgedruckte KI-Schrift. Seitenfonts bleiben Archivo/Manrope/DM Mono; die SVG-Tastengrafik nutzt DejaVu Sans mit Sans-Serif-Fallback.

Bildbearbeitung: integriertes image_gen, Quelle `Tastatur blank`. Prompt: ausschließlich saubere feine Graphitoberflächen und präzise Keycap-Kanten bei identischer Silhouette, Tastenanzahl/-position, Perspektive, Transparenz und ohne Beschriftung, zusätzliche Beleuchtung oder Redesign. Bildausgabe unter `docs/assets/keyboard-surface-retouch.png`. Originalalphamasken begrenzen die abgeleitete Fassung.

Downloads für GIMP: `assets/desk/Rauchglas-Tisch-Feinschliff.ora` (16 benannte Ebenen, native Versätze) und `Rauchglas-Tisch-Feinschliff.png` (transparente Zusammenfassung, 1949×826). Originaldateien des Nutzers wurden nicht überschrieben.

## Masken und Performance

Matrix ausschließlich in schmalen Codeleisten der vier kleinen Glasflächen, aus tatsächlicher Quellalpha abgeleitet. Mittlerer Hauptmonitor hat eine eigene echte Glasmaske. Kein Matrixfilm über Metall, Maus, Tastatur oder Knöpfen. Nur **16** Matrixspalten statt 155 beim alten Kontrollpult; nahtlos senkrechter 144-Pixel-Fall, variable Dichte und Geschwindigkeit, #19E50F/#39FF14, enger 1-Pixel-Schein. 24×16 kleine Vektorzeichen im zentralen Kommunikationsblock. CSS-Animation, kein laufender Canvas und keine JS-Zeichenschleife.

Pause bei Offscreen, komplett altem Vergleich, verborgenem Tab, Reduced Motion und Save-Data. Drei tatsächliche Knopfmasken (Rot/Orange/Grün) sind über IDs separat adressierbar. Es wurden keine neuen Klickfunktionen oder zusätzlichen Tastaturstopps für diese später geplanten Taster eingeführt.

## Import wiederholen

```sh
python3 scripts/import_smoked_desk.py "/pfad/Tisch einzelteile(1).ora" docs/assets/keyboard-surface-retouch.png
python3 scripts/check_site.py
```

Pillow wird nur für den Offline-Import benötigt. Die veröffentlichte Website benötigt keinen Build und keine Zusatzbibliothek.

## Prüfung

Chromium, echte Iframe-Viewports 320/390/768/1440 px: Clientbreiten 305/375/753/1425 px entsprechen jeweils exakt scrollWidth. Gerät und Hero enden jeweils bei y=844. Alle Monitorinhalte passen nach abgeschlossener Entrance-Phase in die Glasflächen. Desktop 1348×936: 16 Ebenen vollständig geladen, Gerät 1320×559.42 bei x=14 und y=376.58; Tischkante exakt y=936. 4 kleine Displayeffekte, 1 Hauptmonitor-Telemetrie, 3 Knopfmasken, 16 Matrixspalten.

Vergleich Ende=100 pausiert SVG, Pos1=0 setzt fort. Sonnenmedien im sichtbaren Header readyState=4/laufend, Dauer 46.033333 s und 33.5 s; Dateien unverändert. Native Originalbild-Hashes stimmen; deckende Schnittmenge des Gehäuses mit den sieben ausgegliederten Glasflächen und Tastatur: jeweils 0 %, keine doppelte Bilddarstellung. Ressourcen-/JS-Syntaxprüfung und git diff --check erfolgreich.

Firefox und physische Smartphones sind nicht verfügbar. Reduced Motion, Save-Data und Hintergrundtab besitzen explizite Guards; diese Präferenzen konnten nicht separat im Browser umgeschaltet werden. Hover-Wiedergabe und neun Konzeptdialoge wurden nicht erneut vollständig durchgetestet; HTML nach dem Hero und ihre Controller sind bytegleich zum zuvor vollständig geprüften Stand. Keine Aussage über Langzeit-FPS fremder Geräte.
