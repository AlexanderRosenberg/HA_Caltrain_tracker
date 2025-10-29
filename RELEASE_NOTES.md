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
