#!/usr/bin/env python3
"""Import Patrick's named ORA layers; keep original PNG bytes and native offsets.

Requires Pillow/numpy only for this offline import; the deployed site is buildless.
Usage: python3 scripts/import_smoked_desk.py INPUT.ora [KEYBOARD_RETOUCH.png]
"""
from pathlib import Path
import sys, zipfile, xml.etree.ElementTree as ET, hashlib, json, html
from PIL import Image, ImageChops

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/desk'
OUT.mkdir(exist_ok=True)
(OUT/'original').mkdir(exist_ok=True)
names=['main-left','main-center','main-right','aux-left-outer','aux-left-inner',
       'aux-right-inner','aux-right-outer','keyboard-labels','keyboard',
       'mouse-wheel','mouse','button-red','button-orange','button-green','mousepad','base']
ora=Path(sys.argv[1])
with zipfile.ZipFile(ora) as archive:
    xml=archive.read('stack.xml')
    root=ET.fromstring(xml)
    W,H=int(root.get('w')),int(root.get('h'))
    assert (W,H)==(1949,826)
    layers=[]
    for i,e in enumerate(root.iter('layer')):
        name=names[i];raw=archive.read(e.get('src'))
        path=OUT/'original'/f'{name}.png';path.write_bytes(raw)
        im=Image.open(path).convert('RGBA')
        layers.append(dict(name=name,label=e.get('name'),file=f'original/{name}.png',
                           x=int(e.get('x','0')),y=int(e.get('y','0')),width=im.width,height=im.height,
                           opacity=float(e.get('opacity','1')),visibility=e.get('visibility'),
                           sha256=hashlib.sha256(raw).hexdigest(),alphaBox=list(im.getbbox())))
    assert len(layers)==16
    (OUT/'original-stack.xml').write_bytes(xml)

def region(layer,inset=0):
    x,y=layer['x'],layer['y'];a,b,c,d=layer['alphaBox']
    return dict(id=layer['name'],box=[max(0,x+a+inset),max(0,y+b+inset),min(W,x+c-inset),min(H,y+d-inset)],pixels=(c-a)*(d-b))

main=[region(l,12) for l in layers[:3]]
aux=[region(l,3) for l in layers[3:7]]
center=main[1]
aux_mask=Image.new('L',(W,H))
matrix_mask=Image.new('L',(W,H))
for i in [1,3,4,5,6]:
    layer=layers[i];im=Image.open(OUT/layer['file']).convert('RGBA')
    a=im.getchannel('A')
    # A small inset protects the photographic bezel; use the real alpha, including
    # the otherwise surprising transparent left padding of auxiliary layers 2–4.
    from PIL import ImageFilter,ImageDraw
    a=a.filter(ImageFilter.MinFilter(7))
    full=Image.new('L',(W,H));full.paste(a,(layer['x'],layer['y']))
    aux_mask=ImageChops.lighter(aux_mask,full)
    if i!=1:
        left=layer['x']+layer['alphaBox'][0]+8
        gate=Image.new('L',(W,H));ImageDraw.Draw(gate).rectangle((left,layer['y']+6,left+26,layer['y']+layer['height']-7),fill=255)
        matrix_mask=ImageChops.lighter(matrix_mask,ImageChops.multiply(full,gate))
for name,alpha in [('aux-mask',aux_mask),('matrix-mask',matrix_mask)]:
    im=Image.new('RGBA',(W,H),'white');im.putalpha(alpha);im.save(OUT/f'{name}.png')

controls=[]
for layer in layers[11:14]:
    a=Image.open(OUT/layer['file']).convert('RGBA').getchannel('A')
    # Encode actual source-alpha spans; no guessed rectangular hit area.
    parts=[]
    for y in range(a.height):
        xs=[x for x in range(a.width) if a.getpixel((x,y))>64]
        if xs:parts.append(f'M{layer["x"]+min(xs)} {layer["y"]+y}h{max(xs)-min(xs)+1}v1H{layer["x"]+min(xs)}z')
    r=region(layer);r['path']=''.join(parts);controls.append(r)

geometry=dict(canvas=[W,H],source=ora.name,sourceSha256=hashlib.sha256(ora.read_bytes()).hexdigest(),
              layers=layers,main=main,auxiliary=aux,center=center,controls=controls,
              bottomEdge=826,keyboardRetouch=False)

# Separately authorized surface retouch. The native alpha and coordinate contract
# are preserved; original artwork and its lettering layer remain archived above.
if len(sys.argv)>2:
    retouch=Image.open(sys.argv[2]).convert('RGBA')
    original=Image.open(OUT/'original/keyboard.png').convert('RGBA')
    ob=original.getbbox();nb=retouch.getchannel('A').point(lambda p:255 if p>96 else 0).getbbox()
    factor=3
    keyboard=Image.new('RGBA',(original.width*factor,original.height*factor))
    detail=retouch.crop(nb).resize(((ob[2]-ob[0])*factor,(ob[3]-ob[1])*factor),Image.Resampling.LANCZOS)
    keyboard.paste(detail,(ob[0]*factor,ob[1]*factor))
    keyboard.putalpha(original.getchannel('A').resize(keyboard.size,Image.Resampling.LANCZOS))
    keyboard.save(OUT/'keyboard-refined.png')
    geometry['keyboardRetouch']=True
    geometry['keyboardRetouchSha256']=hashlib.sha256(Path(sys.argv[2]).read_bytes()).hexdigest()

# Sharp real QWERTZ text at measured keycap centers, in the keyboard's LOCAL grid.
keys=[]
def row(xs,y,labels,size=9):
    assert len(xs)==len(labels)
    keys.extend((x,y,text,size) for x,text in zip(xs,labels))
row([49.5],39,['Esc'],6)
row([98,126,152.5,180.5,220.5,247.5,275,302.5,340,368,395.5,424],38,[f'F{i}' for i in range(1,13)],6)
row([470.5,498,525.5],38,['Druck','Rollen','Pause'],4.3)
row([562,590,618,649],38,['M1','M2','M3','M4'],6)
row([48,76,104,131.5,159.5,187.5,215,243,271,298.5,326.5,354.5,382],64,['^','1','2','3','4','5','6','7','8','9','0','ß','´'])
row([423],64,['⌫'],10)
row([472.5,500.5,528.5],64,['Einfg','Pos1','Bild ↑'],4.5)
row([565,593.5,621.5,653.5],64,['Num','/','×','−'],7)
row([52.5],88,['Tab'],6)
row([88,116.5,144.5,172.5,200.5,228.5,256.5,285,313,341,369,397],87.5,list('QWERTZUIOPÜ+') )
row([432],99.5,['↵'],12)
row([474.5,502.5,530.5],87.5,['Entf','Ende','Bild ↓'],4.5)
row([568,596.5,625],87.5,['7','8','9'])
row([658.5],99,['+'],10)
row([53.5],111.5,['Caps'],6)
row([94,122,150.5,178.5,207,235.5,263.5,292,320.5,348.5,376.5,405],111.5,list('ASDFGHJKLÖÄ#'))
row([570,599,628],111.5,['4','5','6'])
row([44.5],135.5,['Shift'],5.8)
row([77.5,106,134.5,163,191.5,220,248.5,277.5,306,334.5,363.5],135.5,['<>','Y','X','C','V','B','N','M',',','.','−'])
row([416],135.5,['Shift'],6)
row([506],133,['↑'],10)
row([572.5,602,631],134.5,['1','2','3'])
row([665.5],147,['Enter'],5.8)
row([40,74,108.5,331,367,401,436],159.5,['Strg','Meta','Alt','Alt Gr','Fn','Menü','Strg'],5.4)
row([479.5,508,537],158.5,['←','↓','→'],10)
row([590,634],159,['0',','])
svg=['<svg xmlns="http://www.w3.org/2000/svg" width="709" height="199" viewBox="0 0 709 199">',
     '<g fill="#e7ede6" font-family="DejaVu Sans,sans-serif" font-weight="500" text-anchor="middle" dominant-baseline="central">']
for x,y,text,size in keys:svg.append(f'<text x="{x}" y="{y}" font-size="{size}">{html.escape(text)}</text>')
svg+=['</g>','</svg>']
(OUT/'keyboard-labels.svg').write_text('\n'.join(svg),encoding='utf-8')
(OUT/'geometry.json').write_text(json.dumps(geometry,ensure_ascii=False,indent=2),encoding='utf-8')

css=['/* Native GIMP canvas 1949 × 826. Original alpha and negative offsets preserved. */']
for i,layer in enumerate(layers):
    css.append('.desk-layer--'+layer['name']+'{'+f'left:{layer["x"]/W*100:.9f}%;top:{layer["y"]/H*100:.9f}%;width:{layer["width"]/W*100:.9f}%;height:{layer["height"]/H*100:.9f}%;z-index:{20-i};'+'}')
for cls,r in [('screen-left',main[0]),('screen-right',main[2])]:
    x,y,x1,y1=r['box'];css.append(f'.workstation-stage .{cls}'+'{'+f'left:{x/W*100:.9f}%;top:{y/H*100:.9f}%;width:{(x1-x)/W*100:.9f}%;height:{(y1-y)/H*100:.9f}%;'+'}')
(OUT/'geometry.css').write_text('\n'.join(css)+'\n')
print(f'Imported {len(layers)} original layers, {len(main)} main screens, {len(aux)} auxiliary screens, {len(controls)} controls; {W}x{H}.')
