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
