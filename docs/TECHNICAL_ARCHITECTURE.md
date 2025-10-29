# Technical Architecture for Caltrain Home Assistant Integration

## Overview
Custom Home Assistant integration providing real-time Caltrain train tracking, ETAs, and service alerts using the 511 SF Bay API with GTFS Realtime data.

## Component Structure

```
custom_components/CaltrainTracker/
├── __init__.py              # Integration setup & coordinator
├── manifest.json            # Integration metadata & dependencies
├── config_flow.py           # Configuration UI
├── const.py                 # Constants & station data
├── coordinator.py           # Data update coordinator
├── sensor.py                # Sensor platform (ETAs, alerts)
├── device_tracker.py        # Train position tracking (future)
├── services.yaml            # Service definitions (future)
└── strings.json             # UI translations
```

## Core Components Detail

### 1. manifest.json
```json
{
  "domain": "caltrain_tracker",
  "name": "Caltrain Tracker",
  "codeowners": ["@username"],
  "config_flow": true,
  "documentation": "https://github.com/...",
  "integration_type": "service",
  "iot_class": "cloud_polling",
  "requirements": [
    "gtfs-realtime-bindings==1.0.0",
    "protobuf>=4.0.0"
  ],
  "version": "0.1.0"
}
```

### 2. const.py
```python
"""Constants for Caltrain Tracker."""

DOMAIN = "caltrain_tracker"

# API Configuration
API_BASE_URL = "http://api.511.org/transit"
API_AGENCY = "CT"

# API Endpoints
ENDPOINT_VEHICLE_POSITIONS = "vehiclepositions"
ENDPOINT_TRIP_UPDATES = "tripupdates"
ENDPOINT_SERVICE_ALERTS = "servicealerts"

# Update intervals
DEFAULT_SCAN_INTERVAL = 30  # seconds
ALERTS_SCAN_INTERVAL = 300  # 5 minutes

# Configuration keys
CONF_API_KEY = "api_key"
CONF_STATIONS = "stations"
CONF_HOME_STATION = "home_station"
CONF_WORK_STATION = "work_station"

# Station data structure
STATIONS = {
    "70011": {"name": "San Francisco", "direction": "NB", "zone": 1, "lat": 37.7762, "lon": -122.3945},
    "70012": {"name": "San Francisco", "direction": "SB", "zone": 1, "lat": 37.7762, "lon": -122.3945},
    "70021": {"name": "22nd Street", "direction": "NB", "zone": 1, "lat": 37.7573, "lon": -122.3933},
    # ... complete list of 43+ stations
}

# Sensor types
SENSOR_TYPE_NEXT_TRAIN = "next_train"
SENSOR_TYPE_SERVICE_ALERTS = "service_alerts"
```

### 3. coordinator.py
```python
"""Data coordinator for Caltrain Tracker."""
from datetime import timedelta
import logging
import urllib.request
from google.transit import gtfs_realtime_pb2

from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed

_LOGGER = logging.getLogger(__name__)

class CaltrainDataCoordinator(DataUpdateCoordinator):
    """Coordinate fetching Caltrain data."""
    
    def __init__(self, hass: HomeAssistant, api_key: str):
        """Initialize coordinator."""
        super().__init__(
            hass,
            _LOGGER,
            name="Caltrain Data",
            update_interval=timedelta(seconds=30),
        )
        self.api_key = api_key
        
    async def _async_update_data(self):
        """Fetch data from API."""
        try:
            # Fetch all three feeds
            vehicles = await self._fetch_vehicle_positions()
            trips = await self._fetch_trip_updates()
            alerts = await self._fetch_service_alerts()
            
            return {
                "vehicles": vehicles,
                "trips": trips,
                "alerts": alerts,
                "last_update": self.last_update_success_time
            }
        except Exception as err:
            raise UpdateFailed(f"Error communicating with API: {err}")
    
    async def _fetch_vehicle_positions(self):
        """Fetch vehicle positions."""
        # Implementation
        
    async def _fetch_trip_updates(self):
        """Fetch trip updates."""
        # Implementation
        
    async def _fetch_service_alerts(self):
        """Fetch service alerts."""
        # Implementation
```

### 4. config_flow.py
```python
"""Config flow for Caltrain Tracker."""
import voluptuous as vol
from homeassistant import config_entries
from homeassistant.core import callback

class CaltrainConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle config flow."""
    
    VERSION = 1
    
    async def async_step_user(self, user_input=None):
        """Handle initial step."""
        errors = {}
        
        if user_input is not None:
            # Validate API key
            valid = await self._test_api_key(user_input[CONF_API_KEY])
            if valid:
                return self.async_create_entry(
                    title="Caltrain Tracker",
                    data=user_input
                )
            errors["base"] = "invalid_api_key"
        
        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema({
                vol.Required(CONF_API_KEY): str,
                vol.Optional(CONF_HOME_STATION): vol.In(STATION_NAMES),
                vol.Optional(CONF_WORK_STATION): vol.In(STATION_NAMES),
            }),
            errors=errors,
        )
```

### 5. sensor.py
```python
"""Sensor platform for Caltrain Tracker."""
from homeassistant.components.sensor import SensorEntity
from homeassistant.helpers.update_coordinator import CoordinatorEntity

class CaltrainStationSensor(CoordinatorEntity, SensorEntity):
    """Representation of a Caltrain station sensor."""
    
    def __init__(self, coordinator, station_id):
        """Initialize sensor."""
        super().__init__(coordinator)
        self._station_id = station_id
        self._attr_name = f"Caltrain {STATIONS[station_id]['name']}"
        self._attr_unique_id = f"caltrain_{station_id}"
    
    @property
    def state(self):
        """Return the state (next train ETA in minutes)."""
        trips = self.coordinator.data.get("trips", [])
        # Calculate next train ETA for this station
        
    @property
    def extra_state_attributes(self):
        """Return additional attributes."""
        return {
            "station_name": STATIONS[self._station_id]["name"],
            "next_trains": [...],  # List of upcoming trains
            "alerts": [...],  # Relevant alerts
            "last_update": self.coordinator.data.get("last_update"),
        }
```

## Data Flow

1. **Setup Phase**
   - User configures integration via UI (API key, stations)
   - Config flow validates API key
   - Integration creates coordinator and sensors

2. **Runtime Phase**
   - Coordinator polls 511 API every 30 seconds
   - Fetches: vehicle positions, trip updates, service alerts
   - Parses GTFS Realtime protobuf data
   - Updates all sensors with new data

3. **Sensor Updates**
   - Station sensors calculate ETAs from trip updates
   - Device trackers update train positions
   - Alert sensors display service disruptions

## API Usage Pattern

### Rate Limiting Strategy
- Maximum 1 request per endpoint per 30 seconds
- Batch all three endpoints in single update cycle
- Implement exponential backoff on errors
- Cache data for 60 seconds as fallback

### Error Handling
- Network errors: Use last known good data, retry next cycle
- API key errors: Notify user, disable polling
- Parse errors: Log warning, skip invalid entities
- Rate limit: Increase interval temporarily

## State Machine

### Station Sensor States
- **Number**: Minutes until next train (0-999)
- **"No trains"**: No upcoming trains in data
- **"Unknown"**: API error or no data
- **"Unavailable"**: Integration not configured

### Additional Attributes
- `next_trains`: Array of next 2-5 trains with ETAs
- `route_type`: "Local Weekday", "Limited", "Baby Bullet"
- `delay_minutes`: Positive if late, negative if early
- `alerts`: Array of alerts affecting this station
- `last_update`: Timestamp of last successful update

## Entity Naming Convention

### Sensors
- `sensor.caltrain_san_francisco_nb`
- `sensor.caltrain_mountain_view_sb`
- `sensor.caltrain_service_alerts`

### Device Trackers (Future)
- `device_tracker.caltrain_train_132`
- `device_tracker.caltrain_train_416`

## Configuration Example

### UI Configuration
```yaml
# Generated by config flow
caltrain_tracker:
  api_key: !secret caltrain_api_key
  home_station: "70161"  # Menlo Park NB
  work_station: "70012"  # San Francisco SB
```

### secrets.yaml
```yaml
caltrain_api_key: "your-api-key-here"
```

## Future Enhancements

### Phase 2
- Device tracker for train positions
- GPS-based nearest station detection
- Custom service to query specific routes

### Phase 3
- Historical delay statistics
- Predictive delay warnings
- Integration with calendar for commute planning

### Phase 4
- Custom Lovelace card
- Station picker with map
- Visual train tracking

## Performance Considerations

- **Memory**: ~1-2MB per integration instance
- **CPU**: Minimal (protobuf parsing ~10ms per update)
- **Network**: ~3KB per API call, ~6KB total per update cycle
- **Storage**: <1KB (config only)

## Testing Strategy

1. **Unit Tests**: Test coordinator, data parsing
2. **Integration Tests**: Test with mock API responses
3. **Manual Tests**: Deploy to developer's Home Assistant
4. **Live Testing**: Monitor with actual 511 API

## Documentation Needs

- README with setup instructions
- API key acquisition guide
- Troubleshooting guide
- Example automations
- Custom card documentation (separate project)

## Dependencies

### Python Libraries
- `gtfs-realtime-bindings==1.0.0`: GTFS parsing
- `protobuf>=4.0.0`: Protocol buffer support

### Home Assistant Version
- Minimum: 2023.1.0 (for coordinator improvements)
- Recommended: Latest stable

## Security Considerations

- API key stored in Home Assistant's encrypted config entries
- No sensitive user data collected
- All API calls over HTTP (511 API limitation)
- No authentication tokens or user credentials needed

## Deployment

### Installation Methods
1. **HACS** (future): Add custom repository
2. **Manual**: Copy to `custom_components/caltrain_tracker/`
3. **Git**: Clone into config directory

### Configuration Steps
1. Restart Home Assistant
2. Add integration via UI
3. Enter 511 API key
4. Select preferred stations
5. Add sensors to dashboard
