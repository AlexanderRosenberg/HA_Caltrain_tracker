# Quick Start: Trip Planner in 3 Steps

## 📋 Prerequisites
- ✅ Caltrain Tracker integration v1.5.0 installed
- ✅ Integration configured with your API key
- ✅ Card v1.5.0 installed

## 🚀 Step 1: Create Trip Sensor (2 minutes)

### Via Home Assistant UI:

1. Open **Developer Tools** → **Services** tab

2. In the "Service" dropdown, select:
   ```
   Caltrain Tracker: Create Trip Sensor
   ```

3. Fill in the service data:
   ```
   Origin Station: San Antonio
   Destination Station: Palo Alto
   Maximum Trips: 2
   ```

4. Click **"CALL SERVICE"** button

5. ✅ You should see a confirmation toast notification

### Verify It Worked:

1. Go to **Developer Tools** → **States** tab
2. Search for: `caltrain_trip`
3. You should see: `sensor.caltrain_trip_san_antonio_palo_alto`
4. Click on it to see the trip data!

---

## 🎴 Step 2: Add Card to Dashboard (1 minute)

1. Go to your dashboard
2. Click **Edit Dashboard** (top right)
3. Click **+ ADD CARD**
4. Search for: `Caltrain Tracker Card`
5. Click to add it

---

## ⚙️ Step 3: Configure Card (1 minute)

In the card configuration:

```yaml
type: custom:caltrain-tracker-card
mode: trip_planner               # IMPORTANT: Set to trip_planner
origin_station: San Antonio      # Must match what you used in service
destination_station: Palo Alto   # Must match what you used in service
max_trips: 2
```

Or use the **Visual Editor**:
1. In the dropdown at top, select: **Trip Planner**
2. Origin Station: **San Antonio**
3. Destination Station: **Palo Alto**
4. Maximum Trips: **2**
5. Click **SAVE**

---

## ✅ Done!

You should now see:

```
🚆 San Antonio → Palo Alto
Northbound • 2 trips available

🟢 LOCAL #268
02:34 PM (in 3 min) → 02:42 PM
Duration: 8 min • 2 stops • On time

🟢 LOCAL #372
03:04 PM (in 33 min) → 03:15 PM  
Duration: 11 min • 4 stops • On time
```

---

## 🔁 Create More Routes

Repeat Step 1 for each route you want:

**Morning Commute**:
```
Service: Caltrain Tracker: Create Trip Sensor
Origin: San Antonio
Destination: San Francisco
Max Trips: 3
```

**Evening Commute**:
```
Service: Caltrain Tracker: Create Trip Sensor
Origin: San Francisco
Destination: San Antonio
Max Trips: 3
```

**Quick Hop**:
```
Service: Caltrain Tracker: Create Trip Sensor
Origin: Mountain View
Destination: Palo Alto
Max Trips: 2
```

Then add a card for each one!

---

## 📱 Pro Tips

### Multiple Cards on One Dashboard
```yaml
# Morning commute card
type: custom:caltrain-tracker-card
mode: trip_planner
origin_station: San Antonio
destination_station: San Francisco
title: "🌅 Morning Commute"

---

# Evening commute card
type: custom:caltrain-tracker-card
mode: trip_planner
origin_station: San Francisco
destination_station: San Antonio
title: "🌆 Evening Commute"
```

### Conditional Cards
Show card only during commute hours:

```yaml
type: conditional
conditions:
  - condition: state
    entity: input_boolean.work_day
    state: "on"
  - condition: time
    after: "07:00:00"
    before: "09:30:00"
card:
  type: custom:caltrain-tracker-card
  mode: trip_planner
  origin_station: San Antonio
  destination_station: San Francisco
```

### Automation Alert
Get notified 10 minutes before your train:

```yaml
automation:
  - alias: "Train Departure Alert"
    trigger:
      - platform: numeric_state
        entity_id: sensor.caltrain_trip_san_antonio_palo_alto
        below: 10
    condition:
      - condition: time
        weekday: [mon, tue, wed, thu, fri]
    action:
      - service: notify.mobile_app
        data:
          message: "Train to Palo Alto in {{ states('sensor.caltrain_trip_san_antonio_palo_alto') }} minutes!"
```

---

## 🐛 Troubleshooting

### Service not found
- **Fix**: Restart Home Assistant after installing v1.5.0
- Check: Settings → Devices & Services → Caltrain Tracker should show v1.5.0

### Sensor not created
- **Check**: Developer Tools → States → Search for `caltrain_trip`
- **Fix**: Try calling service again (safe to call multiple times)
- **Check logs**: Settings → System → Logs → Filter "caltrain"

### Card shows "Entity not found"
- **Check**: Sensor exists (see above)
- **Check**: Origin/destination in card match exactly (case-sensitive)
- **Expected**: `sensor.caltrain_trip_san_antonio_palo_alto`
  - Lowercase
  - Underscores instead of spaces
  - Format: `sensor.caltrain_trip_{origin}_{destination}`

### "No trips available"
- **Check time**: Trains run 4 AM - 1 AM (weekdays), 6 AM - 1 AM (weekends)
- **Check date**: No trains on some holidays
- **Wait**: Data refreshes every 30 seconds

---

## 📚 More Help

- **Full Guide**: [docs/TRIP_SENSOR_SETUP.md](docs/TRIP_SENSOR_SETUP.md)
- **Release Notes**: [RELEASE_NOTES_v1.5.0.md](RELEASE_NOTES_v1.5.0.md)
- **Issues**: https://github.com/AlexanderRosenberg/HA_Caltrain_tracker/issues

---

**Total Time**: ~5 minutes to set up your first trip planner! 🎉
