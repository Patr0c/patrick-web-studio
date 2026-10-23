# Projektstand — 22. Oktober 2026

## Ausgangspunkt und Arbeitsweise
Repository: https://github.com/Patr0c/patrick-web-studio
Produktiv: https://patrick-web-studio.pages.dev
Bestehender PR: https://github.com/Patr0c/patrick-web-studio/pull/1
Ausgangsbranch: `perf/animation-loading-20261022`, Commit `c20dfc3`.
Alle 18 zusätzlichen Entwicklungscommits sind Vorfahren des neuen Branches
`chore/design-system-cleanup-20261022`. `main` bleibt unverändert.

## Umgesetzt
- Browser-Export-Verzeichnis in klare assets/css, assets/js, assets/images,
  assets/video und assets/fonts aufgeteilt; drei redundante Konzeptbilder entfernt.
- Aktive Styles konsolidiert, über 460 überholte Deklarationen sowie nicht mehr
  verwendete Feuer-, SVG-, Canvas- und Fontauswahl-Regeln entfernt.
- Gewählte Display-Schrift Archivo beibehalten; Manrope/DM Mono für Text/Labels.
  Nur diese drei Schriftfamilien lokal einschließlich OFL-Lizenzen bereitgestellt.
  Die vorherige lokale 24-Familien-Datei verwies auf fehlende Fontdateien.
- Beide Schriftvergleichslinks, Fontparameter-Logik und Testressourcen entfernt.
  Normale Textauswahl bleibt erhalten.
- Echte Projektstandbilder lokal aus den vorhandenen Videos bei 0.1 s extrahiert.
  Vorher referenzierte Bilder waren trotz früherer Commits nicht eingecheckt.
- Video-Downloads beginnen erst beim Hover, statt bereits nahe dem Sichtbereich;
  Pause beim Verlassen/Unsichtbarwerden und Reset nach 10 s erhalten.
- 18 doppelt gerenderte Kategorieoptionen auf 9 eindeutige Vorschläge korrigiert.
  Räder pausieren zusätzlich außerhalb des Sichtbereichs und im versteckten Tab.
- Veralteten Posterworkflow ersetzt: CI prüft Dateien und JavaScript, schreibt
  nicht mehr automatisch in den alten Entwicklungsbranch.
- Galaxie aus Patricks Upload übernommen, Kern zentriert, quadratischer gemeinsamer
  Rotationscontainer mit eigener PNG-Transparenz; feine Sternenebene synchron, Randsterne fest.
- DIGITAL ohne flächigen Lichtfleck, REWORK mit enger grüner Laserkontur;
  Laserfarben verbindlich dokumentiert, Orange für Sonne und Rahmen erhalten.
- Vergleich ohne veraltetes verstecktes Flammen-SVG; ein CSS-Lichtstrahl über die
  ganze Höhe, mittiger Start, Pointer- und Tastaturbedienung erhalten.

## Medien und Provenienz
| Asset | Verwendung |
| --- | --- |
| assets/images/Galaxy-2.png | Patricks verfeinerter Galaxy(2).png-Upload, unverändert, RGBA 1280×1001 |
| assets/images/astronaut.webp | bestehendes explorer-hero, unverändert |
| assets/video/sun-desktop.mp4 | bestehende Sonnenfassung, 512×512, 60 fps |
| assets/video/sun-mobile.mp4 | bestehende mobile Sonnenfassung, 384×384, 60 fps |
| assets/images/sun-poster.jpg | echter Frame der Sonnenaufnahme |
| previews/hrservice.jpg, villa.jpg, wagner.jpg | echte Frames der Projektaufnahmen |
| concepts/hotel.webp, restaurant.webp, driving.webp | bestehende Konzeptbilder |

Historischer Upload: Galaxie.png und 2Galaxie.png waren bytegenau identisch:
SHA-256 e20e283c53c12e16c9cf066f1212e26897fc6d782303f68083748ea3e8189436.
Die Grafik hat 287982 völlig transparente Pixel und weiche Alphakanalübergänge.
Ihr helles Zentrum liegt rechts der Bildmitte; CSS positioniert es bei der
Drehachse. Eine frühere kreisförmige Maske wurde nach Patricks Rückmeldung entfernt;
die Transparenz stammt ausschließlich aus seiner PNG.
NASA/ESA- und weitere ursprüngliche Bildnachweise bleiben auf der Website.

## Projektlinks (unverändert)
- https://www.hrservice-fm.de/
- https://villa-schwalbe.vercel.app/
- https://gasthof-wagner-demo.vercel.app/

## Prüfung
- Ressourcenprüfung: 23 lokale Ressourcen, 17 eindeutige IDs, interne Sprungziele
  und unveränderte Projektlinks erfolgreich; JavaScript-Syntax und CSS-Parser sauber.
- GitHub Actions: beide static-site-Läufe erfolgreich. Cloudflare-Checks erfolgreich.
- Chromium-Desktop (1363×936): tatsächliche Darstellung, 50/50-Start,
  Pos1/Ende/Pfeiltasten und Doppelklick sowie echte Mausbewegung des Reglers geprüft;
  Drag auf 30 % wurde korrekt als aria-valuenow=30 gemeldet.
- Sofort sichtbare echte Projektposter, Hoverstart, unmittelbare Pause und
  Rücksprung aller geladenen Aufnahmen auf currentTime=0 nach zehn Sekunden geprüft.
  Sonne spielt im sichtbaren Header und pausiert nach dem Scrollen zum Projektteil.
- Alle neun Entwürfe einzeln geöffnet/geschlossen; Desktop-/Handy-Umschaltung
  geprüft. Dialog ist auch im schmalen Smartphone-Viewport sichtbar und scrollbar.
- Mobile Layouts über echte CSS-Viewport-Rahmen (390 und 320 px) im Cloud-Chromium
  gerendert. Kein physisches Mobilgerät. Sonnenlicht-Überbreite behoben; 390-px-
  Rahmen meldet scrollWidth=clientWidth=375 (15 px Scrollbar).
- Bei 320 px zweizeilige Navigation und mehr Abstand zwischen Textblock und
  unterem Projektlink eingerichtet und visuell geprüft; scrollWidth=clientWidth=305.
- Alle drei externen Projektziele liefern bei GET HTTP 200 ohne Umleitung.
- Font-Auswahl vollständig entfernt; Archivo/Manrope/DM Mono lokal ausgeliefert.
- Neuer Galaxiekern sitzt auf der Drehachse, Bild und Sternenfilm haben dieselbe
  Rotationsmatrix; feste Hintergrundsterne besitzen keine Rotationsanimation.
- Kein aktiver Flammenrenderer und kein kontinuierliches JS-Sternen-Repaint.
  Die verfügbaren Logs zeigten Fehler der Browsererweiterung, nicht des Portfolios.

## Grenzen / noch offen
Die lokale Playwright-Installation hat keine Browserbinärdateien; der Download
lieferte leere Archive. Deshalb wird der verfügbare Cloud-Browser zur visuellen
Prüfung verwendet. Firefox-Prüfung ist in dieser Umgebung bisher nicht möglich.
Kontaktmöglichkeit/Impressum sind im Bestand unvollständig und wurden im Rahmen
dieses Designauftrags nicht mit erfundenen Angaben ergänzt.

## Review
Entwicklungs-Preview: https://chore-design-system-cleanup.patrick-web-studio.pages.dev/
Draft-PR: https://github.com/Patr0c/patrick-web-studio/pull/2
Nur Entwicklung veröffentlicht, keine Änderungen auf main.

## Ergänzung: Eclipsio-Korona
Patrick hat ausdrücklich präzisiert: Die vorhandene Sonne bleibt in Darstellung,
Größe und Position erhalten; nur Ring und Flammen werden hinzugefügt.
Originale Sonnenvideos/Poster sind bytegenau unverändert. Ein zuvor lokal
vorbereiteter breiter Sonnenrand wurde vor Bereitstellung verworfen.
Die Originalkorona aus dem bereitgestellten Film wurde vorab auf einen ganzen
Kreis umgelegt, mit versetzten Filmphasen und weichen Übergängen. Es läuft kein
zusätzlicher Szenenrenderer im Browser. Der schmale 60-fps-Ringfilm ist 1110912
Bytes groß (512×512, 4.93 s); eine kleinere mobile Fassung ist ebenfalls vorhanden.
Neue Dateien: assets/video/sun-corona.webm, sun-corona-mobile.webm sowie
assets/images/sun-corona.webp. Ringfilm und Ruheframe besitzen echte Alphatransparenz (VP9/WebM bzw. WebP),
damit kein schwarzer Saum die Galaxie oder Rahmenkante verdeckt.
Der Ruheframe und das Video sind gleich groß
ausgerichtet; Video wird nach dem ersten playing-Ereignis eingeblendet.
Quelle: https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/48106c12-33c9-4cea-9780-4a080477405e.mp4
Die Bildschirmaufnahme von MotionSites wurde als zusätzliche visuelle Referenz
geprüft. Keine Eclipsio-Texte, Navigation oder sonstige Landingpage-Elemente
übernommen. Die Änderung am Produkt betrifft ausschließlich die Sonne.
Ressourcenprüfung nach Ergänzung: 26 lokale Ressourcen, Syntax erfolgreich.
Browserprüfung der zusätzlichen Korona abgeschlossen: In Chromium spielt die
transparente Zusatzebene am Desktop und im mobilen CSS-Viewport sichtbar ab.
Die bestehende Sonne bleibt 268×268 px (Desktop) bzw. 165×165 px (mobil).
Original- und Koronavideo melden readyState=4, spielen bei sichtbarem Header
und pausieren beide nach dem Scrollen zu den Projekten. WebM-Alpha ist sichtbar
transparent, ohne schwarzen Saum am Rahmen. Alle drei Projektaufnahmen wurden
nochmals einzeln per tatsächlicher Mausbewegung gestartet und wieder pausiert.
Ein Vergleich bestätigt: HTML außerhalb der Sonne und ihrer Bildnachweise,
Galaxieskript, Kategorieskript sowie beide alten Sonnenvideos und deren Poster
sind gegenüber dem Stand vor dem Sonnenwunsch unverändert.
Die zusätzliche Korona benötigt WebM/VP9-Wiedergabe; andernfalls bleibt das
transparente Standbild sichtbar. Firefox konnte in dieser Umgebung nicht direkt
getestet werden. Das gilt weiterhin als Testgrenze, nicht als bestätigter Fehler.

## Korrektur: hochgeladene Galaxie sichtbar erhalten
Nach Patricks Rückmeldung wurde die Darstellung der PNG geprüft. Die eingebundene
Datei war bytegenau identisch mit beiden Uploads; eine nachträgliche kreisförmige
CSS-Maske sowie Deckkraft 0.60/0.55 hatten jedoch Außenbereiche und Sterne
verdeckt. Diese Eingriffe sind entfernt, ebenso der Sättigungsfilter und der
zusätzliche helle Schleier. Das Original heißt jetzt ausdrücklich 2Galaxie.png
(gleiche SHA-256 wie oben). Keine neue Bildbearbeitung, keine neue Grafik.
Die PNG verwendet ihre eigene Transparenz bei Deckkraft 1. Der separate
synchron rotierende Sternenfilm bleibt mit 20 % Deckkraft dezent erhalten;
feste Sterne, Sonne und übriger Seiteninhalt bleiben unverändert.
Desktop und mobiler CSS-Viewport wurden geprüft: Geladen wird ausdrücklich
assets/images/2Galaxie.png mit 1280×1001 Pixeln, opacity=1, filter=none und
mask-image=none auf Bild sowie Rotationscontainer. Die äußeren Sternenbereiche
sind in der Vorschau sichtbar. Das Original wird auch unter der direkten
Asset-URL ausgeliefert. Sonne, Medien und sonstige Interaktionen sind unverändert.

## Neue Galaxy.png und feine feste Randsterne
Patricks neuer Upload Galaxy.png ersetzt die alte 2Galaxie.png bytegenau, ohne
Bildbearbeitung. SHA-256: 5c1c47b7c6c293d25e990b860fca470e1e04883b2bba662ff0819639800a4450.
1280×1001 RGBA, sichtbarer Alphabereich (63,102)–(1135,965); alle vier
äußersten Pixelreihen sind vollständig transparent. Der helle Kern liegt
bei (650,518) und sitzt per CSS-Versatz 50.78125 % / 51.74825 % auf der
Drehachse. Unverzerrte Breite weiterhin 112 % des Rotationscontainers.
Keine Maske, Abdunklung oder Farbfilter auf dem Original.
16–42 zusätzliche feine feste Lichtpunkte verbinden den lockeren Außenbereich
mit dem bestehenden Sternenhintergrund. Enger Halo, Radius 0.40–0.75 CSS-Pixel,
separater Zufallsstartwert; bisherige Sterne bleiben an ihren bisherigen Positionen.
Sie werden nur initial und bei Größenänderungen im bestehenden festen Canvas
gezeichnet und drehen sich nicht mit. Keine zusätzliche Animationsschleife.
Sonne, Korona, Seiteninhalt und übrige Interaktionen sind unverändert.
Browserprüfung der neuen Fassung in Chromium abgeschlossen: Desktop und mobile
CSS-Viewports 390/320 px zeigen die neue PNG proportional und ohne zusätzliche
Bildmaske; naturalWidth/Height=1280/1001, opacity=1, filter=none. Keine horizontale
Überbreite (Desktop 1348/1348, mobil 375/375 bzw. 305/305 CSS-Pixel).
Die Galaxie meldet galaxyTurn, die feste Sternenebene animation=none und
transform=none. Desktop-Vorschau unter docs/preview.jpg aktualisiert.
Ressourcenprüfung (26 Referenzen), JavaScript-Syntax, CSS-Parser und git diff
--check erfolgreich. Beide CI-Läufe sowie Cloudflare-Preview erfolgreich.
Unveränderte Interaktionen wurden in der vorherigen Fassung vollständig geprüft;
für diese reine Hintergrundänderung wurden die betroffenen Darstellungen und
der Vergleichsregler erneut kontrolliert. Firefox bleibt ungetestet.

## Verfeinerter transparenter Upload Galaxy(2).png
Galaxy(2).png unverändert als assets/images/Galaxy-2.png übernommen.
SHA-256: 93538183b211e1d56026a6d54a30ffd3619fc4b3efdb5d680fadee594a5a9994.
1280×1001 RGBA, Alphabereich (32,2)–(1160,999), 780024 vollständig
transparente Pixel; alle vier äußersten Pixelreihen transparent.
Der helle Kern bleibt bei (650,518); CSS-Größe und Ausrichtung unverändert.
Die feineren Außensterne des Uploads werden vollständig übernommen.
Keine Maskierung, Bildbearbeitung, Farbänderung oder Abdunklung.
Der zuvor geprüfte Upload Galaxy(1).png enthielt einen grünen Hintergrund und
wurde nicht eingebunden. Zusätzliche feste Randsterne, Rotationsschichten,
Sonne/Korona sowie alle übrigen Seitenelemente und Skripte bleiben unverändert.
Ressourcenprüfung und git diff --check erfolgreich; beide CI-Läufe und
Cloudflare-Preview erfolgreich. Chromium-Desktop und 390-px-CSS-Viewport
zeigen assets/images/Galaxy-2.png mit 1280×1001 Pixeln, opacity=1 und
mask-image=none. Keine horizontale Überbreite (1348/1348 und 375/375).
Galaxie und feste Sterne behalten ihre getrennten Rotationszustände.
Originalbytegleichheit geprüft; Styles, Skripte und Sonnenmedien sind
gegenüber f0583af unverändert. Vorschaubild aktualisiert. Firefox weiterhin
nicht verfügbar; unveränderte übrige Interaktionen zuvor vollständig geprüft.

## Space-Referenzen und weich ausglühende Sonnenkorona
Neuer Entwicklungsbranch feat/space-motion-20261022, Basis c32edc9.
Alle fünf verlinkten Dribbble-Arbeiten im Browser visuell geprüft:
- https://dribbble.com/shots/1892373-Astronaut-Walk (Oliver Sin): gegenläufiger Lauf.
- https://dribbble.com/shots/1528969-Globe (Nick Slater): Globus und Satellitenbahn.
- https://dribbble.com/shots/1741666-KeenCon-Stickers (Dom Flask): Missionsabzeichen.
- https://dribbble.com/shots/1934673-Creative-Drive (spovv): mechanischer Zeichenantrieb.
- https://dribbble.com/shots/1635731-Space-Icons (John Barrier Wilson): Hexagon und Raumfahrtsymbole.
Eigenständig gezeichnete SVGs, keine übernommenen Dribbble-Dateien im Produkt.
Drei Missionsmodule ergänzen die Seite; die bisherigen Inhalte bleiben bestehen.
Zusätzliche Service-Symbole und Raketen-Link zum Seitenanfang. CSS-Animationen
pausieren außerhalb des Viewports und bei verstecktem Tab; Reduced Motion
stoppt sie. Antrieb lässt sich starten/stoppen, nach 4.5 s endet der Schub.
Der zusätzliche Screenshot zeigt eine überlappende linke Sonnenflare.
Offline-Retiming unter scripts/retime_corona.py verwendet die ursprüngliche
Alpha-Aufnahme aus Git: 14 s / 60 fps, weichere linke Flare und 8 s Fade-out
auf einen ruhigen Ring. Identische Ruhephasen an Anfang/Ende. Die ursprünglichen
Sonnenvideos und ihre Größe/Position sind unverändert. Kein neuer Browserrenderer.
Offline-Prüfung: Beide Zusatzfilme 14.000 s, 60 fps und echte Alpha-Transparenz.
Desktopfilm 623294 Bytes, mobil 431021 Bytes. Kontaktbogen bei 0/2/4/7/10/12.5/13.98 s
zeigt den Ausbruch und das lange Abklingen. Differenz erster/letzter decodierter
Frames im Mittel 0.223 von 255 pro Farb-/Alphakanal (Codecabweichung).
Ressourcenprüfung (28 lokale Ressourcen, 23 IDs), JS-Syntax und git diff --check
erfolgreich. Keine Änderungen an Galaxie, festem Sternenhintergrund oder
ursprünglichen Sonnenvideos.
Browserprüfung in Chromium abgeschlossen: Drei Mission-Illustrationen sichtbar,
Lauf/Antrieb/Umlaufbahn animation-play-state=running im Viewport. Außerhalb
des Viewports wird is-inview entfernt. Start-/Stop-Schalter sowie automatisches
Zurücksetzen wurden geprüft; Status und aria-pressed stimmen überein.
Der Film meldet duration=14, readyState=4, spielt im Header und pausiert beim
Scrollen zum Missionsteil. Transparenz und linke Flare visuell kontrolliert.
Desktop ohne horizontalen Überlauf (1348/1348 CSS-Pixel). Mobile CSS-Viewport-
Rahmen 390/320 px: 375/375 bzw. 305/305; auch jede Missionskarte hat
scrollWidth=clientWidth. Alle neun Konzeptdialoge erneut geöffnet/geschlossen,
Handyansicht pro Kategorie umgeschaltet. Service-Accordion mit allen vier
SVG-Symbolen und jeweils nur einem offenen Eintrag geprüft.
Reduced Motion wird durch CSS und bestehenden Video-Controller respektiert;
eine tatsächliche Betriebssystem-Umschaltung wurde nicht automatisiert.
Firefox bleibt in dieser Umgebung ungetestet. Screenshot: docs/space-preview.jpg.
Entwicklungs-Preview: https://feat-space-motion-20261022.patrick-web-studio.pages.dev/
main bleibt unverändert.

## Korrektur: Aufbau und Rückzug gleich ruhig
Nach Patricks Rückmeldung wurde die asymmetrische 14-s-Fassung ersetzt.
Neuer Ablauf 36 s / 60 fps: 2 s Ruhe, 15 s Aufbau, 2 s Höhepunkt,
15 s Rückzug, 2 s Ruhe. Aufnahmezeit und Flammenhelligkeit verwenden dieselbe
gespiegelte Smoothstep-Kurve, statt einen schnellen Aufbau mit langem bloßem
Ausblenden zu kombinieren. Zeitkurve numerisch auf exakte Symmetrie geprüft.
Linke Kantenkorrektur, Ringausrichtung und ursprüngliche Sonne bleiben erhalten.
Keine Änderungen an Icons, Galaxie, Seitentext oder anderen Interaktionen.
Desktop und mobile Datei: 36.000 s, 60 fps. Spiegelbildliche Framepaare
bei 6/29.983 und 12/23.983 s nach dem Decodieren verglichen: mittlere
Codecabweichung unter 2 von 255 pro Kanal. Transparenz bleibt erhalten.
Ressourcenprüfung und git diff --check erfolgreich.
Chromium-Vorschau lädt die neue Fassung: duration=36, readyState=4,
spielt im sichtbaren Header; Aufbau und Beginn des Rückzugs visuell geprüft.
Vorschaubild aktualisiert. Die vorherige Responsive-Prüfung gilt weiter,
da ausschließlich die Filmdateien und deren Offline-Zeitkurve geändert wurden.

## Screenshot-Korrekturen: Raketen, Hover-Kontrast und Neonröhren
Alle zehn Uploads geprüft. Bild 1: Footer-Rakete, Bild 2: Projekt-Rundlink,
3/4: Kontakt und Arbeiten-Pfeile, 5/6: Hero-Beschriftungen, 7: Navigationspunkt,
8: Universum-Überschrift, 9: Leistungen/Orbit, 10: Footer-Überschrift.
Neuere Icon-Vorlage https://dribbble.com/shots/4298961-Space-Icons (Mike Hill)
im Browser visuell geprüft. Eigene runde SVG-Konturen; erste Missionsgrafik
durch Teleskop, Globus durch Ringplanet ersetzt. Services verwenden Planet,
Satellit, Rakete und UFO. Mechanischer Kreativantrieb bleibt als eigenes Motiv.
Alle Hauptseiten-Richtungspfeile und Vorschlagsrad-Pfeile sind nun kleine
gefüllte SVG-Raketen mit Porthole und Hoverflamme. Die funktionalen Alt/Neu-
Chevrons bleiben erhalten. Die eigenständigen Musterwebsites behalten ihre
eigenen Pfeile und Farbwelten. Kreislinks: separate Hoverfläche z-index 0,
zentriertes Icon z-index 1, dunkles Symbol auf grünem Hintergrund.
Getriebeflammen im Ruhezustand unsichtbar; Pointerenter aktiviert, Pointerleave
beendet den Hover-Schub. Manuelles Start/Stop und 4.5-s-Reset bleiben bedienbar.
Einheitliches #19E50F für grüne Akzente, dunkle Kerne und enge Leuchtkonturen
für Work/Universum/Version/rework. Nav- und Service-Orbit-Punkte sowie der
flächige Hero-Fleck entfernt. Sonne und ihr 36-s-Ablauf bleiben unverändert.
Browserzwischenprüfung: Hero-Akzente melden rgb(25,229,15). Alle drei
Projekt-Raketen haben in ihrem Kreis eine gemessene Zentrumabweichung von
(0,0); Footer-SVG ebenfalls (0,0). Hover-Fläche z-index 0, Symbol z-index 1,
Hover-Symbol rgb(4,27,8) auf grün. Getriebe: vor Hover hidden/false,
auf Pointerenter visible/true und Schub aktiv, danach wieder hidden/false.
Die Hintergrundumschaltung der Kreislinks erfolgt ohne Opacity-Übergang,
damit kein kurzer dunkler Icon-auf-dunklem-Grund-Zwischenzustand entsteht.
Kleine Raketen erhalten einen engeren Glow; Browserleisten-Symbole sind für
Lesbarkeit 12 px groß und weiß statt punktartig grün.
Abschlussprüfung in Chromium: Alle neun Konzeptdialoge nach der Raketen-
Ergänzung erneut geöffnet/geschlossen und Handyansicht je Kategorie geprüft.
Nav-Punkt und Service-Orbit-Punkt melden content=none. Footer-Hover meldet
sofort opacity=1 für die Hintergrundfläche, dunkle SVG-Kontur und z-index 1.
Neonwörter haben den dunklen Kern rgb(6,55,12) mit enger #19E50F-Kontur.
In der Handyprüfung wurde die zu breite Footer-Rakete erkannt: Eine alte Regel
für .fine span:first-child griff auch auf das Icon im Link. Sie gilt jetzt
ausschließlich für das direkte Beschriftungskind. Danach ohne Überlauf:
Desktop 1348/1348, 390er-Rahmen 375/375, 320er-Rahmen 305/305 CSS-Pixel.
Sonne, Galaxie, Sterne und bestehende Videologik sind gegenüber b5279cd
bytegenau unverändert. Lokale Ressourcen- und Syntaxprüfungen erfolgreich.
Cloudflare-Vorschau mit der neuen CSS-Fassung im Browser verifiziert.
Firefox bleibt in dieser Umgebung ungetestet.

## Icon-Vereinheitlichung und markierte Entfernen-Korrekturen
Basis c2b55f3, neuer Preview-Branch feat/space-icon-cleanup-20261022.
Vier neue Screenshots vollständig geprüft. Mike-Hill-Vorlage erneut visuell
verglichen: bisherige mechanische Grafik und abweichende Konturen ersetzt.
Alle Space-Motive liegen zentral in SVG-symbol-Definitionen; Mission und
Services teilen ihre Geometrie. Kleine Linkraketen sind gefüllte Varianten.
Entfernt wurden exakt die rot markierten Elemente: Name im Hero; Rakete am
Scrollhinweis; Projekt-/Kategorie-Leistenraketen; drei runde Projektlinks;
Rakete am Wiedergabehinweis; großer runder Footerlink; Konzeptstudie 2026;
Rakete am verbleibenden Back-to-top-Text. Projekt-Vorschaulinks bleiben und
Ressourcenprüfung erwartet deshalb einen Link pro Projekt statt zwei.
Sonne, Galaxie, Astronaut, Slider und Medienlogik sind unverändert.

Abschlussprüfung: Cloudflare Pages und static-site-Check für 85f13b9 erfolgreich.
Vorschau: https://feat-space-icon-cleanup-2026.patrick-web-studio.pages.dev/
Chromium zeigt alle markierten DOM-Selektoren mit Anzahl 0 und keinen Text
Konzeptstudie 2026. Gemeinsame Symbole bei Mission/Services visuell geprüft.
Antrieb vor Hover hidden/false, auf Hover visible/true, danach hidden/false;
auf 320-px-Prüfrahmen auch manuell schaltbar. Mobile Darstellung visuell geprüft;
Desktop 1348/1348, 390er-Rahmen 375/375, 320er-Rahmen 305/305 ohne Überlauf.
Alle neun Dialogtitel mit ihren Buttons abgeglichen, alle neun korrekt. Für
die stabile automatische Zuordnungsprüfung wurden die Vorschlagsräder per
vorhandenem Pause-Button angehalten. Hotel-Handyansicht meldet is-mobile.
Textlicher Back-to-top-Link navigiert zu #top. Slider: Home=0, Rechts=2,
Doppelklick=50; Anzeige nach dem nächsten gerenderten Frame abgelesen.
Sonnenfilme spielen im sichtbaren Hero, Korona meldet weiterhin 36 Sekunden.
Alle Bild-/Videoassets sowie media.js, space.js und comparison.js sind gegen
c2b55f3 unverändert. Ressourcenprüfung (28 Dateien/26 IDs), categories.js-
Syntax und diff --check erfolgreich. Firefox weiterhin nicht verfügbar.
Screenshots: docs/icons-cleanup-preview.jpg (Hover-Flamme),
docs/projects-cleanup-preview.jpg und docs/footer-cleanup-preview.jpg.

## Karten-Hover für die drei kleinen Missionsraketen
Basis 0972ee7, Branch feat/mission-hover-20261022. Screenshot 172236 geprüft:
Orange markiert die kleinen Linkraketen außen, Gelb den mittleren Startknopf.
Der mittlere Knopf verwendet jetzt dasselbe kleine gefüllte SVG statt Text.
Sein Start/Stop-Name bleibt für Hilfstechnologien als aria-label erhalten;
JavaScript ändert nicht mehr textContent und bewahrt so das Icon beim Schalten.
Alle kleinen Raketen zünden auf Karten-Hover oder Fokus innerhalb der Kachel.
Die mittlere bleibt zusätzlich während eines manuellen Schubs aktiv.
Keine orange/gelben Markierungsrahmen ins Design übernommen.

## Feuernovas rundum vereinheitlicht; Rückzug 20 Prozent schneller
Auftrag während der Hover-Korrektur ergänzt. Die originale Koronaaufnahme hat
unterschiedliche lokale Höhepunkte: Norden 4.917 s, Osten 3.600 s, Süden 2.350 s,
Westen 1.100 s. Der bisherige globale Vor-/Rücklauf ließ deshalb einzelne
Ausbrüche während des Rückzugs erneut anwachsen. Die Offline-Pipeline bestimmt
jeden lokalen Höhepunkt und bildet ihn auf dieselbe Smoothstep-Phase ab.
Winkelabhängige Quellenzeiten werden nahtlos überblendet; die linke
Überlappungsfederung wird auf rechten und unteren Rand erweitert.
Neuer Ablauf: 2+15+2+12.5+2=33.5 Sekunden bei 60 fps. 15/12.5=1.2, also
20 Prozent schnellere Rückzugsbewegung. Keine globale Beschleunigung des
Aufbaus. 101 korrespondierende Aufbau-/Rückzugsphasen stimmen numerisch überein.
Beide VP9-Dateien haben echte Alpha-Transparenz (alpha_mode=1), 2010 Frames,
512x512 bzw. 384x384. Decodierte Endpunktabweichung bei 256 px: 0.00145/255
im Mittel. Kontaktbogen bei 0/7/13/18/22/28/33.48 s visuell geprüft, siehe
docs/nova-timing-preview.jpg. Sonne und Galaxie selbst sowie ihre Größen,
Positionen und vorhandenen Mediencontroller werden nicht geändert.
Hover-Prüfung in Chromium: Jede der drei Kacheln aktiviert ihre kleine Flamme
bereits bei Zeiger auf dem Textbereich (opacity=1, animation=rocketBurn).
Nach Verlassen alle drei opacity=0. Mittlere Rakete nach Start und nach dem
4.5-s-Reset weiterhin als SVG vorhanden, aria-label/aria-pressed korrekt.
Knopf ist transparent und ohne Rahmen; Screenshot docs/mission-hover-preview.jpg.
390er-Rahmen 375/375 ohne Überlauf; mittlerer Iconknopf auf 320er-Rahmen
per Klick/Touchfunktion bedient, Größe 32 px, SVG bleibt erhalten.

Veröffentlichte Sonnenfassung in Chromium verifiziert: duration=33.5,
readyState=4, paused=false im sichtbaren Header. Beide statischen Checks und
Cloudflare-Deployment für e175495 erfolgreich. Alle drei Karten-Hover-
Zustände und korrektes Rücksetzen zuvor in der veröffentlichten Vorschau geprüft.
Auch nach automatischem Ende des Schubs bleibt der mittlere SVG-Knopf erhalten.
Handybreiten 390/320: 375/375 bzw. 305/305 ohne horizontalen Überlauf.
Kleine Kartenflammen pausieren zusätzlich explizit außerhalb des Viewports,
auch wenn ein Link nach Navigation noch Tastaturfokus hat. Reduced Motion und
Tab-Pausierung bleiben aktiv. Firefox weiterhin nicht verfügbar.

Die mobile Fassung lädt ebenfalls duration=33.5, readyState=4, paused=false,
mit currentSrc sun-corona-mobile.webm. Hauptansicht bei 14.39 s mit
sichtbarem rechten, linken und oberen Ausbruch geprüft und dokumentiert:
docs/nova-live-preview.jpg. Zurückziehen und Ruhephase im decodierten
Kontaktbogen kontrolliert. Ursprüngliche Sonnenvideos sind unverändert.

## Astronaut durch moderne kompakte Kontrollzentrale ersetzt
Basis 89b40a0, Preview-Branch feat/control-center-20261022.
Finale Fassung nach Patricks Präzisierungen: niedrige gerundete Konsole, drei
breite Monitore, klar getrennte Bedienelemente, glänzendes Graphit, hellere
Einlagen und präzise grüne Telemetrie. Keine hohe spitze/raue Maststruktur.
Warme orange Kanten und Reflexe verbinden das Objekt optisch mit der Sonne.
TRON-Referenz VVzm8yyHCHE identifiziert; Player blieb bei readyState=0 auch
nach Qualitätsreduktion. Deshalb Standbild-Suchergebnisse der Szene ergänzend
für Glanzflächen, Lichtlinien und Reflexe herangezogen, keine Filmassets kopiert.
Bildgenerierung als eigenes Asset; tatsächliche Ausgabe 1254x1254 RGBA,
rund 1.57 MP. Keine künstliche Hochskalierung, verlustfreies WebP (1317204 Bytes)
ist pixelgleich mit der PNG. Die frühere hohe Variante wird im HTML ersetzt.
Das Motiv nutzt die bestehende Ankunftsanimation. Sonnen-/Koronafilme,
Galaxie und Steuerlogik bleiben unverändert. Kein Hue-Rotate für das neue Bild.
Quadratische motivspezifische CSS-Box, mobil maximal 220x220, auf 320er-Rahmen auf 70% begrenzt, erhält freie Textflächen.
Finaler Prompt und Bildherkunft: docs/control-center-prompt.md.

## Boden unter der Station
Nachtrag auf Patricks Wunsch: eigener hochauflösender Boden ab etwa der Mitte
im Desktop-Hero. Glatte Graphit-/Titanpaneele mit perspektivischen Fugen,
feinen grünen Lichtlinien und warmen Sonnenreflexen. Separates Bildasset
control-floor.webp, native 1774x887 RGBA, verlustfrei und pixelgleich zur
Generierung (1367856 Bytes), nicht hochskaliert. Hinter Station und Texten,
innerhalb der neuen Vergleichshälfte. Weicher Kontaktschatten unter der Basis.
Mobile Projektion beginnt passend zum dort höher angeordneten Stationsfuß.
Boden wird im Hero geklippt, bleibt statisch und fängt keine Eingaben ab.

Finale Browserprüfung in Chromium am Preview fa27899: Boden vollständig geladen
mit 1774x887; Desktop visuell geerdete Station, lesbare Texte und warme Reflexe.
390er-Ansicht ebenfalls visuell geprüft. Viewportrahmen 320/390/768/1440:
interne Breiten 305/375/753/1425 jeweils gleich scrollWidth, kein horizontaler
Überlauf. Station bleibt auf 320 vollständig innerhalb des Hero (192.5 px breit).
Regler mit Ende/Pos1 sowie echtem Drag geprüft: 100/0/75, neue Hälfte und Boden
korrekt gemeinsam geklippt; danach auf neue Ansicht zurückgesetzt.
Korona weiterhin duration=33.5, readyState=4, paused=false. Alle neun Konzepte
und drei Hoveraufnahmen wurden im vorherigen Stand geprüft; deren Quellen und
sämtliche Skripte unverändert gegenüber 89b40a0. Ressourcenprüfung (29 lokale
Referenzen, 26 IDs) und diff --check erfolgreich. Firefox nicht verfügbar.
Beweisbilder: docs/control-center-preview.jpg, docs/control-center-mobile-preview.jpg.

## Breite Workstation aus sitzender Nahperspektive
Basis dc1f1e0, separater Branch feat/workstation-immersive-20261022.
Auf Patricks Wunsch Stuhl entfernt, Kamera näher; Konsole über die erste Szene
verbreitert. Szene bis an beide Browserränder, Höhe 100svh mit Mindesthöhe für
lesbare Inhalte. Bestehende Seite darunter im bisherigen Content-Rahmen.
Neues eigenes Bild workstation-operator.webp: native 1774x887 RGBA,
1570256 Bytes, verlustfreies WebP, pixelgleich zur PNG und nicht hochskaliert.
Leere Seitenmonitore tragen echte HTML-Inhalte: links DIGITAL REWORK mit
unveränderter dexterType/dexterCut/dexterRule-Animation, rechts bisherige Kopie.
Animationslinie in linken Monitor verschoben, keine CSS-/JS-Neuzeichnung der
Konsole. Mobile Rahmen sind CSS-Ausschnitte derselben Bitmap, Inhalte bleiben
skalierbare Schrift und bedienbare Links. Die Szene öffnet vollständig im neuen Design; der Vergleichsregler bleibt
verfügbar, Doppelklick setzt wie bisher auf 50/50.
Nur beim Laden/Resize wird die tatsächliche Clientbreite für den Hero gelesen,
kein kontinuierlicher Resize-/Paint-Loop. Originale Sonnen-/Koronafilme,
Galaxie, Projekte, Kategorien und deren Steuerungen unverändert.
Prompt und Herkunft: docs/workstation-operator-prompt.md.

Browserprüfung am Preview d19d46c in Chromium: Einstieg direkt 0% Alt,
Herohöhe 936 px bei 936 px sichtbarem Browserinhalt; 1348/1348 Client-/Scrollbreite.
Desktop visuell geprüft: kein Stuhl, Nahperspektive, echte Inhalte vollständig
innerhalb linker/rechter Glasfläche. CSS-Titelanimation weiterhin dexterType,
7.6-s-Zyklus unverändert; Linie auf linken Monitor begrenzt. Screenshots:
docs/workstation-operator-preview.jpg und docs/workstation-operator-mobile-preview.jpg.
Mobile 320er-Rahmen: 305/305, rechte Kopie/CTA ohne Überlappung oder Abschneiden;
390er-Rahmen: 375/375, beide Monitorrahmen untereinander visuell geprüft.
768er-Rahmen: 753/753, nebeneinander, alle Inhalte passen in die Displays.
Alle neun Konzepte im echten Browser geöffnet: Dialoge offen, jeweilige Titel
korrekt, Motivbilder vollständig geladen. Sonnenkorona außerhalb des Headers
pausiert; Quelldauer 33.5 s unverändert. Drei ursprüngliche Projektaufnahmen,
Galaxie und alle Steuerdateien außer comparison.js unverändert.
Statische Prüfung: 30 lokale Ressourcen, 26 eindeutige IDs; JS-Syntax und
diff --check erfolgreich. Firefox ist in dieser Umgebung weiterhin nicht verfügbar.

Abschließende Interaktionen: echter Drag ergibt 60%, Doppelklick 50%, Ende
100% mit vollständig geklippter neuer Szene, Pos1 zurück auf 0%. 1440er-Rahmen:
1425/1425, Hero 844 px bei 844 px Viewporthöhe. Alle drei Projektvideos separat
per echtem Hover abgespielt (readyState=4, laufende Zeit); vorherige Aufnahme
pausiert beim Wechsel, nach Verlassen alle pausiert. Kein Websitefehler in der
Prüfung beobachtet; Browser-Erweiterung protokolliert eigene Metadatenfehler.
Keine Produktionsänderung; nur separater Cloudflare-Preview-Branch.

## Näheres gerades Terminal, Seitenkonturen vollständig
Basis fff4282, Branch feat/flat-terminal-20261022. Patricks Wahlmöglichkeit
umgesetzt: neues Terminal ohne Bildschirmkrümmung statt unpassender Projektion.
Zwei größere Hauptdisplays, Erdtelemetrie im kleinen zentralen Pultdisplay.
Gehäuse-/Joystick-Außenkanten nun vollständig im Bild. Native 1774x887 RGBA,
WebP verlustfrei/pixelgleich, 1287700 Bytes; Alpha >32 liegt in x=43..1731,
y=81..823, also etwa 2.4% wirklich freie Ränder. Im Layout zusätzliche 14 px
je Seite. Hauptdisplays breiter, Titel größer, keine skewY-Verzerrung.
Mobile Pultgrafik passt in die Breite; neue Monitorrahmen/Einsetzflächen an
neues Bild angepasst. Original-Sonne, Galaxie, Korona, sämtliche Skripte und
alle Abschnitte nach dem Hero bleiben unverändert.
Bildherkunft/Prompt: integrierte Bildgenerierung, docs/workstation-flat-prompt.md.

Prüfung im veröffentlichten Chromium-Preview 6206515: komplette seitliche
Konturen visuell sichtbar, etwa 46 px Abstand zu beiden Viewportkanten bei
1348 px Clientbreite. Beide HTML-Bereiche transform=none, innerhalb der
planen Glasflächen; keine abgeschnittenen Textbereiche. DIGITAL-Schriftgröße
71.28 px (vorher etwa 62 px), Animation weiterhin dexterType. Screenshots:
docs/workstation-flat-preview.jpg und docs/workstation-flat-mobile-preview.jpg.
Responsive nach abgeschlossenem Resize: Rahmen 320/390/768/1440 entsprechen
305/375/753/1425 Clientbreite, jeweils gleich scrollWidth. Beide Displayboxen
jeweils clientHeight=scrollHeight. Mobile Pultgrafik innerhalb der sichtbaren
Breite, gerade Monitorrahmen visuell geprüft. Regler Ende=100, Pos1=0,
echter Drag=60, danach zurück auf vollständige neue Szene. Sonnenkorona
readyState=4, paused=false, duration=33.5. Alle neun Konzeptdialoge und drei
Hoveraufnahmen wurden auf Basis fff4282 geprüft; deren Dateien, sämtliche
Skripte und das komplette HTML ab der Missionssektion sind bytegleich.
30 lokale Referenzen/26 IDs und diff --check erfolgreich. Firefox in dieser
Umgebung weiterhin nicht verfügbar. Ausschließlich Preview-Branch aktualisiert.

## Sonnenrandlicht, Standfuß, Abstand und Retro-Nebenmonitore
Basis 25e0b53, separater Branch feat/terminal-light-20261022. Eigene Hardware-
Lichtleisten weiß, orange nur als knappes Sonnenlicht an der Außensilhouette.
Neue Mittelstütze mit breiter Bodenplatte; zwei plane Hauptmonitore sichtbar
getrennt (optisch ungefähr 10 cm, kein realer physischer Maßstab ableitbar).
Neues Asset workstation-pedestal.webp: 1774x887 RGBA, verlustfrei pixelgleich
zur PNG, 1134900 Bytes, keine Hochskalierung. Prompt im zugehörigen Dokument.
Einsetzflächen und mobile Rahmencrops an die neue Monitorhöhe angepasst.
Sieben kleine Displayflächen anhand der Glas-Eckpunkte in einem SVG kartiert.
Eigene grüne Vektorgrafiken: Schaltkreise, Wellen, Balken, Punkte, Gitterkugel;
eigene unbekannte Zeichen als SVG-Pfade, schnell scrollend, ohne Font-Abhängigkeit.
Inspiration aus Patricks korrektem Screenshot grafik(20261022-194222).png und
https://www.screensaversplanet.com/de/screensavers/retro-sci-fi-522/.
Kein Screensaver installiert und keine fremden Programm-/Bildassets kopiert.
Geometrie einmalig in terminal.js erstellt; Animationen per CSS, keine Timer/
Frame-Schleife. Offscreen, Hintergrundtab, Reduced Motion und saveData pausieren.
Beide großen Displays behalten die vorhandene HTML-Kopie/Animation. Sonne,
Korona, Galaxie, bestehende Skripte und Abschnitte nach dem Hero unverändert.

## Originale GIMP-/ORA-Workstation

Basis exakt feat/sketch-layout-20261022, Commit 6953f0f; neuer Branch
feat/ora-layers-20261023. Vier PNGs bytegleich aus Workstation-Ebenen.ora
übernommen; XCF als Referenz, kein KI-Rendering. 1774×887-Canvas, originale
Versätze und Transparenzen. Versteckte Ebenen vollständig untersucht. Sie
enthalten Bildausschnitte statt bloßer Markierungsfarben. Importskript,
SHA-256-Manifest, Original-stack.xml und Dokumentation unter docs/workstation-ora.md.

Zwei Hauptmonitore, elf kleine Original-Glasmasken, 19 Panelkomponenten und
61 separat adressierbare Alpha-Pfade. Alle Ebenen skalieren gemeinsam. Alte
Vollbild-WebP und mobile Rahmenduplikate aus dem aktiven Hero entfernt, Dateien
historisch behalten. Kontinuierliche Matrix in dunklen Panel-Cutouts (76.561 px),
Displays/Schalter/Metallreflexe ausgespart. Feinzeichige Downward-SVG-Ströme,
CSS-Animationen ohne kontinuierliche JS-Zeichenberechnung. Observer pausiert
an echter Gerätesichtbarkeit, 100%-Altvergleich, Tabvisibility und Nutzerpräferenzen.
Originale Diagnostik bleibt unter maskiertem Telemetrielicht sichtbar. Mobile
zeigt vollständiges Gerät plus lesbare rechte Displaykopie unterhalb.

Quellen außerhalb der Terminal-Integration sowie HTML ab Missionssektion
unverändert. Browser- und Veröffentlichungsprüfung siehe unten. main wird nicht aktualisiert.


Browserprüfung im Cloudflare-Preview a1d842e, Chromium: 1348×936 Clientviewport,
alle vier Originalbilder geladen, Stage x=68..1280 / y=276..882; ganze Konsole
und Fuß vollständig sichtbar. Beide Hauptdisplays clientHeight=scrollHeight,
Inhalt ohne Abschneiden. 11 Diagnosebereiche und 61 Bedienelementpfade vorhanden.
Matrix: 155 laufende Spalten, CSS matrixFall, Masken ohne rechteckige Ersatzflächen.
Sonne readyState=4/46.033333 s, Korona readyState=4/33.5 s, beide laufend.

Responsive-Harness tests/responsive.html im echten Chromium bedient:
320/390/768/1440 px Rahmen entsprechen 305/375/753/1425 px Clientbreite,
jedes Mal scrollWidth identisch, keine seitliche Seitenscrollleiste. Gleiche
Koordinaten auf allen vier Ebenen. Stage auf Telefon 285×142.5 beziehungsweise
355×177.5, jeweils ganze Kontur/Standfuß sichtbar. Beide Hauptdisplayboxen
clientHeight=scrollHeight in allen Größen. 390er Lesekopie x=24..351, y=465.5..674.2;
CTA 44 px hoch, unterhalb des Geräts, keine Überlagerung. Telefone verwenden
weiter dasselbe Originalgerät und bekommen zusätzlich die lesbare rechte Kopie.

Echte Interaktionen: Vergleich Ende=100 und Matrix is-paused; Pos1=0 und
Animation setzt fort, Drag auf 60%, Doppelklick=50%, zurück auf 0%. Beim Sprung
zu Kategorien pausieren Gerät, Sonne und Korona offscreen; Rückkehr setzt fort.
Alle neun Konzeptdialoge geöffnet, korrekte Titel, Motivbilder vollständig geladen.
Alle drei Projektaufnahmen einzeln per echtem Hover getestet: readyState=4,
laufende Zeit; Wechsel pausiert vorherige Aufnahme, Verlassen pausiert alle.
Keine Websitefehler beobachtet; Browser-Erweiterung meldet eigene Metadatenfehler.

Vier PNGs direkt gegen das Archiv byte-/SHA-gleich geprüft; unveränderte Sonne
und HTML ab Missionssektion separat verglichen. Import reproduzierbar, Alpha-
Schutzmaske ohne Display-/Schalterüberschneidung; Maskenobergrenze y=423..631.
GitHub static-site und Cloudflare Pages erfolgreich. Ressourcenprüfung nun auch
für dynamische Masken/JSON samt Originaldatei-Hashes und Koordinatenvertrag.
Letzte Verfeinerung: gemeinsame statt elf separate SVG-Glasmasken; lesbare
Telefonkopie auch dann verfügbar, wenn der Geometrie-Fetch fehlschlägt.
Screenshots: docs/workstation-ora-preview.jpg und workstation-ora-mobile-preview.jpg.

Testgrenzen: Firefox und echte Smartphone-Hardware sind hier nicht verfügbar.
Hintergrundtab, Reduced Motion und Save-Data haben explizite Ereignis-/CSS-
Guards; die Browsersteuerung stellt keine Umschaltung dieser Präferenzen bereit,
daher nicht als separate Laufzeittests ausgegeben. Telefonprüfungen sind reale
Chromium-Iframe-Viewports, keine physische Mobilgeräteprüfung. Keine Aussage
über Langzeit-FPS auf fremder Hardware. Ausschließlich separater Preview-Branch.


## Neuer Rauchglas-Tisch aus 16 GIMP-Ebenen (23.10.2026)

Basis 7813470, Branch feat/smoked-glass-desk-20261023. Patricks neue ORA
1949×826 vollständig eingelesen; alle 16 benannten PNGs bytegleich archiviert.
Drei Hauptmonitore, vier Nebendisplays, Tastatur/Beschriftung, Maus/Rad, drei
Knöpfe, Mauspad, Gehäuse. Negative Basisversätze −174/−83 erhalten. Drei
Hauptdisplays als ein Gerät, Tischvorderkante exakt am Hero-Ende. Neue Skizze
023714 dient nur der Komposition, zeigt ausdrücklich nicht das aktive Tischmodell.

Separat freigegebener Oberflächen-Feinschliff an blanker Tastatur; originale
Alpha-Silhouette und logische Koordinaten erhalten. Echte scharfe QWERTZ-Schrift
statt unscharfer Rasterbuchstaben. Originale Quellen bleiben unverändert.
Arbeitskopie als 16-lagige ORA und transparente PNG unter assets/desk/.
Details und sämtliche Maße: docs/smoked-glass-desk.md.

Chromium-Viewport 1348×936: alle 16 Bilder geladen; Stage 1320×559.42,
x=14/y=376.58, untere Kante exakt 936. Vier Originalkleindisplays plus mittlere
feine Kommunikations-/Telemetrieanimation, drei einzeln adressierbare Tastermasken.
Nur 16 statt vorher 155 Matrixspalten. Matrix bleibt auf kleine echte Glasbereiche
begrenzt; Metall und Bedienelemente frei. Quellalpha-Überlappung des Gehäuses
mit sieben Displayflächen/Tastatur: deckend 0 %, keine doppelten Originalbilder.

Echte Chromium-Iframes 320/390/768/1440: Clientbreiten 305/375/753/1425 gleich
scrollWidth, Gerät und Hero enden jeweils bei y=844. Inhalte passen nach
Entrance-Phase in die Monitore. Telefon-Lesekopie auf dunklem Glas oberhalb,
Vergleichsgriff verdeckt keinen CTA. Ende=100 pausiert SVG, Pos1=0 setzt fort.
Sonnenmedien readyState=4/laufend, Dauer 46.033333/33.5 s. Originalmedien und
Controller unverändert, genauso HTML/Interaktionslogik aller Folgeabschnitte.
Ressourcenprüfung, PNG-Hashes, JavaScript-Syntax und diff --check erfolgreich.

Testgrenzen: Firefox und echte Smartphone-Hardware nicht verfügbar. Reduced
Motion/Save-Data/Hintergrundtab-Guards nicht separat per Browser umgeschaltet.
Hoveraufnahmen und neun Konzeptdialoge gegenüber der vollständig geprüften
Basis unverändert, deshalb nicht erneut vollständig getestet. Browser-Erweiterung
protokolliert eigene Metadatenfehler; kein Websitefehler festgestellt.
Ausschließlich Entwicklungsbranch/Cloudflare-Vorschau; main bleibt unberührt.
