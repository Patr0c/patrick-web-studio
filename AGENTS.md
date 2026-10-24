# Patrick — Web Redesign Studio

Read DESIGN_SYSTEM.md and PROJECT_NOTES.md before changes. Continue the current
immersive space portfolio; never replace it with a generic landing page or restore
obsolete variants without Patrick's request. Preserve the latest development work.

- Laser green: #19E50F / #23D92A, light core #39FF14, dark #0E8F19.
  Increase core brightness/opacity, not glow radius. DIGITAL stays clear white;
  REWORK keeps its dark saturated green outline. Solar frames/sun stay warm orange.
- Chosen display typeface: Archivo. Body: Manrope. Labels: DM Mono.
  No font picker, font preview query parameters, or selection prevention on text.
- Keep sun, seated close-up workstation without chair, draggable comparison (50/50 on double-click), all three project recordings,
  category wheels, and nine concepts. No animated flames on windows.
- Galaxy artwork and fine star film share one rotating parent. Background stars
  stay fixed. Never stretch star canvases or add continuous JS repaint loops.
- Recordings have real posters, play only on mouse hover, pause immediately on
  leave/offscreen/hidden tab, and reset after 10 seconds outside their card.
- Work on a separate branch based on the newest development commit. Commit/push
  to preview only. Never merge/push main or deploy production without approval.
- Verify dependencies before deleting files. Git preserves historical designs.
- Check local references, real browser rendering at desktop/mobile sizes, slider
  keyboard/drag behavior, all nine concepts, playback and page visibility.
  State browser/network testing limitations honestly in PROJECT_NOTES.md.

- First scene is full width: live animated DIGITAL REWORK in the left monitor,
  hero copy in the right monitor. Open on the complete new scene; keep the
  comparison available. Preserve the sections below the scene.

- Current smoked-glass desk has three flat main screens. Keep all outer desk
  edges fully visible with small side gaps; no skew on the live screen content.

- Terminal hardware lighting is white; orange only as fine exterior solar rim
  reflections. Keep the original three monitor supports. The native desk canvas ends at the front desk edge, anchored to the hero bottom.
- Center monitor: full-width flowing green/white ASCII, no split or extension UI.
  Four auxiliary displays: three existing hover recordings, fourth elegant contact
  preview. Matrix only on the darkened, alpha-masked mousepad. Pause continuous
  effects offscreen/hidden/reduced motion/saveData. Three native physical buttons
  provide press feedback only; destinations await Patrick’s instructions.
- Current screenshot layout: centered larger top nav, sun at 112px desktop, smaller
  desk bottom-aligned. Platform source scale unchanged; crop upper 10% of its
  visible length. Galaxy behind platform; narrow galaxy-colored edge beam.

- Active source: Tisch einzelteile(1).ora, 1949×826, 16 named layers in assets/desk/.
  Original PNG bytes/offsets archived; only the explicitly authorized separate
  keyboard surface retouch and sharp lettering replace their working overlays.
  Keep the new three-monitor smoked-glass desk; the sketch shows old hardware
  only to explain composition. See docs/smoked-glass-desk.md.

## Latest user override — 23.10.2026 Curved Matrix Scene

Active source is now Digital-Rework-Zubehoer-v3(1).xcf,2560×1440, assets/scene/. User explicitly authorizes repairing/regenerating desk, frames and screen faces to the current perspective. Keep original current accessory positions. Prior flat-screen/1949×826/four-aux-display rules above are superseded for this hero. Left main monitor cycles the3 real recordings, middle shows smoother flowing ASCII/pixel patterns, right COMING SOON – Ihr Projekt. Table matrix waves stay on actual table alpha, keyboard rain glows only on lettering. Sun rotation0.6×; galaxy500s desktop/600s mobile. Subtle dust and individual fixed-star glints; main warm light follows actual sun, occasional galaxy light pulses. Existing sections/concepts and preview-only publishing rule remain. See docs/curved-matrix-scene.md.

Latest user override: galaxy static (dust registered, no rotation), sun0.42×. Matrix only inset smoked glass, never metal frame or mousepad; script scripts/build_scene_masks.py. Three native controls hidden, assets retained. Left monitor poster carousel remains; video only on pointer hover, immediate pause on leave, reset after10s. Focus/touch/auto-selection never start playback.

Current accessory override: mousepad, keyboard + lettering/rain, mouse + wheel all shifted -12 native y pixels. Keep source_position metadata; working geometry/HTML/masks must agree. Matrix also covers rear glass strip, glyph/wave lengths and flow speed1.2×.

Material/lighting override: hardware base is neutral chrome via non-destructive grayscale; all warmth comes from external solar reflections. scene-lighting.js shares the existing scene RAF, follows sun-video time/color and actual mobile/desktop source. Exact pad-alpha receiver for keyboard/mouse contact + cast shadows; no independent wheel shadow. Keep screen faces excluded and hidden/offscreen/reduced-motion guards.

Latest override: separate pixel-registered tabletop.webp / hardware-structure.webp, exact source-alpha sum, masks from scripts/build_scene_masks.py. Matrix keeps16 glyphs but long vertical falling plumes, +15% tight core, no lateral waves. No cone/ring rays or fixed tile glow. One bounded cached reflection field, sphere source, corona-synced red/orange glints. Sun slow0.42× is baked at60fps: playbackRate MUST be1 for new smooth assets.33.5s corona is premultiplied H.264 at60fps. Own solar composition outside native stage retains exact338/151/322 desktop geometry. Preserve hover-only recordings, paused galaxy and hidden controls.

Latest user override: tabletop matrix projected FLAT onto glass again; preserve latest strand length/brightness/tight glow and current mask. Left HRService static initial poster, manual click selection only, never timed rotation; recordings remain hover-only. Middle uses uploaded detective-board preview, right keeps ASCII flow. No large top navigation. DIGITAL REWORK30% smaller, static without kinetic class/effect; remove hero prose, flow caption and project kicker box. Preserve sun/media/materials and sections below.

Latest matrix override: ignore last two external matrix references. Straight continuous ribbons on the actual glass homography,302 columns,20/24 occupied slots each; permanently visible base plus broad moving brightness wave. No lateral bending, no intermittent plume field. Cached periodic strips, original mask/glyphs/color/gain and lifecycle guards. More than50% visible-glass glyph-cell coverage required; measured82.7–83.8% across241 phases.

Latest matrix override: discard the50% coverage requirement and dense base carpet. Separate straight trails with natural gaps, stable glyphs, soft tails/heads and complete exit before reset. Preserve glass projection/mask,302 trails, colors, brightness gain and lifecycle guards. No coverage quota.

Latest matrix override: use supplied fullscreen reference recording as native H.264 table video. Preserve actual glyphs/motion/falloff;110% horizontal density baked into1408×720 media (mobile704×360), project via table_quad2400×1350, exact glass mask unchanged. Remove simulated glyph painter; preserve lifecycle guards and lighting RAF. No arbitrary glow/color/gain changes. No50% coverage quota. See scripts/build_matrix_reference.py.

Latest override: matrix hue matches #19E50F via sRGB color-only filter; keyboard violet #A855F7 with NO glow/drop-shadow radius. Villa preview on RIGHT main screen, left manual chooser HRService/Wagner, center detective image. Remove active ASCII monitor. Full desk grid fits with side/bottom clearance. Comparison slider, beam, two labels and help hidden; comparison disabled, viewport sizing retained. Keep recordings hover-only with10s reset and scene lifecycle.

Latest override: remove keyboard raindrop animation completely. Constant violet masked lettering only, no SVG rings/keyRain or glow radius. Platform is a separate full-width scene-floor sibling of the inset desk stage. Preserve original aspect ratio and bottom alignment. NO floor edge fades/masks: the former fade was rejected and removed. Never constrain the floor to the smaller desk grid or regenerate original assets.

Latest override: monitor frames, mounts and three live screen faces share scene-monitor-assembly projective transform; upper reference y521 is5% wider/60px higher, attachment line y1150 fixed. Original bitmaps untouched; complementary hardware clips at1150. Keep tabletop/accessories/full-width floor unchanged. Rebuild monitor-reflection-mask and monitor_perspective geometry via scripts/build_monitor_perspective.py AFTER base mask rebuilds.

Latest mobile stability override:≤760px uses source-pixel1280×720 composite assets/scene/mobile/hardware.webp, final screen quads directly, no nested assembly transform or runtime SVG color/shadow filters. Preserve same perspective/design, continuous green matrix and solar videos. Desktop original layers unchanged. Rebuild mobile source assets via scripts/build_mobile_scene.py after base mask/perspective rebuild. Do not claim real-iPhone crash resolved without an actual Safari test.

Latest user override —24.10.2026 common seated camera: user explicitly authorizes
newly modeling ALL objects, including table, floor, pad, keyboard, mouse, three
monitor bodies and mounts, with a single coherent camera and rebuilt shading.
Active calibration is assets/scene/seated/camera.json; build offline with
scripts/render_seated_workstation.py (Blender4.2), then
scripts/package_seated_workstation.py. This supersedes source-pixel-only geometry
and the shared upper-monitor image warp. Archived GIMP artwork stays unchanged.
Live monitor quads and visible-glass Matrix mask are exported from the real3D
camera. Floor overscan MUST share the desk pixel scale, never independently stretch
to viewport width. PBR sunlight/galaxy passes replace synthetic gradient lighting
and duplicate SVG shadows. No runtime3D engine, no active physical buttons.
Preserve static galaxy, slow sun, violet static legends, hover-only recordings,
manual left-project chooser, detective center, Villa right, and preview-only rule.

Latest refinement24.10.2026: all monitor frames stay rigid. Adjacent bezel fronts
meet at shared vertical3D hinge lines, all top tilt0° (no wedge-shaped seams).
Desk and matching floor/light layers finish at hero bottom0, without bottom gap.
Galaxy rotates again at85% of its LAST active speed500s desktop/600s mobile:
588.235294s/705.882353s. Dust follows the galaxy; individually twinkling fixed-sky
stars remain independent. Preserve tab/offscreen/reduced-motion/data-saver guards.

Latest explicit camera override: eye height1.20m, middle-monitor center1.15m
(exactly5cm difference), frontal center view, yaw0, pitchatan(.05/1.87).
Outer monitors±45°, rigid shared vertical hinge columns, rear fixed bridges.
Principal point1280/785; updated floor VP1280/738.20856 follows this camera.
Original measured VP1280/721 is a historical guide, not the active constraint.
Monitor bezels are extruded rings with real openings and chamfers; display glass
is recessed13mm behind the bezel face. Full casing depth53.5mm, not flat cards.
