"""Photo-based gaming mouse, executed in the common Blender scene namespace.

Reference: Patrick's IMG_4156–4159, 24 October 2026. No photo billboard.
Separate rear palm, floating switch plates, centre chassis, ribbed wheel,
side controls and grip grooves. All dimensions are metres in the shared scene.
"""
mouse_root=bpy.data.objects.new('Reference gaming mouse assembly',None)
scene.collection.objects.link(mouse_root)
mouse_root.location=(.50,.245,PAD_TOP)
mouse_root.rotation_euler.z=math.radians(-10)
mouse_mat=material('Reference mouse fine matte graphite polymer',(.028,.031,.035),.05,.43)
mouse_trim=material('Reference mouse satin gunmetal chassis',(.10,.115,.125),.65,.29)
mouse_grip=material('Reference mouse rubber grip',(.009,.011,.014),0,.69)
mouse_logo=material('Reference mouse soft violet G marking',(.55,.15,.85),0,.4,emission=1.9)

def mouse_mesh(name,vertices,polygons,mat,smooth=True,thickness=0):
 mesh=bpy.data.meshes.new(name);mesh.from_pydata(vertices,[],polygons);mesh.update()
 obj=bpy.data.objects.new(name,mesh);scene.collection.objects.link(obj)
 for p in mesh.polygons:p.use_smooth=smooth
 if thickness:
  solid=obj.modifiers.new('Molded panel thickness','SOLIDIFY');solid.thickness=thickness
  bevel=obj.modifiers.new('Fine panel edge','BEVEL');bevel.width=.00045;bevel.segments=3
 return finish(obj,mat,6,mouse_root)

def mouse_tube(name,points,radius,mat):
 obj=tube(name,points,radius,mat,6);obj.parent=mouse_root;return obj

def mouse_cylinder(name,a,b,radius,mat):
 obj=cylinder(name,a,b,radius,mat,6);obj.parent=mouse_root;return obj

# Angular lower chassis; its flat underside sits directly on the pad.
profile=[(-.064,.019,.009),(-.057,.030,.016),(-.040,.035,.024),(-.015,.036,.029),(.010,.033,.026),(.040,.034,.020),(.062,.029,.012),(.066,.021,.008)]
verts=[];faces=[];N=48
for y,width,height in profile:
 for i in range(N):
  a=i*math.tau/N
  verts.append((width*math.cos(a),y,max(0,height/2+height/2*math.sin(a))))
for j in range(len(profile)-1):
 for i in range(N):faces.append((j*N+i,j*N+(i+1)%N,(j+1)*N+(i+1)%N,(j+1)*N+i))
faces.extend([tuple(reversed(range(N))),tuple(range((len(profile)-1)*N,len(profile)*N))])
mouse_mesh('Grounded tapered rubber lower body',verts,faces,mouse_grip)

# Broad raised rear palm, with the distinctive deep notch at the centre spine.
def palm_z(x,y):
 return .010+.032*max(0,1-(x/.038)**2)**.55*max(0,1-((y+.015)/.049)**2)**.48
verts=[];faces=[];NX=32;NY=32
for j in range(NY+1):
 t=j/NY
 for i in range(NX+1):
  u=2*i/NX-1
  yy=-.064+t*(.050+.024*abs(u)**.7)
  width=.036*(.60+.40*math.sin(math.pi*min(1,t*1.1)/2))
  xx=u*width
  verts.append((xx,yy,palm_z(xx,yy)))
for j in range(NY):
 for i in range(NX):
  a=j*(NX+1)+i;faces.append((a,a+1,a+NX+2,a+NX+1))
mouse_mesh('Arched rear palm shell with central cutout',verts,faces,mouse_mat,thickness=.0015)

# Two distinct angular switch plates, separated from the exposed centre spine.
for side in [-1,1]:
 verts=[];faces=[];NX=12;NY=24
 for j in range(NY+1):
  t=j/NY;yy=.013+.050*t
  for i in range(NX+1):
   u=i/NX;xx=side*(.007+u*(.026-.003*t))
   z=.030-.012*t+.004*math.sin(math.pi*u)-.004*u*u
   verts.append((xx,yy-.006*u*(1-t),z))
 for j in range(NY):
  for i in range(NX):
   a=j*(NX+1)+i;f=(a,a+1,a+NX+2,a+NX+1);faces.append(f if side==1 else tuple(reversed(f)))
 mouse_mesh(('Left' if side==-1 else 'Right')+' independent main switch plate',verts,faces,mouse_mat,thickness=.0017)
 box('Side thumb control '+str(side),(side*.033,-.002,.021),(.003,.031,.006),mouse_mat,.0017,6,mouse_root)
 for i in range(9):
  yy=-.048+i*.0045
  mouse_tube('Recessed diagonal side grip groove',[(side*.031,yy,.007),(side*.034,yy+.007,.017)],.00032,seam)
 # Fine silver nose wing visible beneath the main buttons.
 mouse_mesh('Angular nose undercut '+str(side),[(side*.013,.066,.006),(side*.030,.061,.008),(side*.035,.040,.008),(side*.032,.036,.009)],[(0,1,2,3)],mouse_trim,False,.001)

box('Exposed central structural spine',(0,.036,.020),(.012,.065,.005),mouse_trim,.0016,6,mouse_root)
box('Wheel recessed black socket',(0,.040,.025),(.015,.029,.004),seam,.003,6,mouse_root)
mouse_cylinder('Wheel satin metal axle',(-.0063,.040,.027),(.0063,.040,.027),.009,mouse_trim)
mouse_cylinder('Wheel broad rubber tread',(-.0047,.040,.027),(.0047,.040,.027),.0102,mouse_grip)
for i in range(24):
 a=i*math.tau/24
 mouse_cylinder('Wheel raised rib',(-.0047,.040+math.cos(a)*.0103,.027+math.sin(a)*.0103),(.0047,.040+math.cos(a)*.0103,.027+math.sin(a)*.0103),.00055,mouse_mat)
box('Wheel mode switch',(0,.019,.030),(.008,.008,.003),mouse_mat,.001,6,mouse_root)
for side in [-1,1]:
 mouse_mesh('Triangular DPI selector '+str(side),[(side*.001,.003,.032),(side*.006,.001,.032),(side*.005,.011,.032)],[(0,1,2)],mouse_mat,False,.0015)
for side in [-1,1]:
 for i in range(3):
  x=side*(.011+i*.006)
  points=[(x,y,palm_z(x,y)+.0001) for y in [-.060,-.053,-.046]]
  mouse_tube('Rear palm inset seam',points,.00023,seam)

# The illuminated G marking follows the actual crown surface.
points=[]
for i in range(33):
 a=math.radians(45+i*270/32);x=.0058*math.cos(a);y=-.031+.007*math.sin(a)
 points.append((x,y,palm_z(x,y)+.0004))
mouse_tube('Violet G arc',points,.00075,mouse_logo)
mouse_tube('Violet G crossbar',[(.006,-.031,palm_z(.006,-.031)+.0005),(.001,-.031,palm_z(.001,-.031)+.0005)],.00075,mouse_logo)
mouse_tube('Violet G vertical',[(.006,-.031,palm_z(.006,-.031)+.0005),(.006,-.035,palm_z(.006,-.035)+.0005)],.00075,mouse_logo)
