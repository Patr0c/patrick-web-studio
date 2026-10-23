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


## Präzisierung: ruhige Galaxie, Rauchglas und Hover (23.10.2026)

Galaxie und gemeinsamer Sternenstaub stehen fest; individuelle Sternenglints und Lichtimpulse bleiben erhalten. Sonne nochmals 30% langsamer: 0.6 × 0.7 = 0.42×; Koronatiming unverändert. Tischmatrix ausschließlich auf der innenliegenden Rauchglasfläche, mit Sicherheitsabstand zum Metallrahmen und vollständigem Ausschluss der echten Mauspad-/Gerätealpha. Zeichenkern um15%, Ebenendeckkraft von0.88 auf0.96 angehoben, Glowradius unverändert. Drei native Knöpfe vorläufig per hidden ausgeblendet und aus der Material-Lichtmaske entfernt; Originalassets/Positionen bleiben gespeichert.

Im linken Monitor wechseln die drei Standbilder weiter. Aufnahme startet ausschließlich bei Maus-/Stifthover, pausiert sofort beim Verlassen und setzt nach10 Sekunden zurück; Fokus/Touch/automatischer Bildwechsel starten keine Aufnahme. Nur eine Aufnahme wird dekodiert. Untere Projektkarten behalten denselben Hoververtrag.

Masken reproduzierbar mit `python3 scripts/build_scene_masks.py`; aktualisierte Prüfsummen in geometry.json und inline identisch. Null Alphaüberlappung mit Mauspad, Tastatur, Maus und Rad numerisch geprüft. Chromium Desktop1348×936: alle drei Hovervideos einzeln, sofortiges Pausieren und10s-Reset bestätigt; Sonne0.42×, Galaxieanimation none und drei hidden Knöpfe im DOM bestätigt. Telefoniframe375×844 ohne horizontalen Überlauf und ohne Autoplay. Ressourcen-/Hashprüfung, JS-Syntax und diffcheck erfolgreich. Firefox und physische Mobilgeräte hier nicht verfügbar. Beleg: docs/glass-hover-desktop-preview.jpg. Veröffentlichung ausschließlich auf dem bestehenden Entwicklungsbranch; main bleibt unverändert.


### Mauspad vollständig auf Glas; Matrixfluss +20% (23.10.2026)

Mauspad, Tastatur, separate Schrift-/Regenmaske, Maus und Mausrad gemeinsam12 native Pixel nach hinten verschoben, Größen/relative Abstände unverändert. Mauspad y1165 statt1177; sichtbare Unterkante vor der ab y1385 beginnenden vorderen Metallkante. Source-Positionen in geometry.json zusätzlich archiviert; Quellbitmaps unverändert. Material- und Matrixmasken anhand neuer tatsächlicher Alpha neu gebaut. Hinterer Glasstreifen ab y1156 freigegeben und mit einer perspektivisch feinen zusätzlichen Zeichenreihe im selben Canvas gefüllt. Mauspad/Geräte weiterhin vollständig ausgeschlossen. Zeichenlänge und Wellenlänge jeweils1.2×; Flusszeit läuft1.2×, weiter maximal30fps und nur sichtbar/aktiver Tab.


### Einheitliches Metall und sonnengeführte Schatten (23.10.2026)

Originale Hardware-/Zubehörbitmaps, Alpha, Bildschirmquads und aktuelle Positionen unverändert. Laufzeit-Materialkorrektur entfernt den fest eingebrannten bronzefarbenen Grundton: neutrales silbernes Chrom/Graphit, warme Farbe ausschließlich als Reflex der Sonne. Neue scene-lighting.js teilt den bestehenden sichtbarkeitsgesteuerten RAF des Tischrenderers, ohne eigene Animationsschleife. Tastatur/Maus: schmale Alpha-Kontaktschatten plus weicher, höhenabhängig nach unten/rechts projizierter Schatten von der tatsächlich gerenderten Sonne weg; Empfängermaske exakt die originale verschobene Mauspadalpha. Das Mausrad wirft keinen zweiten künstlichen Schatten aufs Pad. Pad selbst hat einen sehr engen Kontaktschatten auf dem Glas.

Drei weich gefiederte Wellenfronten haben ihr Zentrum an der Sonne und wirken nur in der realen Materialmaske, ohne Bildschirmflächen. Reichweite aus Abstand zur Tischfläche, auch bei der mobil außerhalb des nativen Tischrasters stehenden Sonne. Gold/Amber/warmes Weiß und Helligkeit folgen der tatsächlichen Sonnenvideo-Phase; mittlere Videofarbe wird höchstens alle700ms aus12×12Pixeln gelesen, mit sicherem phasenbasiertem Rückfall. Lichtwerte höchstens8Hz, im vorhandenen30fps-Renderer; keine zusätzliche Video-/Canvas-Dauerschleife. Keine Änderung an Sonne0.42×, ruhender Galaxie, Matrix+20%, Zubehörabstand oder Hoververtrag. Reduced Motion zeigt statisches Licht ohne Wellen; Offscreen/Tab/Save Data pausieren über vorhandenen Controller.


### Präzise Glasplatte, senkrechte Lichtzeichen und kugelförmige Lichtquelle

Die native Tischplatte ist nun als eigene Ebene `assets/scene/tabletop.webp` ausgekoppelt; `hardware-structure.webp` enthält den verbleibenden Rahmen und die Halterungen. Originalhardware bleibt archiviert. Innenkante aus dem Originalraster mit kubischen Kurven nachgezogen, inklusive gerundeter Vorderenden;4× Coverage-Antialiasing. Kontur: `tabletop-outline.svg`; volle Quellalpha ist die exakte Summe beider Teilalphas. Kein neuer Bildinhalt, keine KI-Neuzeichnung. `scripts/build_scene_masks.py` baut diese Ebenen, Glas-/Matrixmaske und den kombinierten Oberflächenempfänger reproduzierbar. Mauspad/Tastatur/Maus/Rad bleiben vollständig ausgespart; drei Hauptbildschirme sind aus der Reflexionsmaske ausgeschlossen.

Matrix: unveränderte16 Vektorzeichen,151 nach unten laufende Spalten mit langen, weich begrenzten Zeichenkörpern, hellerer Mitte und dunklen Anfängen/Enden. Keine seitliche Wellenbewegung; Zeichenkerne nochmals15% energiereicher, Glowsaum unverändert eng. Bewegung zeitbasiert,30fps, vorhandene1.2× Flussrate erhalten. Quellpixel von Zubehör und aktuelle Verschiebung−12px unverändert.

Das Dreieck des Sonnenkegels, die großen SVG-Ringwellen und starren Reflex-Gradienten sind aus der aktiven Szene entfernt. Die vorhandene runde Sonnenaura bleibt. Ein gecachter Reflexkompositor (768×192Pixel, nur nativer unterer Bereich y800–1440) malt weiche wandernde Gold-/Warmweißreflexe, entsprechend der wirklichen Sonnenposition und der Plattformebene. Kein Lichtstrahl im freien Raum und keine leuchtenden rechteckigen Kacheln. Grundmetall/Plattform neutralisiert; Wärme entsteht durch die bewegliche externe Sonne. Zusätzliche zurückhaltende Rot-/Hellorange-Schimmer folgen exakt der vorhandenen Koronakurve:2s Ruhe,15s Aufbau,2s Peak,12.5s Rückzug,2s Ruhe. Galaxie bleibt unbewegt und setzt schwächere gelegentliche bläuliche Reflexe. Reflexphasen sind über den Sonnenloop periodisch und springen am Ende nicht.

Sonnenrotation weiterhin ungefähr0.42× des Originaltempos, jetzt offline mit Motion-Compensated-Zwischenbildern auf echte60fps berechnet. Browser spielt die neue H.264-Fassung mit1×.512px Desktop /320px Telefon. Ursprünglicher Loop-Sprung mit0.8s Übergang in die eigene Öffnung geglättet; Laufzeit108.733333s. Korona unverändert33.5s/60fps, Alpha offline über Schwarz vormultipliziert und als H.264512/384px bereitgestellt; vorhandenes Screen-Blending erhält die Erscheinung und spart den Alpha-VP9-Decoder. Originalmedien unverändert archiviert. Reproduzierbar: `scripts/build_smooth_sun.py` (langsamer Offline-Schritt).

Sonne als eigene kleine Komposition außerhalb der sich neu zeichnenden Tischbühne, bei identischer Desktopbox338/151/322 im Quellraster. Alle Reflexe/Schatten lesen weiter ihre tatsächliche Bildschirmposition. Ein bestehender RAF für Tisch und Reflexe; beide begrenzt30fps. Kein Video-Canvas-Readback, keine große animierte SVG-Weichzeichnung, keine pro-Frame-DOM-Telemetrie. Canvas2D-Fallback des mittleren Monitors nutzt dieselben Zeichen/Felder mit vorgerechnetem32-stufigem Farbatlas statt dauernder Text-Rasterung. Alle vorhandenen Sichtbarkeits-/Tab-/Präferenzguards bleiben.


## Oberfläche und Monitorbelegung – 23.10.2026

Matrixstränge wieder perspektivisch flach auf der Rauchglasfläche, von hinten nach vorne laufend. Unveränderte16 Zeichen, verlängerte Stränge, helle Mitte mit weichen Enden, enger Glow und jüngste Helligkeits-/Flusswerte erhalten. Glyphentiefe auf26–36% gestaucht und zur Sitzperspektive aufgefächert; vorhandene echte Glas-/Zubehörausschlussmaske unverändert.

Links startet dauerhaft HRService. Ausschließlich die drei Auswahlknöpfe wechseln zum nächsten Projekt; kein Rotationstimer und kein Pauseknopf. Hover-only-Wiedergabe, sofortige Pause und10s-Reset bleiben. Mitte: Patricks hochgeladenes Ermittlertafelbild (1672×941) als Detektiv-Vorschau, ohne erfundene URL oder zusätzliche Schrift. Rechts: bisheriger Pixel-/ASCII-Effekt. Bildschirmquads und Hardware unverändert, nur Inhalte getauscht.

Hero auf DIGITAL REWORK reduziert:64.4 statt92 native Schriftpixel (−30%), ohne kinetische Titelklasse, Scanlinie, Glow oder Animation. Namens-/Beschreibungstexte und Hero-Projektaufruf entfernt, große obere Navigationsleiste entfernt. Mobile kurze Identität plus ein Arbeiten-Link. Technischer Flow-Text und Projekt-Kickerkästchen entfernt; linke Vorschau behält nur Projektname und manuelle Auswahl. Sonne, Licht, ruhende Galaxie, Hardware und Folgeabschnitte unverändert.


### Gerade, durchgehend dichte Tischmatrix
Letzte zwei externen Matrixreferenzen verworfen; keine Bokeh-/Partikelplumen mehr.302 gerade, parallel in der Tischebene laufende Zeichenbahnen. Pro Bahn sind20 von24 periodischen Zeichenplätzen belegt; ein Grundlicht bleibt immer sichtbar. Breite sinusförmige Helligkeitswelle wandert von hinten nach vorne, ohne seitliche Auslenkung oder großflächiges Auslöschen. Unveränderte16 Zeichen, Lasergrün, enger Glow und Helligkeitsgain×1.4.

Eine echte Homografie legt das gesamte Codefeld auf die vorhandenen Tischquads; originale Glas-/Gerätemaske bleibt unverändert.16 kleine, dreifach periodisierte Streifentexturen werden einmal gecacht. Pro Frame nur302 Streifenzeichnungen statt Tausender einzelner Zeichen. Nahtlose Innenkopien, feste Glyphen und stetiger Texturversatz vermeiden synchronen Zeichenwechsel und Strangabbrüche. Renderer maximal60fps, Reflexe weiter begrenzt; Offscreen-/Tab-/Reduced-Motion-/Save-Data-Steuerung bleibt. Zeichenraster960–2400px breit, Seitenverhältnis2400×850; Maximalfläche2.04MP.

Abdeckungsprüfung: Original-Glasalpha auf die echte Homografie abgebildet,302×96 Messzellen über241 Phasen in120s. Belegte Zeichenplätze auf sichtbarem Glas82.7–83.8%; dies bezeichnet Zeichenplatzabdeckung, nicht den Anteil grüner Strichpixel. Chromium Desktop1363×936 visuell geprüft, Renderer aktiv und kein horizontaler Überlauf. Ressourcen-/Hash-/Syntax-/Diffprüfung bestanden. Keine neue FPS-Garantie; Firefox und physische Telefone nicht verfügbar.


### Verbindliche Matrixvorlage aus Bildschirmaufnahme
Quelle: Patricks34.4044s-Upload zur YouTube-Referenz https://www.youtube.com/watch?v=l4ghF3PzY2M (Jay Mayor, The Matrix Raining Code Screensaver).34s-Aufnahme1920×1080,60000/1001fps tatsächlich bildweise geprüft. Sauberer Vollbildabschnitt6–32s enthält keine Player-/Browserbedienung. Die Originalbewegung, Zeichenformen, Helligkeitsabstufungen und der enge Leuchtverlauf werden nun direkt als native H.264-Videoebene verwendet. Keine weitere geschätzte Glyphensimulation.

10% mehr Zeichendichte: Basisbild1280×720 um128px periodischen Zeichenausschnitt verbreitert, Gesamt1408×720 =110% horizontale Zeichenfeldbreite, anschließend auf dieselbe Tischfläche projiziert. Dadurch10% höhere horizontale Zeichendichte, keine Behauptung einer exakt um10% größeren Anzahl nichtschwarzer Zeichen in jedem einzelnen Zufallsframe. Wiederholter Streifen liegt am äußeren Ende, Zeichenmuster stammt vollständig aus der Aufnahme. Keine zusätzliche Helligkeitsverstärkung/Zeichnung/Wellenmodulation; Unterschiede zur Vorlage nur Dichte, Tischperspektive, Glasuntergrund und notwendiger Loopübergang.

25.4s-Loop bei60fps,0.6s weicher Übergang zwischen Ende und eigener Öffnung. Desktop1408×720, mobil704×360, ohne Audio; Poster als WebP. CSS-Homografie auf bestehende table_quad, Ebene2400×1350; originale Glas-/Zubehörausschlussmaske und screen blend erhalten. Mauspad/Metallrahmen unverändert ausgespart. Der alte Zeichenrenderer ist aus dem aktiven Controller entfernt. Bestehender RAF arbeitet nur noch für die begrenzten Oberflächenreflexe. Video ausschließlich sichtbar/aktiver Tab, ohne Reduced Motion/Save Data; sonst Poster/stillstehendes Bild. Kein neues Autoplay der Projektaufnahmen. Reproduzierbar: scripts/build_matrix_reference.py mit Originalaufnahme als Eingabe.


### Lasergrüne Matrix, Villa rechts, violette Tastatur und freie Kanten
Die vorhandene Matrixaufnahme und ihr Timing bleiben unverändert. Ein sRGB-feColorMatrix-Filter setzt ihren Farbton kanalproportional auf #19E50F (R/G25/229,B/G15/229), ohne Blur oder zusätzliche Glowebene. Screen-Blend weiterhin auf dem maskierten Elternlayer. Tastaturgrundgrafik per neutralitätserhaltender Farbmatrix violett, Beschriftungs-Regen #A855F7 und helle Akzente #D8B4FE; sämtliche Tastatur-/Ring-Drop-Shadows entfernt, Glowradius0. Originalbitmaps und Alpha unangetastet.

Villa Schwalbe vom linken Projektwähler auf den rechten Monitor verschoben, einschließlich echter Hoveraufnahme, Poster und Website-Link. Links HRService als feste Initialauswahl und Gasthof Wagner per Klick; Mitte Ermittlerbild unverändert. Der bisherige ASCII-Effekt rechts ist aus der aktiven Seite entfernt, Quellmodul bleibt archiviert. Gemeinsamer Mediencontroller unterstützt die einzelne rechte Vorschau: nur Hover, sofort Pause,10s-Reset, erster echter Videoframe vor Einblendung, gegenseitige Playback-Sperre und scene.effects-Lifecycle. Keine doppelten Villa-Aufnahmen im Hero.

Gesamte Tischbühne proportional innerhalb48px horizontaler/32px vertikaler Desktopreserve,12px Abstand unten; mobil24px horizontal/8px unten. Vollständiges gemeinsames2560×1440-Raster, Außenkanten und Bildschirminhalte skalieren zusammen. Bühne selbst beschneidet keine Außenränder mehr. Keine Asset-Verzerrung oder Neuzeichnung. Vergleich über data-comparison-hidden deaktiviert: Slidergriff/Lichtlinie/beide grünen Kästen und Anweisung ausgeblendet, alter Entwurf verborgen, neue Ansicht dauerhaft vollständig. Viewportbreiten-Messung bleibt aktiv; keine unsichtbaren Slider-Drag-/Tastaturhandler.
