# Designsystem — Patrick / Digital Rework

Verbindliche Entscheidungen von Patrick, Stand 22. Oktober 2026.

## Identität
Immersives, hochwertiges Science-Fiction-Portfolio: dunkler Weltraum, Galaxie,
Sonne, Astronaut, präzise Laserakzente, räumliche Tiefe und kinetische Typografie.
Vorbild für die ursprüngliche Komposition: Dribbble „Star Wars Web Page“,
https://dribbble.com/shots/10031350-Star-Wars-Web-Page.
Die aktuelle kreative Arbeit fortführen. Effekte qualitativ und technisch
verbessern; keine Vereinfachung zur gewöhnlichen Landingpage. Keine Rückkehr zu
alten Designs, Raster, blauen Leisten oder bewegten Fensterflammen ohne Auftrag.

## Farben und Licht
| Einsatz | Wert / Regel |
| --- | --- |
| Hintergrund | #02040A, tiefschwarz mit leichtem Blauton |
| Lasergrün | #19E50F bzw. #23D92A |
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
6. Vergleichsinhalte; Sonne und Astronaut vor dem Rahmen.
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
