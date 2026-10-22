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
  Rotationscontainer mit Randmaske; feine Sternenebene synchron, Randsterne fest.
- DIGITAL ohne flächigen Lichtfleck, REWORK mit enger grüner Laserkontur;
  Laserfarben verbindlich dokumentiert, Orange für Sonne und Rahmen erhalten.
- Vergleich ohne veraltetes verstecktes Flammen-SVG; ein CSS-Lichtstrahl über die
  ganze Höhe, mittiger Start, Pointer- und Tastaturbedienung erhalten.

## Medien und Provenienz
| Asset | Verwendung |
| --- | --- |
| assets/images/galaxy.png | Patricks 2Galaxie.png, unverändert, RGBA 1280×1001 |
| assets/images/astronaut.webp | bestehendes explorer-hero, unverändert |
| assets/video/sun-desktop.mp4 | bestehende Sonnenfassung, 512×512, 60 fps |
| assets/video/sun-mobile.mp4 | bestehende mobile Sonnenfassung, 384×384, 60 fps |
| assets/images/sun-poster.jpg | echter Frame der Sonnenaufnahme |
| previews/hrservice.jpg, villa.jpg, wagner.jpg | echte Frames der Projektaufnahmen |
| concepts/hotel.webp, restaurant.webp, driving.webp | bestehende Konzeptbilder |

Galaxie.png und 2Galaxie.png sind bytegenau identisch:
SHA-256 e20e283c53c12e16c9cf066f1212e26897fc6d782303f68083748ea3e8189436.
Die Grafik hat 287982 völlig transparente Pixel und weiche Alphakanalübergänge.
Ihr helles Zentrum liegt rechts der Bildmitte; CSS positioniert es bei der
Drehachse. Die äußeren Ausschnittkanten werden per kreisförmiger Maske überblendet.
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
zusätzlicher Szenenrenderer im Browser. Der schmale 60-fps-Ringfilm ist 273449
Bytes groß (512×512, 4.93 s); eine kleinere mobile Fassung ist ebenfalls vorhanden.
Neue Dateien: assets/video/sun-corona.mp4, sun-corona-mobile.mp4 sowie
assets/images/sun-corona.webp. Der Ruheframe und das Video sind gleich groß
ausgerichtet; Video wird nach dem ersten playing-Ereignis eingeblendet.
Quelle: https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/48106c12-33c9-4cea-9780-4a080477405e.mp4
Die Bildschirmaufnahme von MotionSites wurde als zusätzliche visuelle Referenz
geprüft. Keine Eclipsio-Texte, Navigation oder sonstige Landingpage-Elemente
übernommen. Die Änderung am Produkt betrifft ausschließlich die Sonne.
Ressourcenprüfung nach Ergänzung: 26 lokale Ressourcen, Syntax erfolgreich.
Browserprüfung der zusätzlichen Korona folgt.
