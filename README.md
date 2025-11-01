# Caltrain Tracker for Home Assistant

A custom Home Assistant integration that provides real-time Caltrain train tracking, arrival predictions, and service alerts using the 511 SF Bay API.

**Now includes trip planner with smart direction detection!** 🎨✨

## Features

- 🚂 **Real-time ETAs**: Get minute-by-minute updates for next arriving trains
- 🗺️ **Live Train Tracking**: See trains moving on your Home Assistant map in real-time
- 🎴 **Trip Planner Mode**: Select origin and destination - no need to specify direction! (NEW in v1.5.0)
- 🧭 **Smart Direction Detection**: Automatically determines northbound/southbound based on station zones
- 📍 **28 Caltrain Stations**: Track any station from SF to Tamien
- ⚠️ **Service Alerts**: Stay informed about delays and service disruptions
- 🔄 **Auto-updating**: Data refreshes every 30 seconds
- 🎨 **Easy Setup**: Simple configuration flow with API key validationracker for Home Assistant

A custom Home Assistant integration that provides real-time Caltrain train tracking, arrival predictions, and service alerts using the 511 SF Bay API.

## Features

- 🚂 **Real-time ETAs**: Get minute-by-minute updates for next arriving trains
- �️ **Live Train Tracking**: See trains moving on your Home Assistant map in real-time
- �📍 **Multiple Stations**: Track San Antonio and Palo Alto stations (both directions)
- ⚠️ **Service Alerts**: Stay informed about delays and service disruptions
- 🔄 **Auto-updating**: Data refreshes every 30 seconds
- 🎨 **Easy Setup**: Simple configuration flow with API key validation

## Installation

### Step 1: Copy Files

Copy the `custom_components/caltrain_tracker` folder to your Home Assistant `custom_components` directory:

```
/config/custom_components/caltrain_tracker/
```

Your file structure should look like:
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

### Step 2: Get Your 511 API Key

1. Go to https://511.org/open-data/token
2. Sign up for a free API key (no credit card required)
3. Save your API key - you'll need it for setup

### Step 3: Restart Home Assistant

Restart Home Assistant to load the new integration.

### Step 4: Add the Integration

1. Go to **Settings** → **Devices & Services**
2. Click **+ Add Integration**
3. Search for "Caltrain Tracker"
4. Enter your 511 API key when prompted
5. Select which stations you want to track
6. Click Submit

## Usage

### Station Sensors

The integration creates one sensor for each selected station:

- `sensor.caltrain_palo_alto_northbound`
- `sensor.caltrain_palo_alto_southbound`
- `sensor.caltrain_san_antonio_northbound`
- `sensor.caltrain_san_antonio_southbound`

### Device Trackers (NEW in v1.1.0!)

Device trackers are automatically created for all active Caltrain trains on the network:

- `device_tracker.caltrain_train_501`
- `device_tracker.caltrain_train_135`
- `device_tracker.caltrain_train_268`
- etc.

**How to use:**
1. Add a map card to your dashboard
2. Device trackers will automatically appear on the map
3. Watch trains move in real-time as they update every 30 seconds

**Device Tracker Attributes:**
- GPS coordinates (latitude/longitude)
- Speed in MPH
- Bearing/direction
- Trip ID and route
- Last seen timestamp
- Location accuracy (~50m)

### Sensor States

- **Number** (e.g., `8`): Minutes until next train arrives
- **"No trains"**: No upcoming trains in the schedule

### Sensor Attributes

Each sensor includes detailed attributes:

```yaml
station_name: "Palo Alto"
direction: "Northbound"
zone: 4
latitude: 37.4429
longitude: -122.1643
stop_id: "70171"
next_trains:
  - trip_id: "132"
    route: "Local Weekday"
    eta_minutes: 8
    arrival_time: "02:15 PM"
  - trip_id: "416"
    route: "Limited"
    eta_minutes: 38
    arrival_time: "02:45 PM"
train_count: 2
alerts: []
alert_count: 0
last_update: "2025-10-29 14:25:00"
```

## Example Automations

### Departure Notification

Get notified when your train is 10 minutes away:

```yaml
automation:
  - alias: "Caltrain Departure Alert"
    trigger:
      - platform: numeric_state
        entity_id: sensor.caltrain_palo_alto_northbound
        below: 10
    condition:
      - condition: time
        after: "07:00:00"
        before: "09:00:00"
      - condition: state
        entity_id: person.you
        state: "home"
    action:
      - service: notify.mobile_app_your_phone
        data:
          message: "Your train leaves in {{ states('sensor.caltrain_palo_alto_northbound') }} minutes!"
          title: "🚂 Caltrain Departure"
```

### Service Alert Notification

Get notified about service disruptions:

```yaml
automation:
  - alias: "Caltrain Service Alert"
    trigger:
      - platform: state
        entity_id: sensor.caltrain_palo_alto_northbound
        attribute: alert_count
    condition:
      - condition: template
        value_template: "{{ state_attr('sensor.caltrain_palo_alto_northbound', 'alert_count') | int > 0 }}"
    action:
      - service: notify.mobile_app_your_phone
        data:
          message: "Check Caltrain service alerts"
          title: "⚠️ Caltrain Alert"
```

## Lovelace Card Examples

### Simple Entities Card

```yaml
type: entities
entities:
  - entity: sensor.caltrain_palo_alto_northbound
    name: To SF
  - entity: sensor.caltrain_palo_alto_southbound
    name: To SJ
title: Palo Alto Station
icon: mdi:train
```

### Multiple Trains Card

```yaml
type: markdown
content: |
  ## 🚂 Palo Alto Northbound
  {% set trains = state_attr('sensor.caltrain_palo_alto_northbound', 'next_trains') %}
  {% if trains %}
  {% for train in trains %}
  - **{{ train.route }}** - {{ train.eta_minutes }} min ({{ train.arrival_time }})
  {% endfor %}
  {% else %}
  No trains scheduled
  {% endif %}
```

## Custom Card

### 🎴 Caltrain Tracker Card

We've created a beautiful custom Lovelace card specifically for this integration!

**Features:**
- 📊 Clean, modern design with dual modes
- 🗺️ **Trip Planner Mode**: Select origin/destination for real-time trip ETAs (NEW v1.5.0)
- 🧭 **Smart Direction Detection**: No need to specify northbound/southbound
- ⏱️ Color-coded train types (Baby Bullet, Limited, Local)
- 🚆 Trip duration, intermediate stops, and delay status
- ⏰ Countdown timers for departures
- ⚠️ Service alerts display
- 🎨 Theme-aware styling
- 📱 Mobile responsive

**Installation:**

1. **Via HACS** (add repo as "Dashboard"):
   - HACS → Frontend → Custom repositories
   - Add: `https://github.com/AlexanderRosenberg/HA_Caltrain_tracker`
   - Type: Dashboard

2. **Manual**: Copy `dist/caltrain-tracker-card.js` to `/config/www/`

**Usage - Trip Planner Mode (NEW):**

**First, create the trip sensor** (one-time setup):
1. Go to Developer Tools → Services
2. Select "Caltrain Tracker: Create Trip Sensor"
3. Enter origin: `San Antonio`, destination: `Palo Alto`
4. Click "Call Service"

**Then configure the card:**
```yaml
type: custom:caltrain-tracker-card
mode: trip_planner
origin_station: San Antonio
destination_station: Palo Alto
max_trips: 2  # Show next 2 trains
```

**See [docs/TRIP_SENSOR_SETUP.md](docs/TRIP_SENSOR_SETUP.md) for detailed instructions.**

**Usage - Station List Mode:**

```yaml
type: custom:caltrain-tracker-card
mode: station_list
entity: sensor.caltrain_palo_alto_northbound
name: "My Commute"
max_trains: 3
show_alerts: true
```

**What's New in v1.5.0:**

✨ **Trip Planner Features:**
- Select any origin and destination station
- Automatic direction detection (no more northbound/southbound selection)
- Real-time trip duration and ETA
- Countdown timers ("departs in 3 min")
- Number of stops between origin and destination
- Color-coded train types (Baby Bullet 🔴, Limited 🟠, Local 🟢)
- On-time/delayed status indicators
- Next trip highlighting

📊 **Trip Display Example:**

```
🚆 San Antonio → Palo Alto
Northbound • 2 trips available

🔴 BABY BULLET #501
02:34 PM (in 3 min) → 02:42 PM
Duration: 8 min • 2 stops • On time

🟢 LOCAL #268
03:04 PM (in 33 min) → 03:15 PM  
Duration: 11 min • 4 stops • Delayed 2 min
```

**Full Documentation:** See [CARD_README.md](CARD_README.md) and [RELEASE_NOTES_v1.5.0.md](RELEASE_NOTES_v1.5.0.md)

## Troubleshooting

### Integration Won't Load

1. Check that all files are in the correct directory
2. Restart Home Assistant
3. Check the logs for errors: **Settings** → **System** → **Logs**

### "Invalid API Key" Error

1. Verify your API key at https://511.org/open-data/token
2. Make sure there are no extra spaces when pasting
3. Try generating a new API key

### Sensors Show "Unavailable"

1. Check your internet connection
2. Verify the 511 API is working: http://api.511.org/transit/tripupdates?api_key=YOUR_KEY&agency=CT
3. Check the integration logs for errors

### No Trains Showing

- This is normal during late night hours when trains aren't running
- Caltrain operates roughly 5 AM - 12 AM on weekdays
- Weekend and holiday schedules vary

## Technical Details

- **Update Interval**: 30 seconds
- **API**: 511 SF Bay GTFS Realtime
- **Data Format**: Protocol Buffers (GTFS Realtime)
- **Dependencies**: `gtfs-realtime-bindings`, `protobuf`

## Version History

### v1.5.0 - Trip Planner Release (Current)
- ✨ Trip planner mode with origin/destination selection
- ✨ Smart direction detection algorithm (no need to specify northbound/southbound)
- ✨ Real-time trip duration and ETA calculations
- ✨ Countdown timers and delay status
- ✨ Color-coded train types (Baby Bullet, Limited, Local)
- ✨ Visual editor with mode selector
- 📦 28 stations supported
- See [RELEASE_NOTES_v1.5.0.md](RELEASE_NOTES_v1.5.0.md) for full details

### v1.4.0 - Station List Enhancements
- ✅ All 28 Caltrain stations supported
- ✅ Options flow for reconfiguration
- ✅ Improved station list display

### v1.1.0 - Device Tracker
- ✅ Real-time train GPS tracking
- ✅ Map card integration

## Future Enhancements (v1.6.0+)

- [ ] Multi-leg trips (Caltrain → BART transfers)
- [ ] Fare calculation
- [ ] Platform/track numbers (if API adds)
- [ ] Push notifications for departures
- [ ] Alternative routes (BART/bus)
- [ ] Saved trips / frequent routes
- [ ] Calendar integration
- [ ] Historical delay tracking
- [ ] Accessibility info (wheelchair accessible trains)
- [ ] Real-time crowding info (if API adds)

## Branding

This integration has custom branding for HACS and Home Assistant integration displays.

**Logo Submission**: To display the Caltrain Tracker logo in HACS and HA settings:
1. See [BRANDING_GUIDE.md](BRANDING_GUIDE.md) for complete instructions
2. See [branding/LOGO_SUBMISSION_CHECKLIST.md](branding/LOGO_SUBMISSION_CHECKLIST.md) for quick steps
3. Logo must be submitted to [home-assistant/brands](https://github.com/home-assistant/brands) repository

**Status**: Logo designed, pending submission to Home Assistant brands repository.

## Support

For issues, questions, or contributions:
- GitHub Issues: [Create an issue](https://github.com/alexrosenberg/HA_Caltrain_tracker/issues)
- Documentation: See `/docs` folder for detailed technical information
- Branding: See [BRANDING_GUIDE.md](BRANDING_GUIDE.md) for logo submission

## License

This project is provided as-is for personal use.

## Credits

- Data provided by 511 SF Bay (https://511.org/)
- Caltrain operated by Peninsula Corridor Joint Powers Board
- Logo design: Custom "Transit Tracker" branding
