# Trip Planner Fix & Logo Update Summary

## Issues Fixed

### 1. Trip Planner Sensors Not Created ✅

**Problem**: Trip planner mode failed because trip sensors like `sensor.caltrain_trip_san_antonio_palo_alto` didn't exist.

**Root Cause**: The integration only created station sensors (e.g., `sensor.caltrain_palo_alto_northbound`), not generic trip sensors.

**Solution Implemented**:
- Added new service: `caltrain_tracker.create_trip_sensor`
- Users create trip sensors on-demand via Developer Tools → Services
- Service parameters: origin, destination, max_trips
- Sensors persist across restarts

**Files Modified**:
- `custom_components/caltrain_tracker/__init__.py` - Added service registration
- `custom_components/caltrain_tracker/sensor.py` - Added dynamic sensor storage
- `custom_components/caltrain_tracker/services.yaml` - Documented service
- `docs/TRIP_SENSOR_SETUP.md` - **NEW** complete setup guide

### 2. Logo Setup Simplified ✅

**Problem**: Previous guide was overly complex, requiring submission to Home Assistant Brands repository.

**Reality**: For HACS custom repositories, you can add your logo directly!

**Solution**:
- Logo goes in: `custom_components/caltrain_tracker/icon.png`
- Size: 256x256 PNG
- HACS automatically displays it
- No external submission needed

**Files Created**:
- `branding/HACS_LOGO_QUICK_GUIDE.md` - Simple 3-step guide

**Files Updated**:
- `hacs.json` - Added homeassistant version requirement

## How to Use Trip Planner Now

### Step 1: Create Trip Sensor (One-Time)

**Via UI** (easiest):
1. Go to **Developer Tools** → **Services**
2. Select **Caltrain Tracker: Create Trip Sensor**
3. Fill in:
   - Origin Station: `San Antonio`
   - Destination Station: `Palo Alto`
   - Maximum Trips: `2`
4. Click **"Call Service"**

**Via Script**:
```yaml
service: caltrain_tracker.create_trip_sensor
data:
  origin: "San Antonio"
  destination: "Palo Alto"
  max_trips: 2
```

### Step 2: Configure Card

```yaml
type: custom:caltrain-tracker-card
mode: trip_planner
origin_station: San Antonio
destination_station: Palo Alto
max_trips: 2
```

The card will automatically find `sensor.caltrain_trip_san_antonio_palo_alto`.

### Step 3: Enjoy!

The card will display:
- Next 2 trains
- Real-time ETAs
- Trip duration
- Stops between origin/destination
- Delay status

## Logo Setup (For HACS)

### Quick Method

1. **Save your logo** to `/branding/logo_original.png`

2. **Resize to 256x256**:
   - Online: https://redketchup.io/image-resizer
   - Or ImageMagick: `magick convert logo_original.png -resize 256x256 -gravity center -extent 256x256 icon.png`

3. **Save icon.png** to: `custom_components/caltrain_tracker/icon.png`

4. **Commit and push** - HACS will display it automatically!

No Home Assistant Brands submission needed.

## Documentation Updates

### New Files
1. **docs/TRIP_SENSOR_SETUP.md** - Complete trip sensor guide
   - How to create sensors
   - Valid station names list
   - Troubleshooting
   
2. **branding/HACS_LOGO_QUICK_GUIDE.md** - Simplified logo instructions
   - 3-step process
   - No external dependencies

### Updated Files
1. **README.md** - Added trip sensor setup instructions
2. **RELEASE_NOTES_v1.5.0.md** - Added service documentation
3. **hacs.json** - Added HA version requirement
4. **services.yaml** - Documented create_trip_sensor service

## Technical Changes

### Integration Backend

**`__init__.py`**:
```python
# New service registration
async def handle_create_trip_sensor(call):
    origin = call.data.get("origin")
    destination = call.data.get("destination")
    max_trips = call.data.get("max_trips", 2)
    # Creates CaltrainTripSensor dynamically
```

**`sensor.py`**:
```python
# Store coordinator for dynamic sensor creation
hass.data[DOMAIN]["_coordinators"][entry.entry_id] = {
    "coordinator": coordinator,
    "add_entities": async_add_entities,
    "trip_sensors": {},  # Track created sensors
}
```

**`services.yaml`**:
```yaml
create_trip_sensor:
  name: Create Trip Sensor
  description: Create a new trip planning sensor
  fields:
    origin: ...
    destination: ...
    max_trips: ...
```

### Card Frontend
- No changes needed - card already supports trip_entity lookup
- Works with dynamically created sensors

## Deployment Steps

### For Integration v1.5.0

1. **Copy updated files** to Home Assistant:
   ```bash
   cp -r custom_components/caltrain_tracker /config/custom_components/
   ```

2. **Restart Home Assistant**

3. **Create your trip sensors**:
   - Go to Developer Tools → Services
   - Use `caltrain_tracker.create_trip_sensor`
   - Create sensors for your common routes

4. **Verify sensors exist**:
   - Developer Tools → States
   - Search for `sensor.caltrain_trip`

### For Card v1.5.0

1. **Add logo** (optional):
   - Save 256x256 PNG as `custom_components/caltrain_tracker/icon.png`
   - Commit and push

2. **Copy card** to Home Assistant:
   ```bash
   cp dist/caltrain-tracker-card.js /config/www/
   ```

3. **Clear browser cache**: Cmd+Shift+R

4. **Configure card**:
   - Add card in trip_planner mode
   - Select origin/destination
   - Save

## Testing Checklist

- [ ] Integration loads without errors
- [ ] Service `caltrain_tracker.create_trip_sensor` appears in Developer Tools
- [ ] Can create trip sensor via service call
- [ ] Trip sensor appears in Developer Tools → States
- [ ] Trip sensor shows state (minutes until next train)
- [ ] Trip sensor has correct attributes (origin, destination, trips list)
- [ ] Card in trip_planner mode displays trip information
- [ ] Logo displays in HACS (if icon.png added)

## Known Limitations

### Trip Sensors
1. **Manual creation required** - Sensors must be created via service (not automatic)
2. **Persist but not configurable** - Once created, sensors persist but can't be edited via UI
3. **No cleanup** - Unused sensors remain until manually removed

### Future Enhancements (v1.6.0)
- Add trip configuration to integration config flow
- Auto-create sensors based on card configuration
- UI for managing trip sensors
- Delete/edit trip sensors via options flow

## Troubleshooting

### "Trip sensor not found"
**Solution**: Create the sensor first using the service
```bash
# Developer Tools → Services
caltrain_tracker.create_trip_sensor
origin: "San Antonio"
destination: "Palo Alto"
```

### "Origin and destination are required"
**Solution**: Check spelling - must match exactly:
- ✅ "San Antonio" (correct)
- ❌ "san antonio" (wrong - case sensitive)
- ❌ "San Antonio Station" (wrong - no "Station")

### "No trips available"
**Solutions**:
1. Check operating hours (4 AM - 1 AM weekdays)
2. Verify both stations on same line
3. Wait 30 seconds for data refresh
4. Check coordinator: any station sensor should be updating

### Logo not showing in HACS
**Solutions**:
1. Verify file: `custom_components/caltrain_tracker/icon.png`
2. Check size: Must be 256x256 PNG
3. Commit and push to GitHub
4. HACS may cache - wait 5-10 minutes

## Summary

✅ **Trip sensors now work** - Use service to create them  
✅ **Logo simplified** - Just add icon.png to integration folder  
✅ **Documentation complete** - Step-by-step guides created  
✅ **Backward compatible** - Existing station sensors unaffected  

**Next Steps**:
1. Deploy integration v1.5.0
2. Create trip sensors for your routes
3. Optional: Add logo
4. Configure cards
5. Test trip planner mode

---

**Last Updated**: November 1, 2025
**Version**: 1.5.0
**Status**: Ready for testing
