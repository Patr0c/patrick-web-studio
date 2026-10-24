"""Keep the separate iPhone entry identical to the main source and camera."""
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
s=(ROOT/'index.html').read_text()
s=s.replace('<title>Patrick / Digital Rework</title>','<title>Patrick / Digital Rework — iPhone</title>')
s=s.replace('</head>','<link rel="stylesheet" href="assets/css/iphone.css"></head>')
s=s.replace('class="theme-star studio-final"','class="theme-star studio-final iphone-edition"')
(ROOT/'iphone.html').write_text(s)
print('Built iPhone edition from the current verified main source')
