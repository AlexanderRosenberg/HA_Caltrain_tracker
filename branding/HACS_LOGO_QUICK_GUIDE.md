# Quick Logo Setup for HACS

For HACS custom repositories, you can add your logo directly to the repo!

## Simple Method (No Home Assistant Brands Needed)

### 1. Save Your Logo

Save your "Transit Tracker" logo image as:
```
/branding/logo_original.png
```

### 2. Create icon.png for HACS

HACS looks for an icon in the repository. Create a 256x256 PNG:

**Using online tool** (easiest):
1. Go to https://redketchup.io/image-resizer
2. Upload your logo
3. Resize to 256x256 (square)
4. Download as `icon.png`
5. Save to: `/custom_components/caltrain_tracker/icon.png`

**Using ImageMagick**:
```bash
cd /Users/alexrosenberg/Documents/Gitrepos/HA_Caltrain_tracker
magick convert branding/logo_original.png -resize 256x256 -gravity center -extent 256x256 custom_components/caltrain_tracker/icon.png
```

### 3. That's It!

HACS will automatically display the icon from `custom_components/caltrain_tracker/icon.png`

No need to submit to Home Assistant Brands repository!

## Where It Appears

Once you commit and push the icon:
- ✅ HACS integration list
- ✅ HACS repository card
- ✅ Automatically served to users

## File Structure

```
custom_components/
└── caltrain_tracker/
    ├── __init__.py
    ├── manifest.json
    ├── icon.png          ← Add this file (256x256 PNG)
    └── ... other files
```

## Notes

- **Size**: 256x256 pixels (PNG format)
- **Transparency**: Preferred (works on any background)
- **Location**: Must be in the integration directory
- **Name**: Must be exactly `icon.png`

---

**The previous branding guide about Home Assistant Brands was for getting the logo to appear in Home Assistant's native integration settings. For HACS, just add icon.png directly to your integration folder!**
