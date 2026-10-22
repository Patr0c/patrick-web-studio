# Originale Workstation aus GIMP / OpenRaster

Maßgeblich: Patricks `Workstation-Ebenen.ora`, 1774 × 887 px. Die XCF wurde
als zweite Originalquelle gesichert, für den Import entscheidet ausschließlich
ORA. Kein ImageGen, keine Neuzeichnung, keine Farbkorrektur oder Neucodierung.
Die vier PNG-Dateien unter `assets/workstation/` sind bytegleich zum ORA-Archiv.
SHA-256, ursprüngliche Sichtbarkeit, Abmessungen und Komponenten stehen in
`geometry.json`; das originale `stack.xml` bleibt erhalten.

| Ebene | Archiv | Offset | Abmessungen | Browser |
| --- | --- | --- | --- | --- |
| Grundgerüst | data/003.png | 0, 0 | 1774 × 887 | base.png |
| Monitore | data/002.png | 128, 95 | 1519 × 432 | monitors.png |
| Panels / Kästchen | data/001.png | 38, 423 | 1701 × 209 | panels.png |
| Knöpfe / Schalter | data/000.png | 49, 423 | 1677 × 201 | controls.png |

Die drei ausgeblendeten Ebenen sind echte herausgeschnittene Bildbestandteile,
keine einfarbigen Markierungsfarben. Ihre sichtbaren RGB-Pixel stimmen nach
Versatz mit den RGB-Werten im Grundgerüst überein; dessen entsprechende Pixel
sind transparent. Originale Alpha-Werte (meist 252/253) unverändert beibehalten.
Alle vier Ebenen werden genau einmal in normaler Source-over-Reihenfolge
zusammengesetzt. Keine alte vollständige Workstation darunter, keine zusätzlichen
mobilen Bildausschnitte. Die bisherige WebP bleibt nur als historische Datei im Git.

## Koordinaten und Masken

`python scripts/import_workstation_ora.py /pfad/Workstation-Ebenen.ora`
reproduziert die Assets mit Pillow, NumPy und SciPy. Die ausgelieferte Website
benötigt keinen Build und keine dieser Bibliotheken.

Alle Positionen beziehen sich auf **dasselbe** 1774 × 887-Raster. Generated CSS
berechnet x / 1774, y / 887, Breite / 1774 und Höhe / 887. Das Gerät erhält
nur eine proportionale Skalierung, ohne Skew und ohne unabhängige Ebenenresizes.

Zusammenhängende Alpha-Komponenten: Schwelle >20/255, Mindestfläche 12 Pixel
(unterdrückt einzelne transparente Randartefakte). Daraus entstehen zwei große
und elf kleine Monitorflächen, 19 Panelregionen sowie 61 Bedienregionen. Die
beiden Hauptmonitore haben die gemessenen Boxen [129,96,814,365] und
[960,96,1647,363] (rechte/untere Grenze exklusiv). HTML bekommt einen sicheren
Innenabstand von zwölf Originalpixeln. Alle elf kleinen Displays behalten ihre
Originalgrafiken; präzise alpha-maskierte Vektorlichter ergänzen Telemetrie,
Wellen, Radar und Zeichenströme. Keine schwarzen rechteckigen Ersatzdisplays.

`aux-mask.png` ist die originale Monitor-Alphaebene ohne die zwei Hauptflächen.
Die Rechtecke der Displaykomponenten dienen nur zur lokalen Vektorskalierung;
die tatsächliche Alpha-Maske schneidet Licht und Animationen an den realen
schrägen beziehungsweise unregelmäßigen Glaskanten ab.

### Matrix

Eine eigene Maske wird ausschließlich innerhalb der ausgeschnittenen, von der
Panel-Ebene belegten Bereiche des Grundgerüsts berechnet:

`Panel-Alpha × (1 − Grundgerüst-Alpha) × Dunkelbereich`.

Monitor- und Schalter-Alpha wird um zwei Quellpixel erweitert und vollständig
abgezogen. Helle Metallpixel und Reflexionen der Panelteile bleiben geschützt
(Dunkelgewicht 1 bis RGB-Maximum 40, linear auf 0 bei 90). Außenraum und
Standfuß erhalten keine Matrix. Die resultierende Unterstützung umfasst 76.561
Quellpixel, nicht die gesamte 1,57-Millionen-Pixel-Arbeitsfläche.

Wichtig: Die Panel-PNGs enthalten selbst dunkles Substrat, nicht nur transparente
Markierungen. Sie werden deshalb nicht unsichtbar gemacht. Darüber liegt allein
das eng maskierte Zeichenlicht, unter den originalen Knöpfen und außerhalb aller
Displays. So bleibt die Originalgrafik vollständig erhalten, während die Zeichen
optisch in den ausgeschnittenen dunklen Bereichen sitzen. Kein großflächiger
Grünfilter und keine grünen Lichtwolken.

Feine eigene SVG-Zeichen, 6 × 8 Quellpixel, #19E50F mit einzelnen #39FF14-Kernen.
155 schmale Spalten, verschiedene Laufzeiten von 3 bis 8,9 Sekunden und
Helligkeiten. Drei identische 144-Pixel-Perioden pro Spalte überbrücken nahtlos
den Maskenbereich; positive Y-Bewegung bedeutet dauerhaft **nach unten**.
Ein gemeinsames SVG wird einmal aufgebaut, ausschließlich CSS bewegt begrenzte
Gruppen. Kein Canvas und keine requestAnimationFrame-/Timer-Zeichenschleife.
Pausiert: Gerät außerhalb des Viewports, vollständig alter Vergleich (100 %),
Hintergrundtab, Reduced Motion, Save-Data, pagehide. Fortsetzung über Observer
und Visibility-/pageshow-Ereignisse, ohne Animationsneustart.

### Ansteuerbare Bedienelemente

`[data-control-id="control-XX"]` adressiert jede zusammenhängende Originalregion.
Die Pfade bestehen aus exakten Ein-Pixel-Zeilenspannen der Alpha-Unterstützung,
keinen geschätzten Polygonen. `data-source-box` und Manifest liefern die
Quellkoordinaten. Gemeinsame Tastatur-/Joystickregionen bleiben gemeinsam,
solange die Quelle keine separaten Masken enthält. Vorerst keine Klickaktionen,
kein Fingerzeiger und keine zusätzlichen Tabstopps. Spätere Lichtzustände
können denselben Pfad nutzen, ohne das Gerät neu zu vermessen.

## Responsive und Zugänglichkeit

Desktop: vollständige Außenkontur und Standfuß im sichtbaren Hero, Sonne frei
oberhalb der Monitore, Navigation links. Originalseitenverhältnis 2:1.
Tablet: gleiches zusammenhängendes Ebenensystem. Telefon: gesamtes Gerät in
der Breite, keine auseinandergezogenen Monitor-Crops. Die originale Kopie bleibt
im rechten Monitor sichtbar; dieselbe Kopie wird für Lesbarkeit und einen
44-Pixel-CTA zusätzlich unter dem Gerät angeboten. Der kleine rechte Monitor
wird dann für Screenreader ausgeblendet, seine Mini-Links sowie der linke
Mini-Link werden aus der Tabfolge genommen. Die eigentliche H1 und Typoanimation
bleiben im linken Glas. Keine neue Zoom-/Schalterfunktion.

Sonne, Korona, Galaxie, Sternfilm, Aufnahmen, Kategorien und neun Konzepte
bleiben in Quellen und Verhalten erhalten. Abschnitte nach dem Hero unverändert.
