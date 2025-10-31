# Troubleshooting Guide - Caltrain Tracker Card

## Visual Editor Issues

### "Visual editor not supported" Error

**Problem**: When trying to configure the card, you see:
```
Visual editor not supported
The visual editor is not available for this type of element.
You can still edit your config using YAML.
```

**Solutions**:

1. **Clear browser cache** (Most common fix):
   - Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
   - Or clear cache manually in browser settings
   - Reload Home Assistant

2. **Verify card is properly loaded**:
   - Go to Developer Tools → Resources
   - Confirm `/local/caltrain-tracker-card.js` is listed
   - Check browser console (F12) for errors

3. **Re-add the resource**:
   - Settings → Dashboards → Resources
   - Remove the old caltrain-tracker-card resource
   - Add it again:
     - URL: `/local/caltrain-tracker-card.js`
     - Type: JavaScript Module
   - Restart Home Assistant
   - Clear browser cache

4. **Check file permissions**:
   ```bash
   chmod 644 /config/www/caltrain-tracker-card.js
   ```

5. **Try adding via YAML first**, then edit:
   ```yaml
   type: custom:caltrain-tracker-card
   entities:
     - sensor.caltrain_palo_alto_northbound
   ```
   Save, then click Edit → visual editor should appear

## Configuration Errors

### "Please define an entity or entities"

**Problem**: Card shows error even with entities configured.

**Cause**: Neither `entity` nor `entities` is provided.

**Solution**: Provide at least one:
```yaml
# Option 1: Single entity
type: custom:caltrain-tracker-card
entity: sensor.caltrain_palo_alto_northbound

# Option 2: Multiple entities  
type: custom:caltrain-tracker-card
entities:
  - sensor.caltrain_palo_alto_northbound
  - sensor.caltrain_palo_alto_southbound
```

### "Entity not found" Error

**Problem**: Card shows "Entity not found: sensor.xxx"

**Solutions**:

1. **Verify entity exists**:
   - Developer Tools → States
   - Search for your entity
   - Ensure it's available

2. **Check entity ID spelling**:
   - Entity IDs are case-sensitive
   - Some installations may not have `caltrain_` prefix
   - Use Developer Tools to copy exact entity ID

3. **Wait for integration to load**:
   - After Home Assistant restart
   - Integration may take 30-60 seconds to create entities
   - Refresh dashboard after entities appear

### Station Selector Not Showing

**Problem**: Multiple entities configured but no dropdown appears.

**Causes**:
1. Only one entity in list
2. `show_station_selector: false` explicitly set
3. Card not updated to latest version

**Solutions**:

1. **Verify multiple entities**:
   ```yaml
   entities:
     - sensor.caltrain_palo_alto_northbound
     - sensor.caltrain_palo_alto_southbound  # Need at least 2
   ```

2. **Check selector isn't disabled**:
   ```yaml
   # Don't set this to false
   # show_station_selector: false
   
   # Or explicitly enable
   show_station_selector: true
   ```

3. **Update card**:
   - Copy latest `caltrain-tracker-card.js`
   - Clear browser cache
   - Refresh dashboard

### GPS Not Working

**Problem**: GPS proximity selection isn't working.

**Checklist**:

1. **GPS entity has coordinates**:
   - Go to Developer Tools → States
   - Find your `person.xxx` or `device_tracker.xxx`
   - Verify it has `latitude` and `longitude` attributes

2. **Multiple entities configured**:
   ```yaml
   entities:  # Must have multiple!
     - sensor.caltrain_palo_alto_northbound
     - sensor.caltrain_san_antonio_northbound
   ```

3. **GPS enabled in config**:
   ```yaml
   use_gps: true
   gps_entity: person.alex  # Must specify entity
   ```

4. **Station sensors have coordinates**:
   - Stations need `latitude`/`longitude` attributes
   - These are automatically included by integration

## Card Display Issues

### Card Shows "No data available"

**Problem**: Card loads but shows no train information.

**Solutions**:

1. **Check sensor state**:
   - Developer Tools → States
   - Find your Caltrain sensor
   - Verify `next_trains` attribute exists
   - Should have array of train objects

2. **Verify integration is working**:
   - Check logs: Settings → System → Logs
   - Search for "caltrain"
   - Look for API errors

3. **API key issues**:
   - Integration may need reconfiguration
   - Settings → Devices & Services → Caltrain Tracker
   - Reconfigure with valid 511 API key

4. **Caltrain service hours**:
   - Trains only run certain hours
   - Weekdays: 4:00 AM - 1:00 AM
   - Weekends: 6:00 AM - 1:00 AM

### Refresh Button Disabled

**Problem**: Can't click refresh button.

**Cause**: Outside operating hours.

**Behavior**: Normal - button automatically disables when Caltrain isn't running.

**Check**: Hover over button for tooltip explaining why.

### Delay Badges Not Showing

**Problem**: No delay indicators on trains.

**Cause**: Caltrain's GTFS feed doesn't currently populate delay data.

**Status**: 
- Backend is ready to display delays
- Waiting for Caltrain to add delay data to their feed
- When they add it, badges will appear automatically

## Integration Issues

### Sensors Not Creating

**Problem**: No Caltrain sensors after integration setup.

**Solutions**:

1. **Restart Home Assistant**: Settings → System → Restart

2. **Check logs** for errors:
   - Settings → System → Logs
   - Filter for "caltrain"

3. **Verify API key**:
   - Test at: http://api.511.org/transit/vehiclepositions?api_key=YOUR_KEY&agency=CT
   - Should return data, not error

4. **Re-add integration**:
   - Settings → Devices & Services
   - Remove Caltrain Tracker
   - Add again with correct API key

### "Invalid API key" Error

**Problem**: Integration setup fails with authentication error.

**Solutions**:

1. **Get new API key**:
   - Visit: https://511.org/open-data/token
   - Request new transit data token
   - Use that in integration setup

2. **Check key format**:
   - Should be format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
   - No extra spaces or characters

## Browser Console Debugging

To see detailed errors:

1. Press `F12` to open browser console
2. Go to Console tab
3. Filter for "caltrain"
4. Look for red error messages

Common console errors:

**"Failed to fetch"** → Network issue, check HA is reachable

**"Cannot read property 'xxx' of undefined"** → Entity missing attributes

**"Card type not found"** → Card not loaded, check resources

## Getting Help

If issues persist:

1. **Check logs**: Settings → System → Logs
2. **Browser console**: F12 → Console tab
3. **Verify versions**:
   - Home Assistant version
   - Integration version (manifest.json)
   - Card version (console message on load)

4. **Create GitHub issue** with:
   - Exact error message
   - Your configuration (sanitize API keys!)
   - Browser console errors
   - HA version
   - Steps to reproduce

## Quick Fixes Summary

| Issue | Quick Fix |
|-------|-----------|
| Visual editor not showing | Clear browser cache (Ctrl/Cmd+Shift+R) |
| Entity not found | Verify entity ID in Developer Tools |
| No station selector | Need 2+ entities configured |
| GPS not working | Check GPS entity has lat/lon |
| No train data | Check sensor attributes in Dev Tools |
| Refresh button disabled | Normal - outside operating hours |
| Card won't load | Check Resources, clear cache |
| Integration fails | Verify API key at 511.org |
