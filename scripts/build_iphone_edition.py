"""Independent low-memory iPhone page; desktop source remains unchanged."""
from pathlib import Path
from bs4 import BeautifulSoup
import json
ROOT=Path(__file__).resolve().parents[1]
source=BeautifulSoup((ROOT/'index.html').read_text(),'html.parser')
symbols=source.select_one('svg.space-symbols')
for item in symbols.select('filter'):item.decompose()
# Never import the desktop scene or its scripts.
sections=[];started=False
for section in source.select('main > section'):
 if 'mission-section' in section.get('class',[]):started=True
 if started:sections.append(section)
assert sections and 'mission-section' in sections[0].get('class',[])
for section in sections:
 for text in section.find_all(string=True):
  if 'Hier laufen die echten Bildschirmaufnahmen.' in text:text.replace_with(str(text).replace('Hier laufen die echten Bildschirmaufnahmen.','Entdecke die umgesetzten Projekte.'))
 hint=section.select_one('.video-play-hint')
 if hint:hint.string='Antippen öffnet die Website.'
 for video in section.select('video'):
  image=source.new_tag('img',src=video['poster'],loading='lazy',width='1280',height='800',alt=video.get('aria-label','Projektvorschau'))
  video.replace_with(image)
geometry=(ROOT/'assets/iphone/geometry.json').read_text()
hero='''<section class="phone-hero" data-state="night" aria-labelledby="hero-title">
<h1 id="hero-title" class="sr-only">Digital Rework — Patrick</h1>
<canvas id="phone-scene" role="img" aria-label="Dunkle Workstation. Den Mond antippen, um die Sonne aufgehen zu lassen."></canvas>
<button type="button" class="phone-moon" aria-label="Mond versenken und Sonne aufgehen lassen"><img src="assets/iphone/moon.webp" width="192" height="192" alt=""></button>
<button type="button" class="phone-project-switch" aria-label="Linke Vorschau von HRService auf Gasthof Wagner wechseln" hidden></button>
<a class="phone-villa" href="https://villa-schwalbe.vercel.app/" aria-label="Villa Schwalbe öffnen" hidden></a>
<p class="sr-only" id="phone-status" role="status">Arbeitsstation ausgeschaltet.</p>
<noscript><p class="no-script">Für die Einschaltsequenz bitte JavaScript aktivieren. Die Projekte findest du weiter unten.</p></noscript>
</section>'''
out='''<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#02040a"><meta name="description" content="Patrick — Webdesign und Redesign. Digital Rework für das iPhone."><title>Patrick / Digital Rework — iPhone</title><link rel="stylesheet" href="assets/css/fonts.css"><link rel="stylesheet" href="assets/css/iphone.css"><script defer src="assets/js/iphone-scene.js"></script><script defer src="assets/js/categories.js"></script></head><body class="iphone-edition">'''
out+=str(symbols)+'<div class="page-shell"><main id="top">'+hero+''.join(map(str,sections))+'</main>'+str(source.select_one('footer.footer'))+'</div>'+str(source.select_one('dialog.concept-dialog'))
out+='<script type="application/json" id="phone-geometry">'+json.dumps(json.loads(geometry),separators=(',',':'))+'</script></body></html>'
(ROOT/'iphone.html').write_text(out)
print('Built independent iPhone page; desktop scene/CSS/media controllers excluded')
