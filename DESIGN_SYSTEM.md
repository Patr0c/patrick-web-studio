# Designsystem — Patrick / Digital Rework

Verbindliche Entscheidungen von Patrick, Stand 22. Oktober 2026.

## Identität
Immersives, hochwertiges Science-Fiction-Portfolio: dunkler Weltraum, Galaxie,
Sonne, Kontrollzentrale, präzise Laserakzente, räumliche Tiefe und kinetische Typografie.
Vorbild für die ursprüngliche Komposition: Dribbble „Star Wars Web Page“,
https://dribbble.com/shots/10031350-Star-Wars-Web-Page.
Die aktuelle kreative Arbeit fortführen. Effekte qualitativ und technisch
verbessern; keine Vereinfachung zur gewöhnlichen Landingpage. Keine Rückkehr zu
alten Designs, Raster, blauen Leisten oder bewegten Fensterflammen ohne Auftrag.

## Farben und Licht
| Einsatz | Wert / Regel |
| --- | --- |
| Hintergrund | #02040A, tiefschwarz mit leichtem Blauton |
| Lasergrün | Einheitlich #19E50F für alle grünen Akzente |
| Scharfer Lichtkern | #39FF14 |
| Dunkle Grünabstufung | #0E8F19 |
| DIGITAL | #F7FFF5, klarer Kern, kein milchiger Lichtteppich |
| REWORK | transparente Füllung, 1.45 px Kontur #23D92A |
| REWORK Glow | Konturgebundene Drop-Shadows 1 / 4 px; kein text-shadow, der die transparente Füllung aufhellt |
| Sonne und Rahmen | Orange/Amber #FFB34D, heller Rand #FFCF81 |

Helligkeit über Kern und Deckkraft erhöhen. Bestehende Radien für kleine Akzente
beibehalten (z.B. 6 px für Zeichen, 14 px für kleine Lichtpunkte). Kein flächiger
hellgrüner Neonschein. Fenster behalten statische warme Rahmen; Interaktionen
dürfen gezielt grün leuchten. Ein durchgehender Rahmen pro Fenster.

## Typografie
Gewählte Display-Schrift: **Archivo**, ermittelt aus dem inline gesetzten
`--studio-display` und dem Seitentitel des Entwicklungsstands c20dfc3.
Fließtext: Manrope; technische Labels: DM Mono. Klar, schnörkellos, kräftig,
gut lesbar; Text kopierbar lassen. Schriftvergleich und font-URL-Parameter sind
abgeschafft. Schriften lokal mit Lizenzen bereitstellen.

## Ebenen
1. Dunkler fester Hintergrund.
2. Galaxie in eigenem Positionierungscontainer.
3. Galaxiebild, transparenter feiner Sternenfilm und dezenter Schleier in genau
   **einem** Rotationscontainer (300 s Desktop, 360 s mobil).
4. Zusätzliche feste Sterne über dem Hintergrund, unabhängig von der Rotation.
5. Seitenfenster mit statischem orangefarbenem Rand.
6. Vergleichsinhalte; Sonne und Kontrollzentrale vor dem Rahmen.
7. Ein senkrechter Vergleichsstrahl; Labels und bedienbarer Regler darüber.

Die aktuelle transparente Galaxie stammt aus Patricks verfeinertem Upload `Galaxy(2).png`.
Sie ersetzt die zuvor am Bildrand beschnittene 2Galaxie.png. Originalgröße
1280 × 1001, RGBA; alle vier äußeren Pixelreihen sind transparent.
Original unverändert unter assets/images/Galaxy-2.png; CSS positioniert nur den
Kern auf der Drehachse und erhält die natürlichen Bildproportionen. Keine
zusätzliche kreisförmige Maske auf Bild oder Rotationscontainer, keine CSS-
Abdunklung oder Farbfilter: Die eigene Transparenz und die außenliegenden
Sterne der PNG müssen sichtbar bleiben. Der zusätzliche Sternenfilm ist mit
20 % Deckkraft zurückgenommen, damit die von Patrick bearbeiteten Sterne
bestimmend bleiben. Am lockeren Außenbereich ergänzen 16–42 feine feste Sterne
mit engem weißlichem Leuchten den vorhandenen Hintergrund. Sie werden einmal
gezeichnet, drehen sich nicht mit und haben keine Blinkanimation.
Sternenfilm nicht als eigenes Bild unabhängig animieren. Sterne sehr fein,
weißlich, scharf, mit sparsamen kleinen vierstrahligen Glints.

## Bewegung und Interaktion
Kinetische DIGITAL/REWORK-Animation und ruhige Galaxiedrehung erhalten.
Sonne: vorhandene 60-fps-Fassungen, normaler playbackRate, kleineres Video mobil;
außerhalb des sichtbaren Headers und im versteckten Tab pausieren.
Zusatzwunsch: Die ursprüngliche Sonne bleibt unverändert. Ein eigener gefilmter
Koronaring mit Flammen aus der Eclipsio-Referenz liegt darüber (512 px/60 fps,
mobil 384 px/60 fps). Originale Position und Sonnengröße nicht verändern.
Ringradius 176/512, Ebenengröße 145.455 %, Versatz -22.7275 %; screen blendet
Schwarz aus, eine enge Ringmaske hält die Sonnenoberfläche frei. Keine Flammen
per Laufzeit-Canvas erzeugen. Beide Videos gemeinsam sichtbar/unsichtbar schalten.
Vergleich startet 50/50. Ein gerader orangeweißer Lichtstrahl reicht exakt von
Rahmenkante zu Rahmenkante, ohne Ankerpunkte, Überstand oder zweite Leiste.
Maus, Touch und Pfeiltasten/Pos1/Ende bedienen den Regler; Doppelklick zentriert.

HRService, Villa Schwalbe und Gasthof Wagner behalten echte Aufnahme-Standbilder.
Nur Hover startet Videos; Verlassen pausiert sofort, nach zehn Sekunden Reset.
Auf Touchgeräten bleiben die verlinkten Standbilder nutzbar.
Kategorien Hotel, Restaurant, Fahrschulen: je drei rotierende Vorschläge,
bei Hover/Fokus pausiert, mit Dialog und Desktop-/Handyvorschau.

## Responsive und Performance
Vorhandene Breakpoints (1550, 1250, 1100, 760, 650, 380 px) berücksichtigen.
Keine horizontale Überbreite, gestauchten Sterne oder verzerrten Bilder.
Canvas-Seitenverhältnis dem sichtbaren Bereich anpassen; maximal 2.2 Mio Pixel
pro Fläche, DPR maximal 1.25. Sterne nur initial und bei Größenänderungen malen;
Bewegung per CSS-Transform. Keine Scroll-Handler für Hintergrundpositionierung.
Keine dauerlaufenden versteckten Videos/Canvas-Effekte. Offscreen- und
Tab-Pausierung; prefers-reduced-motion und saveData berücksichtigen.
Desktop und Smartphone tatsächlich rendern, Firefox und Chromium prüfen, soweit
die Umgebung das erlaubt. Grenzen konkret dokumentieren.

## Space-Icons und Missionsbewegung
Drei eigene SVG-Illustrationen greifen die Referenzideen auf: gegensinniger
Astronauten-Laufzyklus, mechanischer Kreativantrieb, Globus mit Satellitenbahn.
Kompakte sechseckige Missionskonturen, weißliche Striche, Lasergrün und warme
Amberdetails. Keine fremden Grafiken oder Logos in die Seite kopiert.
Die Module verbinden Hero und Arbeiten; Service-Icons und eine Rakete am
Zurück-nach-oben-Link verwenden dieselbe Strichsprache. Bewegung nur sichtbar
und im aktiven Tab; Reduced Motion zeigt ruhende Illustrationen.
Antrieb starten ist eine optionale 4.5-s-Interaktion mit bedienbarem Stop und
Statusrückmeldung. Kein neuer Canvas oder dauernder JavaScript-Frame-Loop.
Die Sonnenkorona läuft über 33.5 s bei 60 fps: 2 s Ruhe, 15 s Aufbau,
2 s Höhepunkt, 12.5 s Rückzug, 2 s Ruhe. Der Rückzug ist um 20 % schneller
als die vorherigen 15 s. Jeder der vier aufgenommenen Ausbrüche wird auf
seinen eigenen Höhepunkt zeitlich abgebildet; alle Richtungen verwenden
dieselbe weiche Kurve für Bewegung und Helligkeit. Kein neuer Ausbruch während
des Rückzugs. Winkel werden weich überblendet, Überlagerungen links, rechts
und unten gefiedert. Ruhige, übereinstimmende Endpunkte vermeiden den Sprung.
Ursprüngliche Sonne, Größe und Position bleiben erhalten.

## Icon- und Neonkorrekturen nach den zehn Screenshots
Neue Vorlage: Mike Hill, Space Icons, Dribbble 4298961. Runde weiße Konturen,
Space-Motive und eng begrenzte Lichtakzente; eigene SVG-Umsetzung für Planet,
Rakete, Teleskop, Satellit und UFO. Kleine gefüllte Raketen ersetzen die
Richtungspfeile im Portfolio. Flammen erscheinen erst bei Hover oder Fokus.
Runde Bedienelemente haben ein separates Hintergrund-Pseudoelement unter
dem zentrierten Symbol; beim grünen Hover wechselt das Symbol kontrastreich
auf sehr dunkles Grün. Kein gleichfarbig übermaltes Icon.
Antriebsflammen starten bei Hover auf die Getriebekarte; Klick/Tastatur bleiben
als zusätzliche steuerbare Aktivierung erhalten. Kein Flammenlauf im Ruhezustand.
Grüne Beschriftungen verwenden #19E50F. Große Akzentwörter haben einen dunklen
Kern, eine enge grüne Kontur und kleine lichtgebundene Schatten statt hellgrüner
Vollfüllung oder breitem Glow. DIGITAL bleibt weiß. Navigationspunkt unter
Arbeiten, einzelner Punkt am Service-Orbit und grüner Fleck im Hero entfallen.

## Präzisierung nach vier Korrekturbildern
Alle Space-Motive nutzen gemeinsame SVG-Symbole nach der neuen Mike-Hill-
Vorlage: schräge Rakete mit runder Nase, Teleskop, Ringplanet, Satellit und UFO.
Die mechanische Antriebszeichnung entfällt; im Antriebsmodul steht dieselbe
Rakete, deren warme Flamme weiterhin erst bei Hover oder manueller Aktivierung
erscheint. Services nutzen dieselben Symbole, weiße Konturen und grüne Akzente.
Kleine verbleibende Linkraketen sind vollständig gefüllte Varianten.
Entfernt: Hero-Namenszeile; Rakete am Scrollhinweis; Raketen in Projekt- und
Kategorie-Titelleisten; drei zusätzliche runde Projektlinks; Rakete am
Projekt-Hinweistext; großer runder Footerlink; Konzeptstudie-2026-Zeile;
Rakete neben dem textlichen Back-to-top-Link. Markierte Dekoration nicht
später erneut hinzufügen. Haupt-Vorschaulinks und textlicher Top-Link bleiben.

## Missionskacheln: Raketen bei Karten-Hover
Alle drei kleinen Raketen zünden bereits beim Hover über ihre gesamte Kachel,
auch wenn der Zeiger auf Überschrift oder Fließtext steht. Fokus innerhalb
der Kachel aktiviert denselben Zustand. Der mittlere textliche Startknopf ist
durch eine kleine gefüllte Rakete gleicher Größe ersetzt; sie bleibt als Button
per Tastatur und Touch steuerbar und hat ein dynamisches aria-label.
Die orange/gelben Screenshot-Kästen sind Markierungen, keine sichtbaren Rahmen.

## Kontrollzentrale als neues Hero-Motiv
Auf Patricks Wunsch ersetzt eine realistische freigestellte Kontrollzentrale
den Astronauten. Asset: assets/images/control-center.webp, 1254x1254 Pixel
(rund 1.57 MP wie das ursprüngliche Astronautenasset), Alpha, verlustfreies WebP.
Kompakte flache Monitorreihe, weich gerundete glänzende Graphitgehäuse,
hellere Einsätze, Titan und dunkles Glas. Präzise grüne Radar-/Telemetrieanzeigen.
TRON-Legacy-Light-Cycle als Material-/Lichtreferenz: glatte Reflexionsflächen,
präzise Lichtlinien, klare Kontraste. Sonne erzeugt warme orange-goldene
Reflexe an oberen und seitlichen Rändern. Kein hoher Mast oder Antennen.
Keine Personen, rauen Oberflächen, rostigen oder außerirdischen Strukturen.
Kein Hue-Rotate auf dem Asset. Nur Motivgröße/Position an die kompakte Form
angepasst; Sonne, 33.5-s-Korona, Galaxie, Vergleichsregler und Texte erhalten.

Der Kontrollzentrale liegt ein hochauflösender Boden aus glattem Graphit und
Titan unter. Perspektivische Paneele, sehr feine grüne Fugen und warme Reflexe
führen den Materiallook fort. Desktop-Horizont ungefähr auf Bildschirmmitte;
mobil an den Stationsfuß angepasst. Nur innerhalb des Hero und der neuen
Vergleichshälfte, hinter Kopie und Station. Kontaktschatten erdet die Basis.

## Bildschirmfüllender Einstieg aus Operator-Perspektive
Aktueller Wunsch: kein Stuhl; nahe sitzende Perspektive auf eine breite Konsole.
Die erste Szene reicht über die gesamte Browserbreite und füllt den Bildschirm.
Die bestehende Sonne/Korona und die originale Galaxie bleiben echte Medien.
Neues freigestelltes Workstation-Asset mit leeren seitlichen Monitoren:
1774x887 RGBA, verlustfrei. Links echte HTML-Typografie DIGITAL / REWORK samt
vorhandener 7.6-s-Animation, auf diesen Monitor begrenzt. Rechts Titel,
Beschreibung und CTA als echte interaktive HTML-Inhalte. Mittig Erdtelemetrie.
Auf kleinen Displays werden dieselben realen Monitorrahmen lesbar untereinander
angeordnet; der Bedienpult-Ausschnitt bleibt im Vordergrund. Keine Schrift im
Rasterbild. Farben, Detailgrad, Goldreflexe und Boden fortführen.
Alle Abschnitte unterhalb des Einstiegs bleiben in ihrer bisherigen Gestaltung.

## Gerades Terminal mit sichtbaren Außenkanten
Aktuelle Präzisierung: zwei große, plane Hauptmonitore ohne Krümmung oder
Trapezperspektive. Live-Inhalte und Animation stehen unverzerrt auf diesen
Flächen; keine skewY-Transformation. Erdtelemetrie im kleinen Pultdisplay.
Asset workstation-flat.webp, native 1774x887 RGBA, verlustfrei. Beide seitlichen
Gehäuseenden vollständig enthalten; kleine transparente Ränder im Bild plus
14 px Layoutabstand. Größere Hauptdisplays geben die gewünschte nähere Ansicht,
ohne die Station an den Seiten abzuschneiden. HTML-Kopie, Farben und Animation
bleiben erhalten. Mobile verwendet die neuen geraden Monitorrahmen; Pultbreite
passt vollständig in den Viewport.

## Sonnenkante, Mittelstütze und aktive Nebenanzeigen
Eigene orange Leuchtstreifen entfallen. Weiße Hardware-Lichtakzente, warme
Reflexe ausschließlich knapp an der äußeren Silhouette. Stabile Mittelstütze
mit vollständig sichtbarer Bodenplatte. Sichtbar getrennte Hauptmonitore mit
optisch etwa 10 cm Abstand; physischer Maßstab im Rasterbild ist angenähert.
Asset workstation-pedestal.webp, 1774x887 RGBA, verlustfrei. Hauptkopie bleibt
live und gerade, Einsetzflächen an die neue Monitorhöhe angepasst.
Die sieben kleinen Pultdisplays zeigen grüne technische SVG-Grafiken und
unbekannte eigene Vektorzeichen. Referenz: Patricks Retro-Sci-Fi-Screenshot
und Screensavers Planet /retro-sci-fi-522/. Keine fremde Software/Assets
übernommen. Wellenformen, Schaltpläne, Gitterkugel und schnelle Terminalzeilen;
CSS-Animation, nur sichtbar und im aktiven Tab. Kein Canvas-Repaint-Loop.


## Hero-Komposition nach Patricks Skizze vom 22.10.2026

Die weiße Fläche in der 1610×853-Skizze ist keine neue Hintergrundfarbe:
die dunkle Weltraumwelt mit Sternen und Galaxie bleibt über das ganze Fenster
erhalten. Das Verhältnis der Motivgruppen ist verbindlich:

- Navigation ausschließlich oben links, visuell etwa x=0–660 / y=0–154.
  Auf kleineren Geräten bleibt die bisherige responsive Navigation.
- Sonne und vorhandene Korona unverändert als echte Medien oben mittig:
  Referenz ca. x=670–940 / y=36–304. Sonnenlicht bleibt Amber/Orange.
- Workstation nimmt die untere, fast volle Fensterbreite ein. Ihre
  äußeren Gehäusekanten bleiben sichtbar, mit nur wenig seitlicher Luft;
  keine eigene Bildverzerrung und keine zusätzliche künstliche Neuzeichnung.
  Auf der 1610×853-Desktopansicht beginnt die Monitorreihe bei y≈350.
- Linkes Display: DIGITAL/REWORK, fein begrenztes Lasergrün; rechtes Display:
  Zeit für einen neuen Auftritt mit Beschreibungs- und Interaktionsbereich.
  Beide sind echte HTML-Texte und werden in den Glasflächen verankert.
  Zwischen den beiden Hauptdisplays bleibt die Mitteltelemetrie sichtbar.
- Boden, Taster, Zentralhalterung und untere Linklabels behalten ihre
  räumliche Tiefe. Kein weißer ausgeschnittener Hintergrund.
- Desktop-Proportionen über wenige gekoppelte CSS-Werte;
  Tablet/Mobil verwenden weiterhin die bestehenden spezialisierten
  Ansichten, sodass Schrift nicht gestaucht oder abgeschnitten wird.
- Die geänderte Komposition liegt isoliert im Branch
  feat/sketch-layout-20261022 und darf erst nach Freigabe nach main.


## Verbindliche Workstation-Vorlage aus GIMP (22.10.2026)

Patrick hat selbst die Datei **Graphit-Titan-Doppelmonitorstation mit grüner Telemetrie.png**
als Original hochgeladen (1774 × 887 px, RGBA mit Transparenz). Diese konkrete
unveränderte PNG ist ab sofort der visuelle Master für die Konsole und auch
seine lokale GIMP-Arbeitsdatei. Nicht die danach mittels KI neu erzeugten
Rekonstruktionen verwenden. Diese haben unerwünschte rot-gelbe Kantenartefakte,
veränderte Schalter sowie verfälschte Formen erzeugt.

Bis die originalen PNG-Bytes in das GitHub-Repository übertragen wurden, darf
die aktive Bildreferenz im Code nicht auf eine fehlende Datei umgeschaltet werden.
Ab einem solchen Upload die Original-PNG möglichst unter
`assets/images/workstation-original.png` unverändert speichern und
`workstation-art` sowie die zwei `monitor-frame`-Bildquellen gemeinsam
auf denselben Dateipfad aktualisieren. Die vorhandenen `aux-displays`- und
Monitor-Overlays anschließend anhand des **exakten** Pixelrasters der Original-PNG
kalibrieren. Keine KI-Regeneration, keine geometrische Retusche, keine
zusätzlichen Stäbe/Spangen, und bis auf ausdrückliche Freigabe keine
Veränderung am Original.

Geplante nächste Phase: Patrick markiert die exakten Pixelbereiche der beiden
Monitore und der einzelnen Tasten/Schalter in GIMP. Daraus werden eigenständige
interaktive Ebenen entwickelt, ausgerichtet an derselben Bilddatei.

## Verbindlicher ORA-Ebenenaufbau (aktueller Stand)

Patricks `Workstation-Ebenen.ora` ersetzt die frühere zusammengefasste
Workstation. Canvas 1774 × 887; originale PNGs unverändert, keine KI-Neuerstellung.
`base.png` (0/0, 1774×887), `monitors.png` (128/95, 1519×432),
`panels.png` (38/423, 1701×209), `controls.png` (49/423, 1677×201).
Auch ausgeblendete ORA-Ebenen werden ausgewertet. Sie enthalten Bildteile,
keine flächigen Markierungsfarben. Genau einmal zusammensetzen.

Ein gemeinsames relatives Koordinatensystem für Bitmapteile, Hauptmonitor-HTML,
elf kleine Alpha-maskierte Displayanimationen und 61 adressierbare Bedienmasken.
Matrix senkrecht nach unten, ausschließlich in den real ausgeschnittenen dunklen
Panelbereichen, geschützt vor Displays, Schaltern und Metallreflexen. #19E50F,
Akzente #39FF14, enger 1-Pixel-Schein. Kein ganzflächiger Grünfilter.
Einmal erstellte SVG-Geometrie und CSS; offscreen/hidden/reduced-motion/saveData
pausieren. Die alten sieben geschätzten Displaypolygone sind ersetzt.

Auch mobil bleibt das komplette Gerät einschließlich Standfuß zusammenhängend;
keine verzerrten oder getrennten Monitorrahmen. Für lesbare Telefoninhalte steht
die rechte Monitor-Kopie zusätzlich unter dem Gerät. Ältere mobile Crop-Regeln
in diesem Dokument sind damit überholt. Details und Maskenformel:
[docs/workstation-ora.md](docs/workstation-ora.md).


## Aktuell: Rauchglas-Tisch mit drei Monitoren (23.10.2026)

Der neue GIMP-Import aus `Tisch einzelteile(1).ora` ersetzt den früheren schweren
1774×887-Kontrollpult-Aufbau im aktiven Hero. Verbindlich ist jetzt **1949×826**,
16 benannte Originalebenen mit ihren echten Alpha-Masken und Originalversätzen.
Die neue Skizze verwendet den alten Tisch ausschließlich als Platzhalter für
Anordnung/Größenverhältnisse. Tatsächlich drei Hauptmonitore, vier kleine Displays,
Rauchglas, Titanhalterungen und rote/orange/grüne Originalknöpfe verwenden.
Tischvorderkante bündig unten am Hero; Sonne oben frei sichtbar, Navigation links.
Links DIGITAL REWORK, rechts bisherige Kopie/CTA, Mitte feine grüne Telemetrie.
Drei grüne Hinweisfelder an Gerät und Viewport anpassen. Kleinmonitore behalten
ihre Originaldiagnostik; Matrix nur in echten schmalen Display-Codebereichen.

Ausdrücklich freigegebener Oberflächen-Feinschliff: separate Tastaturtextur und
scharfe echte Beschriftung. Originale 16 PNGs bleiben unverändert archiviert.
Keine KI-Neuzeichnung des Tisches/der anderen Geräteflächen. Keine neue Palette,
keine zusätzlichen Knopffunktionen. Auf Telefonen vollständiges Gerät unten
plus lesbare Textkopie darüber; keine getrennten oder verzerrten Monitorrahmen.
Native Maße, Downloads, Feinschliffherkunft und Prüfgrenzen:
[docs/smoked-glass-desk.md](docs/smoked-glass-desk.md).


## Aktuell: Textmode Flightdeck (23.10.2026)

Die neue Skizze 033549 ersetzt die vorige Anordnung: größere zentrierte Navigation,
Sonne oben bei 112px, kleinerer Tisch bündig am Hero-Ende. Die Originalebenen
1949×826 und alle Archiv-PNGs bleiben unverändert. Mitte: vollflächige ASCII-
Strömungen in Weiß/Grau und Lasergrün, keine Vergleichsteilung oder Extension-UI.
Links/rechts bleiben DIGITAL REWORK und bisheriger Text/CTA.

Vier kleine Monitore: vorhandene Aufnahmen HRService, Villa Schwalbe, Gasthof
Wagner; vierter edle Kontaktvorschau „Hier könnten Sie sein“. Gemeinsamer
Hover-Controller: sofort pausieren, nach 10 Sekunden außerhalb auf Anfang.
Matrix senkrecht auf dem vorher abgedunkelten Mauspad, anhand echter Quellalpha
maskiert; Tastatur, Maus, Rad und drei Knöpfe ausgespart. Enger heller Kern,
keine grüne Lichtwolke. Physische Originalknöpfe reagieren auf Hover/Klick,
keine noch nicht vereinbarten Ziele.

Plattform: obere 10% ihrer sichtbaren Länge wegschneiden, unveränderte Projektion
und Unterkante. Galaxie dahinter. Feiner blassblau/creme/peachfarbener Lichtsaum
am neuen oberen Rand mit gelegentlichen Helligkeitsimpulsen. Folgeabschnitte in
Rauchglas/Titan mit schmalen Silberkanten und präzisem Grün; keine Änderungen
an Inhalten, Konzeptmarken oder Sonnenmedien. Details: docs/textmode-flightdeck.md.


### Tastaturabstand zur Vorderkante (23.10.2026)

Tastatur und Beschriftung gemeinsam 24 native Pixel nach hinten versetzt:
Arbeitsposition y=595 statt619, identische Größe/Proportionen. Originale GIMP-
Dateien und archivierte Geometrie unverändert. 40 native Pixel zwischen der
sichtbaren Tastaturunterkante (y786) und dem Canvas-Ende (826). Matrixmaske
mit derselben Arbeitsposition neu abgeleitet: scripts/build_mousepad_mask.py.


## Aktuell verbindlich: Curved-Matrix-Szene (23.10.2026)

Die aktuelle Nutzerdatei `Digital-Rework-Zubehoer-v3(1).xcf` mit 2560×1440 ersetzt für den aktiven Hero das alte 1949×826-Raster. Fotografische Reparatur von Tisch, Rahmen und Bildschirmen ist diesmal ausdrücklich beauftragt. Maßgeblich sind Patricks neue Perspektive und Zubehörpositionen. Drei sanft zum Sitzplatz eingedrehte Displays: links rotierende echte Projektaufnahmen, Mitte weich fließende Pixel-/ASCII-Bänder, rechts „COMING SOON – Ihr Projekt“. Die bisherigen Anweisungen zu geraden Displays, Hauptmonitor-Kopie und vier kleinen Displays sind für diesen aktuellen Aufbau überholt. Die DIGITAL-REWORK-Identität steht im freien Bereich oberhalb der Monitorreihe.

Matrixwellen über der tatsächlichen Tischoberfläche, Schriften-Regenimpulse nur auf der separaten Tastaturalpha in #19E50F. Sonne dreht mit0.6×, Galaxie500s/600s. Feiner gemeinsamer Sternenstaub, einzelne feste Sternenglints, gerichtetes Sonnenlicht aus der nativen Quellposition und dezente Galaxielichtimpulse. Keine grünen Lichtwolken. Alle Animationen sichtbarkeitsabhängig, Reduced Motion und Save Data beachten. Weitere Maße, Lichtmasken und ehrliche Prüfgrenzen: [Curved-Matrix-Szene](docs/curved-matrix-scene.md).
