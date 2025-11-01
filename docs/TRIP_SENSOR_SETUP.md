# Trip Planner Setup Guide

## The Problem

When you configure a card in trip planner mode, it expects a trip sensor entity like:
```
sensor.caltrain_trip_san_antonio_palo_alto
```

But these sensors don't exist by default - you need to create them first!

## Solution: Create Trip Sensors via Service

### Method 1: Via Home Assistant UI (Easiest)

1. Go to **Developer Tools** → **Services**
2. Select service: **Caltrain Tracker: Create Trip Sensor**
3. Fill in the fields:
   - **Origin Station**: `San Antonio`
   - **Destination Station**: `Palo Alto`
   - **Maximum Trips**: `2` (or 3, 4, 5)
4. Click **"Call Service"**
5. The sensor `sensor.caltrain_trip_san_antonio_palo_alto` will be created!

### Method 2: Via Automation/Script

```yaml
service: caltrain_tracker.create_trip_sensor
data:
  origin: "San Antonio"
  destination: "Palo Alto"
  max_trips: 2
```

### Method 3: Via YAML Configuration (Coming in future version)

In a future update, you'll be able to add trips directly in the integration configuration.

## Example: Common Trips

Create sensors for your daily commute:

```yaml
# Morning commute (Home → Work)
service: caltrain_tracker.create_trip_sensor
data:
  origin: "San Antonio"
  destination: "San Francisco"
  max_trips: 3

---

# Evening commute (Work → Home)  
service: caltrain_tracker.create_trip_sensor
data:
  origin: "San Francisco"
  destination: "San Antonio"
  max_trips: 3
```

## Valid Station Names

Use these exact names (case-sensitive):

**Zone 1-2:**
- San Francisco
- 22nd Street
- Bayshore
- South San Francisco
- San Bruno
- Millbrae
- Broadway
- Burlingame
- San Mateo
- Hayward Park

**Zone 3:**
- Hillsdale
- Belmont
- San Carlos
- Redwood City
- Atherton
- Menlo Park

**Zone 4:**
- Palo Alto
- California Avenue
- San Antonio
- Mountain View
- Sunnyvale
- Lawrence

**Zone 5-6:**
- Santa Clara
- College Park
- San Jose Diridon
- Tamien

## Verifying the Sensor

After calling the service:

1. Go to **Developer Tools** → **States**
2. Search for: `sensor.caltrain_trip`
3. You should see your new sensor!
4. Entity ID format: `sensor.caltrain_trip_{origin}_{destination}`
   - Lowercase, underscores instead of spaces
   - Example: `sensor.caltrain_trip_san_antonio_palo_alto`

## Using in the Card

Once the sensor exists, configure your card:

```yaml
type: custom:caltrain-tracker-card
mode: trip_planner
origin_station: San Antonio
destination_station: Palo Alto
# The card will automatically find: sensor.caltrain_trip_san_antonio_palo_alto
```

Or specify the sensor explicitly:

```yaml
type: custom:caltrain-tracker-card
mode: trip_planner
origin_station: San Antonio
destination_station: Palo Alto
trip_entity: sensor.caltrain_trip_san_antonio_palo_alto
```

## Sensor Attributes

Each trip sensor provides:

```yaml
state: 3  # Minutes until next departure
attributes:
  origin: "San Antonio"
  destination: "Palo Alto"
  direction: "Northbound"
  trip_count: 2
  trips:
    - trip_id: "501"
      route: "BABY BULLET"
      departure: "02:34 PM"
      arrival: "02:42 PM"
      departure_in: "3 min"
      duration: "8 min"
      stops_between: 2
      status: "On time"
      departure_delay: 0
      arrival_delay: 0
```

## Troubleshooting

### "Origin and destination are required"
- Make sure you filled in both fields
- Check spelling matches exactly (case-sensitive)

### "Entity not found"
- Verify the sensor was created: Developer Tools → States
- Check entity ID: `sensor.caltrain_trip_{origin}_{destination}`
- Try recreating the sensor (it's safe to call multiple times)

### "No trips available"
- Check if trains are running (4 AM - 1 AM weekdays)
- Verify both stations are on the same line
- Check coordinator is updating: Look at any station sensor

### Sensor shows "Unknown"
- Wait 30 seconds for first data refresh
- Check integration is loaded: Settings → Devices & Services
- Check logs: Settings → System → Logs

## Future Enhancement

In v1.6.0, we plan to add trip configuration directly in the integration setup, so you won't need to manually call the service!

---

**Quick Start**: Go to Developer Tools → Services, select "Caltrain Tracker: Create Trip Sensor", fill in San Antonio → Palo Alto, click "Call Service". Done!
