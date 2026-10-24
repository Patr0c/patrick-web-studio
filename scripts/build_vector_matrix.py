"""Version 3: genuine Noto CJK outlines, stable nonintersecting columns.

SVG is the authoritative web asset. No generated or painted glyphs, filters,
blur, font loading, Canvas repaint loop, or compressed video is involved.
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools import subset
import random, math, json

ROOT=Path(__file__).resolve().parents[1]
FONT=ROOT/'assets/fonts/noto/NotoSansCJKjp-Regular.otf'
if not FONT.exists():FONT=ROOT/'assets/fonts/noto/MatrixCJK-subset.otf'
OUT=ROOT/'assets/scene/seated'
chars='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンあいうえおかきくけこさしすせそたちつてとなにぬねの光雨電流空星月日森数時点線界門水火木金土上下左右中'
f=TTFont(FONT);cmap=f.getBestCmap();glyphs=f.getGlyphSet();upm=f['head'].unitsPerEm
chars=[c for c in dict.fromkeys(chars) if ord(c) in cmap]
assert len(chars)>100
defs=[]
for i,c in enumerate(chars):
    glyph=glyphs[cmap[ord(c)]];pen=SVGPathPen(glyphs);glyph.draw(pen)
    # The font's authentic advance centres Latin and fullwidth CJK identically.
    size=22;scale=size/upm;x=(32-glyph.width*scale)/2
    defs.append(f'<path id="g{i}" transform="translate({x:.4f} 25) scale({scale:.6f} {-scale:.6f})" d="{pen.getCommands()}"/>')
rng=random.Random(3102026);uses=[];counts=[]
for col in range(60):
    offset=rng.randrange(72);count=0
    for row in range(72):
        # Two soft tails per period, with stable symbols and natural gaps.
        phase=((row+offset)%36)/36
        if phase>.82:continue
        strength=.20+.80*math.sin(math.pi*phase/.82)**.55
        if rng.random()<.055:continue
        g=rng.randrange(len(chars));fill='#42ff35' if .60<phase<.69 else '#19e50f'
        uses.append(f'<use href="#g{g}" x="{col*32}" y="{row*32}" fill="{fill}" opacity="{strength:.3f}"/>');count+=1
    counts.append(count)
svg='<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="2304" viewBox="0 0 1920 2304"><defs>'+''.join(defs)+'</defs>'+''.join(uses)+'</svg>'
(OUT/'matrix-vector.svg').write_text(svg)
(OUT/'matrix-vector.json').write_text(json.dumps({'method':'C / true SVG glyph outlines — selected version 3','font':'Noto Sans CJK JP / SIL OFL 1.1','columns':60,'cell':32,'glyph_size':22,'period':2304,'speed_px_per_second':24,'glyph_count':sum(counts),'no_missing_glyphs':True,'glow_radius':0},indent=2)+'\n')
# Keep an independently reusable small source font with precisely these glyphs.
options=subset.Options();sub=subset.Subsetter(options);sub.populate(text=''.join(chars));sub.subset(f)
f.save(ROOT/'assets/fonts/noto/MatrixCJK-subset.otf')
print('Saved',len(uses),'vector glyphs,',len(chars),'authentic symbols; SVG bytes',len(svg.encode()))
