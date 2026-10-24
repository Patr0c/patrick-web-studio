/* One small cached SVG glyph sheet. Six bounded surfaces share one phase,
   including the rounded edge. Symbols change independently without flashing. */
window.createMatrixFlow=(field,geometry,project)=>{
 'use strict';
 const hash=n=>{n=Math.imul(n^(n>>>16),0x45d9f3b);n=Math.imul(n^(n>>>16),0x45d9f3b);return(n^(n>>>16))>>>0;};
 const planes=geometry.matrix_surfaces.map(surface=>{
  const plane=document.createElement('div');plane.className='matrix-vector-plane';plane.dataset.surface=surface.name;project(plane,surface.quad,surface.width,surface.height);
  const canvas=document.createElement('canvas');canvas.className='matrix-glyph-canvas';canvas.width=1280;canvas.height=Math.max(2,Math.ceil(surface.height*2/3));plane.append(canvas);field.append(plane);
  const ctx=canvas.getContext('2d');return{surface,canvas,ctx};
 });
 let data,atlas,elapsed=0,previous=0,active=false;
 const cells=new Map();
 function paint(){
  if(!data||!atlas)return;
  const flow=(elapsed*data.speed)%data.period;
  for(const {surface,canvas,ctx} of planes){
   if(!ctx)continue;ctx.clearRect(0,0,canvas.width,canvas.height);ctx.setTransform(canvas.width/1920,0,0,canvas.height/surface.height,0,0);
   const start=surface.offset-flow;
   for(let row=Math.floor(start/32);row<=Math.floor((start+surface.height)/32);row++){
    const logical=(row%72+72)%72,y=row*32-start;
    for(let col=0;col<60;col++){
     const cell=cells.get(logical*60+col);if(!cell)continue;
     const seed=hash(logical*131+col*977+17),steps=23+seed%59,period=data.period/data.speed,cycle=Math.floor(((elapsed%period)/period+(seed%997)/997)*steps)%steps;
     const glyph=(cell.glyph+cycle*(1+seed%(data.glyphs-1)))%data.glyphs;
     ctx.globalAlpha=cell.opacity;ctx.drawImage(atlas,glyph%16*32,Math.floor(glyph/16)*32+cell.bank*288,32,32,col*32,y,32,32);
    }
   }
   ctx.globalAlpha=1;ctx.setTransform(1,0,0,1,0,0);
  }
 }
 Promise.all([fetch('assets/scene/seated/matrix-cells.json').then(r=>{if(!r.ok)throw Error('Matrix data');return r.json();}),new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src='assets/scene/seated/matrix-glyphs.svg';})]).then(([d,im])=>{data=d;atlas=im;data.cells.forEach(c=>cells.set(c.row*60+c.col,c));paint();}).catch(()=>{field.dataset.unavailable='true';});
 return{
  setActive(value){active=value;previous=0;},
  tick(now){if(!active)return;if(previous)elapsed+=(now-previous)/1000;previous=now;paint();},
 };
};
