"""Offline Blender 4.2 model/render. No 3D engine is shipped to the website.

Run: blender -b -t 8 --python scripts/render_seated_workstation.py -- --draft
The single camera, real mesh surfaces, ray-traced shadows and exported display
vertices replace independent image warps. Original GIMP artwork stays archived.
"""
import bpy
import math
import json
import random
import sys
from pathlib import Path
from mathutils import Vector, Euler
from bpy_extras.object_utils import world_to_camera_view

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'assets/scene/seated'
RAW = Path('/tmp/patrick-seated-render')
OUT.mkdir(exist_ok=True)
RAW.mkdir(exist_ok=True)
DRAFT = '--draft' in sys.argv
W, H, OVERSCAN = 2560, 1440, 4096
CX, CY, F = 1280.0, 785.0, 1750.0
MEASURED_VP = (1280.0, 721.0)
CAM = Vector((0, -1.23, 1.20))
MONITOR_Z = 1.15
# Latest explicit viewing specification: frontal, eyes exactly5cm above center.
pitch = math.atan((CAM.z-MONITOR_Z)/(.64-CAM.y))
yaw = 0
VP = (CX, CY-F*math.tan(pitch))
FORWARD = Vector((math.sin(yaw) * math.cos(pitch), math.cos(yaw) * math.cos(pitch), -math.sin(pitch)))
RIGHT = Vector((math.cos(yaw), -math.sin(yaw), 0))
UP = RIGHT.cross(FORWARD)
TABLE_Z = .75

bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.device = 'CPU'
scene.cycles.samples = 12 if DRAFT else 48
scene.cycles.use_denoising = True
scene.cycles.max_bounces = 6
scene.cycles.glossy_bounces = 4
scene.cycles.transmission_bounces = 4
scene.cycles.transparent_max_bounces = 4
scene.cycles.adaptive_threshold = .07 if DRAFT else .025
scene.render.threads_mode = 'FIXED'
scene.render.threads = 8
scene.render.resolution_x = OVERSCAN
scene.render.resolution_y = H
scene.render.resolution_percentage = 40 if DRAFT else 100
scene.render.film_transparent = True
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.render.image_settings.color_depth = '8'
scene.view_settings.view_transform = 'AgX'
scene.view_settings.look = 'AgX - Medium High Contrast'
scene.view_settings.exposure = .3
scene.render.image_settings.compression = 30
scene.render.use_file_extension = True
scene.world.use_nodes = True
scene.world.node_tree.nodes['Background'].inputs['Color'].default_value = (.16, .19, .24, 1)
scene.world.node_tree.nodes['Background'].inputs['Strength'].default_value = .22

cam_data = bpy.data.cameras.new('Seated calibrated pinhole camera')
camera = bpy.data.objects.new('Seated POV — common camera for every object', cam_data)
scene.collection.objects.link(camera)
camera.location = CAM
camera.rotation_euler = FORWARD.to_track_quat('-Z', 'Y').to_euler()
cam_data.type = 'PERSP'
cam_data.sensor_fit = 'HORIZONTAL'
cam_data.sensor_width = 36
cam_data.lens = F * 36 / OVERSCAN
cam_data.shift_x = (W / 2 - CX) / OVERSCAN
cam_data.shift_y = (CY - H / 2) / OVERSCAN
cam_data.clip_start = .01
cam_data.clip_end = 100
scene.camera = camera


def project(p):
    v = world_to_camera_view(scene, camera, Vector(p))
    return [round(v.x * OVERSCAN - (OVERSCAN - W) / 2, 5), round((1 - v.y) * H, 5)]


def on_plane(u, v, z=TABLE_Z):
    ray = FORWARD + RIGHT * ((u - CX) / F) + UP * ((CY - v) / F)
    return CAM + ray * ((z - CAM.z) / ray.z)


def material(name, color, metallic=0, rough=.35, transmission=0, emission=0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bs = mat.node_tree.nodes.get('Principled BSDF')
    bs.inputs['Base Color'].default_value = (*color, 1)
    bs.inputs['Metallic'].default_value = metallic
    bs.inputs['Roughness'].default_value = rough
    bs.inputs['IOR'].default_value = 1.48
    bs.inputs['Transmission Weight'].default_value = transmission
    bs.inputs['Coat Weight'].default_value = .22 if metallic else .1
    bs.inputs['Coat Roughness'].default_value = .16
    if emission:
        bs.inputs['Emission Color'].default_value = (*color, 1)
        bs.inputs['Emission Strength'].default_value = emission
    return mat


chrome = material('Neutral satin polished chromium', (.36, .39, .43), 1, .19)
edge_chrome = material('Fine polished edge, external reflections only', (.6, .64, .68), 1, .105)
graphite = material('Graphite anodized structure', (.032, .038, .046), .78, .30)
glass = material('Smoked graphite glass, solid thickness', (.023, .035, .045), .16, .22, .48)
rubber = material('Fine anthracite pad textile', (.014, .018, .022), 0, .83)
keys = material('Clean molded charcoal keycaps', (.027, .031, .038), .12, .31)
key_top = material('Subtle satin key top', (.038, .042, .050), .1, .35)
black = material('Screen antireflective dark glass', (.001, .003, .004), .1, .28)
seam = material('Rubber seams and gaskets', (.004, .006, .008), 0, .68)
violet = material('Violet legends — crisp, no bloom', (.48, .15, .87), .02, .36, 2.4)
white = material('White hardware status pin', (.6, .65, .7), .1, .3, .3)

# Tight material microstructure; real shader normals instead of scratched artwork.
for mat, scale, strength in [(chrome, 1200, .025), (rubber, 1800, .13)]:
    nt = mat.node_tree
    tex = nt.nodes.new('ShaderNodeTexNoise')
    tex.inputs['Scale'].default_value = scale
    tex.inputs['Detail'].default_value = 1
    bump = nt.nodes.new('ShaderNodeBump')
    bump.inputs['Strength'].default_value = strength
    bump.inputs['Distance'].default_value = .0003
    nt.links.new(tex.outputs['Fac'], bump.inputs['Height'])
    nt.links.new(bump.outputs['Normal'], nt.nodes['Principled BSDF'].inputs['Normal'])


def finish(obj, mat, category=3, parent=None):
    obj.data.materials.append(mat)
    obj.pass_index = category
    if parent:
        obj.parent = parent
    return obj


def box(name, center, size, mat, bevel=.003, category=3, parent=None):
    bpy.ops.mesh.primitive_cube_add(size=1, location=center)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel:
        mod = obj.modifiers.new('Manufactured rounded edges', 'BEVEL')
        mod.width = bevel
        mod.segments = 3
        normals = obj.modifiers.new('Weighted surface normals', 'WEIGHTED_NORMAL')
        normals.keep_sharp = True
    return finish(obj, mat, category, parent)


def cylinder(name, a, b, radius, mat, category=3):
    a, b = Vector(a), Vector(b)
    bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=radius, depth=(b-a).length, location=(a+b)/2)
    obj = bpy.context.object
    obj.name = name
    obj.rotation_euler = (b-a).to_track_quat('Z', 'Y').to_euler()
    bevel = obj.modifiers.new('Machined cylinder edge', 'BEVEL')
    bevel.width = min(radius * .12, .002)
    bevel.segments = 3
    obj.modifiers.new('Weighted normals', 'WEIGHTED_NORMAL')
    for p in obj.data.polygons:
        p.use_smooth = True
    return finish(obj, mat, category)


def frame_ring(name,width,height,inner_width,inner_height,front,back,mat,parent):
    """A manufactured extruded ring with a real opening, not an opaque card."""
    verts=[]
    for y in [front,back]:
        for w,h in [(width,height),(inner_width,inner_height)]:
            verts.extend([(-w/2,y,h/2),(w/2,y,h/2),(w/2,y,-h/2),(-w/2,y,-h/2)])
    faces=[]
    for i in range(4):
        j=(i+1)%4
        faces.extend([(i,i+4,j+4,j),(i+8,j+8,j+12,i+12),
                      (i,j,j+8,i+8),(i+4,i+12,j+12,j+4)])
    mesh=bpy.data.meshes.new(name);mesh.from_pydata(verts,[],faces);mesh.update()
    obj=bpy.data.objects.new(name,mesh);scene.collection.objects.link(obj)
    bevel=obj.modifiers.new('Machined bezel chamfer','BEVEL');bevel.width=.0008;bevel.segments=3
    obj.modifiers.new('Rigid frame weighted normals','WEIGHTED_NORMAL')
    return finish(obj,mat,3,parent)


def tube(name, points, radius, mat, category=3, cyclic=False):
    curve = bpy.data.curves.new(name, 'CURVE')
    curve.dimensions = '3D'
    curve.resolution_u = 2
    curve.bevel_depth = radius
    curve.bevel_resolution = 4
    spline = curve.splines.new('POLY')
    spline.points.add(len(points)-1)
    for p, co in zip(spline.points, points):
        p.co = (*co, 1)
    spline.use_cyclic_u = cyclic
    obj = bpy.data.objects.new(name, curve)
    scene.collection.objects.link(obj)
    return finish(obj, mat, category)


def slab(name, polygon, z, thickness, mat, category=3):
    points = [Vector((p[0], p[1], z)) for p in polygon]
    area = sum(points[i].x*points[(i+1)%len(points)].y-points[(i+1)%len(points)].x*points[i].y for i in range(len(points)))
    if area < 0:
        points.reverse()
    n = len(points)
    verts = [tuple(p-Vector((0,0,thickness))) for p in points] + [tuple(p) for p in points]
    faces = [tuple(reversed(range(n))), tuple(range(n,2*n))]
    faces += [(i,(i+1)%n,(i+1)%n+n,i+n) for i in range(n)]
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    scene.collection.objects.link(obj)
    mod = obj.modifiers.new('Polished solid edge', 'BEVEL')
    mod.width = min(thickness*.25, .003)
    mod.segments = 3
    obj.modifiers.new('Weighted normals', 'WEIGHTED_NORMAL')
    return finish(obj, mat, category)


# Reconstruct the current table outline as one real horizontal surface. Its
# wider rear wings are physical geometry, not an image-space trapezoid warp.
path = [('M',(278,1155)),('L',(2284,1155)),('C',(2295,1155,2303,1161,2316,1173)),
        ('L',(2490,1346)),('C',(2500,1360,2483,1379,2456,1380)),('L',(102,1380)),
        ('C',(72,1380,55,1369,68,1350)),('L',(247,1173)),('C',(260,1157,266,1155,278,1155))]
pixels = []
for command, values in path:
    if command in ('M','L'):
        current = Vector(values)
        pixels.append(tuple(current))
    else:
        a, b, end = Vector(values[:2]), Vector(values[2:4]), Vector(values[4:])
        start = current.copy()
        for j in range(1,25):
            t = j/24
            p = (1-t)**3*start+3*(1-t)**2*t*a+3*(1-t)*t*t*b+t**3*end
            pixels.append(tuple(p))
        current = end
outline = [on_plane(*p) for p in pixels]
slab('Solid smoked-glass tabletop', outline, TABLE_Z, .017, glass, 2)
center_y = sum(p.y for p in outline)/len(outline)
outer = [Vector((p.x*1.019, center_y+(p.y-center_y)*1.07, TABLE_Z-.013)) for p in outline]
slab('Graphite structural perimeter', outer, TABLE_Z-.015, .025, graphite)
tube('Continuous upper chrome lip', outer, .007, edge_chrome, cyclic=True)
tube('Satin lower edge rail', [(p.x,p.y,p.z-.021) for p in outer], .006, chrome, cyclic=True)
box('Central real desk support', (0,.48,.39), (.20,.31,.70), graphite, .055)
box('Pedestal polished front insert', (0,.315,.40), (.13,.012,.56), chrome, .02)
box('Floor foot', (0,.48,.035), (.64,.49,.05), graphite, .045)

# Real rectangular monitor bodies. All screens use the same camera; the outer
# pair wraps toward the seated eye and has its own yaw and pitch, not a shared H.
screens = []
monitor_defs = [('textmode',0,.64,.91,.43,0),
                ('projects',None,None,.688,.43,45),
                ('coming-soon',None,None,.688,.43,-45)]
for ident,x,y,width,height,angle in monitor_defs:
    theta = math.radians(angle)
    if x is None:
        side = -1 if angle>0 else 1
        # Adjacent bezel front edges meet on a common vertical hinge line.
        # All three screens stay rigid rectangles without wedge-shaped gaps.
        hinge=Vector((side*(.91+.025)/2,.64-.033,MONITOR_Z))
        local=Vector((-side*(width+.025)/2,-.033,0))
        offset=Euler((0,0,theta)).to_matrix() @ local
        x,y=hinge.x-offset.x,hinge.y-offset.y
    parent = bpy.data.objects.new('Monitor '+ident+' — rigid real-world pose', None)
    scene.collection.objects.link(parent)
    parent.location = (x,y,MONITOR_Z)
    parent.rotation_euler = (0,0,theta)
    box(ident+' graphite rear shell', (0,.004,0), (width+.032,.033,height+.032), graphite, .012, parent=parent)
    frame_ring(ident+' continuous chromium bezel',width+.025,height+.025,width+.006,height+.006,-.033,-.019,chrome,parent)
    frame_ring(ident+' recessed inner dark gasket',width+.007,height+.007,width,height,-.026,-.018,seam,parent)
    box(ident+' inset display glass', (0,-.019,0), (width,.002,height), black, .001, 10, parent=parent)
    bpy.context.view_layer.update()
    quad3d = [parent.matrix_world @ Vector(p) for p in [(-width/2,-.0202,height/2),(width/2,-.0202,height/2),(width/2,-.0202,-height/2),(-width/2,-.0202,-height/2)]]
    screens.append({'id':ident,'quad':[project(p) for p in quad3d], 'width':800,'height':420,
                    'world_corners':[list(p) for p in quad3d], 'pose':{'center':[x,y,MONITOR_Z],'yaw_degrees':angle,'top_tilt_degrees':0}})
    # Mounts are attached to the actual monitor rear and the actual glass plane.
    foot = Vector((0 if angle==0 else (-.80 if angle>0 else .80), .57, TABLE_Z+.003))
    target = parent.matrix_world @ Vector((0,.044,-.125))
    elbow = foot + Vector((0,0,.095))
    cylinder(ident+' mount foot', foot, foot+Vector((0,0,.018)), .052, chrome)
    cylinder(ident+' mount collar', foot+Vector((0,0,.018)), elbow, .025, chrome)
    if angle==0:
        rear_elbow=elbow+Vector((0,.06,0))
        cylinder('Central rear-offset elbow',elbow,rear_elbow,.022,chrome)
        elbow=rear_elbow
    cylinder(ident+' load-bearing arm', elbow, target, .022, chrome)
    cylinder(ident+' rear hinge', target-Vector((.026,0,0)), target+Vector((.026,0,0)), .03, graphite)
    for i in range(3):
        p=foot+Vector((math.cos(i*math.tau/3)*.036,math.sin(i*math.tau/3)*.036,.019))
        cylinder(ident+' recessed fastener', p, p+Vector((0,0,.0015)), .0035, graphite)

# Fixed vertical hinge columns join the outer monitors to the central structure.
# Their front bezel edges meet on the same line; no flexible/warped display.
for side in [-1,1]:
    x=side*(.91+.025)/2
    y=.64-.033+.022
    cylinder('Shared rigid monitor hinge column', (x,y,MONITOR_Z-.235),(x,y,MONITOR_Z+.235),.009,chrome)
    for dz in [-.15,.15]:
        cylinder('Machined hinge locking collar',(x,y,MONITOR_Z+dz-.012),(x,y,MONITOR_Z+dz+.012),.013,graphite)
    cylinder('Rear fixed bridge to central mount',(0,.70,MONITOR_Z-.13),(x,y+.022,MONITOR_Z-.13),.009,graphite)

# One textile pad, physically resting on the glass, with sewn edge.
pad_center = (.09,.25,TABLE_Z+.006)
box('Mousepad — rebuilt fine woven surface', pad_center, (1.25,.395,.007), rubber, .018, 4)
padpoly=[(-.535,.065),(.715,.065),(.715,.435),(-.535,.435)]
tube('Fine stitched mousepad border', [(x,y,TABLE_Z+.0102) for x,y in padpoly], .0007, graphite, 4, True)

keyboard = bpy.data.objects.new('Keyboard — true geometry and legible QWERTZ',None)
scene.collection.objects.link(keyboard)
keyboard.location=(-.08,.255,TABLE_Z+.021)
keyboard.rotation_euler=(math.radians(4),0,0)
box('Keyboard lower casing with full front thickness', (0,0,0), (.702,.225,.019), graphite, .009, 5, keyboard)
box('Keyboard upper deck', (0,0,.012), (.693,.218,.008), chrome, .006, 5, keyboard)
box('Keyboard dark switch plate', (0,0,.016), (.683,.209,.006), seam, .005, 5, keyboard)
font_path=Path('/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf')
font=bpy.data.fonts.load(str(font_path)) if font_path.exists() else None
u=.029


def key(label, x, y, units=1, row_height=1):
    box('Key '+label, (x,y,.027), (u*units-.003,u*row_height-.003,.018), keys, .003, 5, keyboard)
    box('Key top '+label, (x,y+.0007,.037), (u*units-.008,u*row_height-.008,.003), key_top, .002, 5, keyboard)
    if not label:
        return
    curve=bpy.data.curves.new('Readable legend '+label,'FONT')
    curve.body=label
    curve.align_x='CENTER'
    curve.align_y='CENTER'
    curve.size=.0063 if len(label)>2 else .0085
    curve.extrude=.00004
    if font:
        curve.font=font
    obj=bpy.data.objects.new('Legend '+label,curve)
    scene.collection.objects.link(obj)
    obj.location=(x,y,.039)
    finish(obj,violet,7,keyboard)


for c,label in enumerate(['Esc']+['F'+str(i) for i in range(1,13)]):
    key(label,-.319+c*.032,.084,row_height=.72)
rows=[[(s,1) for s in ['^','1','2','3','4','5','6','7','8','9','0','ß','´']]+[('←',2)],
      [('Tab',1.5)]+[(s,1) for s in 'QWERTZUIOPÜ+']+[('↵',1.5)],
      [('Caps',1.75)]+[(s,1) for s in 'ASDFGHJKLÖÄ#']+[('↵',1.25)],
      [('Shift',1.25)]+[(s,1) for s in '<YXCVBNM,.-']+[('Shift',2.75)],
      [('Strg',1.25),('Win',1.25),('Alt',1.25),('',6.25),('AltGr',1.25),('Fn',1.25),('Menu',1.25),('Strg',1.25)]]
for r,labels in enumerate(rows):
    cursor=-.334
    for label,units in labels:
        key(label,cursor+units*u/2,.051-r*.033,units)
        cursor+=units*u
for r,labels in enumerate([['Prt','Scr','Pau'],['Ins','Pos1','Bild↑'],['Entf','Ende','Bild↓']]):
    for c,label in enumerate(labels):
        key(label,.132+c*u,.084-r*.033,row_height=.72 if r==0 else 1)
key('↑',.161,-.048)
for c,label in enumerate(['←','↓','→']):
    key(label,.132+c*u,-.081)
for r,labels in enumerate([['Num','/','*','-'],['7','8','9','+'],['4','5','6',''],['1','2','3','↵'],['0','','.', '']]):
    for c,label in enumerate(labels):
        if label:
            if label in ['+','↵']:
                key(label,.239+c*u,.060-r*.033-.0165,row_height=2.14)
            elif label=='0':
                key(label,.239+u/2,.060-r*.033,2)
            else:
                key(label,.239+c*u,.060-r*.033)

# Clean mouse shell with real wheel, fine button split and bounded highlights.
bpy.ops.mesh.primitive_uv_sphere_add(segments=64,ring_count=32,location=(.50,.245,TABLE_Z+.030))
mouse=bpy.context.object
mouse.name='Mouse — smooth manufactured shell'
mouse.scale=(.039,.067,.026)
bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
for face in mouse.data.polygons:
    face.use_smooth=True
finish(mouse,graphite,6)
tube('Mouse button center split',[(.50,.306,TABLE_Z+.039),(.50,.283,TABLE_Z+.053),(.50,.261,TABLE_Z+.055)],.00065,seam,6)
cylinder('Mouse wheel',(.491,.278,TABLE_Z+.055),(.509,.278,TABLE_Z+.055),.008,seam,6)
for i in range(10):
    a=i*math.tau/10
    cylinder('Wheel tread',(.493,.278+math.cos(a)*.0082,TABLE_Z+.055+math.sin(a)*.0082),(.507,.278+math.cos(a)*.0082,TABLE_Z+.055+math.sin(a)*.0082),.00045,graphite,6)

# A geometrically coherent graphite/chrome tiled platform. Depth edges converge
# to the measured VP, independent of monitor yaw or table shape.
rng=random.Random(20261024)
for iy in range(17):
    for ix in range(-7,7):
        color=.029+rng.random()*.009
        mat=material('Graphite floor tile '+str(iy)+'/'+str(ix),(color,color*1.06,color*1.14),.76,.27+rng.random()*.025)
        box('Platform tile '+str(ix)+'/'+str(iy),((ix+.5)*.80,(iy+.5)*.80,-.016),(.797,.797,.025),mat,.0015,1)


def light(name,kind,location,energy,color,size,group):
    data=bpy.data.lights.new(name,kind)
    data.energy=energy
    data.color=color
    if kind=='AREA':
        data.shape='DISK'
        data.size=size
    else:
        data.shadow_soft_size=size
    obj=bpy.data.objects.new(name,data)
    scene.collection.objects.link(obj)
    obj.location=location
    obj.lightgroup=group
    if kind=='AREA':
        obj.rotation_euler=(Vector((0,.35,.8))-obj.location).to_track_quat('-Z','Y').to_euler()
    return obj


def source_world(u,v,distance):
    return CAM+(FORWARD+RIGHT*((u-CX)/F)+UP*((CY-v)/F))*distance

for group in ['Sun','Galaxy','Flare','Fill']:
    bpy.context.view_layer.lightgroups.add(name=group)
sun=light('Main spherical sun — projected actual sky position','POINT',source_world(499,312,6),1350,(1,.69,.38),.48,'Sun')
light('Coronal flare within solar sphere','POINT',sun.location+Vector((-.12,0,.18)),35,(1,.23,.06),.18,'Flare')
galaxy=light('Occasional violet-blue galaxy contribution','AREA',source_world(1771,650,7),85,(.31,.39,1),2.5,'Galaxy')
light('Soft neutral sky fill','AREA',(0,-1.4,2.6),95,(.76,.84,1),2.8,'Fill')
light('White grazing definition, no emissive orange strips','AREA',(2,-.5,1.9),45,(.85,.91,1),1.4,'Fill')

bpy.context.view_layer.update()
order=['projects','textmode','coming-soon']
screens.sort(key=lambda screen:order.index(screen['id']))
calibration={
    'canvas':[W,H], 'overscan_canvas':[OVERSCAN,H], 'crop_x':(OVERSCAN-W)//2,
    'method':'Single consistent pinhole camera; measured platform VP; physically modeled replacement objects',
    'platform_vanishing_point':list(VP), 'principal_point':[CX,CY], 'focal_pixels':F,
    'original_platform_reference_vp':list(MEASURED_VP),
    'monitor_setup':{'eye_above_center_m':CAM.z-MONITOR_Z,'outer_yaw_degrees':45,'front_view':True,'shared_vertical_hinges':True},
    'horizontal_fov_degrees':math.degrees(2*math.atan(W/(2*F))),
    'camera':{'location':list(CAM),'forward':list(FORWARD),'right':list(RIGHT),'up':list(UP),
              'height_m':CAM.z,'pitch_degrees':math.degrees(pitch),'yaw_degrees':math.degrees(yaw)},
    'assumptions':['Focal length and metric scale chosen explicitly; no claim of recovering a unique original camera.',
                   'Original floor VP about1280/721 retained as a reference. Explicit frontal POV5cm above monitor center overrides the initial approximate sketch calibration.',
                   'All desk, peripherals, monitor planes, mounts and floor are newly modeled in this same coordinate system.'],
    'screens':screens,
    'table_quad':[project(on_plane(u,v)) for u,v in [(278,1155),(2284,1155),(2490,1378),(68,1378)]],
    'table_outline':[project(p) for p in outline],
    'sun_world':list(sun.location),'sun_image':project(sun.location),
    'galaxy_world':list(galaxy.location),'galaxy_image':project(galaxy.location),
    'object_categories':{'1':'floor','2':'smoked glass','3':'hardware/mounts','4':'mousepad','5':'keyboard','6':'mouse','7':'legends','10':'live display aperture'},
}
(OUT/'camera.json').write_text(json.dumps(calibration,indent=2))

# One ray-traced render yields material masks and physically occluded solar /
# galactic contribution passes. Masks come from actual visible mesh surfaces.
view=bpy.context.view_layer
view.use_pass_object_index=True
view.update_render_passes()
scene.use_nodes=True
nt=scene.node_tree
nt.nodes.clear()
render=nt.nodes.new('CompositorNodeRLayers')
print('AVAILABLE RENDER PASSES', [socket.name for socket in render.outputs], flush=True)
file=nt.nodes.new('CompositorNodeOutputFile')
file.base_path=str(RAW)
file.format.file_format='PNG'
file.format.color_mode='RGBA'
file.format.color_depth='8'
file.format.compression=30
file.file_slots.clear()


def output(name,socket):
    file.file_slots.new(name)
    file.file_slots[-1].path=name
    nt.links.new(socket,file.inputs[name])


output('combined',render.outputs['Image'])
floor_mask=nt.nodes.new('CompositorNodeIDMask')
floor_mask.index=1
floor_mask.use_antialiasing=True
nt.links.new(render.outputs['IndexOB'],floor_mask.inputs[0])
for name,index in [('floor',1),('glass-mask',2),('pad-mask',4),('keyboard-mask',5),('mouse-mask',6),('legends-mask',7),('display-mask',10)]:
    mask=nt.nodes.new('CompositorNodeIDMask')
    mask.index=index
    mask.use_antialiasing=True
    nt.links.new(render.outputs['IndexOB'],mask.inputs[0])
    alpha=nt.nodes.new('CompositorNodeSetAlpha')
    alpha.mode='REPLACE_ALPHA'
    if name=='floor':
        nt.links.new(render.outputs['Image'],alpha.inputs['Image'])
    else:
        alpha.inputs['Image'].default_value=(1,1,1,1)
    nt.links.new(mask.outputs[0],alpha.inputs['Alpha'])
    output(name,alpha.outputs[0])
inverse=nt.nodes.new('CompositorNodeMath')
inverse.operation='SUBTRACT'
inverse.inputs[0].default_value=1
nt.links.new(floor_mask.outputs[0],inverse.inputs[1])
multiply=nt.nodes.new('CompositorNodeMath')
multiply.operation='MULTIPLY'
nt.links.new(inverse.outputs[0],multiply.inputs[0])
nt.links.new(render.outputs['Alpha'],multiply.inputs[1])
fore=nt.nodes.new('CompositorNodeSetAlpha')
fore.mode='REPLACE_ALPHA'
nt.links.new(render.outputs['Image'],fore.inputs['Image'])
nt.links.new(multiply.outputs[0],fore.inputs['Alpha'])
output('foreground',fore.outputs[0])
for name in ['Sun','Galaxy','Flare']:
    socket=render.outputs.get('Combined_'+name)
    if socket:
        output(name.lower(),socket)
scene.render.filepath=str(RAW/'beauty.png')
bpy.context.preferences.filepaths.save_version=0
bpy.ops.wm.save_as_mainfile(filepath=str(RAW/'seated-workstation.blend'))
print('CAMERA',json.dumps(calibration['camera']),flush=True)
print('DISPLAY QUADS',json.dumps([{s['id']:s['quad']} for s in screens]),flush=True)
bpy.ops.render.render(write_still=True)
# A small separate beauty pass gives the weak coronal contribution a denoised
# image without relying on the compositor's low-energy light-group PNG writer.
scene.use_nodes=False
scene.render.resolution_percentage=50
scene.cycles.samples=16
scene.world.node_tree.nodes['Background'].inputs['Strength'].default_value=0
for obj in bpy.data.objects:
    if obj.type=='LIGHT' and obj.lightgroup!='Flare':
        obj.data.energy=0
scene.render.filepath=str(RAW/'flare-resolved.png')
bpy.ops.render.render(write_still=True)
print('RENDER COMPLETE',str(RAW),flush=True)
