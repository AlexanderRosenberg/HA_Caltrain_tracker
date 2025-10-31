# Visual Editor - Quick Guide

## Overview

The Caltrain Tracker Card now includes a **visual configuration editor** that makes setup easy without writing YAML!

## Features

### 🎯 Smart Entity Detection
- Automatically finds all Caltrain sensor entities in your system
- Filters and displays only relevant entities
- Shows friendly names in dropdowns

### 📋 Configuration Options

**Single Station Entity**
- Dropdown selection of any Caltrain station
- Optional - use "None" if using multiple entities

**Multiple Entities**
- Text input for comma-separated entity IDs
- Enables station selector and GPS features
- Overrides single entity if provided

**Card Name**
- Optional custom title
- Defaults to station name

**Maximum Trains**
- Number input (1-10)
- Defaults to 2

**Show Service Alerts**
- Checkbox toggle
- Enabled by default

**Show Station Selector**
- Checkbox toggle
- Auto-enabled with multiple entities by default
- Set to false to hide

**Use GPS Proximity**
- Checkbox toggle
- When enabled, reveals GPS entity selector

**GPS Entity**
- Dropdown of all device_tracker and person entities
- Only visible when GPS is enabled
- Shows friendly names

### ✨ User Experience

- **Live Validation**: Fields update based on configuration
- **Help Text**: Descriptions under each field
- **Smart Visibility**: GPS entity only shown when GPS enabled
- **Auto-Save**: Changes apply immediately on save
- **No YAML Needed**: Perfect for beginners

## How to Use

### Adding a New Card

1. **Open Dashboard**
   - Go to your Lovelace dashboard
   - Click the pencil icon (Edit Dashboard)

2. **Add Card**
   - Click "+ Add Card" button
   - Search for "Caltrain Tracker Card"
   - Select it from the results

3. **Configure**
   - Visual editor opens automatically
   - Fill in desired options:
     - For single station: Select from dropdown
     - For multiple stations: Enter comma-separated entity IDs
     - Toggle checkboxes for features
     - Set max trains (1-10)
     - If using GPS: Check box and select GPS entity

4. **Save**
   - Click "Save" button
   - Card appears on dashboard

### Editing Existing Card

1. Click the three-dot menu on the card
2. Select "Edit"
3. Visual editor opens with current config
4. Make changes
5. Click "Save"

## Configuration Examples

### Example 1: Single Station
```
Single Station Entity: San Francisco Caltrain Station (Northbound)
Card Name: (leave blank for default)
Maximum Trains: 3
☑ Show Service Alerts
☑ Show Station Selector
☐ Use GPS Proximity
```

### Example 2: Multiple Stations
```
Single Station Entity: None (use multiple entities below)
Multiple Entities: sensor.caltrain_palo_alto_northbound, sensor.caltrain_palo_alto_southbound
Card Name: Palo Alto Trains
Maximum Trains: 2
☑ Show Service Alerts
☑ Show Station Selector (auto-enabled)
☐ Use GPS Proximity
```

### Example 3: GPS-Based Selection
```
Single Station Entity: None
Multiple Entities: sensor.caltrain_palo_alto_northbound, sensor.caltrain_san_antonio_northbound
Card Name: Nearest Station
Maximum Trains: 2
☑ Show Service Alerts
☑ Show Station Selector
☑ Use GPS Proximity
GPS Entity: person.alex
```

## Tips

### Entity Detection
The editor automatically detects entities with "caltrain" in their name. If your entities use a different naming scheme, you can manually enter them in the "Multiple Entities" field.

### Comma-Separated Format
When entering multiple entities, separate them with commas:
```
sensor.caltrain_palo_alto_northbound, sensor.caltrain_palo_alto_southbound
```

Spaces after commas are optional and will be trimmed automatically.

### GPS Accuracy
For GPS-based station selection to work:
- Your GPS entity must have `latitude` and `longitude` attributes
- Station sensors must have coordinates (automatically included)
- The card calculates distance using the Haversine formula

### Station Selector Behavior
- Automatically shows when 2+ entities configured
- Can be manually hidden with unchecked checkbox
- Priority: Manual selection > GPS > First entity in list

## Troubleshooting

**Editor doesn't show entities**
- Ensure your Caltrain integration is loaded
- Check that entity IDs include "caltrain"
- Manually enter entity IDs if needed

**GPS not working**
- Verify GPS entity has coordinates
- Check that multiple entities are configured
- Ensure "Use GPS Proximity" is checked

**Changes not applying**
- Click Save button
- Refresh browser (Ctrl/Cmd + Shift + R)
- Check browser console for errors

## YAML Alternative

You can still configure via YAML if preferred. Click "Show Code Editor" in the card configuration dialog to switch to YAML mode.

The visual editor and YAML editor are interchangeable - changes in one will reflect in the other.
