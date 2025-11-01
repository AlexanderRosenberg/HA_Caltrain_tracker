# ADD YOUR LOGO HERE

Please save your "Caltrain Transit Tracker" logo image as:
- `logo_original.png`

This will be used to generate the required icon files for Home Assistant.

## What to do:

1. **Save your logo**:
   - Right-click the logo image from the chat
   - Save as `logo_original.png` in this directory

2. **Follow the guide**:
   - See `LOGO_SUBMISSION_CHECKLIST.md` for step-by-step instructions
   - Or see `../BRANDING_GUIDE.md` for complete documentation

## File Structure (after processing):

```
branding/
├── logo_original.png       ← Save your logo here first
├── icon.png                ← Generated (256x256)
├── icon@2x.png            ← Generated (512x512)
├── README.md
├── LOGO_SUBMISSION_CHECKLIST.md
└── PLACE_LOGO_HERE.md     ← This file
```

## Quick Start:

```bash
# After saving logo_original.png, run:
cd branding

# Generate icons (requires ImageMagick):
magick convert logo_original.png -resize 256x256 -gravity center -extent 256x256 icon.png
magick convert logo_original.png -resize 512x512 -gravity center -extent 512x512 icon@2x.png

# Or use online tool:
# https://redketchup.io/image-resizer
```

---

**Next Step**: Save your logo, then see LOGO_SUBMISSION_CHECKLIST.md
