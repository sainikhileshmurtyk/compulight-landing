"""Package allowlisted website assets and a separate GitHub source bundle."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parent.parent
public = root / 'public'
files = [
    'index.html', 'styles.css', 'contact.js', '_headers',
    'assets/compulight-symbol.svg',
    'assets/fonts/space-grotesk-500.woff2',
    'assets/fonts/space-grotesk-700.woff2',
    'assets/fonts/inter-regular.ttf',
    'assets/fonts/space-grotesk-OFL.txt', 'assets/fonts/inter-OFL.txt',
]
if 'key: [], value: []' in (public / 'contact.js').read_text():
    raise SystemExit('Configure contact first: node tools/set-contact.mjs')
for name in files:
    if not (public / name).is_file():
        raise SystemExit(f'Missing required file: {name}')
output = root / 'compulight-pages.zip'
with ZipFile(output, 'w', ZIP_DEFLATED) as archive:
    for name in files:
        archive.write(public / name, name)
print(f'Ready: {output} ({output.stat().st_size:,} bytes, {len(files)} files)')

source_files = ['README.md', '.gitignore', 'tools/set-contact.mjs', 'tools/package.py']
source_output = root / 'compulight-github.zip'
with ZipFile(source_output, 'w', ZIP_DEFLATED) as archive:
    for name in files:
        archive.write(public / name, f'public/{name}')
    for name in source_files:
        archive.write(root / name, name)
print(f'Ready: {source_output} ({source_output.stat().st_size:,} bytes, {len(files) + len(source_files)} files)')
