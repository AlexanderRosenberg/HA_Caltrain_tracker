# Logo Integration Summary

## What Was Done

I've researched and documented the complete process for adding your Caltrain Transit Tracker logo to HACS and Home Assistant integration settings.

## Key Findings

### Home Assistant Brands Repository
- **Official source**: All integration logos are served from `https://brands.home-assistant.io/`
- **Requirement**: HACS documentation states integrations MUST be added to [home-assistant/brands](https://github.com/home-assistant/brands)
- **Location**: Custom integrations go in `custom_integrations/[domain]/`
- **Domain**: Must match `domain` in `manifest.json` → `caltrain_tracker`

### Logo Requirements

**Icon (for integration list):**
- Size: 256x256 pixels (standard), 512x512 pixels (@2x hDPI)
- Format: PNG
- Aspect ratio: 1:1 (square)
- Optimization: Lossless compression, web-optimized
- Background: Transparent preferred

**Logo (for integration details, optional):**
- Size: Shortest side 128-256px (standard), 256-512px (@2x)
- Format: PNG
- Aspect ratio: Can be landscape (respect brand)
- Note: If logo is square, only icon needed

### Where Logo Will Appear

Once submitted and approved:
1. ✅ **HACS Integration List** - Shows icon next to "Caltrain Tracker"
2. ✅ **Settings → Devices & Services** - Shows icon on integration card
3. ✅ **Integration Details Page** - Shows logo (or icon)
4. ✅ **Device Cards** - Shows icon for devices

## Files Created

### Documentation
1. **BRANDING_GUIDE.md** - Complete guide with:
   - Logo requirements
   - Submission process
   - Testing instructions
   - Troubleshooting tips

2. **branding/LOGO_SUBMISSION_CHECKLIST.md** - Quick reference:
   - Step-by-step commands
   - Time estimates
   - Verification steps

3. **branding/README.md** - Directory overview:
   - File structure
   - Quick start guide
   - Testing instructions

4. **branding/PLACE_LOGO_HERE.md** - Reminder file:
   - Where to save original logo
   - Next steps

### Directory Structure
```
/branding/
├── README.md                          ✅ Created
├── LOGO_SUBMISSION_CHECKLIST.md      ✅ Created
├── PLACE_LOGO_HERE.md                ✅ Created
├── logo_original.png                 ⏳ You need to save this
├── icon.png                          ⏳ To be generated
└── icon@2x.png                       ⏳ To be generated
```

## Next Steps for You

### 1. Save Your Logo (2 minutes)
```bash
cd /Users/alexrosenberg/Documents/Gitrepos/HA_Caltrain_tracker/branding
# Save the "Transit Tracker" logo image as logo_original.png
```

### 2. Generate Icon Files (5-10 minutes)

**Option A: Online Tools (Easiest)**
1. Go to https://redketchup.io/image-resizer
2. Upload `logo_original.png`
3. Resize to 256x256 → Save as `icon.png`
4. Resize to 512x512 → Save as `icon@2x.png`
5. Optimize at https://tinypng.com/

**Option B: Command Line (If ImageMagick installed)**
```bash
cd branding
magick convert logo_original.png -resize 256x256 -gravity center -extent 256x256 icon.png
magick convert logo_original.png -resize 512x512 -gravity center -extent 512x512 icon@2x.png
```

### 3. Submit to Home Assistant Brands (15-20 minutes)

Follow the detailed steps in [branding/LOGO_SUBMISSION_CHECKLIST.md](branding/LOGO_SUBMISSION_CHECKLIST.md):

1. Fork https://github.com/home-assistant/brands
2. Add files to `custom_integrations/caltrain_tracker/`
3. Create pull request
4. Wait for approval (1-7 days typically)

### 4. Verify Logo Appears (After PR merged + 24 hours)
- Check HACS integration list
- Check Settings → Devices & Services
- Verify URL: `https://brands.home-assistant.io/caltrain_tracker/icon.png`

## Why This Approach?

### Official Method
- ✅ HACS documentation requires it
- ✅ Logo served from CDN (fast, cached)
- ✅ Works automatically in all HA installations
- ✅ Professional appearance

### Alternative (Not Recommended)
- ❌ Storing logo in repository (not recognized by HACS)
- ❌ Users must manually download/configure
- ❌ Not cached, slower load times

## Timeline

| Step | Time | Status |
|------|------|--------|
| Save logo | 2 min | ⏳ To do |
| Generate icons | 10 min | ⏳ To do |
| Submit PR | 15 min | ⏳ To do |
| Wait for approval | 1-7 days | ⏳ To do |
| Logo live | +24 hours | ⏳ To do |
| **Total** | **~1 week** | |

## Important Notes

### Domain Must Match
The folder name in brands repository MUST be `caltrain_tracker` to match:
```json
// manifest.json
{
  "domain": "caltrain_tracker",
  ...
}
```

### Custom Integration Guidelines
- ✅ Use your own custom branding (you have this)
- ❌ Don't use Home Assistant branded images
- ❌ Don't use official Caltrain logo without permission

### Your Logo Design
Your "Transit Tracker" logo is perfect because:
- ✅ Custom design (not official Caltrain branding)
- ✅ High contrast (visible on light backgrounds)
- ✅ Clear purpose (train icon + "Transit Tracker")
- ✅ Professional appearance

### Future Enhancement
Consider creating a dark version for dark themes:
- `dark_icon.png` (256x256)
- `dark_icon@2x.png` (512x512)

## Resources

### Tools
- **Image Resizer**: https://redketchup.io/image-resizer
- **PNG Optimizer**: https://tinypng.com/
- **Image Analyzer**: https://squoosh.app/

### Documentation
- **HA Brands Repo**: https://github.com/home-assistant/brands
- **HACS Docs**: https://hacs.xyz/docs/publish/integration
- **Your Guides**:
  - [BRANDING_GUIDE.md](../BRANDING_GUIDE.md)
  - [branding/LOGO_SUBMISSION_CHECKLIST.md](branding/LOGO_SUBMISSION_CHECKLIST.md)

## Testing Before Submission

You can test your icon locally before submitting:

```bash
# Copy to HA www folder
cp icon.png /path/to/homeassistant/config/www/test_icon.png

# Test in Lovelace card:
# type: button
# icon: /local/test_icon.png
# name: Test Caltrain Icon
```

Check appearance:
- Light theme ✓
- Dark theme ✓
- Mobile view ✓
- Small size (32x32) ✓

## FAQ

**Q: Can I skip the brands repository and just use my logo locally?**
A: Not recommended. HACS won't recognize it, and it won't appear in integration settings.

**Q: How long does approval take?**
A: Usually 1-7 days. The HA team reviews all brand submissions.

**Q: What if my PR is rejected?**
A: Common reasons: wrong size, not optimized, domain mismatch. Fix and resubmit.

**Q: Can I update the logo later?**
A: Yes! Submit a new PR with updated images. Same process.

**Q: Does the logo need to be exactly square for icon.png?**
A: Yes, 256x256 or 512x512. Use `-gravity center -extent` to center if needed.

---

## Summary

✅ **Research complete** - Logo submission process documented  
✅ **Documentation created** - 4 guide files in place  
✅ **Directory prepared** - `/branding/` ready for your logo  
⏳ **Your action needed** - Save logo and follow checklist  

**Estimated total time to get logo live**: ~1 week (including PR approval)

---

**Last Updated**: November 1, 2025 (v1.5.0)
