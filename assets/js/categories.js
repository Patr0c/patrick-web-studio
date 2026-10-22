(()=>{
const concepts={
 hotel:[
 {id:'hotel-1',brand:'WALD & WEITE',name:'Natur & Ruhe',label:'Warm · Natürlich',layout:'editorial',bg:'#eeeadd',fg:'#263a30',accent:'#6e7e57',hero:'Ein guter Ort,\num anzukommen.',intro:'Weniger Alltag. Mehr Auszeit.',body:'Ein ruhiger Auftritt mit natürlichen Farben, großzügigen Bildern und einem klaren Weg zur Zimmeranfrage.',cta:'Zimmer entdecken',features:['Zimmer & Rückzugsorte','Die Umgebung erleben','Deine Auszeit anfragen']},
 {id:'hotel-2',brand:'NOCTURNE',name:'Boutique & Eleganz',label:'Dunkel · Elegant',layout:'immersive',bg:'#15171a',fg:'#f0e7da',accent:'#ceaf7b',hero:'Dein Aufenthalt.\nEin eigenes Kapitel.',intro:'Ein Haus mit Persönlichkeit.',body:'Dunkle Flächen, feine Typografie und ein bildstarker Einstieg geben einem Boutiquehotel Raum und Charakter.',cta:'Das Haus entdecken',features:['Das Haus','Zimmer mit Charakter','Dein Aufenthalt']},
 {id:'hotel-3',brand:'MAISON / STAY',name:'Klar & Modern',label:'Hell · Editorial',layout:'split',bg:'#f3f1ec',fg:'#26232b',accent:'#836274',hero:'Hier darf\nZeit bleiben.',intro:'Klar im Design. Persönlich im Gefühl.',body:'Ein leichter, moderner Entwurf mit klaren Wegen zu Zimmern, Informationen und einer persönlichen Anfrage.',cta:'Aufenthalt planen',features:['Wohnen','Entdecken','Ankommen']}
 ],
 restaurant:[
 {id:'restaurant-1',brand:'TAVOLA',name:'Italienisch & Warm',label:'Warm · Gesellig',layout:'editorial',bg:'#f1e4cd',fg:'#4a2521',accent:'#a64230',hero:'Gutes Essen.\nGute Gesellschaft.',intro:'Ein Platz am Tisch.',body:'Warme Farben, große Bilder und eine übersichtliche Speisekarte bringen das Gefühl des Restaurants ins Web.',cta:'Speisekarte entdecken',features:['Unsere Küche','Ein Abend bei uns','Tisch anfragen']},
 {id:'restaurant-2',brand:'EMBER',name:'Fine Dining',label:'Dunkel · Intensiv',layout:'immersive',bg:'#191813',fg:'#f2eada',accent:'#c19257',hero:'Ein Abend,\nder bleibt.',intro:'Mit Sinn für das Besondere.',body:'Ein stimmungsvoller Entwurf mit feinen Kontrasten, zurückhaltender Navigation und Raum für die Küche.',cta:'Küche entdecken',features:['Die Philosophie','Die Speisekarte','Dein Besuch']},
 {id:'restaurant-3',brand:'NOVA / KITCHEN',name:'Urban & Lebendig',label:'Modern · Mutig',layout:'split',bg:'#eeede6',fg:'#252b4a',accent:'#626fab',hero:'Hier kommt\nGeschmack zusammen.',intro:'Für lange Abende und neue Lieblingsplätze.',body:'Markante Typografie, klare Flächen und lebendige Akzente schaffen einen Auftritt für moderne Gastronomie.',cta:'Restaurant entdecken',features:['Food & Drinks','Der Ort','Tisch anfragen']}
 ],
 driving:[
 {id:'driving-1',brand:'SHIFT',name:'Jung & Dynamisch',label:'Mutig · Dynamisch',layout:'editorial',bg:'#e9efdc',fg:'#182721',accent:'#3d704c',hero:'Dein Weg.\nDein Tempo.',intro:'Dein nächstes Kapitel beginnt am Steuer.',body:'Ein frischer Entwurf mit klarer Kursübersicht, direkter Ansprache und einem einfachen Einstieg zur Anfrage.',cta:'Den Weg kennenlernen',features:['Führerscheinklassen','So läuft es ab','Persönlich anfragen']},
 {id:'driving-2',brand:'NIGHTDRIVE',name:'Premium & Fokus',label:'Dunkel · Präzise',layout:'immersive',bg:'#101923',fg:'#e9eff4',accent:'#78b8d0',hero:'Klarer Kurs.\nNeues Gefühl.',intro:'Mit einem guten Gefühl nach vorn.',body:'Ein präziser, bildstarker Entwurf mit ruhiger Nutzerführung und gut auffindbaren Informationen zur Ausbildung.',cta:'Ausbildung entdecken',features:['Deine Ausbildung','Das Team','Dein Einstieg']},
 {id:'driving-3',brand:'FREI / FAHREN',name:'Offen & Persönlich',label:'Hell · Direkt',layout:'split',bg:'#f3eee4',fg:'#392d26',accent:'#bb663b',hero:'Los geht’s.\nMit dir am Steuer.',intro:'Einfach einsteigen.',body:'Helle Flächen, persönliche Ansprache und eine gut lesbare Struktur führen Schritt für Schritt zur ersten Anfrage.',cta:'Mehr erfahren',features:['Deine Möglichkeiten','Schritt für Schritt','Fragen & Kontakt']}
 ]};
const categoryNames={hotel:'Hotel',restaurant:'Restaurant',driving:'Fahrschulen'};
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const all=Object.values(concepts).flat();
const orbitVisibility=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('orbit-offscreen',!entry.isIntersecting)),{threshold:.01});
const modal=document.querySelector('.concept-dialog');
const demo=document.querySelector('.concept-demo');
let activeTrigger=null;
function miniature(c,key){return `<span class="mini-site mini-${c.layout}" style="--mini-bg:${c.bg};--mini-fg:${c.fg};--mini-accent:${c.accent}"><span class="mini-nav">${escape(c.brand)}<i>☰</i></span><span class="mini-image" style="background-image:url('concepts/${key}.webp')"></span><strong>${escape(c.hero).replaceAll('\n','<br>')}</strong><span class="mini-rule"></span></span>`;}
for(const article of document.querySelectorAll('.category')){
 const key=article.dataset.category,trigger=article.querySelector('.category-trigger'),panel=article.querySelector('.wheel-panel'),orbit=article.querySelector('.concept-orbit');
 orbit.replaceChildren();
 concepts[key].forEach((c,i)=>{
  const node=document.createElement('div');node.className='orbit-node';node.style.setProperty('--node-angle',`${i*120-90}deg`);
  node.innerHTML=`<button class="orbit-window" type="button" data-concept="${c.id}" aria-label="${categoryNames[key]}: ${escape(c.name)} Vorschau öffnen"><span class="orbit-chrome"><i></i><i></i><i></i></span>${miniature(c,key)}<span class="orbit-label">${escape(c.name)} <b><span aria-hidden="true" class="rocket-mark"><svg viewBox="0 0 32 32"><g class="rocket-flame"><path d="M12 27q1 7 4 12 3-5 4-12z"/><path class="flame-core" d="M14 27l2 7 2-7z"/></g><path class="rocket-body" d="M16 2C10 6 8 14 10 23h12C24 14 22 6 16 2zM10 15 4 25l8-3m10-7 6 10-8-3M12 23v4h8v-4z"/><circle class="rocket-port" cx="16" cy="12" r="3"/></svg></span></b></span></button>`;
  orbit.appendChild(node);
 });
 trigger.addEventListener('click',()=>{
  const open=trigger.getAttribute('aria-expanded')!=='true';
  trigger.setAttribute('aria-expanded',String(open));article.classList.toggle('is-open',open);panel.hidden=!open;
 });
 orbitVisibility.observe(article);
 const pause=article.querySelector('.wheel-pause');
 pause.addEventListener('click',()=>{
  const isPaused=pause.getAttribute('aria-pressed')!=='true';pause.setAttribute('aria-pressed',String(isPaused));article.classList.toggle('is-paused',isPaused);pause.textContent=isPaused?'▷ Weiter':'Ⅱ Pause';
 });
}
function openConcept(c,source){
 const key=c.id.split('-')[0];activeTrigger=source;
 document.getElementById('concept-dialog-category').textContent=`${categoryNames[key]} / ${c.label}`;
 document.getElementById('concept-dialog-title').textContent=c.name;
 demo.innerHTML=`<article class="sample-site sample-${c.layout}" style="--sample-bg:${c.bg};--sample-fg:${c.fg};--sample-accent:${c.accent}">
 <header class="sample-nav"><strong>${escape(c.brand)}</strong><span>Designkonzept</span></header>
 <div class="sample-hero"><img src="concepts/${key}.webp" alt="Beispielmotiv für ${categoryNames[key]}" class="sample-photo"><div class="sample-copy"><span class="sample-eyebrow">${escape(c.label)}</span><h3>${escape(c.hero).replaceAll('\n','<br>')}</h3><p>${escape(c.intro)}</p><button type="button" class="sample-cta" data-demo-scroll>${escape(c.cta)} <span>↗</span></button></div><span class="sample-index">01 — EIN NEUER BLICK</span></div>
 <section class="sample-details"><span class="sample-eyebrow">DAS KONZEPT</span><h3>${escape(c.intro)}</h3><p>${escape(c.body)}</p><div class="sample-features">${c.features.map((f,i)=>`<div><span>0${i+1}</span><h4>${escape(f)}</h4><i>↗</i></div>`).join('')}</div></section><footer class="sample-footer"><strong>${escape(c.brand)}</strong><span>Beispielentwurf · Inhalte individuell anpassbar</span></footer></article>`;
 document.querySelector('.concept-demo-scroll').classList.remove('is-mobile');
 modal.querySelectorAll('[data-size]').forEach(b=>{const active=b.dataset.size==='desktop';b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
 document.querySelectorAll('.category').forEach(el=>el.classList.add('dialog-paused'));
 document.body.classList.add('dialog-open');modal.showModal();
 document.querySelector('.concept-demo-scroll').scrollTop=0;
}
document.querySelector('.category-grid').addEventListener('click',e=>{const b=e.target.closest('[data-concept]');if(b){const c=all.find(c=>c.id===b.dataset.concept);if(c)openConcept(c,b);}});
modal.querySelector('.dialog-close').addEventListener('click',()=>modal.close());
modal.addEventListener('click',e=>{if(e.target===modal)modal.close();if(e.target.closest('[data-demo-scroll]'))demo.querySelector('.sample-details').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});});
modal.addEventListener('close',()=>{document.body.classList.remove('dialog-open');document.querySelectorAll('.category').forEach(el=>el.classList.remove('dialog-paused'));activeTrigger?.focus();});
modal.querySelectorAll('[data-size]').forEach(b=>b.addEventListener('click',()=>{const mobile=b.dataset.size==='mobile';document.querySelector('.concept-demo-scroll').classList.toggle('is-mobile',mobile);modal.querySelectorAll('[data-size]').forEach(x=>{const active=x===b;x.classList.toggle('active',active);x.setAttribute('aria-pressed',String(active));});}));
})();
