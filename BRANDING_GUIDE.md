# Branding Guide - Caltrain Tracker Logo

## Overview

To display your custom logo in HACS and Home Assistant integration settings, you need to submit it to the official [Home Assistant Brands](https://github.com/home-assistant/brands) repository.

## Current Status

- ✅ Logo designed (Caltrain Transit Tracker with train icon)
- 📁 Logo saved in `/branding/` directory
- ⏳ Pending submission to Home Assistant Brands repository

## Logo Requirements

### Icon Requirements (for integration list/cards)
- **Size**: 256x256 pixels (standard), 512x512 pixels (hDPI @2x version)
- **Aspect ratio**: 1:1 (square)
- **Format**: PNG
- **Optimization**: Lossless compression, interlaced/progressive preferred
- **Background**: Transparent preferred
- **Trimming**: Minimal empty space around subject

### Logo Requirements (for integration details)
- **Size**: Shortest side 128-256 pixels (standard), 256-512 pixels (hDPI @2x)
- **Aspect ratio**: Landscape preferred (respect brand aspect ratio)
- **Format**: PNG
- **Optimization**: Same as icon
- **Note**: If logo is square, only icon needed (logo will fallback to icon)

## File Structure for Submission

Your logo should be submitted to:
```
home-assistant/brands/
└── custom_integrations/
    └── caltrain_tracker/           # Must match domain in manifest.json
        ├── icon.png                 # 256x256 square icon
        ├── icon@2x.png             # 512x512 square icon (hDPI)
        ├── logo.png                 # Landscape logo (optional if icon is suitable)
        └── logo@2x.png             # hDPI logo (optional)
```

## Steps to Submit

### 1. Prepare Your Logo Files

**From your current logo image:**

1. **Save the logo image** from the attachment to `/branding/logo_original.png`

2. **Create icon.png (256x256)**:
   ```bash
   # Use image editor or command line
   # Recommended tool: https://redketchup.io/image-resizer
   
   # Or with ImageMagick (if installed):
   magick convert branding/logo_original.png -resize 256x256 branding/icon.png
   ```

3. **Create icon@2x.png (512x512)**:
   ```bash
   magick convert branding/logo_original.png -resize 512x512 branding/icon@2x.png
   ```

4. **Optimize PNGs** (reduce file size without quality loss):
   ```bash
   # Using pngquant (if installed):
   pngquant --quality=80-100 branding/icon.png -o branding/icon_optimized.png
   pngquant --quality=80-100 branding/icon@2x.png -o branding/icon@2x_optimized.png
   
   # Or use online tools:
   # - https://tinypng.com/
   # - https://squoosh.app/
   ```

### 2. Fork the Brands Repository

1. Go to https://github.com/home-assistant/brands
2. Click **"Fork"** button (top right)
3. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/brands.git
   cd brands
   ```

### 3. Add Your Brand Files

```bash
# Create directory for your integration
mkdir -p custom_integrations/caltrain_tracker

# Copy your prepared icon files
cp /path/to/your/icon.png custom_integrations/caltrain_tracker/
cp /path/to/your/icon@2x.png custom_integrations/caltrain_tracker/

# Optional: Add logo files if different from icon
# cp /path/to/your/logo.png custom_integrations/caltrain_tracker/
# cp /path/to/your/logo@2x.png custom_integrations/caltrain_tracker/
```

### 4. Commit and Push

```bash
git checkout -b add-caltrain-tracker-logo
git add custom_integrations/caltrain_tracker/
git commit -m "Add Caltrain Tracker custom integration logo"
git push origin add-caltrain-tracker-logo
```

### 5. Create Pull Request

1. Go to your fork on GitHub
2. Click **"Pull Request"** button
3. Title: `Add Caltrain Tracker custom integration logo`
4. Description:
   ```markdown
   ## Add Caltrain Tracker Logo
   
   This PR adds logo/icon images for the Caltrain Tracker custom integration.
   
   **Integration domain**: `caltrain_tracker`
   **Integration repository**: https://github.com/AlexanderRosenberg/HA_Caltrain_tracker
   **Integration type**: Custom integration (HACS)
   
   ### Files included:
   - [x] icon.png (256x256)
   - [x] icon@2x.png (512x512)
   
   ### Checklist:
   - [x] Images are PNG format
   - [x] Images are properly sized
   - [x] Images are optimized for web
   - [x] Domain matches manifest.json
   - [x] Custom integration (not core)
   ```
5. Click **"Create Pull Request"**
6. Wait for review from Home Assistant team

### 6. After Approval

Once your PR is merged:
- **Wait 24 hours** for CDN cache to refresh
- **Wait for next HA Core release** for full Cloudflare cache flush
- Your logo will appear at:
  - `https://brands.home-assistant.io/caltrain_tracker/icon.png`
  - `https://brands.home-assistant.io/caltrain_tracker/icon@2x.png`

## Where Your Logo Will Appear

Once submitted and approved:

1. **HACS Integration List**
   - Shows `icon.png` next to "Caltrain Tracker"
   
2. **Home Assistant Settings → Devices & Services**
   - Shows `icon.png` on the integration card
   
3. **Integration Details Page**
   - Shows `logo.png` (or `icon.png` if logo not provided)
   
4. **Device Cards**
   - Shows `icon.png` for devices created by the integration

## Important Notes

### Domain Must Match
The folder name `caltrain_tracker` MUST match the `domain` in your `manifest.json`:
```json
{
  "domain": "caltrain_tracker",
  ...
}
```

### Custom Integration Guidelines
- ❌ Do NOT use Home Assistant branded images
- ❌ Do NOT use Caltrain's official logo without permission
- ✅ DO use your own custom branding (like "Transit Tracker" design)
- ✅ DO ensure images are optimized and web-ready

### Alternative: Local Logo (No PR Required)

If you want a logo to show up immediately in HACS without waiting for the brands repo:

1. **Add logo to `hacs.json`** (NOT recommended by HACS):
   ```json
   {
     "name": "Caltrain Tracker",
     "content_in_root": false,
     "filename": "caltrain_tracker",
     "render_readme": true,
     "domains": ["caltrain_tracker"]
   }
   ```

2. **Note**: This method is discouraged. Always prefer the official brands repository.

## Logo Design Guidelines

Your current logo features:
- ✅ Train icon (recognizable)
- ✅ Caltrain branding (red circle)
- ✅ "TRANSIT TRACKER" text (clear purpose)
- ✅ High contrast (works on light backgrounds)

**Recommendations:**
- Consider creating a "dark" version if needed: `dark_icon.png`, `dark_logo.png`
- Ensure transparent background for best integration with HA themes
- Test on both light and dark themes in Home Assistant

## Useful Tools

### Image Editing/Resizing
- **RedKetchup Image Resizer**: https://redketchup.io/image-resizer
  - Browser-based, supports SVG to PNG
  
- **Squoosh**: https://squoosh.app/
  - Google's image optimizer
  
- **TinyPNG**: https://tinypng.com/
  - PNG compression tool

### Finding Brand Assets
- **Worldvectorlogo**: https://worldvectorlogo.com/
  - SVG brand logos
  
- **Wikimedia Commons**: https://commons.wikimedia.org/
  - High quality brand images

### Command Line Tools
- **ImageMagick**: `brew install imagemagick`
  - Resize, convert, optimize images
  
- **pngquant**: `brew install pngquant`
  - PNG compression

## Testing Your Logo

Before submitting, test locally:

1. **Add to HACS manually**:
   - Place `icon.png` in `/config/www/community/caltrain_tracker/`
   
2. **View in Home Assistant**:
   - Go to Settings → Devices & Services
   - Look for Caltrain Tracker integration
   - Check if logo displays correctly

3. **Test on multiple themes**:
   - Light theme
   - Dark theme
   - iOS dark mode
   - Various custom themes

## Support

- **Brands Repository**: https://github.com/home-assistant/brands
- **Brands Documentation**: (See README in brands repo)
- **HACS Documentation**: https://hacs.xyz/docs/publish/integration
- **Integration Repository**: https://github.com/AlexanderRosenberg/HA_Caltrain_tracker

## Status Tracking

- [ ] Logo file saved to `/branding/` directory
- [ ] Icon resized to 256x256 (icon.png)
- [ ] Icon resized to 512x512 (icon@2x.png)
- [ ] Images optimized (compressed)
- [ ] Brands repository forked
- [ ] Files added to fork
- [ ] Pull request created
- [ ] PR merged by HA team
- [ ] Logo visible in HACS (after 24h cache)
- [ ] Logo visible in HA settings

---

**Last Updated**: November 1, 2025 (v1.5.0)
