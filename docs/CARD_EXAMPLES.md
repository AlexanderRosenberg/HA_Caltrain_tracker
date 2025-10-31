# Caltrain Tracker Card - Configuration Examples

## Basic Configuration

### Single Station Card

```yaml
type: custom:caltrain-tracker-card
entity: sensor.caltrain_palo_alto_northbound
```

### With Custom Name

```yaml
type: custom:caltrain-tracker-card
entity: sensor.caltrain_san_antonio_southbound
name: "Morning Commute to SJ"
```

### Show More Trains

```yaml
type: custom:caltrain-tracker-card
entity: sensor.caltrain_palo_alto_northbound
max_trains: 5
```

### Hide Alerts

```yaml
type: custom:caltrain-tracker-card
entity: sensor.caltrain_palo_alto_southbound
show_alerts: false
```

## Dashboard Layouts

### Vertical Stack (Multiple Stations)

```yaml
type: vertical-stack
cards:
  - type: custom:caltrain-tracker-card
    entity: sensor.caltrain_palo_alto_northbound
    name: "🔼 Northbound"
    max_trains: 3
  
  - type: custom:caltrain-tracker-card
    entity: sensor.caltrain_palo_alto_southbound
    name: "🔽 Southbound"
    max_trains: 3
```

### Horizontal Stack (Side by Side)

```yaml
type: horizontal-stack
cards:
  - type: custom:caltrain-tracker-card
    entity: sensor.caltrain_palo_alto_northbound
    name: "Palo Alto North"
  
  - type: custom:caltrain-tracker-card
    entity: sensor.caltrain_san_antonio_southbound
    name: "San Antonio South"
```

### Grid Layout

```yaml
type: grid
columns: 2
square: false
cards:
  - type: custom:caltrain-tracker-card
    entity: sensor.caltrain_palo_alto_northbound
    name: "PA → SF"
    max_trains: 3
  
  - type: custom:caltrain-tracker-card
    entity: sensor.caltrain_palo_alto_southbound
    name: "PA → SJ"
    max_trains: 3
  
  - type: custom:caltrain-tracker-card
    entity: sensor.caltrain_san_antonio_northbound
    name: "SA → SF"
    max_trains: 3
  
  - type: custom:caltrain-tracker-card
    entity: sensor.caltrain_san_antonio_southbound
    name: "SA → SJ"
    max_trains: 3
```

## Advanced Examples

### Commute Dashboard

```yaml
title: My Commute
views:
  - title: Home
    cards:
      # Morning commute
      - type: custom:caltrain-tracker-card
        entity: sensor.caltrain_palo_alto_northbound
        name: "🌅 Morning to SF"
        max_trains: 3
      
      # Evening commute
      - type: custom:caltrain-tracker-card
        entity: sensor.caltrain_palo_alto_southbound
        name: "🌆 Evening Home"
        max_trains: 3
      
      # Map with trains
      - type: map
        entities:
          - device_tracker.caltrain_train_501
          - device_tracker.caltrain_train_135
        default_zoom: 11
```

### Conditional Cards (Time-based)

Show northbound in morning, southbound in evening:

```yaml
type: conditional
conditions:
  - condition: time
    after: "06:00:00"
    before: "12:00:00"
card:
  type: custom:caltrain-tracker-card
  entity: sensor.caltrain_palo_alto_northbound
  name: "Morning Commute"

---

type: conditional
conditions:
  - condition: time
    after: "15:00:00"
    before: "21:00:00"
card:
  type: custom:caltrain-tracker-card
  entity: sensor.caltrain_palo_alto_southbound
  name: "Evening Commute"
```

### With Alert Banner

```yaml
type: vertical-stack
cards:
  # Alert if train leaves soon
  - type: conditional
    conditions:
      - condition: numeric_state
        entity: sensor.caltrain_palo_alto_northbound
        below: 10
    card:
      type: markdown
      content: |
        🚨 **Train leaves in {{states('sensor.caltrain_palo_alto_northbound')}} minutes!**
      card_mod:
        style: |
          ha-card {
            background-color: var(--error-color);
            color: white;
          }
  
  # Station card
  - type: custom:caltrain-tracker-card
    entity: sensor.caltrain_palo_alto_northbound
    max_trains: 5
```

### Mobile Dashboard

Optimized for phone:

```yaml
type: vertical-stack
cards:
  - type: custom:caltrain-tracker-card
    entity: sensor.caltrain_palo_alto_northbound
    name: "Next Trains"
    max_trains: 2
    show_alerts: true
  
  - type: button
    name: "Open Caltrain App"
    icon: mdi:train
    tap_action:
      action: url
      url_path: "https://www.caltrain.com"
```

### With Entity Filter

Show only stations with incoming trains:

```yaml
type: entity-filter
entities:
  - sensor.caltrain_palo_alto_northbound
  - sensor.caltrain_palo_alto_southbound
  - sensor.caltrain_san_antonio_northbound
  - sensor.caltrain_san_antonio_southbound
state_filter:
  - operator: "!="
    value: "No trains"
card:
  type: custom:caltrain-tracker-card
```

## Configuration Options Reference

| Option | Type | Default | Required | Description |
|--------|------|---------|----------|-------------|
| `type` | string | - | ✅ | Must be `custom:caltrain-tracker-card` |
| `entity` | string | - | ✅ | Caltrain station sensor entity ID |
| `name` | string | Station name | ❌ | Custom card title |
| `show_alerts` | boolean | `true` | ❌ | Show/hide service alerts |
| `max_trains` | number | `3` | ❌ | Number of trains to display (1-10) |

## Tips & Tricks

### 1. Color-Coded ETAs

The card automatically colors ETAs:
- 🔴 **Red**: < 5 minutes (Leave now!)
- 🟠 **Orange**: 5-10 minutes (Get ready)
- 🟢 **Green**: > 10 minutes (Plenty of time)

### 2. Theme Integration

Card respects your Home Assistant theme:
- Text colors match theme
- Alert colors use theme error/warning colors
- Backgrounds blend with dashboard

### 3. Mobile Responsive

- Automatically adjusts for mobile screens
- Touch-friendly tap targets
- Readable on small displays

### 4. Update Frequency

- Card updates automatically every 30 seconds
- Matches integration update interval
- Shows last update timestamp

### 5. Empty States

Handles all scenarios:
- No trains scheduled
- Entity not found
- Integration offline
- API errors

## Troubleshooting

### Card Shows "Entity not found"

**Fix:** Check entity ID in Developer Tools → States

```yaml
# Wrong
entity: caltrain_palo_alto_northbound

# Right
entity: sensor.caltrain_palo_alto_northbound
```

### Card Doesn't Update

**Fix:** Verify integration is running and API key is valid

### Styling Looks Wrong

**Fix:** Try a different theme or check browser console

### Card Too Large

**Fix:** Reduce `max_trains`:

```yaml
type: custom:caltrain-tracker-card
entity: sensor.caltrain_palo_alto_northbound
max_trains: 1  # Show only next train
```

## Best Practices

✅ **DO:**
- Use descriptive names for multiple cards
- Set appropriate max_trains for your layout
- Test on mobile and desktop
- Use conditional cards for time-based display

❌ **DON'T:**
- Use non-Caltrain entities
- Set max_trains too high (>5 on mobile)
- Forget to check alerts
- Override theme colors (card adapts automatically)

## Need Help?

- 📖 [Full Documentation](../CARD_README.md)
- 🐛 [Report Issues](https://github.com/AlexanderRosenberg/HA_Caltrain_tracker/issues)
- 💬 [Discussions](https://github.com/AlexanderRosenberg/HA_Caltrain_tracker/discussions)
