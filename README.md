# Patrick / Digital Rework

Bestehendes Space-Portfolio, statisches HTML/CSS/JavaScript ohne Buildsystem.
Verbindliche Gestaltung: [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).
Entwicklungsstand und Prüfergebnisse: [PROJECT_NOTES.md](PROJECT_NOTES.md).

## Lokal starten und prüfen

```sh
python3 -m http.server 4173
# http://localhost:4173
python3 scripts/check_site.py
for file in assets/js/*.js; do node --check "$file"; done
```

## Struktur

- `index.html`: einzige aktuelle Website, einschließlich Alt/Neu-Demonstration.
- `assets/css/fonts.css`: nur Archivo, Manrope, DM Mono; OFL-Lizenzen beigelegt.
- `assets/css/studio.css`: aktuelles Layout, responsive Regeln und Effekte.
- `assets/css/workstation.css`: bildschirmfüllender Einstieg aus Operator-Perspektive.
- `assets/js/terminal.js`: Mauspad-Matrix, Sichtbarkeit und drei native Steuerknöpfe.
- `assets/workstation/`: historischer 1774×887-ORA-Import. Der aktive neue Tisch liegt in `assets/desk/`.
- `scripts/import_workstation_ora.py`: reproduzierbarer Import aus Patricks ORA; kein Runtime-Build.
- `docs/workstation-ora.md`: Quellmaße, Alpha-Auswertung, Lichtmasken und Bedienregionen.
- `assets/js/comparison.js`: Alt/Neu-Regler mit Tastatur und Pointer Capture.
- `assets/js/media.js`: Hovervideos, Reset und sichtbarkeitsabhängige Sonne.
- `assets/js/space.js`: feste Sterne und gemeinsam rotierende Galaxie/Sternenfilm.
- `assets/js/categories.js`: drei Kategorien mit insgesamt neun Vorschlägen.
- `assets/css/missions.css` und `assets/js/missions.js`: eigene animierte Space-Icons,
  sichtbarkeitsabhängige Bewegung und bedienbarer Kreativantrieb.
- `scripts/retime_corona.py`: Offline-Aufbereitung des ursprünglichen Koronafilms zu einer 33.5-s-Schleife.
- `assets/images/`: Kontrollzentrale, originale transparente Galaxie, Sonnenstandbild.
- `assets/video/`: drei Aufnahmen, zwei unveränderte Sonnenfassungen und
  zwei kleine Korona-Overlays mit 60 fps.
- `concepts/`: je ein Bild pro Branche, von Kacheln und Vorschauen gemeinsam genutzt.
- `previews/`: sofort sichtbare echte Standbilder aus den Bildschirmaufnahmen.
- `.github/workflows/check-site.yml`: Ressourcen- und JavaScript-Prüfung.
- `tests/responsive.html`: lädt dieselbe Website in schmalen/größeren Viewports
  zur browserbasierten Darstellungsprüfung; keine zusätzliche Designversion.
- `docs/workstation-ora-preview.jpg` und `docs/workstation-ora-mobile-preview.jpg`: aktuelle Original-GIMP-Workstation auf Desktop/Telefon.
- `docs/workstation-pedestal-preview.jpg` und `docs/workstation-pedestal-mobile-preview.jpg`: vorherige Beleuchtung, Stütze und Nebenanzeigen.
- `docs/workstation-flat-preview.jpg` und `docs/workstation-flat-mobile-preview.jpg`: vorheriges gerades Terminal mit sichtbaren Seitenkanten.
- `docs/workstation-operator-preview.jpg` und `docs/workstation-operator-mobile-preview.jpg`: vorheriger bildschirmfüllender Einstieg mit drei Monitoren.
- `docs/control-center-preview.jpg` und `docs/control-center-mobile-preview.jpg`: vorherige Kontrollzentrale mit Boden.
- `docs/mission-hover-preview.jpg`, `docs/nova-live-preview.jpg` und
  `docs/nova-timing-preview.jpg`: Kachel-Hover, Sonne in der Website und aktueller Nova-Ablauf.
- `docs/icons-cleanup-preview.jpg`, `docs/projects-cleanup-preview.jpg` und
  `docs/footer-cleanup-preview.jpg`: aktuelle, geprüfte Icon- und Bereinigungsansichten.
- `docs/icons-preview.jpg` und `docs/laser-preview.jpg`: vorherige Icon-/Neonkorrektur.
- `docs/space-preview.jpg` und `docs/sun-preview.jpg`: vorherige Space-Erweiterung und unveränderte Sonne.
- `docs/preview.jpg`: vorheriger Stand vor der Space-Icon-Erweiterung.

## Entwicklungs-Vorschau

Aktueller Entwicklungsbranch: `feat/textmode-flightdeck-20261023`.

Neue Textmode-Vorschau: siehe Abschlusslink und PROJECT_NOTES.md.

[Textmode, Masken und Material](docs/textmode-flightdeck.md).

Rauchglas-Tisch: [Ebenen, Maße, Feinschliff und Tests](docs/smoked-glass-desk.md).
Aktive Assets: `assets/desk/`; Import: `scripts/import_smoked_desk.py`.
Downloadbare GIMP-Arbeitskopie: `assets/desk/Rauchglas-Tisch-Feinschliff.ora`.

Cloudflare Pages ist bereits mit GitHub verbunden und meldet den Preview-Link
als „Cloudflare Pages“-Check am Commit. Kein Build-Befehl erforderlich;
Ausgabeverzeichnis ist das Repository-Wurzelverzeichnis. Auf einen separaten
Entwicklungsbranch pushen, erfolgreichen Check abwarten und dessen URL verwenden.
Hauptbranch/Produktivversion erst nach Patricks ausdrücklicher Freigabe ändern.
Alte Versionen sind über Git verfügbar, nicht als zusätzliche aktive Websites.
