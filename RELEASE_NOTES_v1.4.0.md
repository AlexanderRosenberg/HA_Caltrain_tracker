# Caltrain Tracker Card v1.4.0 Release Notes

## Major Improvements

### 1. ✅ **Enhanced Scheduled Time Display**
- **Clear On-Time/Late/Early Status**: Shows "On Time" with green checkmark, or delays with colored badges
- **Scheduled vs Expected**: Displays both scheduled arrival time and real-time expected time
- **Visual Indicators**:
  - 🟢 Green for on-time/early trains
  - 🔴 Red for delayed trains
  - Time labels: "Scheduled:" and "Expected:" or "On Time:"
  - Delay badges show +/- minutes

**Example Display:**
```
Scheduled: 10:30 AM
Expected: 10:33 AM +3min (red badge)
```

### 2. 📍 **Improved GPS Indicator**
- **Better Positioning**: Moved GPS badge to direction line (no longer floating in middle)
- **Clean Design**: Small green badge with GPS icon and text
- **No Distractions**: Removed pulsing animation, now static badge
- **Clear Context**: Shows when station is auto-selected by proximity

### 3. 🚉 **Complete Station List**
Added **ALL 28 Caltrain stations** with accurate coordinates:

**Zone 1 (San Francisco Peninsula North)**
- San Francisco (Terminal)
- 22nd Street
- Bayshore
- South San Francisco  
- San Bruno

**Zone 2 (Mid-Peninsula)**
- Millbrae (BART Connection)
- Broadway (Burlingame)
- Burlingame
- San Mateo
- Hayward Park

**Zone 3 (Central Peninsula)**
- Hillsdale
- Belmont
- San Carlos
- Redwood City
- Atherton
- Menlo Park

**Zone 4 (South Peninsula / Silicon Valley North)**
- Palo Alto
- California Avenue
- San Antonio
- Mountain View
- Sunnyvale
- Lawrence

**Zone 5 (San Jose)**
- Santa Clara
- College Park
- San Jose Diridon (Major Hub)

**Zone 6 (South County)**
- Tamien

### 4. 🎨 **Smart Colors & Enhanced Design**

**Train Type Colors** (based on Caltrain branding):
- **Baby Bullet** 🔴 Red (#C62828) - Express service, limited stops
  - Icon: Lightning bolt
- **Limited** 🟠 Orange (#F57C00) - Fewer stops
  - Icon: Train variant
- **Local** 🟢 Teal (#00897B) - All stops
  - Icon: Train

**Visual Improvements:**
- **Color-coded left border** on each train item matching service type
- **Larger, color-coded icons** for train types
- **Caltrain Red header icon** (#C62828) with passenger train symbol
- **Better hierarchy**: Route name prominent, trip ID subtle
- **Status-based borders**: Red for delayed, green for early trains

### 5. 🎯 **Improved Layout**
- **Two-line time display** for scheduled trains:
  - Line 1: Scheduled time (subtle)
  - Line 2: Expected time (prominent) with status
- **Better spacing** between elements
- **Clearer labels** with uppercase, smaller text
- **Professional typography** with proper font weights

## Technical Details

- **Bundle Size**: 43KB (2KB increase for new features)
- **All Stations**: 28 stations × 2 directions = 56 stop IDs
- **GPS Coordinates**: Accurate lat/lon for all stations
- **Color Palette**: Official Caltrain brand colors
- **Icons**: Material Design icons optimized for each train type

## Configuration

### Visual Editor Features:
1. **Direction Filter**: Select Northbound/Southbound/Both
2. **Station Checkboxes**: Easy multi-select with checkboxes
3. **GPS Proximity**: Auto-select nearest station
4. **Customization**: Name, max trains, alerts, etc.

## What's Fixed

✅ Scheduled times now always shown when available  
✅ GPS badge moved to proper location (no more center floating)  
✅ All 28 Caltrain stations available for selection  
✅ Smart colors distinguish train types at a glance  
✅ Professional design matching Caltrain branding  
✅ Clear on-time/late/early status indicators  

## Installation

1. Copy `dist/caltrain-tracker-card.js` to your Home Assistant `/config/www/` directory
2. Add to your Lovelace resources:
   ```yaml
   url: /local/caltrain-tracker-card.js
   type: module
   ```
3. Clear browser cache (Cmd+Shift+R)
4. Add card via visual editor or YAML

## Example YAML

```yaml
type: custom:caltrain-tracker-card
entities:
  - sensor.palo_alto_northbound
  - sensor.mountain_view_northbound
  - sensor.san_jose_diridon_northbound
direction: northbound
name: My Commute
show_alerts: true
max_trains: 3
use_gps: true
gps_entity: person.you
```

## Screenshots

**Scheduled Time Display:**
- Clear separation between scheduled and expected times
- On-time indicator with green checkmark
- Delay badges for late/early trains

**Train Type Colors:**
- Baby Bullet: Red with lightning bolt
- Limited: Orange with train variant
- Local: Teal with train icon

**GPS Badge:**
- Small green badge next to direction
- Only shows when GPS auto-selects station

---

**Version**: 1.4.0  
**Release Date**: October 31, 2025  
**Compatibility**: Home Assistant 2024.1+
