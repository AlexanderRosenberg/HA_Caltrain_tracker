# Branding Assets

This directory contains branding assets for the Caltrain Tracker integration.

## Logo Files

The `branding/caltrain_tracker/` folder contains:
- ✅ `icon.png` - 256x256 PNG logo for HACS repository listing
- ✅ `logo.png` - Repository logo (same as icon.png)
- ✅ `icon@2x.png` - High-resolution version for retina displays

## Logo Locations

HACS looks for logos in **two places**:

### 1. Integration Icon (Shows in Home Assistant UI)
**Location:** `custom_components/caltrain_tracker/icon.png`
- ✅ Already exists
- Used in: Settings → Devices & Services
- Used in: Entity cards and dashboards

### 2. Repository Logo (Shows in HACS)
**Location:** `branding/caltrain_tracker/icon.png`
- ✅ Now created
- Used in: HACS integration browser
- Used in: HACS repository listing

## How HACS Finds Logos

1. **Automatic Discovery:**
   - HACS scans `branding/{domain}/` folder
   - Looks for `icon.png`, `logo.png`, or `icon@2x.png`
   - No configuration needed in `hacs.json`

2. **Requirements:**
   - PNG format required
   - Minimum size: 256x256 pixels
   - Transparent background recommended
   - File size: Under 100KB recommended
   - Must be committed to git repository

## Current Logo

The Caltrain Tracker logo is:
- Format: PNG
- Size: 256x256 pixels
- File size: ~57KB
- Style: Transit Tracker icon

## Updating the Logo

To change the logo:

1. **Replace both copies:**
   ```bash
   # Update integration icon
   cp new_logo.png custom_components/caltrain_tracker/icon.png
   
   # Update HACS branding
   cp new_logo.png branding/caltrain_tracker/icon.png
   cp new_logo.png branding/caltrain_tracker/logo.png
   cp new_logo.png branding/caltrain_tracker/icon@2x.png
   ```

2. **Commit and push:**
   ```bash
   git add custom_components/caltrain_tracker/icon.png
   git add branding/caltrain_tracker/
   git commit -m "Update logo"
   git push
   ```

3. **Clear HACS cache (in Home Assistant):**
   - Go to HACS → ⋮ (menu) → Custom repositories
   - Or wait for HACS to refresh (up to 24 hours)

## No External Submission Needed

✅ **This is a custom HACS repository** - no submission to Home Assistant Brands required!

Custom repositories automatically use the logo from their own `branding/` folder.
