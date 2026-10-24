# Reproducible seated workstation

## Build

Use Blender4.2 on a machine with Cycles CPU support:

```
blender -b -t 8 --python scripts/render_seated_workstation.py
python scripts/package_seated_workstation.py
python scripts/check_site.py
```

`-- --draft` produces a40%/12sample inspection render; packaging intentionally
rejects drafts. Final output uses4096×1440,48samples, denoising and AgX. Raw
compositing passes and the editable `.blend` are placed in `/tmp/patrick-seated-render/`;
only optimized WebP and camera metadata are deployed. The script reproduces the
model without committing a Blender binary or requiring a runtime3D engine.

## Calibration and constraints

Original platform diagonals gave a reference VP near1280/721. The user’s
explicit viewing geometry now determines the new platform VP1280/738.20856. The latest explicit user setup overrides the approximate purple guide:
frontal center view, eye height exactly5cm above monitor center, outer yaw±45°.
Principal point1280/785. Focal1750px and metric scale are chosen; a modified2D composite
does not uniquely determine an original camera. All new objects use this SAME
explicit camera. Table points are ray/plane intersections at height.75m.

Camera center(0,-1.23,1.20m), pitch1.531608°, yaw0°. Three monitor faces
are real rigid planes; the outer pair is turned45° toward the sitter. Original
screenshots are positioning guides, never rendered into the page. No duplicated
HR screenshots or colored markup is published.

## Exported layers

| File | Native role |
| --- | --- |
| workstation.webp |4096×1440 overscan object beauty, transparency, baked shadows/reflections |
| platform.webp |4096px overscan, cropped above first visible floor pixel |
| glass-mask.webp |Visible glass surface ID; automatic occlusion by every peripheral |
| pad/keyboard/mouse-mask.webp |Exact visible geometry masks retained for later work |
| light-sun/flare/galaxy.webp |Ray-traced light groups, live displays excluded |
| camera.json |Camera basis, world poses, projected screen/table corners, asset hashes |

`-mobile.webp` variants use half resolution. Light groups use2048px (mobile1024px); the object beauty uses4096px overscan (mobile2048px), positioned at native x−768. The weak flare contribution uses a separate16sample half-resolution denoised pass. Floor/light dimensions are scaled
with the same CSS scene unit and bottom anchor, not independently stretched.
This is essential: independent full-width scaling changes the floor's horizon.
The floor render overscans beyond the inset desk so its sides cover normal
widescreen viewports without blurred/faded joins. Very extreme aspect ratios
beyond the4096/native2560 overscan are not independently verified.

The original `assets/scene/geometry.json` and source artwork remain archived.
Do not run the old GIMP mask/perspective packaging scripts over the new HTML.

## Existing behavior retained

HRService is the initial LEFT poster. Clicks select Wagner, hover alone plays
recordings; immediate pause on leaving and reset after10seconds. CENTER retains
the detective board, RIGHT retains Villa Schwalbe. No automatic project cycling.
Matrix remains flat on glass. Galaxy rotates at85% of its last active speed; existing slow solar media is
unchanged. Controls remain hidden. The shared scene animation lifecycle pauses
out of view, on hidden tabs, reduced motion and data saver.

## Final physical constraints supplied by Patrick

Eyes1.20m, center monitor1.15m, straight center view, yaw0. Camera looks down
atan(.05/1.87) to the center. Outer screens are exactly±45°, joined on common
vertical hinge columns and fixed rear bridges. All front bezel edge joins are
validated in world coordinates to10µm tolerance. Each display remains a rectangle;
its apparent trapezoid comes entirely from the camera.

The chrome bezel is an extruded ring with a real opening, not a face painted on
an opaque card. Display glass is13mm behind its face; casing is53.5mm deep.
All side walls, chamfers, frame recesses and their shadows/reflections are modeled.
The native desk, floor and light layers end at the hero bottom with0px clearance.

Live display apertures come from visible object-ID10. Foreground alpha subtracts actual floor/display coverage; live HTML sits below the manufactured frames, so their inner walls occlude it correctly. Foreground overscan preserves outer45° case sides beyond the nominal grid while the viewport side clearance keeps them fully visible.


## Refinement build
Run `python scripts/prepare_accessory_materials.py` before Blender. Archived
GIMP accessory pixels are rectified into physical top planes; camera-invisible
proxies retain their contact/cast shadows. Keyboard lower case remains visible.
Mouse is a registered photographic cutout, not a new sculpted mesh. The blue
Galaxy light is disabled in the actual render. Surface textures are deterministic
local derivatives ignored by Git; originals and preparation script are retained.
The solar platform field projects world z0 corners through this same camera.
See PROJECT_NOTES.md for corona sampling and start sequence details.
