from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT=Path(__file__).resolve().parents[1]/"docs"/"brand-exploration"/"selected-logo"
OUT.mkdir(parents=True,exist_ok=True)
PAPER="#F7F5EF"; INK="#293B36"; SAGE="#78927B"; CLAY="#B2794B"; MUTED="#65766C"

def font(size,bold=False):
    try:return ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",size)
    except OSError:return ImageFont.load_default()

def bezier(p0,p1,p2,p3,n=32):
    out=[]
    for i in range(n+1):
        t=i/n;u=1-t
        out.append((u**3*p0[0]+3*u*u*t*p1[0]+3*u*t*t*p2[0]+t**3*p3[0],u**3*p0[1]+3*u*u*t*p1[1]+3*u*t*t*p2[1]+t**3*p3[1]))
    return out

def mark_points(which):
    if which=="voice":
        return [(bezier((14,48),(17,27),(22,69),(28,48),24),SAGE),(bezier((28,48),(34,20),(40,77),(46,48),24),INK),(bezier((46,48),(51,37),(55,40),(60,43),18),INK),([(60,43),(79,43)],INK),([(60,54),(72,54)],INK),([(60,65),(76,65)],INK)],[(82,43,CLAY)]
    return [([(15,27),(36,27)],INK),([(15,38),(36,38)],INK),(bezier((36,27),(48,27),(47,48),(61,50),24),INK),(bezier((36,38),(47,40),(49,61),(61,62),24),SAGE),([(61,50),(85,50)],INK),([(61,62),(79,62)],SAGE)],[(85,50,CLAY)]

def render_icon(draw,which,origin,size):
    x,y=origin;scale=size/100;strokes,dots=mark_points(which)
    for pts,color in strokes:
        coords=[(x+a*scale,y+b*scale) for a,b in pts]
        draw.line(coords,fill=color,width=max(2,int(5.5*scale)),joint="curve")
    for cx,cy,color in dots:
        r=6.5*scale;draw.ellipse((x+(cx*scale)-r,y+(cy*scale)-r,x+(cx*scale)+r,y+(cy*scale)+r),fill=color)

def svg_paths(which):
    strokes,dots=mark_points(which);parts=[]
    for pts,color in strokes:
        d=f"M {pts[0][0]:g} {pts[0][1]:g} "+" L ".join(f"{px:g} {py:g}" for px,py in pts[1:])
        parts.append(f'<path d="{d}" fill="none" stroke="{color}" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>')
    parts += [f'<circle cx="{cx}" cy="{cy}" r="6.5" fill="{col}"/>' for cx,cy,col in dots]
    return "".join(parts)

def create(which,title,description):
    inner=svg_paths(which)
    # Primary horizontal lockup with an intentionally clear gap between the symbol and wordmark.
    svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="500" viewBox="0 0 1500 500" role="img" aria-labelledby="title desc"><title id="title">Front Brief — {title}</title><desc id="desc">{description}</desc><rect width="1500" height="500" fill="{PAPER}"/><g transform="translate(100 165) scale(1.85)">{inner}</g><text x="310" y="258" fill="{INK}" font-family="Inter,Arial,sans-serif" font-size="78" font-weight="600" letter-spacing="-2">Front Brief</text></svg>'''
    (OUT/f"front-brief-{which}-to-brief.svg").write_text(svg,encoding="utf-8")
    im=Image.new("RGB",(1500,500),PAPER);d=ImageDraw.Draw(im)
    render_icon(d,which,(100,165),185)
    d.text((310,174),"Front Brief",font=font(78),fill=INK)
    im.save(OUT/f"front-brief-{which}-to-brief.png",optimize=True)
    icon_svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" role="img" aria-label="{title}">{inner}</svg>'''
    (OUT/f"front-brief-{which}-icon.svg").write_text(icon_svg,encoding="utf-8")
    icon=Image.new("RGB",(400,400),PAPER);render_icon(ImageDraw.Draw(icon),which,(15,15),370)
    icon.save(OUT/f"front-brief-{which}-icon.png",optimize=True)
    return im

voice=create("voice","Voice to brief","A spoken account resolves into an ordered brief.")
handoff=create("handoff","Clear handoff","Two distinct source lines travel into one clinician-reviewed brief.")

sheet=Image.new("RGB",(1540,1225),"#ECEDE8");d=ImageDraw.Draw(sheet)
d.text((48,26),"FRONT BRIEF  /  TWO PREFERRED LOGO DIRECTIONS",font=font(24,True),fill=INK)
d.text((48,68),"Same Fieldnote wordmark and calm palette; distinct ideas in the icon.",font=font(17),fill=MUTED)
sheet.paste(voice,(20,120));d.text((48,625),"01  ·  VOICE TO BRIEF",font=font(20,True),fill=INK)
sheet.paste(handoff,(20,670));d.text((48,1180),"02  ·  CLEAR HANDOFF",font=font(20,True),fill=INK)
sheet.save(OUT/"front-brief-logo-finalists.png",optimize=True)

readme='''# Front Brief logo finalists\n\nBoth concepts use the light Fieldnote palette and wordmark. The icon remains the only choice point.\n\n1. **Voice to brief** — one gently wavering source line resolves into a short set of structured strokes, ending in a warm clay point.\n2. **Clear handoff** — two distinct source lines bend toward a shared reviewable brief; the warm point marks the human handoff.\n\nEach finalist has an editable SVG and a PNG lockup, plus an icon-only SVG and PNG. Warm paper: `#F7F5EF`; pine: `#293B36`; sage: `#78927B`; clay: `#B2794B`.\n'''
(OUT/"README.md").write_text(readme,encoding="utf-8")
