"""Version root CSS/JS URLs by content to prevent stale release files mixing.
Run after updating scripts, stylesheet or the audio manifest, before publishing.
"""
from pathlib import Path
import hashlib,re
root=Path(__file__).resolve().parent.parent
page=root/'index.html';html=page.read_text()
for name in ['style.css','image-map.js','audio-assets.js','audio.js','script.js']:
    digest=hashlib.sha256((root/name).read_bytes()).hexdigest()[:12]
    html,count=re.subn(r'((?:src|href)="'+re.escape(name)+r')(?:\?[^"<>]*)?"',lambda m:m[1]+'?v='+digest+'"',html)
    assert count==1,(name,count)
    print(name,digest)
page.write_text(html)
