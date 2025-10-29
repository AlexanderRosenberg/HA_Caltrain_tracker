# Research Summary for Caltrain Home Assistant Integration

## Date: October 29, 2025

## API Analysis Complete

### 511 API Endpoints Working:
1. **Vehicle Positions** - `http://api.511.org/transit/vehiclepositions?api_key={key}&agency=CT`
   - Returns GTFS Realtime Protocol Buffer data
   - Provides: Vehicle ID, Trip ID, Route ID, GPS coordinates (lat/lon), timestamp
   - Currently tracking ~8 active vehicles
   
2. **Trip Updates** - `http://api.511.org/transit/tripupdates?api_key={key}&agency=CT`
   - Returns GTFS Realtime Protocol Buffer data
   - Provides: Trip ID, Route ID, Vehicle ID, Stop IDs, Arrival times
   - Currently tracking ~13 active trips
   - Found 43 unique stop IDs in current data
   
3. **Service Alerts** - `http://api.511.org/transit/servicealerts?api_key={key}&agency=CT`
   - Returns GTFS Realtime Protocol Buffer data
   - Provides service disruption information
   - Currently 4 active alerts

### Data Format:
- All APIs return GTFS Realtime Protocol Buffer format
- Requires `gtfs-realtime-bindings` Python library to parse
- Data structure follows GTFS Realtime specification

### Sample Data Points:
- Vehicle positions update in real-time (coordinates: lat 37.394, lon -122.075)
- Stop IDs range from 70012 to 70262 (estimated based on pattern)
- Routes include "Local Weekday", "Limited" services
- Timestamps are Unix epoch format

## Home Assistant Integration Requirements

### Core Components Needed:

1. **manifest.json**
   - Define integration metadata
   - Specify dependencies: `gtfs-realtime-bindings`, `protobuf`
   - Set version, requirements, etc.

2. **__init__.py**
   - Integration setup and configuration
   - Config flow for API key storage
   - Coordinator for API polling
   - Platform setup (sensor)

3. **config_flow.py** (NEW - needed)
   - User interface for configuration
   - API key input and validation
   - Station selection

4. **coordinator.py** (NEW - needed)
   - DataUpdateCoordinator to manage API polling
   - Cache vehicle positions, trip updates
   - Handle API rate limiting (511 has usage limits)
   - Fallback logic for failed requests

5. **sensor.py**
   - Station sensors (ETA, next trains)
   - Vehicle tracking sensors (GPS coordinates)
   - Service alert sensors
   - Device tracker entities for trains

6. **const.py** (NEW - needed)
   - Constants: API URLs, update intervals
   - Station mapping data structure

### Data Architecture:

#### Entities to Create:
1. **Station Sensors** (one per configured station)
   - Next train ETA
   - Next 2 trains list
   - Train direction
   - Service alerts affecting station
   - Attributes: stop_id, coordinates, route info

2. **Vehicle Device Trackers** (one per active train)
   - GPS location (lat/lon)
   - Current trip ID
   - Route name
   - Speed/heading if available
   - Delay information

3. **Trip Sensors** (for user's saved trips)
   - Home -> Work ETA
   - Work -> Home ETA
   - Based on stop pairs

4. **Alert Sensor** (single, global)
   - Current service alerts
   - Attributes: list of all active alerts

### Station Data Challenge:
- Need static GTFS data or hardcoded station list
- Stop IDs are known (70012-70262 range)
- Need station names, coordinates, order
- Options:
  1. Download Caltrain GTFS static feed once during setup
  2. Hardcode station list (32 stations total)
  3. Query 511 static endpoints if available

### Update Strategy:
- Vehicle positions: Every 30 seconds (real-time tracking)
- Trip updates: Every 30 seconds (for ETAs)
- Service alerts: Every 5 minutes (less frequent updates)
- Use single coordinator with separate update intervals

### Configuration Options:
- API key (required, stored securely)
- Home station (optional)
- Work station (optional)
- Favorite stations (optional, list)
- Enable/disable vehicle tracking
- Update intervals (advanced)

## Next Steps for Development:

### Phase 1: Core Integration (Priority)
1. ✅ Test and understand 511 API responses
2. Create manifest.json with dependencies
3. Implement config_flow.py for setup
4. Build coordinator.py for data management
5. Create const.py with constants
6. Implement basic sensor.py for station ETAs

### Phase 2: Station Data (Required for Phase 1)
- Decision needed: How to get station names/coordinates?
  - Option A: Hardcode 32 stations (fastest, no external dependency)
  - Option B: Download GTFS static on setup (most flexible)
  - Option C: User enters station info (bad UX)
- **Recommendation: Hardcode station list for v1.0**

### Phase 3: Enhanced Features
1. Vehicle tracking device trackers
2. Trip-based sensors (home to work)
3. Location-based station selection
4. Service alert integration
5. Late train indicators

### Phase 4: Custom Card (Separate Project)
- Lovelace card using Mushroom theme
- Station picker
- ETA display
- GPS-based nearest station

## Technical Decisions:

### Dependencies:
```python
# manifest.json requirements
"requirements": [
    "gtfs-realtime-bindings==1.0.0",
    "protobuf>=4.0.0"
]
```

### Update Intervals:
- Default: 30 seconds for realtime data
- Minimum: 15 seconds (respect API limits)
- Maximum: 5 minutes (for alerts)

### Error Handling:
- Network failures: Retry with exponential backoff
- Invalid API key: Show config error
- No data: Use last known good data
- API rate limit: Increase polling interval temporarily

### Data Storage:
- Use `hass.data[DOMAIN]` for shared coordinator
- Store API key in config entries (encrypted)
- Cache station data in memory

## Questions for Developer:

1. **Station List**: Should I hardcode the 32 Caltrain stations or try to fetch them dynamically?
   
2. **API Key Security**: The current API key is in AI_GUIDE.md - should I add it to .gitignore or keep it as is? (Note: It's a public 511 API key, might be acceptable)

3. **Update Frequency**: What update interval would you like? 30 seconds for real-time feels right but uses more API quota.

4. **Initial Scope**: Should we implement all sensor types in v1.0, or start with just station ETAs?

5. **Station Selection**: For "nearest station" feature, do you want to use Home Assistant's device tracker entities, or have user manually set location?

## References:
- 511 API Documentation: docs/511 SF Bay Open Data Specification - Transit.pdf
- Home Assistant Developer Docs: https://developers.home-assistant.io/docs/creating_component_index
- GTFS Realtime Spec: https://developers.google.com/transit/gtfs-realtime/
