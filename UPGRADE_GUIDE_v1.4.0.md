# Upgrade Guide: v1.1.0 → v1.4.0

## What's New in v1.4.0

### Integration Updates:
- ✅ All 28 Caltrain stations now available (was 4 initially configured)
- ✅ Options flow added - reconfigure stations without removing integration
- ✅ Version bumped to 1.4.0 to match card version

### Card Updates:
- ✅ Enhanced scheduled time display (two-line format)
- ✅ GPS indicator redesigned as badge (no more flashing)
- ✅ Smart train type colors (Baby Bullet red, Limited orange, Local teal)
- ✅ Improved visual hierarchy and Caltrain branding

## Why Am I Only Seeing 4 Stations?

When you initially set up the integration, you selected only 4 stations (probably Palo Alto, San Antonio, and two others). The integration creates sensors **only for the stations you selected** during setup.

Even though the `const.py` file now has all 28 stations, your existing sensors won't automatically update. You need to **reconfigure** the integration.

## How to Add All 28 Stations

### Option 1: Use the Options Flow (Recommended - No Data Loss)

1. **Go to Settings → Devices & Services**
2. **Find "Caltrain Tracker"** in the list
3. **Click "Configure"** (or the three dots → Configure)
4. **You'll see the station selector with all 28 stations**
5. **Select all stations you want** (or select all)
6. **Click Submit**
7. **Home Assistant will reload the integration** with new sensors

### Option 2: Remove and Re-add Integration (Clean Slate)

⚠️ **Warning:** This will delete all existing sensors and historical data.

1. **Go to Settings → Devices & Services**
2. **Find "Caltrain Tracker"**, click three dots → **Delete**
3. **Click "+ Add Integration"**, search for "Caltrain Tracker"
4. **Enter your API key**
5. **Select all 28 stations** (or the ones you want)
6. **Complete setup**

## Update Steps

### Step 1: Update the Integration Files

If you installed via HACS:
```bash
# HACS should auto-detect the new version
# Go to HACS → Integrations → Caltrain Tracker → Update
```

If you installed manually:
```bash
# Copy the updated files to your Home Assistant
cp -r custom_components/caltrain_tracker /path/to/homeassistant/config/custom_components/
```

### Step 2: Restart Home Assistant

**Via UI:**
- Settings → System → Restart Home Assistant

**Via CLI:**
```bash
# Docker
docker restart homeassistant

# HASS OS
ha core restart
```

### Step 3: Verify Version

After restart:
1. Go to Settings → Devices & Services
2. Find "Caltrain Tracker"
3. Version should now show **v1.4.0**

### Step 4: Add New Stations

Use **Option 1** (Options Flow) above to add all 28 stations.

### Step 5: Update the Card

```bash
# Copy the updated card
cp dist/caltrain-tracker-card.js /path/to/homeassistant/config/www/
```

### Step 6: Clear Browser Cache

- **Chrome/Edge:** `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)
- **Firefox:** `Cmd + Shift + R` (Mac) or `Ctrl + F5` (Windows)
- **Safari:** `Cmd + Option + R`

### Step 7: Verify Card

1. Edit your Caltrain Tracker card
2. Open visual editor
3. You should now see all 28 stations in the selector dropdown

## All 28 Stations Available

### Zone 1 - San Francisco Peninsula North
- San Francisco (70011/70012)
- 22nd Street (70021/70022)
- Bayshore (70031/70032)
- South San Francisco (70041/70042)
- San Bruno (70051/70052)

### Zone 2 - Mid-Peninsula
- Millbrae (70061/70062)
- Broadway (70071/70072)
- Burlingame (70081/70082)
- San Mateo (70091/70092)
- Hayward Park (70101/70102)

### Zone 3 - Central Peninsula
- Hillsdale (70111/70112)
- Belmont (70121/70122)
- San Carlos (70131/70132)
- Redwood City (70141/70142)
- Atherton (70151/70152)
- Menlo Park (70161/70162)

### Zone 4 - South Peninsula / Silicon Valley North
- Palo Alto (70171/70172)
- California Avenue (70181/70182)
- San Antonio (70191/70192)
- Mountain View (70201/70202)
- Sunnyvale (70211/70212)
- Lawrence (70221/70222)

### Zone 5 - San Jose
- Santa Clara (70231/70232)
- College Park (70241/70242)
- San Jose Diridon (70251/70252)

### Zone 6 - South County
- Tamien (70261/70262)

**Total:** 28 stations × 2 directions = 56 stop IDs

## About the 76 Device Tracker Entities

You mentioned seeing 76 device tracker entities. This is **expected behavior** - here's why:

### What Are These Entities?

These are **live train cars** being tracked in real-time via GPS. Each entity represents a specific train car (e.g., `device_tracker.caltrain_car_123`).

### Why So Many?

1. **Caltrain has a large fleet** (~70-80 active cars)
2. **The API provides real-time position data** for all active trains
3. **Car numbers can change** depending on what's in service each day
4. **Some cars may be offline/idle** (not responding), but entities persist

### Is This Normal?

Yes! The device tracker platform creates an entity for **every train car** it detects from the API. This is useful for:
- Tracking specific trains
- Building automations based on train proximity
- Visualizing train positions on a map

### Can I Clean This Up?

If you want to reduce clutter:

**Option 1: Hide Unused Entities**
1. Go to Settings → Devices & Services → Entities
2. Filter for `device_tracker.caltrain_`
3. Select entities you don't need
4. Click "Disable" or "Hide"

**Option 2: Use Area Filtering** (future enhancement)
We could add configuration to only track trains within a certain distance or on specific routes.

## Troubleshooting

### Integration Still Shows v1.1.0
- Make sure you copied all files from `custom_components/caltrain_tracker/`
- Restart Home Assistant completely
- Check logs for any errors: Settings → System → Logs

### Configure Button Not Showing
- The options flow requires Home Assistant 2023.11+
- If you don't see "Configure", use Option 2 (remove/re-add)

### Sensors Not Updating After Reconfiguration
- The integration reloads automatically after options change
- Wait 30-60 seconds for first data fetch
- Check Developer Tools → States for new sensor entities

### Card Still Shows Old Stations
- Make sure you cleared browser cache
- Try opening in incognito/private mode
- Check that dist/caltrain-tracker-card.js was copied to www/ folder
- Verify resource URL: Settings → Dashboards → Resources

## What Changed in Each Component

### Files Modified:

1. **manifest.json**
   - Version: 1.1.0 → 1.4.0

2. **const.py**
   - STATIONS: 4 entries → 56 entries (28 stations × 2 directions)
   - Added complete lat/lon coordinates for all stations

3. **config_flow.py**
   - Added `CaltrainOptionsFlow` class for reconfiguration
   - Added `async_get_options_flow()` method
   - Stations now reconfigurable without removal

4. **__init__.py**
   - Added `async_update_options()` function
   - Registered update listener for options changes
   - Integration auto-reloads when options change

5. **sensor.py**
   - Updated to check `entry.options` before `entry.data`
   - Supports dynamic station selection updates

6. **caltrain-tracker-card.ts** (card)
   - All v1.4.0 enhancements (see RELEASE_NOTES_v1.4.0.md)

## Next Steps

After upgrading:

1. ✅ Configure integration with all 28 stations
2. ✅ Test card with multiple stations selected
3. ✅ Verify train type colors display correctly
4. ✅ Test GPS proximity if enabled
5. ✅ Check scheduled vs expected time display
6. ✅ Review device tracker entities (optional cleanup)

## Need Help?

- **GitHub Issues:** https://github.com/AlexanderRosenberg/HA_Caltrain_tracker/issues
- **Logs:** Settings → System → Logs (search for "caltrain")
- **API Status:** https://511.org/open-data
