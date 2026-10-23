# Textmode Flightdeck — 23.10.2026

Entwicklungsbranch `feat/textmode-flightdeck-20261023`, Basis `9e352b6`.
Aktuelle Nutzerskizzen 032243 und 033549. Kein Eingriff in main/Produktion.

## Ebenen und Animation

Der bestehende native ORA-Import 1949×826 bleibt geometrisch und bytegenau
erhalten. Mittleres Glas: x669/y115, 554×255. Live-ASCII-Overlay übernimmt
die echte Alpha-Silhouette von original/main-center.png. Linke/rechte HTML-
Inhalte und scharfe Tastaturbeschriftung bleiben bestehen.

`textmode-flow.js` ist eine eigenständige, beschränkte Darstellung nach dem
Textmode-Vorbild, keine installierte Browser-Erweiterung. Helligkeit wird mit
der Rampe ` .:-=+*#%@` in feine Zeichen übersetzt. Langsame ineinanderlaufende
Strömungskonturen, Weiß/Grau und #19E50F. Ein WebGL-Draw pro Bild, 30fps,
maximal 220000 Pixel. Ohne WebGL: animierte 480×220-Canvas2D-Variante unter
demselben Sichtbarkeitscontroller. Keine externen Laufzeitabhängigkeiten.
Reduced Motion/Save Data: ruhiges Einzelbild; offscreen/hidden: kein RAF.

Referenzen: https://github.com/humanbydefinition/textmode-browser-extension
https://onepagelove.com/textmode-overlay
https://extension.textmode.art/?ref=onepagelove
Die Live-Demo war hier nicht erreichbar. Offizieller Quellcode und Patricks
Screenshot dienten als Vorlage; kein Anspruch auf pixelgleiche Wiedergabe
eines nicht bereitgestellten Quellvideos.

`mousepad-mask.png`: native 1949×826, echte Mauspad-Alpha mit 1px Innenabstand;
Alpha von Tastatur/Maus/Rad/Knöpfen samt 1px Schutzrand abgezogen. Originalpad
um 64% abgedunkelt. 109 deterministische SVG-Spalten, jeweils zwei identische
192px-Perioden, senkrecht nach unten, 2.8–7.1s. Kleine unbekannte Zeichen,
#19E50F / #39FF14, heller Leitkern, 0.65/1.15px enger Glow. CSS-Animation
pausiert zusammen mit Textmode, Tab und Vergleichsregler. Keine Matrix auf
Metall, Maus, Beschriftung oder Monitoren.

Kleindisplays nutzen die gemessenen Alpha-Boxen aus geometry.json, je 3px
Innenabstand. Vier alte Rasterdiagnostiken werden ausgeblendet statt doppelt
gezeichnet. Erste drei: bestehende Poster und MP4-Dateien, preload=none,
kein Autoplay; gemeinsamer media.js-Controller für alte Projektkarten und neue
Displays, höchstens eine Aufnahme aktiv. Vierter: eigenständige HTML-Vorschau
mit Ringmotiv und Kontaktlink. Drei originale Knopf-PNGs einmal als native
Buttons mit derselben Quellgeometrie; Pressfeedback und desk:control-Ereignis,
keine Navigation ohne festgelegtes Ziel.

## Layout und Material

flightdeck.css ergänzt die vorhandene Kaskade nach geometry.css. Desktopgerät
maximal 66vw/1100px sowie verbleibender Höhe; Telefon unverzerrt mit 10px
Seitenabstand und lesbarer Textkopie darüber. Frontkante bündig am Hero-Ende.
Boden bleibt gleich skaliert, nur obere 10% der sichtbaren Fläche geclippt;
Schnittkante aus Quellhorizont und object-fit-Abbildung berechnet. Galaxie
bleibt hinter dem Boden. 1px heller Galaxie-Lichtsaum, 13s dezenter Impuls.
Missions-/Projekt-/Kategorie-/Leistungs-/Kontaktflächen: Rauchglas, Graphit,
Titan und schmale Kanten. Neun Konzeptinhalte behalten ihre eigenen Farben.

## Prüfung

Ressourcen, Original-PNG-Hashes, Koordinatenvertrag, Projektlinks, interne Anker,
JavaScript-Syntax und git diff --check geprüft. Laufzeitdetails und Grenzen
werden nach der Browserprüfung in PROJECT_NOTES.md ergänzt.
