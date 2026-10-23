/* Standalone, bounded textmode monitor inspired by humanbydefinition's
   Textmode Overlay brightness/glyph-ramp conversion. No browser extension,
   permissions, source/comparison pane or third-party runtime is installed.
   One tiny WebGL surface; no animation work while paused. */
(() => {
  'use strict';
  window.createTextmodeFlow = canvas => {
    const glyphs = ' .:-=+*#%@';
    const gl = canvas.getContext('webgl', {alpha:false, antialias:false, depth:false,
      stencil:false, preserveDrawingBuffer:false, powerPreference:'low-power'});
    let active=false, raf=0, previous=0, last=0, elapsed=12.4, lost=false, frames=0;
    let program, timeLocation, gridLocation, fallbackContext, fallbackCanvas, fallbackAtlas;
    const vertex = 'attribute vec2 a_position;varying vec2 v_uv;void main(){v_uv=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}';
    const fragment = `precision highp float;
      varying vec2 v_uv;uniform sampler2D u_glyphs;uniform float u_time;
      uniform vec2 u_grid;uniform float u_aspect;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float field(vec2 p,float t){
        p+=vec2(sin(t*.075)*.55,cos(t*.063)*.5);
        vec2 q=p+vec2(sin(p.y*.78+t*.13),cos(p.x*.71-t*.11))*1.05;
        float f=sin(q.x*.91+sin(q.y*.77+t*.09))+cos(q.y*1.05+cos(q.x*.72-t*.07));
        f+=.16*sin(q.x*1.8+q.y*1.32+t*.16);
        return f;
      }
      void main(){
        vec2 cell=floor(v_uv*u_grid), uv=(cell+.5)/u_grid;
        vec2 p=(uv-.5)*vec2(u_aspect*4.8,4.8);
        float f=field(p,u_time);
        float ribbon=pow(.5+.5*sin(f*11.5-u_time*.42),3.2);
        float strand=pow(.5+.5*sin(f*11.5-u_time*.42+.58),8.);
        float grain=.82+.18*hash(cell);
        float brightness=clamp((ribbon*.92+strand*.31)*grain,0.,.999);
        float index=floor(brightness*10.);
        vec2 local=fract(v_uv*u_grid);
        float ink=texture2D(u_glyphs,vec2((index+local.x)/10.,local.y)).a;
        float green=smoothstep(.58,.87,sin(f*2.45+uv.x*5.8-u_time*.12));
        vec3 color=mix(vec3(.77,.84,.79),vec3(.098,.898,.059),green);
        color=mix(color,vec3(.77,1.,.72),strand*.15);
        float power=.38+brightness*.8;
        gl_FragColor=vec4(vec3(.009,.017,.013)+color*ink*power,1.);
      }`;
    const shader = (type,source) => {
      const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);
      if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    };
    const resize = () => {
      const box=canvas.getBoundingClientRect();
      const dpr=Math.min(devicePixelRatio||1,2,Math.sqrt(220000/Math.max(1,box.width*box.height)));
      canvas.width=Math.max(1,Math.round(box.width*dpr));canvas.height=Math.max(1,Math.round(box.height*dpr));
      if(gl && program && !lost){
        gl.viewport(0,0,canvas.width,canvas.height);gl.useProgram(program);
        gl.uniform2f(gridLocation,Math.max(24,Math.round(box.width/3.5)),Math.max(12,Math.round(box.height/4.8)));
        gl.uniform1f(gl.getUniformLocation(program,'u_aspect'),box.width/Math.max(1,box.height));
        render();
      }
    };
    const renderFallback = () => {
      const ctx=fallbackContext,w=480,h=220;
      ctx.globalAlpha=1;ctx.fillStyle='#020604';ctx.fillRect(0,0,w,h);
      for(let y=0;y<h;y+=8)for(let x=0;x<w;x+=5){
        const px=(x/w-.5)*10.5+Math.sin(elapsed*.075)*.55,py=(y/h-.5)*4.8+Math.cos(elapsed*.063)*.5;
        const qx=px+Math.sin(py*.78+elapsed*.13)*1.05,qy=py+Math.cos(px*.71-elapsed*.11)*1.05;
        const f=Math.sin(qx*.91+Math.sin(qy*.77+elapsed*.09))+Math.cos(qy*1.05+Math.cos(qx*.72-elapsed*.07))+.16*Math.sin(qx*1.8+qy*1.32+elapsed*.16);
        const b=Math.pow(.5+.5*Math.sin(f*11.5-elapsed*.42),3.2);
        if(b<.1)continue;
        const green=.5+.5*Math.sin(f*2.45+x/w*5.8-elapsed*.12);
        ctx.globalAlpha=.4+b*.6;
        const ink=Math.min(31,Math.round(green*31)),glyph=Math.min(9,Math.floor(b*10));
        ctx.drawImage(fallbackAtlas,glyph*8,ink*10,5,8,x,y,5,8);
      }
    };
    const render = () => {
      if(fallbackContext){renderFallback();frames++;return;}
      if(!program || lost)return;
      gl.uniform1f(timeLocation,elapsed);gl.drawArrays(gl.TRIANGLES,0,6);frames++;
    };
    const frame = now => {
      raf=0;if(!active || lost)return;
      if(now-last>=1000/(fallbackContext?20:45)){
        if(previous)elapsed+=Math.min((now-previous)/1000,.1);
        previous=now;last=now;render();
      }
      raf=requestAnimationFrame(frame);
    };
    const setActive = value => {
      active=Boolean(value);canvas.dataset.running=String(active && !lost && Boolean(program || fallbackContext));
      if(!active){cancelAnimationFrame(raf);raf=0;previous=0;return;}
      if((program || fallbackContext) && !lost && !raf)raf=requestAnimationFrame(frame);
    };
    try{
      if(!gl)throw new Error('WebGL unavailable');
      program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));
      gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);
      if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(program));
      gl.useProgram(program);
      const vertices=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,vertices);
      gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
      const attribute=gl.getAttribLocation(program,'a_position');gl.enableVertexAttribArray(attribute);
      gl.vertexAttribPointer(attribute,2,gl.FLOAT,false,0,0);
      const atlas=document.createElement('canvas');atlas.width=320;atlas.height=40;
      const ctx=atlas.getContext('2d');ctx.fillStyle='#fff';ctx.font='28px monospace';
      ctx.textAlign='center';ctx.textBaseline='middle';
      [...glyphs].forEach((g,i)=>ctx.fillText(g,i*32+16,20));
      const texture=gl.createTexture();gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,atlas);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
      gl.uniform1i(gl.getUniformLocation(program,'u_glyphs'),0);
      timeLocation=gl.getUniformLocation(program,'u_time');gridLocation=gl.getUniformLocation(program,'u_grid');
      canvas.dataset.renderer='webgl';resize();
    }catch(error){
      // Some browsers disable WebGL. Keep the same flowing ASCII view on a
      // bounded 480×220 2D surface, with the same visibility/30fps scheduler.
      program=null;canvas.dataset.renderer='canvas2d';
      fallbackCanvas=document.createElement('canvas');fallbackCanvas.width=480;fallbackCanvas.height=220;
      fallbackCanvas.className='textmode-fallback';fallbackCanvas.setAttribute('aria-hidden','true');
      fallbackContext=fallbackCanvas.getContext('2d',{alpha:false});
      fallbackAtlas=document.createElement('canvas');fallbackAtlas.width=80;fallbackAtlas.height=320;
      const ink=fallbackAtlas.getContext('2d');ink.font='7px monospace';ink.textBaseline='top';
      for(let row=0;row<32;row++){
        const green=row/31;ink.fillStyle=`rgb(${196-171*green},${214+15*green},${202-187*green})`;
        [...glyphs].forEach((glyph,i)=>ink.fillText(glyph,i*8,row*10));
      }
      canvas.after(fallbackCanvas);canvas.hidden=true;render();
    }
    canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();lost=true;setActive(false);});
    canvas.addEventListener('webglcontextrestored',()=>{canvas.dataset.renderer='context-lost';});
    new ResizeObserver(resize).observe(canvas);
    return {setActive,resize,stats:()=>({frames,active,renderer:canvas.dataset.renderer})};
  };
})();
