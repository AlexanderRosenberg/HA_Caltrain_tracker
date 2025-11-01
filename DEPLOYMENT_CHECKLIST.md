# Deployment Checklist for v1.4.0

## Issue: Still seeing old stations (Palo Alto, San Antonio only)

The const.py file has all 28 stations, but Home Assistant needs to be restarted to pick up the changes.

## Required Steps:

### 1. Restart Home Assistant
The integration component files (including `const.py`) are only loaded when Home Assistant starts.

**Via UI:**
- Go to Settings → System → Restart Home Assistant
- Wait for restart to complete (~30-60 seconds)

**Via Terminal (if using Docker):**
```bash
docker restart homeassistant
```

**Via Terminal (if using HASS OS):**
```bash
ha core restart
```

### 2. Verify Integration Loaded
After restart, check that the integration is working:
- Go to Settings → Devices & Services → Caltrain Tracker
- The integration should show as "Configured"
- Check any sensor entities to ensure they're updating

### 3. Update the Card (if you haven't already)
```bash
# Copy the new card to Home Assistant
cp dist/caltrain-tracker-card.js /path/to/homeassistant/config/www/
```

### 4. Clear Browser Cache
**Hard Reload:**
- Chrome/Edge: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows/Linux)
- Firefox: `Cmd + Shift + R` (Mac) or `Ctrl + F5` (Windows/Linux)
- Safari: `Cmd + Option + R`

**Or Clear Cache Completely:**
- Chrome: Settings → Privacy → Clear browsing data → Cached images and files
- Make sure to reload Home Assistant after clearing

### 5. Verify Card Configuration
Open the visual editor for your Caltrain card:
- Edit the card
- Open the station selector
- You should now see all 28 stations organized by zone

### 6. Test GPS (if enabled)
If you're using GPS proximity:
- Make sure the GPS device tracker entity is selected
- The badge should appear when you're near a selected station
- Badge format: Green with icon + "GPS" text

## Expected Results After Deployment:

✅ **Station Selector shows 28 stations:**
- Zone 1: San Francisco, 22nd Street, Bayshore, South SF, San Bruno
- Zone 2: Millbrae, Broadway, Burlingame, San Mateo, Hayward Park
- Zone 3: Hillsdale, Belmont, San Carlos, Redwood City, Atherton, Menlo Park
- Zone 4: Palo Alto, Cal Ave, San Antonio, Mountain View, Sunnyvale, Lawrence
- Zone 5: Santa Clara, College Park, San Jose Diridon
- Zone 6: Tamien

✅ **Time Display:**
- Line 1: "Scheduled: [time]"
- Line 2: "Expected: [time]" or "On Time: [time]"
- Color-coded delay badges

✅ **Train Type Colors:**
- Baby Bullet: Red border + lightning bolt
- Limited: Orange border + train variant icon
- Local: Teal border + train icon

✅ **GPS Indicator:**
- Static green badge (no flashing)
- Shows on direction line when proximity active

## Troubleshooting:

### Still seeing old stations after restart?
1. Check Home Assistant logs for integration errors
2. Verify `const.py` file location: `custom_components/caltrain_tracker/const.py`
3. Ensure file permissions are correct (readable by HA)
4. Try removing and re-adding the integration (Settings → Integrations)

### Card not updating?
1. Check browser console for JavaScript errors (F12)
2. Verify resource URL in Lovelace: `/local/caltrain-tracker-card.js`
3. Add `?v=1.4.0` to force cache bust: `/local/caltrain-tracker-card.js?v=1.4.0`
4. Check that file is in correct location: `config/www/caltrain-tracker-card.js`

### Stations not showing up in selector?
1. Make sure integration restarted successfully
2. Check that sensors are being created (Developer Tools → States)
3. Look for entities like `sensor.caltrain_*`
4. Verify API key is still valid (test with test_api.py)

## Quick Test Commands:

```bash
# Check if file exists and is readable
ls -la /path/to/homeassistant/config/custom_components/caltrain_tracker/const.py

# Check Home Assistant logs for integration
tail -f /path/to/homeassistant/config/home-assistant.log | grep caltrain

# Verify station count in Python
python3 -c "from custom_components.caltrain_tracker.const import STATIONS; print(f'Total stations: {len(STATIONS)} stop IDs')"
```

## Files Updated in v1.4.0:

- ✅ `custom_components/caltrain_tracker/const.py` - All 28 stations added
- ✅ `src/caltrain-tracker-card.ts` - Smart colors, GPS badge, time display
- ✅ `dist/caltrain-tracker-card.js` - Built 43KB bundle

All files are ready. Just need to restart Home Assistant!
