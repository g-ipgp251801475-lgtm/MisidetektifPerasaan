"""Verify real required MP3s locally; optionally verify published file bytes.
No speech or test tones are generated. Requires ffprobe (FFmpeg) for decoding checks.
"""
from pathlib import Path
import argparse, json, shutil, subprocess, urllib.request, urllib.parse
root = Path(__file__).resolve().parent.parent
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--base-url',help='Published static-site root ending in /')
args=parser.parse_args()
entries=json.loads((root/'assets/audio/AVAILABILITY.json').read_text())
errors=[]
for entry in entries:
    path=root/'assets/audio'/entry['filename']
    if not path.is_file():
        if entry['required_narration']:errors.append('MISSING: '+entry['filename'])
        continue
    if not entry['available']:errors.append('UNREGISTERED: '+entry['filename']+' — run configure-audio.py')
    if not shutil.which('ffprobe'):
        errors.append('ffprobe is required to verify MP3 decoding');break
    result=subprocess.run(['ffprobe','-v','error','-select_streams','a:0','-show_entries','stream=codec_name,duration','-of','json',str(path)],capture_output=True,text=True)
    if result.returncode or not any(s.get('codec_name')=='mp3' for s in json.loads(result.stdout or '{}').get('streams',[])):
        errors.append('INVALID MP3: '+entry['filename']);continue
    if args.base_url:
        relative=urllib.parse.quote('assets/audio/'+entry['filename'])
        url=urllib.parse.urljoin(args.base_url.rstrip('/')+'/',relative)
        try:
            with urllib.request.urlopen(url,timeout=25) as response:
                if response.status!=200 or response.read()!=path.read_bytes():errors.append('PUBLISHED FILE MISMATCH: '+entry['filename'])
        except Exception as exc:errors.append('PUBLISHED FILE ERROR: '+entry['filename']+' ('+type(exc).__name__+')')
    print('CHECKED:',entry['filename'])
if errors:
    print('\n'.join(errors));raise SystemExit(1)
print('All six required MP3s decoded'+(' and published bytes matched.' if args.base_url else '.'))
