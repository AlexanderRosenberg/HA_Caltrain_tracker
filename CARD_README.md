# Caltrain Tracker Card

A beautiful custom Lovelace card for the [Caltrain Tracker integration](https://github.com/AlexanderRosenberg/HA_Caltrain_tracker).

![Card Preview](https://via.placeholder.com/600x400/009688/FFFFFF?text=Caltrain+Tracker+Card)

## Features

- 🚂 **Next Trains Display** - Shows upcoming trains with ETAs
- 🔴 **Delay Indicators** - Late/early train badges with color coding
- 🔄 **Manual Refresh** - On-demand updates respecting operating hours
- 📍 **Station Selector** - Switch between multiple stations
- 🧭 **GPS Proximity** - Auto-select nearest station based on location
- ⏱️ **Color-Coded ETAs** - Quick visual indicator of urgency
- ⚠️ **Service Alerts** - Displays active alerts and delays
- 🎨 **Theme Integration** - Matches your Home Assistant theme
- 📱 **Responsive Design** - Works on mobile and desktop
- ✨ **Smooth Animations** - Hover effects and transitions

## Installation

### HACS (Recommended)

1. Open HACS in Home Assistant
2. Go to "Frontend" section
3. Click ⋮ (three dots) → Custom repositories
4. Add repository:
   - URL: `https://github.com/AlexanderRosenberg/HA_Caltrain_tracker`
   - Category: Dashboard
5. Click "Add"
6. Find "Caltrain Tracker Card" and click "Download"
7. Restart Home Assistant

### Manual Installation

1. Download `caltrain-tracker-card.js` from the [latest release](https://github.com/AlexanderRosenberg/HA_Caltrain_tracker/releases)
2. Copy to `/config/www/caltrain-tracker-card.js`
3. Add resource in Home Assistant:
   - Settings → Dashboards → Resources (⋮ menu)
   - Add Resource
   - URL: `/local/caltrain-tracker-card.js`
   - Type: JavaScript Module
4. Refresh your browser

## Configuration

### Visual Editor

1. Add card to dashboard
2. Search for "Caltrain Tracker Card"
3. Select your station entity
4. Configure options

### YAML

```yaml
type: custom:caltrain-tracker-card
entity: sensor.caltrain_palo_alto_northbound
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `type` | string | **Required** | `custom:caltrain-tracker-card` |
| `entity` | string | **Required*** | Single station sensor entity ID |
| `entities` | list | `null` | Multiple station sensors (for selector/GPS) |
| `name` | string | Station name | Custom title for the card |
| `show_alerts` | boolean | `true` | Show service alerts |
| `max_trains` | number | `2` | Maximum number of trains to display |
| `show_station_selector` | boolean | `true`** | Show dropdown to switch stations |
| `use_gps` | boolean | `false` | Auto-select nearest station |
| `gps_entity` | string | `null` | Device tracker or person entity for GPS |

\* Either `entity` or `entities` is required  
\*\* Auto-enabled when multiple entities are configured; set to `false` to hide

### Examples

#### Basic Card

```yaml
type: custom:caltrain-tracker-card
entity: sensor.caltrain_palo_alto_northbound
```

#### Customized Card

```yaml
type: custom:caltrain-tracker-card
entity: sensor.caltrain_san_antonio_southbound
name: "Morning Commute"
show_alerts: true
max_trains: 5
```

#### Multiple Stations (Vertical Stack)

```yaml
type: vertical-stack
cards:
  - type: custom:caltrain-tracker-card
    entity: sensor.caltrain_palo_alto_northbound
    name: "To San Francisco"
    max_trains: 3
  
  - type: custom:caltrain-tracker-card
    entity: sensor.caltrain_palo_alto_southbound
    name: "To San Jose"
    max_trains: 3
```

#### Station Selector (New in v1.3.0)

```yaml
type: custom:caltrain-tracker-card
entities:
  - sensor.caltrain_palo_alto_northbound
  - sensor.caltrain_palo_alto_southbound
  - sensor.caltrain_san_antonio_northbound
  - sensor.caltrain_san_antonio_southbound
name: Caltrain Stations
# Note: Station selector shows automatically when multiple entities are configured
```

#### GPS-Based Station Selection (New in v1.3.0)

```yaml
type: custom:caltrain-tracker-card
entities:
  - sensor.caltrain_palo_alto_northbound
  - sensor.caltrain_palo_alto_southbound
  - sensor.caltrain_san_antonio_northbound
  - sensor.caltrain_san_antonio_southbound
use_gps: true
gps_entity: person.alex
name: Nearest Station
max_trains: 3
# Note: Station selector automatically shown for manual override
```

## Card Layout

### Header Section
- 🚂 Train icon
- Station name
- Direction (Northbound/Southbound)
- Train count badge

### Trains Section
For each upcoming train:
- Route name (Local, Limited, Baby Bullet)
- Arrival time (12-hour format)
- ETA with color coding:
  - 🔴 **Red**: Less than 5 minutes (Leave now!)
  - 🟠 **Orange**: 5-10 minutes (Get ready)
  - 🟢 **Green**: More than 10 minutes (Plenty of time)

### Alerts Section (when active)
- ⚠️ Alert icon
- Alert header
- Alert description
- Warning-styled background

### Footer
- Last update timestamp

## Styling

The card automatically adapts to your Home Assistant theme using CSS variables:

- `--primary-color` - Header icon, badges
- `--error-color` - Urgent ETAs (< 5 min)
- `--warning-color` - Soon ETAs (5-10 min), alerts
- `--success-color` - Comfortable ETAs (> 10 min)
- `--card-background-color` - Train item backgrounds
- `--divider-color` - Borders and dividers
- `--primary-text-color` - Main text
- `--secondary-text-color` - Timestamps, labels

## Troubleshooting

### Card Not Showing

1. **Clear browser cache**: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
2. **Check resource**: Settings → Dashboards → Resources
3. **Verify installation**: File should be in `www/` or `www/community/`
4. **Check console**: F12 → Console for errors

### Entity Not Found

1. Verify integration is installed and configured
2. Check entity ID in Developer Tools → States
3. Entity should start with `sensor.caltrain_`

### No Trains Showing

1. Check if trains are actually running (Caltrain schedule)
2. Verify API key is valid in integration configuration
3. Check sensor state in Developer Tools
4. Look for errors in Home Assistant logs

### Styling Issues

1. Try a different theme
2. Inspect element (F12) to see CSS values
3. Report theme compatibility issues on GitHub

## Development

See [CARD_DEVELOPMENT.md](docs/CARD_DEVELOPMENT.md) for:
- Building from source
- Development workflow
- Adding features
- Publishing updates

## Changelog

### Version 1.0.0 (Initial Release)
- ✨ Basic card with next trains display
- ⏱️ Color-coded ETA countdown
- ⚠️ Service alerts integration
- 🎨 Theme-aware styling
- 📱 Responsive design

## Support

- 🐛 [Report Issues](https://github.com/AlexanderRosenberg/HA_Caltrain_tracker/issues)
- 💬 [Discussions](https://github.com/AlexanderRosenberg/HA_Caltrain_tracker/discussions)
- 📖 [Documentation](https://github.com/AlexanderRosenberg/HA_Caltrain_tracker)

## License

MIT License - See [LICENSE](LICENSE) file

## Credits

Built with:
- [LitElement](https://lit.dev/) - Web components
- [Custom Card Helpers](https://github.com/custom-cards/custom-card-helpers) - Home Assistant integration
- Data from [511 SF Bay API](https://511.org/open-data)

---

Made with ❤️ for the Home Assistant community
