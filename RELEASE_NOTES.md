# Release v1.3.0 - Enhanced Custom Card

## ✨ New Features: Delay Indicators, Refresh Button, Station Selector

Major enhancements to the custom Lovelace card!

### What's New

- 🔴 **Delay/Late Train Indicators**: Visual badges show if trains are running late (+Xmin) or early (-Xmin)
- 🔄 **Manual Refresh Button**: Refresh train data on-demand, respects operating hours (Weekdays 4AM-1AM, Weekends 6AM-1AM)
- 📍 **Station Selector**: Dropdown to switch between multiple configured stations
- 🧭 **GPS Proximity**: Auto-select nearest station based on your device tracker or person entity
- 🎫 **Trip ID Display**: See trip numbers next to route names
- 🎨 **Enhanced UI**: New CSS animations, loading spinner, delayed train highlighting

### Configuration Examples

#### Multiple Stations with Selector
```yaml
type: custom:caltrain-tracker-card
entities:
  - sensor.caltrain_palo_alto_northbound
  - sensor.caltrain_palo_alto_southbound
show_station_selector: true
name: Palo Alto Stations
```

#### GPS-Based Nearest Station
```yaml
type: custom:caltrain-tracker-card
entities:
  - sensor.caltrain_palo_alto_northbound
  - sensor.caltrain_san_antonio_northbound
use_gps: true
gps_entity: person.alex
name: Nearest Station
```

### Backend Improvements

- **Coordinator**: Now captures delay field from GTFS feed (ready when Caltrain populates it)
- **Sensor**: Passes delay and scheduled_time to card attributes
- **Operating Hours Check**: Built-in validation prevents API calls during non-service hours

### Known Limitations

- Caltrain's GTFS feed currently doesn't populate the `delay` field
- Code is ready to display delays once Caltrain adds this data to their feed

### Upgrade Instructions

1. Copy `dist/caltrain-tracker-card.js` to `/config/www/`
2. Restart Home Assistant (for backend changes)
3. Clear browser cache (Ctrl+Shift+R)
4. Update card configuration with new options

---

# Release v1.1.0 - Real-Time Train Tracking

## ✨ New Feature: Live Train Positions on Map

Track Caltrain trains in real-time on Home Assistant maps!

### What's New

- 🚆 **Device Tracker Platform**: Trains now appear as device trackers on the map
- 📍 **GPS Updates**: Train positions update every 30 seconds from 511 API
- 🧭 **Rich Attributes**: See speed (mph), bearing, trip ID, and route info
- 🗺️ **Live Movement**: Watch trains move along the tracks in real-time

### Usage

Device trackers are automatically created for all active trains:
- `device_tracker.caltrain_train_501`
- `device_tracker.caltrain_train_135`
- etc.

Add them to your map card to see trains moving live!

### Attributes

Each train tracker includes:
- GPS coordinates (latitude/longitude)
- Speed in MPH
- Bearing/direction
- Trip ID and route
- Last seen timestamp
- 50m location accuracy

### Requirements

No additional setup needed! Just update the integration and device trackers will appear automatically.

---

# Release v1.0.0 - Caltrain Tracker MVP

## 🎉 Initial Release

First public release of Caltrain Tracker for Home Assistant!

## Features

- ✅ Real-time train ETAs from 511 SF Bay API
- ✅ Support for Palo Alto and San Antonio stations (both directions)
- ✅ User-friendly configuration flow with API key validation
- ✅ Automatic updates every 30 seconds
- ✅ Service alerts integration
- ✅ Detailed sensor attributes (next trains, coordinates, zones)

## Installation

### Via HACS (Recommended)

1. Add this repository as a custom repository in HACS
2. Search for "Caltrain Tracker"
3. Click Install
4. Restart Home Assistant
5. Add the integration via Settings → Devices & Services

### Manual Installation

1. Copy `custom_components/caltrain_tracker` to your Home Assistant's `config/custom_components/` directory
2. Restart Home Assistant
3. Add the integration via Settings → Devices & Services

## Configuration

1. Get a free API key from https://511.org/open-data/token
2. Enter the API key when prompted
3. Select which stations to track
4. Done!

## Sensors Created

- `sensor.caltrain_palo_alto_northbound`
- `sensor.caltrain_palo_alto_southbound`
- `sensor.caltrain_san_antonio_northbound`
- `sensor.caltrain_san_antonio_southbound`

## Requirements

- Home Assistant 2023.1.0 or newer
- 511 SF Bay API key (free)
- Internet connection

## Documentation

See the [README](README.md) for full documentation, examples, and troubleshooting.

## Known Limitations

- Only supports Palo Alto and San Antonio stations in this release
- No vehicle GPS tracking yet
- Service operates during Caltrain hours only

## Future Plans

- Support for all 26 Caltrain stations
- Vehicle position tracking
- Nearest station detection
- Custom Lovelace card

## Support

- [Report Issues](https://github.com/AlexanderRosenberg/HA_Caltrain_tracker/issues)
- [Documentation](https://github.com/AlexanderRosenberg/HA_Caltrain_tracker)

---

**Credits**: Data provided by 511 SF Bay (https://511.org/)
