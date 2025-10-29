# Quick Reference - Caltrain Home Assistant Integration

## Research Summary (What We Learned)

✅ **API Works**: 511 SF Bay API confirmed working with Caltrain data  
✅ **Data Format**: GTFS Realtime protobuf (requires parsing library)  
✅ **Update Frequency**: Real-time data available every 30 seconds  
✅ **Stations**: 43 stop IDs identified (26 stations, 2 directions each)  
✅ **Active Trains**: ~8-13 trains active during service hours  

## Files Created During Research

1. **`test_api.py`** - Test script to explore API responses
2. **`extract_stops.py`** - Script to extract stop IDs from live data
3. **`docs/RESEARCH_SUMMARY.md`** - Detailed API analysis
4. **`docs/STATION_REFERENCE.md`** - Caltrain station list and stop IDs
5. **`docs/TECHNICAL_ARCHITECTURE.md`** - System design document
6. **`docs/IMPLEMENTATION_ROADMAP.md`** - Development plan with time estimates

## Key Technical Details

### API Endpoints (511 SF Bay)
```
Base: http://api.511.org/transit
- /vehiclepositions?api_key={key}&agency=CT  # Train GPS locations
- /tripupdates?api_key={key}&agency=CT       # ETAs and schedules
- /servicealerts?api_key={key}&agency=CT     # Service disruptions
```

### Required Python Libraries
```
gtfs-realtime-bindings==1.0.0  # Parse GTFS protobuf
protobuf>=4.0.0                # Protocol buffer support
```

### Stop ID Pattern
```
Format: 700XY
- X = Station number (01-26)
- Y = Direction (1=Northbound, 2=Southbound)

Examples:
- 70012 = San Francisco Southbound
- 70161 = Menlo Park Northbound  
- 70261 = Tamien Northbound
```

## Example API Response (Parsed)

### Vehicle Position
```python
{
    "vehicle_id": "132",
    "trip_id": "132",
    "route_id": "Local Weekday",
    "latitude": 37.394,
    "longitude": -122.076,
    "timestamp": 1761771272
}
```

### Trip Update
```python
{
    "trip_id": "132",
    "route_id": "Local Weekday",
    "vehicle_id": "132",
    "stop_updates": [
        {
            "stop_id": "70222",
            "arrival_time": 1761771443,  # Unix timestamp
            "sequence": 0
        },
        # ... more stops
    ]
}
```

## Integration Structure (To Build)

```
custom_components/CaltrainTracker/
├── __init__.py           # Setup coordinator, load platforms
├── manifest.json         # Dependencies, version, metadata
├── config_flow.py        # UI configuration flow
├── coordinator.py        # API polling & data management
├── const.py              # Constants & station data
├── sensor.py             # Station ETA sensors
├── device_tracker.py     # Train position trackers (phase 3)
├── strings.json          # UI text
└── translations/
    └── en.json
```

## Recommended Development Approach

### Option 1: MVP (6-8 hours)
Get basic working version ASAP:
1. Hardcode one station (San Francisco)
2. Simple config flow (API key only)
3. One sensor showing next train ETA
4. Test and deploy

### Option 2: Full Phase 1 (15-20 hours)
Production-ready core:
1. Complete config flow with station selection
2. Full coordinator with all 3 API endpoints
3. Sensors for all user-selected stations
4. Proper error handling
5. Comprehensive testing

**Recommendation**: Start with MVP, expand to Phase 1

## Sample Home Assistant Entity Output

```yaml
# sensor.caltrain_menlo_park_nb
state: "8"  # minutes until next train
attributes:
  station_name: "Menlo Park"
  direction: "Northbound"
  next_trains:
    - eta_minutes: 8
      route: "Local Weekday"
      train_id: "132"
      delay_minutes: 0
    - eta_minutes: 38
      route: "Limited"
      train_id: "416"
      delay_minutes: -2
  alerts: []
  last_update: "2025-10-29T14:25:00"
```

## Example Automation Use Cases

```yaml
# Notify when train is 10 minutes away
automation:
  - alias: "Caltrain Departure Alert"
    trigger:
      - platform: numeric_state
        entity_id: sensor.caltrain_menlo_park_nb
        below: 10
    condition:
      - condition: time
        after: "07:00:00"
        before: "09:00:00"
    action:
      - service: notify.mobile_app
        data:
          message: "Your train leaves in {{ states('sensor.caltrain_menlo_park_nb') }} minutes!"
```

## Testing Commands

```bash
# Test API directly
python3 test_api.py

# Extract current stops
python3 extract_stops.py

# Install in Home Assistant
# Copy to: /config/custom_components/caltrain_tracker/
# Then restart HA and add via UI
```

## Important Notes

### API Key Security
⚠️ **TODO**: Remove API key from AI_GUIDE.md before committing  
- Current key in code is exposed
- Move to `.env` or Home Assistant secrets
- Add `.env.example` with placeholder

### API Rate Limits
- 511 API has usage limits (not specified in docs)
- Current plan: Poll every 30 seconds
- Monitor for rate limit responses
- Implement backoff if needed

### Station Data
Two options for getting station names/coordinates:
1. **Hardcode** (recommended): Fast, reliable, no dependencies
2. **GTFS Static**: Download from Caltrain, more flexible

For v1.0: **Hardcode the data**

## Next Decision Points

### Before Writing Code:
1. **Confirm scope**: MVP or Full Phase 1?
2. **API key**: Move to secrets now or later?
3. **Stations**: Which stations to prioritize?
4. **Testing**: Production HA or test instance?

### During Development:
5. **Station list**: All 26 or subset?
6. **Sensor naming**: Long descriptive vs. short codes?
7. **Update interval**: 30s default, make configurable?

## Useful Resources

- **Home Assistant Dev Docs**: https://developers.home-assistant.io/
- **GTFS Realtime Spec**: https://developers.google.com/transit/gtfs-realtime/
- **511 API Info**: https://511.org/open-data/transit
- **Caltrain Website**: https://www.caltrain.com/

## Files to Create Next (In Order)

1. `manifest.json` - Define integration
2. `const.py` - Constants and station data
3. `coordinator.py` - API data fetching
4. `config_flow.py` - Configuration UI
5. `__init__.py` - Integration setup
6. `sensor.py` - Sensor entities
7. `strings.json` - UI strings

## Ready to Start?

All research is complete! The next step is to begin implementing Phase 1.

**Suggested first task**: Create `manifest.json` and `const.py` with the station data structure.

Would you like me to proceed with implementation?
