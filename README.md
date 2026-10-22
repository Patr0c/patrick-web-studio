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
- `assets/js/comparison.js`: Alt/Neu-Regler mit Tastatur und Pointer Capture.
- `assets/js/media.js`: Hovervideos, Reset und sichtbarkeitsabhängige Sonne.
- `assets/js/space.js`: feste Sterne und gemeinsam rotierende Galaxie/Sternenfilm.
- `assets/js/categories.js`: drei Kategorien mit insgesamt neun Vorschlägen.
- `assets/images/`: Astronaut, originale transparente Galaxie, Sonnenstandbild.
- `assets/video/`: drei Aufnahmen und zwei 60-fps-Sonnenfassungen.
- `concepts/`: je ein Bild pro Branche, von Kacheln und Vorschauen gemeinsam genutzt.
- `previews/`: sofort sichtbare echte Standbilder aus den Bildschirmaufnahmen.
- `.github/workflows/check-site.yml`: Ressourcen- und JavaScript-Prüfung.

## Entwicklungs-Vorschau

Cloudflare Pages ist bereits mit GitHub verbunden und meldet den Preview-Link
als „Cloudflare Pages“-Check am Commit. Kein Build-Befehl erforderlich;
Ausgabeverzeichnis ist das Repository-Wurzelverzeichnis. Auf einen separaten
Entwicklungsbranch pushen, erfolgreichen Check abwarten und dessen URL verwenden.
Hauptbranch/Produktivversion erst nach Patricks ausdrücklicher Freigabe ändern.
Alte Versionen sind über Git verfügbar, nicht als zusätzliche aktive Websites.
