"""Build the standalone index.html from the editable source files."""
from pathlib import Path
import base64,json
p=Path(__file__).parent
assets=p/'.buildassets'
def font(name): return base64.b64encode((assets/name).read_bytes()).decode('ascii')
latin='U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD'
ext='U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C4,U+2113,U+2C60-2C7F,U+A720-A7FF'
font_css='\n'.join([
 f"@font-face{{font-family:'DM Sans';font-style:normal;font-weight:100 900;font-display:swap;src:url(data:font/woff2;base64,{font('dmsans-latin.woff2')}) format('woff2');unicode-range:{latin}}}",
 f"@font-face{{font-family:'DM Sans';font-style:normal;font-weight:100 900;font-display:swap;src:url(data:font/woff2;base64,{font('dmsans-ext.woff2')}) format('woff2');unicode-range:{ext}}}",
 f"@font-face{{font-family:'DM Serif Display';font-style:italic;font-weight:400;font-display:swap;src:url(data:font/woff2;base64,{font('dmserif-latin.woff2')}) format('woff2');unicode-range:{latin}}}",
 f"@font-face{{font-family:'DM Serif Display';font-style:italic;font-weight:400;font-display:swap;src:url(data:font/woff2;base64,{font('dmserif-ext.woff2')}) format('woff2');unicode-range:{ext}}}"])
def inline_json(path):
    try:
        value=json.loads(path.read_text(encoding='utf8'))
    except (OSError,json.JSONDecodeError):
        if path.name!='data.json':
            raise
        value={}
    return json.dumps(value,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')
template=(p/'index.template.html').read_text(encoding='utf8')
parts={'/*__FONT_CSS__*/':font_css,'/*__SITE_CSS__*/':(p/'site.css').read_text(encoding='utf8'),'/*__EMBEDDED_JSON__*/':inline_json(p/'data.json'),'/*__COVERS_JSON__*/':inline_json(assets/'covers.json'),'/*__APP_JS__*/':(p/'app.js').read_text(encoding='utf8').replace('</script','<\\/script')}
for marker,value in parts.items():
    assert template.count(marker)==1,marker
    template=template.replace(marker,value)
(p/'index.html').write_text(template,encoding='utf8')
print('Built',p/'index.html',f"({(p/'index.html').stat().st_size:,} bytes)")
