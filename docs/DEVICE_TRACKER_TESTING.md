# Device Tracker Implementation - Testing Guide

## What We Built

Added real-time GPS tracking for Caltrain trains that appear on Home Assistant maps.

## Files Modified

1. **coordinator.py** - Added vehicle position fetching
2. **device_tracker.py** - NEW: Device tracker platform
3. **__init__.py** - Registered device tracker platform
4. **manifest.json** - Bumped version to 1.1.0
5. **RELEASE_NOTES.md** - Added v1.1.0 release notes
6. **README.md** - Documented device tracker feature

## How It Works

### Data Flow
1. Coordinator fetches vehicle positions from 511 API every 30 seconds
2. Returns list of vehicles with GPS coordinates, speed, bearing, etc.
3. Device tracker platform creates `device_tracker.caltrain_train_{id}` entities
4. Entities update automatically when coordinator updates
5. Trains appear on Home Assistant map cards

### Key Features
- Dynamically creates trackers as trains appear
- Shows speed in MPH (converted from m/s)
- Includes bearing/direction
- Shows trip ID and route info
- Last seen timestamp
- 50m location accuracy

## Testing Steps

### 1. Deploy to Home Assistant

```bash
# From your repository root
cd /Users/alexrosenberg/Documents/Gitrepos/HA_Caltrain_tracker

# Commit changes
git add -A
git commit -m "Add real-time train tracking on map (v1.1.0)"

# Create version tag
git tag v1.1.0

# Push to GitHub
git push origin main
git push origin v1.1.0
```

### 2. Create GitHub Release

1. Go to https://github.com/AlexanderRosenberg/HA_Caltrain_tracker/releases/new
2. Select tag: `v1.1.0`
3. Title: `v1.1.0 - Real-Time Train Tracking`
4. Description: Copy from RELEASE_NOTES.md
5. Click "Publish release"

### 3. Update in Home Assistant

**Option A: Via HACS**
1. Go to HACS → Integrations
2. Find "Caltrain Tracker"
3. Click "Redownload" or "Update"
4. Restart Home Assistant

**Option B: Manual Update**
1. Copy entire `custom_components/caltrain_tracker` folder
2. Replace existing folder in Home Assistant
3. Restart Home Assistant

### 4. Verify Device Trackers

After restart, check:

**Developer Tools → States**
- Filter for `device_tracker.caltrain_train`
- Should see multiple trains (typically 6-12 active trains)
- Each should have state "home" or coordinates
- Check attributes: vehicle_id, trip_id, route, speed_mph, bearing

**Expected entities:**
```
device_tracker.caltrain_train_501
device_tracker.caltrain_train_135
device_tracker.caltrain_train_268
...etc
```

### 5. Add to Map Card

**Quick Test:**
1. Go to any dashboard
2. Click "Edit Dashboard"
3. Add card → Map
4. Map should automatically show all device trackers
5. Zoom to Bay Area
6. Watch trains update every 30 seconds

**Custom Configuration:**
```yaml
type: map
entities:
  - device_tracker.caltrain_train_501
  - device_tracker.caltrain_train_135
default_zoom: 11
hours_to_show: 1
```

### 6. Verify Attributes

Click on a train on the map, should show:
```
vehicle_id: 501
trip_id: 132
route: CT
speed_mph: 45.2
bearing: 180
last_seen: 2025-01-29 14:30:15
source: 511 SF Bay API
```

## Troubleshooting

### No Device Trackers Appear

**Check coordinator data:**
```yaml
# Developer Tools → States
# Look at sensor.caltrain_palo_alto_northbound
# Check attributes for "vehicle_count"
```

**Check logs:**
```
Settings → System → Logs
Filter: caltrain
Look for: "Added X new train trackers"
```

**Verify API is returning vehicles:**
```python
# Run from repository
python test_api.py
# Should show vehicle positions in output
```

### Trains Don't Move

- Check update interval: Should update every 30 seconds
- Verify last_update attribute is changing
- Check if train is actually moving (might be at station)
- Verify bearing attribute exists (indicates movement)

### Missing Attributes

- speed_mph: Only present when train is moving
- bearing: Only present when train is moving
- trip_id/route: Always present
- Check logs for parsing errors

## API Data Reference

### Vehicle Position Data Structure
From 511 API vehiclepositions endpoint:
```json
{
  "vehicle_id": "501",
  "trip_id": "132",
  "route_id": "CT",
  "latitude": 37.4429,
  "longitude": -122.1643,
  "bearing": 180,
  "speed": 20.1,  // meters/second
  "timestamp": 1738181415
}
```

### Typical Train Count
- Off-peak: 4-6 active trains
- Peak hours: 10-15 active trains
- Weekend: 2-4 active trains

## Next Steps (Future Work)

Once device tracking is verified working:

1. **Custom Lovelace Card** (User requested)
   - Station selector dropdown
   - Next 3 trains with ETAs
   - Service alerts display
   - Maybe mini map showing nearby trains
   
2. **Enhanced Tracking Features**
   - Train icons instead of dots (custom markers)
   - Different colors for northbound/southbound
   - Train labels (show train number on map)
   - Speed indicators (color-coded)
   
3. **Historical Data**
   - Track delays over time
   - Performance metrics
   - Reliability statistics

## Success Criteria

✅ Device trackers appear after integration loads
✅ Trains show correct GPS coordinates
✅ Positions update every 30 seconds
✅ Speed and bearing attributes present when moving
✅ Trains visible on map card
✅ Can click train to see attributes
✅ Old trains disappear when no longer active

## Questions to Verify

1. Do you see multiple `device_tracker.caltrain_train_*` entities?
2. Do trains appear on the map in the Bay Area?
3. Do they move when you wait 30-60 seconds?
4. Can you see speed and bearing attributes?
5. Does the map update smoothly without errors?

Let me know what you see and we can troubleshoot any issues!
