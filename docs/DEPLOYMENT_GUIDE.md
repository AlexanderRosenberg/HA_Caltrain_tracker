# Deployment Guide - Caltrain Tracker MVP

## Pre-Deployment Checklist

✅ All core files created:
- `__init__.py` - Integration setup
- `manifest.json` - Metadata and dependencies
- `const.py` - Constants and station data
- `coordinator.py` - API polling
- `config_flow.py` - Configuration UI
- `sensor.py` - Sensor entities
- `strings.json` - UI text
- `translations/en.json` - English translations

✅ API key removed from documentation
✅ Stations configured: Palo Alto & San Antonio (both directions)

## Deployment Steps

### 1. Locate Your Home Assistant Configuration Directory

Your Home Assistant config directory is typically at:
- Home Assistant OS: `/config/`
- Home Assistant Container: `/config/`
- Home Assistant Core: `~/.homeassistant/`

### 2. Copy Integration Files

Copy the entire `custom_components/caltrain_tracker` folder to your Home Assistant configuration directory:

```bash
# From your development directory
cd /Users/alexrosenberg/Documents/Gitrepos/HA_Caltrain_tracker

# Copy to Home Assistant (adjust path as needed)
# Option A: If using SSH/SCP
scp -r custom_components/caltrain_tracker/ user@homeassistant:/config/custom_components/caltrain_tracker/

# Option B: If using Samba/network share
cp -r custom_components/caltrain_tracker/ /path/to/homeassistant/config/custom_components/caltrain_tracker/

# Option C: Manual via File Editor add-on in Home Assistant
# Use the File Editor add-on to create the folder structure and paste file contents
```

**Note**: The folder is already correctly named to match the domain in manifest.json.

### 3. Verify File Structure

Your Home Assistant should have:
```
config/
└── custom_components/
    └── caltrain_tracker/
        ├── __init__.py
        ├── config_flow.py
        ├── const.py
        ├── coordinator.py
        ├── manifest.json
        ├── sensor.py
        ├── strings.json
        └── translations/
            └── en.json
```

### 4. Restart Home Assistant

- Go to **Settings** → **System** → **Restart**
- Or use the command line: `ha core restart`
- Wait for Home Assistant to fully restart (1-2 minutes)

### 5. Check for Loading Errors

After restart:
1. Go to **Settings** → **System** → **Logs**
2. Look for any errors related to `caltrain_tracker`
3. Common issues:
   - Missing files: Double-check file structure
   - Import errors: Usually resolve after dependencies install
   - Syntax errors: Check logs for line numbers

### 6. Add the Integration

1. Go to **Settings** → **Devices & Services**
2. Click **+ Add Integration** (bottom right)
3. Search for "Caltrain" or "Caltrain Tracker"
4. Click on **Caltrain Tracker**

### 7. Configuration Steps

**Step 1: Enter API Key**
- Paste your 511 API key
- Get one at: https://511.org/open-data/token
- Click **Submit**
- Wait for validation (5-10 seconds)

**Step 2: Select Stations**
- You'll see 4 options:
  - Palo Alto Northbound
  - Palo Alto Southbound
  - San Antonio Northbound
  - San Antonio Southbound
- Select the stations you want to track
- Default: All 4 are selected
- Click **Submit**

### 8. Verify Sensors Created

After successful setup:
1. Go to **Settings** → **Devices & Services**
2. Find **Caltrain Tracker** in the list
3. Click on it to see your sensors
4. You should see 2-4 sensors depending on your selection

### 9. Test Sensors

1. Go to **Developer Tools** → **States**
2. Search for `sensor.caltrain`
3. You should see your sensors with states:
   - Number (e.g., `8`) = minutes to next train
   - `"No trains"` = no upcoming trains
   - `unavailable` = integration not updating (check logs)

### 10. View Sensor Details

Click on any sensor to see:
- Current state (ETA in minutes)
- Attributes:
  - `next_trains`: List of upcoming trains
  - `station_name`, `direction`, `zone`
  - `alerts`: Service alerts (if any)
  - `last_update`: Last data refresh time

## Testing Checklist

After deployment, verify:

- [ ] Integration appears in Devices & Services
- [ ] All selected sensors created
- [ ] Sensors show valid data (number or "No trains")
- [ ] Sensors update every 30 seconds
- [ ] Attributes contain train information
- [ ] No errors in logs
- [ ] Can add sensor to dashboard
- [ ] Sensor shows in entity list

## Common Issues & Solutions

### Issue: Integration Not Found

**Symptoms**: Can't find "Caltrain Tracker" when adding integration

**Solutions**:
1. Verify files are in `config/custom_components/caltrain_tracker/`
2. Check folder name is exactly `caltrain_tracker`
3. Restart Home Assistant again
4. Check logs for loading errors

### Issue: Invalid API Key

**Symptoms**: Error message during configuration

**Solutions**:
1. Verify API key at https://511.org/open-data/token
2. Check for extra spaces or characters
3. Generate a new API key
4. Test API key manually: `curl "http://api.511.org/transit/tripupdates?api_key=YOUR_KEY&agency=CT"`

### Issue: Sensors Show "Unavailable"

**Symptoms**: All sensors show unavailable state

**Solutions**:
1. Check Home Assistant logs for errors
2. Verify internet connection
3. Test 511 API is working (curl command above)
4. Check if dependencies installed: Look for `gtfs-realtime-bindings` in logs
5. Restart Home Assistant

### Issue: "No trains" During Business Hours

**Symptoms**: Sensors show "No trains" when trains should be running

**Possible Causes**:
1. Actually no trains scheduled (check Caltrain schedule)
2. API data delayed or missing
3. Wrong station selected

**Solutions**:
1. Check Caltrain status: https://www.caltrain.com/status
2. Verify at least one train is scheduled for your station
3. Check sensor attributes for raw data
4. Wait 1-2 minutes for next update

### Issue: Dependencies Not Installing

**Symptoms**: Errors about `google.transit` or `gtfs_realtime_pb2`

**Solutions**:
1. Check Home Assistant has internet access
2. Wait 5 minutes - dependencies install on first load
3. Restart Home Assistant
4. Check logs for pip install errors

## Rollback Procedure

If something goes wrong:

1. **Remove Integration**:
   - Go to **Settings** → **Devices & Services**
   - Find **Caltrain Tracker**
   - Click **...** → **Delete**

2. **Remove Files**:
   ```bash
   rm -rf /config/custom_components/caltrain_tracker/
   ```

3. **Restart Home Assistant**

## Next Steps After Successful Deployment

1. **Add to Dashboard**:
   - Create an entities card with your sensors
   - Use the README examples for inspiration

2. **Create Automations**:
   - Set up departure notifications
   - Alert on service disruptions

3. **Test Edge Cases**:
   - Late night (no trains)
   - Service alerts
   - Network disconnection

4. **Monitor Logs**:
   - Watch for any warnings or errors
   - Check API usage

## Need Help?

If you encounter issues:

1. **Check Logs**: Settings → System → Logs
2. **Check Sensor States**: Developer Tools → States
3. **Test API Manually**: Use curl or test_api.py script
4. **Review Documentation**: See `/docs` folder for technical details

## Success Criteria

Your MVP is successfully deployed when:

✅ Integration loads without errors
✅ Configuration flow completes successfully  
✅ All selected sensors appear
✅ Sensors show valid ETA data
✅ Data updates every 30 seconds
✅ Attributes contain train information
✅ No errors in logs

**Congratulations!** Your Caltrain Tracker MVP is now live! 🎉
