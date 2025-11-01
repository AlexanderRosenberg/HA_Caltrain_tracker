# Branding Directory

This directory contains logo and branding assets for the Caltrain Tracker integration.

## Files

### Original Logo
- `logo_original.png` - Your original Caltrain Transit Tracker logo
- **To add**: Save the logo from your message to this file

### Prepared Assets (to be created)
- `icon.png` - 256x256 square icon for HACS/HA integration list
- `icon@2x.png` - 512x512 hDPI version
- `logo.png` - Landscape logo for integration details (optional)
- `logo@2x.png` - hDPI landscape logo (optional)

## Quick Start

1. **Save your logo**:
   - Save the "TRANSIT TRACKER" logo image to `logo_original.png`

2. **Resize for icon.png**:
   ```bash
   # Using online tool (easiest):
   # 1. Go to https://redketchup.io/image-resizer
   # 2. Upload logo_original.png
   # 3. Resize to 256x256 (square, crop if needed)
   # 4. Download as icon.png
   
   # OR using ImageMagick (if installed):
   cd branding
   magick convert logo_original.png -resize 256x256 -gravity center -extent 256x256 icon.png
   ```

3. **Create hDPI version**:
   ```bash
   # Online: Same tool, resize to 512x512
   # OR
   magick convert logo_original.png -resize 512x512 -gravity center -extent 512x512 icon@2x.png
   ```

4. **Optimize**:
   ```bash
   # Using TinyPNG: https://tinypng.com/
   # Upload icon.png and icon@2x.png, download optimized versions
   ```

## Submitting to Home Assistant Brands

See [BRANDING_GUIDE.md](../BRANDING_GUIDE.md) for complete instructions on:
- Preparing logo files
- Submitting to home-assistant/brands repository
- Getting your logo to appear in HACS and HA settings

## Logo Design

Your current logo features:
- **Train icon**: Black/white silhouette in rounded square
- **Caltrain circle**: Red circle with "Caltrain" text
- **Title**: "TRANSIT TRACKER" in bold black letters

**Design notes**:
- High contrast (good for light backgrounds)
- Clear branding (immediately recognizable)
- Professional appearance

**Suggestions**:
- Ensure transparent background (not white)
- Consider creating dark version for dark themes
- Test visibility at small sizes (32x32, 48x48)

## Testing Locally

Before submitting to brands repository, test your icon:

1. Copy to HA www folder:
   ```bash
   cp icon.png /path/to/homeassistant/config/www/caltrain_tracker_icon.png
   ```

2. Use in Lovelace card:
   ```yaml
   type: button
   icon: /local/caltrain_tracker_icon.png
   name: Test Icon
   ```

3. Check appearance:
   - Light theme
   - Dark theme
   - Mobile view
   - Different zoom levels

## Resources

- **Image Resizer**: https://redketchup.io/image-resizer
- **PNG Optimizer**: https://tinypng.com/
- **HA Brands Repo**: https://github.com/home-assistant/brands
- **HACS Docs**: https://hacs.xyz/docs/publish/integration

---

**Note**: Files in this directory are for development only. The official logo will be served from `brands.home-assistant.io` after submission.
