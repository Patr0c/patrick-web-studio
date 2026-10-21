(()=>{
 const family=new URLSearchParams(location.search).get('font');if(!family)return;
 fetch('font-options.json').then(r=>r.json()).then(fonts=>{
  const choice=fonts.find(f=>f.name===family);if(!choice)return;
  document.documentElement.style.setProperty('--studio-display',`'${choice.name}',Arial,sans-serif`);
  document.title=`Patrick / Digital Rework · ${choice.name}`;
 }).catch(()=>{});
})();
