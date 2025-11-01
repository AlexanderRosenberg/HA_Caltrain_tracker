# Trip Planner Feature - Design Document v1.5.0

## Feature Overview

**Goal:** Allow users to select origin and destination stations (without specifying direction) and get real-time ETAs for the next available trains.

## User Experience

### Configuration
```yaml
type: custom:caltrain-tracker-card
mode: trip_planner  # NEW: 'station_list' or 'trip_planner'
origin_station: San Antonio
destination_station: Palo Alto
max_trips: 3  # Show next 3 available trips (default: 2)
```

### Visual Editor
- **Mode Selector:** Dropdown with "Station List" or "Trip Planner"
- **Origin Station:** Single dropdown (no N/S suffix)
- **Destination Station:** Single dropdown (no N/S suffix)
- **Max Trips:** Number input (1-5)

### Display
```
┌─────────────────────────────────────────┐
│ 🚆 San Antonio → Palo Alto             │
│ Northbound • 2 stations • ~8 minutes   │
├─────────────────────────────────────────┤
│ Next Trains:                            │
│                                         │
│ 🟢 LOCAL 123                            │
│ Departs: 2:34 PM (in 3 min)            │
│ Arrives: 2:42 PM                        │
│ Duration: 8 minutes • 2 stops           │
│                                         │
│ 🔴 BABY BULLET 456                      │
│ Departs: 2:45 PM (in 14 min)           │
│ Arrives: 2:50 PM                        │
│ Duration: 5 minutes • Limited stops     │
│                                         │
│ 🟠 LIMITED 789                          │
│ Departs: 3:02 PM (in 31 min)           │
│ Arrives: 3:09 PM                        │
│ Duration: 7 minutes • 1 stop            │
└─────────────────────────────────────────┘
```

## Technical Design

### 1. Direction Detection Algorithm

**Input:** Origin station name, Destination station name

**Logic:**
```python
def get_travel_direction(origin_name: str, dest_name: str) -> str:
    """Determine if travel is northbound or southbound."""
    origin = STATIONS.get_by_name(origin_name)
    dest = STATIONS.get_by_name(dest_name)
    
    # Method 1: Compare zone numbers (preferred)
    if origin['zone'] < dest['zone']:
        return 'Southbound'  # Going south (higher zones)
    elif origin['zone'] > dest['zone']:
        return 'Northbound'  # Going north (lower zones)
    
    # Method 2: Same zone - compare latitude
    if origin['lat'] > dest['lat']:
        return 'Southbound'  # Going south (lower latitude)
    else:
        return 'Northbound'  # Going north (higher latitude)
    
    # Edge case: same station
    if origin_name == dest_name:
        return None  # Invalid trip
```

**Zone Reference:**
- Zone 1: San Francisco (north terminus)
- Zone 2-4: Peninsula
- Zone 5-6: San Jose area (south terminus)
- Lower zone number = more north
- Higher zone number = more south

### 2. Data Structure Changes

#### const.py - Enhanced Station Lookups
```python
# Add helper to get station by name (without direction)
def get_station_by_name(name: str) -> dict:
    """Get station data by name (returns northbound stop_id by default)."""
    for stop_id, station in STATIONS.items():
        if station['name'] == name and station['direction'] == 'Northbound':
            return {'stop_id': stop_id, **station}
    return None

# Get both directions for a station
def get_station_stop_ids(name: str) -> dict:
    """Get both northbound and southbound stop IDs for a station."""
    stops = {'Northbound': None, 'Southbound': None}
    for stop_id, station in STATIONS.items():
        if station['name'] == name:
            stops[station['direction']] = stop_id
    return stops

# Get unique station names (no direction suffix)
UNIQUE_STATION_NAMES = sorted(set(
    station['name'] for station in STATIONS.values()
))  # ['22nd Street', 'Atherton', 'Bayshore', ...]
```

#### coordinator.py - Add Trip Data Method
```python
async def get_trip_options(
    self,
    origin_name: str,
    dest_name: str,
    max_trips: int = 2
) -> list[dict]:
    """Get next available trips from origin to destination."""
    
    # 1. Determine direction
    direction = self._get_travel_direction(origin_name, dest_name)
    
    # 2. Get stop IDs for both stations
    origin_stop = get_station_stop_ids(origin_name)[direction]
    dest_stop = get_station_stop_ids(dest_name)[direction]
    
    # 3. Filter trips that stop at both stations
    viable_trips = []
    
    for trip in self.data.get('trip_updates', []):
        stops = {update.stop_id: update for update in trip.stop_time_updates}
        
        if origin_stop in stops and dest_stop in stops:
            # Check if destination comes after origin in stop sequence
            origin_seq = stops[origin_stop].stop_sequence
            dest_seq = stops[dest_stop].stop_sequence
            
            if dest_seq > origin_seq:  # Valid trip
                viable_trips.append({
                    'trip_id': trip.trip_id,
                    'route': trip.route_id,
                    'origin_stop': origin_stop,
                    'dest_stop': dest_stop,
                    'departure_time': stops[origin_stop].departure.time,
                    'arrival_time': stops[dest_stop].arrival.time,
                    'departure_delay': stops[origin_stop].departure.delay,
                    'arrival_delay': stops[dest_stop].arrival.delay,
                    'stops_between': dest_seq - origin_seq,
                })
    
    # 4. Sort by departure time and return next N trips
    viable_trips.sort(key=lambda x: x['departure_time'])
    return viable_trips[:max_trips]
```

### 3. New Sensor Type

#### sensor.py - Trip Planner Sensor
```python
class CaltrainTripSensor(CoordinatorEntity, SensorEntity):
    """Sensor for trip planning between two stations."""
    
    def __init__(
        self,
        coordinator: CaltrainDataCoordinator,
        origin_name: str,
        dest_name: str,
    ):
        super().__init__(coordinator)
        self._origin = origin_name
        self._destination = dest_name
        self._attr_name = f"Caltrain Trip {origin_name} to {dest_name}"
        self._attr_unique_id = f"caltrain_trip_{origin_name}_{dest_name}"
        
    @property
    def native_value(self) -> str:
        """Return next departure time."""
        trips = self.coordinator.get_trip_options(
            self._origin, 
            self._destination,
            max_trips=1
        )
        if trips:
            return format_time(trips[0]['departure_time'])
        return "No trips available"
    
    @property
    def extra_state_attributes(self) -> dict:
        """Return trip details."""
        trips = self.coordinator.get_trip_options(
            self._origin,
            self._destination,
            max_trips=3
        )
        
        return {
            'origin': self._origin,
            'destination': self._destination,
            'direction': self._get_direction(),
            'next_trips': [
                {
                    'trip_id': trip['trip_id'],
                    'route': trip['route'],
                    'departure': format_time(trip['departure_time']),
                    'arrival': format_time(trip['arrival_time']),
                    'duration_minutes': calculate_duration(
                        trip['departure_time'], 
                        trip['arrival_time']
                    ),
                    'stops_between': trip['stops_between'],
                    'departure_delay': trip['departure_delay'],
                    'arrival_delay': trip['arrival_delay'],
                }
                for trip in trips
            ]
        }
```

### 4. Card Configuration Schema

```typescript
interface CaltrainCardConfig extends LovelaceCardConfig {
  // Existing fields
  entity?: string;
  entities?: string[];
  name?: string;
  show_alerts?: boolean;
  
  // NEW: Mode selector
  mode?: 'station_list' | 'trip_planner';  // Default: 'station_list'
  
  // NEW: Trip planner fields (only used when mode='trip_planner')
  origin_station?: string;      // e.g., "San Antonio"
  destination_station?: string;  // e.g., "Palo Alto"
  max_trips?: number;            // Default: 2, range: 1-5
  
  // Existing fields for station_list mode
  direction?: string;
  show_station_selector?: boolean;
  use_gps?: boolean;
  gps_entity?: string;
  max_trains?: number;
}
```

### 5. Card UI Changes

#### Mode: station_list (existing behavior)
- Shows list of trains at selected stations
- Uses existing entity/entities config
- Station selector, GPS, etc.

#### Mode: trip_planner (NEW)
- Shows origin → destination header
- Displays next N trips with:
  - Train route (color-coded)
  - Departure time (with countdown)
  - Arrival time
  - Duration
  - Number of stops
  - Delay status
- No station selector needed
- No GPS proximity needed

### 6. Implementation Steps

#### Phase 1: Integration Backend (1.5.0)
1. ✅ Update `const.py`:
   - Add `UNIQUE_STATION_NAMES` list
   - Add `get_station_by_name()` helper
   - Add `get_station_stop_ids()` helper
   
2. ✅ Update `coordinator.py`:
   - Add `_get_travel_direction()` method
   - Add `get_trip_options()` method
   - Add `_calculate_stops_between()` helper

3. ✅ Update `sensor.py`:
   - Add `CaltrainTripSensor` class
   - Update `async_setup_entry()` to handle trip sensors

4. ✅ Update `config_flow.py`:
   - Add trip planner mode to options flow
   - Add origin/destination station selectors

#### Phase 2: Card Frontend (1.5.0)
1. ✅ Update card config interface
2. ✅ Add mode selector in visual editor
3. ✅ Add origin/destination selectors
4. ✅ Implement trip display UI
5. ✅ Add countdown timers for departures
6. ✅ Add duration calculations

#### Phase 3: Testing & Documentation
1. ✅ Test various origin/destination combinations
2. ✅ Verify direction detection
3. ✅ Test with Baby Bullet, Limited, Local trains
4. ✅ Create comprehensive release notes
5. ✅ Update README with trip planner examples

## Example Scenarios

### Scenario 1: San Antonio → Palo Alto
- **Direction:** Northbound (zone 4 → zone 4, compare lat)
- **Distance:** ~3 miles
- **Expected trains:** Local (all stops), maybe Limited
- **Duration:** ~8 minutes

### Scenario 2: San Francisco → San Jose Diridon
- **Direction:** Southbound (zone 1 → zone 5)
- **Distance:** ~47 miles
- **Expected trains:** Baby Bullet (fastest), Limited, Local
- **Duration:** Baby Bullet ~60 min, Local ~90 min

### Scenario 3: Mountain View → Millbrae
- **Direction:** Northbound (zone 4 → zone 2)
- **Distance:** ~25 miles
- **Expected trains:** All types
- **Duration:** Baby Bullet ~30 min, Local ~45 min

## Edge Cases to Handle

1. **Same station origin/destination:** Show error message
2. **No trains available:** Show "No trips scheduled"
3. **Trains don't stop at both stations:** Filter them out (Baby Bullets skip many stops)
4. **Trip already departed:** Filter out past trips
5. **Outside operating hours:** Show appropriate message
6. **API offline:** Show last known data or error state

## Performance Considerations

- **Calculation complexity:** O(n) where n = number of active trips (~30-40)
- **Caching:** Cache trip calculations for 30 seconds (same as coordinator)
- **Memory:** Minimal - just filtering existing trip data
- **UI updates:** Real-time countdown timers (update every second for "in X min")

## Future Enhancements (v1.6.0+)

1. **Multi-leg trips:** Support transfers (e.g., Caltrain → BART)
2. **Fare calculation:** Show ticket price for trip
3. **Platform numbers:** Display departure platform
4. **Accessibility info:** Wheelchair accessible trains
5. **Historical performance:** "This train is usually on time"
6. **Notifications:** Alert when train is X minutes away
7. **Alternative routes:** Show BART/bus alternatives

## Release Plan

**Version:** 1.5.0
**Target Date:** November 1-3, 2025
**Components:**
- Integration 1.5.0 (backend trip logic)
- Card 1.5.0 (frontend trip UI)
- Documentation updates
- Migration guide from 1.4.0

**Compatibility:**
- Backward compatible with 1.4.0 configs
- New trip_planner mode opt-in
- Existing station_list mode unchanged
