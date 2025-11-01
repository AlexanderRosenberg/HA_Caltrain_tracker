# Logo Submission Checklist

Quick reference for submitting the Caltrain Tracker logo to Home Assistant.

## Prerequisites

- [ ] Logo image saved to `branding/logo_original.png`
- [ ] ImageMagick installed (optional): `brew install imagemagick`
- [ ] GitHub account with fork of `home-assistant/brands`

## Step 1: Prepare Logo Files (5-10 minutes)

```bash
cd /Users/alexrosenberg/Documents/Gitrepos/HA_Caltrain_tracker/branding

# Create 256x256 icon
magick convert logo_original.png -resize 256x256 -gravity center -extent 256x256 icon.png

# Create 512x512 hDPI icon
magick convert logo_original.png -resize 512x512 -gravity center -extent 512x512 icon@2x.png

# Optimize (or use https://tinypng.com/)
pngquant --quality=80-100 icon.png -o icon_optimized.png
pngquant --quality=80-100 icon@2x.png -o icon@2x_optimized.png

# Rename optimized versions
mv icon_optimized.png icon.png
mv icon@2x_optimized.png icon@2x.png
```

**OR use online tools** (easier):
1. Go to https://redketchup.io/image-resizer
2. Upload `logo_original.png`
3. Resize to 256x256 → Save as `icon.png`
4. Resize to 512x512 → Save as `icon@2x.png`
5. Go to https://tinypng.com/ → Optimize both files

## Step 2: Fork Brands Repository (2 minutes)

```bash
# 1. Go to https://github.com/home-assistant/brands
# 2. Click "Fork" button

# Clone your fork
git clone https://github.com/YOUR_USERNAME/brands.git
cd brands
```

## Step 3: Add Logo Files (2 minutes)

```bash
# Create integration directory
mkdir -p custom_integrations/caltrain_tracker

# Copy your prepared icons
cp /Users/alexrosenberg/Documents/Gitrepos/HA_Caltrain_tracker/branding/icon.png \
   custom_integrations/caltrain_tracker/

cp /Users/alexrosenberg/Documents/Gitrepos/HA_Caltrain_tracker/branding/icon@2x.png \
   custom_integrations/caltrain_tracker/

# Verify files
ls -lh custom_integrations/caltrain_tracker/
# Should show:
# icon.png (< 50KB)
# icon@2x.png (< 150KB)
```

## Step 4: Commit and Push (2 minutes)

```bash
git checkout -b add-caltrain-tracker-logo
git add custom_integrations/caltrain_tracker/
git commit -m "Add Caltrain Tracker custom integration logo"
git push origin add-caltrain-tracker-logo
```

## Step 5: Create Pull Request (3 minutes)

1. Go to https://github.com/YOUR_USERNAME/brands
2. Click **"Pull Request"** button
3. **Title**: `Add Caltrain Tracker custom integration logo`
4. **Description**:
   ```
   Add logo/icon for Caltrain Tracker custom integration
   
   Domain: caltrain_tracker
   Repository: https://github.com/AlexanderRosenberg/HA_Caltrain_tracker
   Type: Custom integration (HACS)
   
   Files:
   - icon.png (256x256)
   - icon@2x.png (512x512)
   ```
5. Click **"Create Pull Request"**

## Step 6: Wait for Approval (1-7 days)

- Home Assistant team will review
- May request changes (resize, optimize, etc.)
- Once merged, logo will be live in 24-48 hours

## Verification

After PR is merged, verify at:
- https://brands.home-assistant.io/caltrain_tracker/icon.png
- https://brands.home-assistant.io/caltrain_tracker/icon@2x.png

## Troubleshooting

### "Files too large"
- Optimize with TinyPNG or pngquant
- Target: icon.png < 50KB, icon@2x.png < 150KB

### "Wrong dimensions"
- Verify: `file icon.png` should show "256 x 256"
- Verify: `file icon@2x.png` should show "512 x 512"

### "Not square"
- Use `-gravity center -extent 256x256` in ImageMagick
- Or crop manually in online editor

### "Domain mismatch"
- Folder name MUST be `caltrain_tracker`
- Must match `domain` in `manifest.json`

## Quick Commands Reference

```bash
# Check image dimensions
file icon.png
identify icon.png

# Check file size
ls -lh icon.png

# Re-optimize if needed
pngquant --quality=80-100 icon.png --force --output icon.png

# Test in browser (after PR merged)
open https://brands.home-assistant.io/caltrain_tracker/icon.png
```

## Total Time Estimate

- Preparation: 10-15 minutes
- Submission: 5-10 minutes
- **Total**: ~30 minutes

---

**Full Documentation**: See [BRANDING_GUIDE.md](../BRANDING_GUIDE.md)
