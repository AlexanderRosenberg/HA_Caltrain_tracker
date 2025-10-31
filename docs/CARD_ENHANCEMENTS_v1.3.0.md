# Card Enhancements - Version 1.3.0

## Overview
The custom Caltrain tracker card has been enhanced with four major features:
1. **Visual Configuration Editor** - Easy-to-use GUI for card setup
2. **Delay indicators** - Shows if trains are running late
3. **Manual refresh button** - Refresh data on-demand with operating hours respect
4. **Station selector** - Choose from multiple stations or use GPS proximity

## New Features

### 1. Visual Configuration Editor
- **Built-in GUI**: No need to write YAML for basic configuration
- **Auto-detection**: Automatically finds all Caltrain sensor entities
- **Dropdowns**: Easy selection for entities and GPS devices
- **Live Preview**: See changes as you configure
- **Field Validation**: Smart field visibility based on options
- **Help Text**: Descriptions for each configuration option

**How to Use:**
1. Add card in Lovelace UI
2. Search "Caltrain Tracker Card"
3. Configure using visual interface
4. Save and done!

### 2. Delay/Late Train Indicators
- Displays delay badges on trains that are running late or early
- **Late trains** show a red badge: `+Xmin` (X = minutes late)
- **Early trains** show a green badge: `-Xmin` (X = minutes early)
- Delayed trains have a red border and highlighted background
- Trip IDs are now displayed next to route names
- **Note**: Currently the GTFS feed does not provide delay data in the `delay` field. The backend is ready to display it when/if Caltrain adds this to their feed.

### 3. Manual Refresh Button
- Click the refresh icon button to manually update train data
- Button shows a spinning animation while refreshing
- **Respects operating hours**: Disabled outside of train service times
  - **Weekdays**: 4:00 AM - 1:00 AM
  - **Weekends**: 6:00 AM - 1:00 AM
- Prevents unnecessary API calls during non-service hours

### 4. Station Selector & GPS Proximity
- When multiple stations are configured, a dropdown selector appears
- Select any station from the dropdown to view its trains
- **GPS-based station selection**: Automatically selects the closest station
  - Enable with `use_gps: true` in card config
  - Specify your GPS entity (device_tracker or person)
  - Uses Haversine formula to calculate distances
- Station selection is prioritized: Manual selection > GPS > Config default

## Configuration

### Basic Single Station (Original)
```yaml
type: custom:caltrain-tracker-card
entity: sensor.caltrain_palo_alto_northbound
name: Palo Alto Station
```

### Multiple Stations with Selector
```yaml
type: custom:caltrain-tracker-card
entities:
  - sensor.caltrain_palo_alto_northbound
  - sensor.caltrain_palo_alto_southbound
  - sensor.caltrain_san_antonio_northbound
  - sensor.caltrain_san_antonio_southbound
name: Caltrain Stations
# Station selector shows automatically with multiple entities
```

### GPS-Based Station Selection
```yaml
type: custom:caltrain-tracker-card
entities:
  - sensor.caltrain_palo_alto_northbound
  - sensor.caltrain_palo_alto_southbound
  - sensor.caltrain_san_antonio_northbound
  - sensor.caltrain_san_antonio_southbound
use_gps: true
gps_entity: person.alex
show_station_selector: true  # Optional: Allow manual override
name: Nearest Station
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `entity` | string | *required* | Single station sensor entity (if not using `entities`) |
| `entities` | list | `null` | Multiple station sensors for selector/GPS |
| `name` | string | `null` | Card title |
| `show_alerts` | boolean | `true` | Show service alerts |
| `max_trains` | number | `2` | Maximum trains to display |
| `show_station_selector` | boolean | `true`* | Show dropdown selector (auto-enabled with multiple entities) |

\* Automatically enabled when multiple entities configured; set to `false` to hide
| `use_gps` | boolean | `false` | Enable GPS-based station selection |
| `gps_entity` | string | `null` | Device tracker or person entity for GPS coordinates |

## What's Changed

### Backend (Coordinator & Sensor)
- ✅ Updated `coordinator.py` to capture delay field from GTFS feed (if available)
- ✅ Updated `sensor.py` to include delay and scheduled_time in sensor attributes
- ✅ Backend ready to pass delay data when Caltrain adds it to their feed

### Frontend (Custom Card)
- ✅ **NEW**: Visual configuration editor with GUI
- ✅ **NEW**: Auto-detection of Caltrain entities
- ✅ Added delay badge display with color coding (red=late, green=early)
- ✅ Implemented manual refresh button with operating hours check
- ✅ Created station selector dropdown for multiple entities
- ✅ Built GPS proximity calculation using Haversine formula
- ✅ Added entity selection priority logic
- ✅ Enhanced UI with new CSS styles and animations
- ✅ Display trip IDs alongside route names

### Build
- ✅ Card rebuilt from TypeScript source
- ✅ Output: `dist/caltrain-tracker-card.js` (38KB with visual editor)

## Installation/Update

1. **Copy the new JavaScript file to Home Assistant**:
   ```bash
   cp dist/caltrain-tracker-card.js /path/to/homeassistant/www/caltrain-tracker-card.js
   ```

2. **Restart Home Assistant** (for backend coordinator changes)

3. **Clear browser cache** (Ctrl+Shift+R or Cmd+Shift+R)

4. **Update your Lovelace card configuration** with new options as desired

## Testing Checklist

- [ ] **Visual editor opens** when adding/editing card
- [ ] **Entity dropdowns populate** with Caltrain sensors
- [ ] **GPS entity dropdown** shows device trackers and persons
- [ ] **Configuration saves** and applies correctly
- [ ] Card displays with new refresh button
- [ ] Refresh button works and respects operating hours
- [ ] Multiple stations show dropdown selector (if configured)
- [ ] GPS proximity selects nearest station (if configured with GPS)
- [ ] Delay badges appear (once Caltrain provides delay data)
- [ ] Trip IDs display next to route names
- [ ] Manual station selection overrides GPS selection

## Known Limitations

1. **No delay data currently available**: Caltrain's GTFS feed does not populate the `delay` field. When they add this, it will automatically appear without code changes.

2. **Operating hours are hardcoded**: Based on current Caltrain schedule
   - Weekdays: 4:00 AM - 1:00 AM
   - Weekends: 6:00 AM - 1:00 AM

3. **GPS requires station coordinates**: Uses station lat/lon from STATIONS constant in `const.py`

## Future Enhancements

- Add configurable operating hours
- Calculate estimated delay by comparing with historical schedule data
- Add time-to-destination feature (select destination station)
- Visual train map with current positions

## Version History

- **v1.3.0** (Current): Delay indicators, refresh button, station selector, GPS proximity
- **v1.1.0**: Device tracker platform for live train GPS
- **v1.0.0**: Initial MVP with station sensors and custom card
