# Quick Start - Deploy Caltrain Tracker MVP

## What You Have

A working Home Assistant integration that tracks real-time Caltrain arrivals for:
- **Palo Alto** (Northbound & Southbound)
- **San Antonio** (Northbound & Southbound)

## Deploy in 5 Minutes

### 1️⃣ Get Your API Key (if you don't have one)
Visit: https://511.org/open-data/token

### 2️⃣ Copy Files to Home Assistant

The integration folder is here:
```
/Users/alexrosenberg/Documents/Gitrepos/HA_Caltrain_tracker/custom_components/CaltrainTracker/
```

Copy it to your Home Assistant as:
```
/config/custom_components/caltrain_tracker/
```

**Note**: Folder name changes from `CaltrainTracker` to `caltrain_tracker`

### 3️⃣ Restart Home Assistant
Settings → System → Restart

### 4️⃣ Add Integration
1. Settings → Devices & Services
2. Click "+ Add Integration"
3. Search "Caltrain"
4. Enter your API key
5. Select stations to track
6. Done!

### 5️⃣ View Your Sensors

Go to Developer Tools → States and search for `sensor.caltrain`

You should see:
- `sensor.caltrain_palo_alto_northbound`
- `sensor.caltrain_palo_alto_southbound`
- `sensor.caltrain_san_antonio_northbound`
- `sensor.caltrain_san_antonio_southbound`

## What Each Sensor Shows

**State**: Minutes until next train (e.g., `8` means 8 minutes)

**Attributes**:
- `next_trains` - List of next 2 trains with ETAs
- `station_name` - "Palo Alto" or "San Antonio"
- `direction` - "Northbound" or "Southbound"
- `alerts` - Service disruptions (if any)

## Add to Your Dashboard

Simple example:
```yaml
type: entities
entities:
  - sensor.caltrain_palo_alto_northbound
  - sensor.caltrain_palo_alto_southbound
title: Palo Alto Station
icon: mdi:train
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't find integration | Check folder is named `caltrain_tracker` |
| Invalid API key | Verify at https://511.org/open-data/token |
| Sensors unavailable | Check logs: Settings → System → Logs |
| Shows "No trains" at night | Normal - trains don't run 24/7 |

## Files Created

All integration files are in:
```
custom_components/CaltrainTracker/
├── __init__.py          ✅ Integration setup
├── config_flow.py       ✅ Configuration UI
├── const.py             ✅ Constants & station data
├── coordinator.py       ✅ API data fetching
├── manifest.json        ✅ Integration metadata
├── sensor.py            ✅ Sensor entities
├── strings.json         ✅ UI text
└── translations/
    └── en.json          ✅ English translations
```

## Documentation

- **README.md** - Full usage guide with examples
- **docs/DEPLOYMENT_GUIDE.md** - Detailed deployment steps
- **docs/TECHNICAL_ARCHITECTURE.md** - System design
- **docs/IMPLEMENTATION_ROADMAP.md** - Development plan
- **docs/RESEARCH_SUMMARY.md** - API research findings
- **docs/STATION_REFERENCE.md** - Station data reference

## Support

If something doesn't work:
1. Check Home Assistant logs
2. Review DEPLOYMENT_GUIDE.md
3. Test API with test_api.py script

## What's Next?

After successful deployment, you can:
- Add more stations (requires editing const.py)
- Create automations for departure alerts
- Build custom dashboard cards
- Expand to all 26 Caltrain stations

## Success! 🎉

When you see your sensors updating every 30 seconds with real train ETAs, you're done!

Enjoy your Caltrain tracker! 🚂
