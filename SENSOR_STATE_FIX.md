# Sensor State Fix - "No trains" ValueError

## Problem
Station sensors were crashing with `ValueError` when no trains were available:

```
ValueError: Sensor sensor.san_francisco_northbound has device class 'None', 
state class 'None' unit 'min' and suggested precision 'None' thus indicating 
it has a numeric value; however, it has the non-numeric value: 'No trains' (<class 'str'>)
```

## Root Cause
When no trains were available, sensors returned the string `"No trains"` or `"No trips"`, but they had `native_unit_of_measurement = "min"`, which tells Home Assistant to expect **only numeric values**.

**The Rule:**  
- If a sensor has units (like "min", "°C", "km", etc.), it MUST return numeric values or `None`
- Returning string values causes a `ValueError`

## Solution
Changed sensors to return `None` instead of strings when no data is available:

### Before (Broken):
```python
@property
def native_value(self) -> int | str | None:
    """Return the state of the sensor."""
    next_trains = self.coordinator.get_next_trains(self._stop_id, limit=1)
    
    if not next_trains:
        return "No trains"  # ❌ String with unit "min" = ERROR
    
    return next_trains[0]["eta_minutes"]
```

### After (Fixed):
```python
@property
def native_value(self) -> int | None:
    """Return the state of the sensor."""
    next_trains = self.coordinator.get_next_trains(self._stop_id, limit=1)
    
    if not next_trains:
        return None  # ✅ None = "Unknown" state in UI
    
    return next_trains[0]["eta_minutes"]
```

## Changes Made

### File: `custom_components/caltrain_tracker/sensor.py`

1. **CaltrainStationSensor.native_value** (line ~91)
   - Changed return type: `int | str | None` → `int | None`
   - Changed no-data return: `"No trains"` → `None`

2. **CaltrainTripSensor.native_value** (line ~183)
   - Changed return type: `int | str | None` → `int | None`
   - Changed no-data return: `"No trips"` → `None`

### File: `custom_components/caltrain_tracker/__init__.py`

3. **Enhanced error handling in handle_create_trip_sensor** (lines 54-109)
   - Added try/except wrapper around entire function
   - Better error messages for each failure point
   - Validates coordinator exists before use
   - Logs successful sensor creation with entity ID
   - Raises exceptions with context instead of silent failures

## Behavior Changes

**When No Trains Available:**

Before:
- ❌ Sensor state: `"No trains"`
- ❌ Integration crashes with ValueError
- ❌ All sensors stop updating

After:
- ✅ Sensor state: `unavailable` (shown as "Unknown" in UI)
- ✅ Integration continues running
- ✅ Other sensors still update
- ℹ️ Sensor attributes still show station info

**In Lovelace Card:**
- State shows: `—` or `Unknown` instead of `"No trains"`
- This is standard Home Assistant behavior for unavailable sensors
- Card can check `state === 'unavailable'` and show custom message

## Testing

**Test Case 1: Late Night (No Service)**
1. Wait until after service hours (~1 AM - 4 AM)
2. Check station sensors
3. Expected: Sensors show "Unknown" or "—" state
4. Expected: No errors in logs

**Test Case 2: Service Disruption**
1. When API returns no trains for a station
2. Sensor should gracefully show unavailable
3. Integration should continue polling

**Test Case 3: New Trip Sensor**
1. Create trip sensor: `San Antonio` → `Palo Alto`
2. If no trips available, sensor shows "Unknown"
3. When trips available, sensor shows minutes

## Additional Service Improvements

**Better Error Messages:**
```python
# Before
_LOGGER.error("Origin and destination are required")

# After  
_LOGGER.error(f"Origin and destination are required. Got origin={origin}, destination={destination}")
```

**Validation Checks:**
- Checks if coordinators exist
- Checks if entry_id is valid
- Logs sensor creation success with full entity ID
- Raises exceptions instead of silent failures

## Version
Fixed in: v1.5.0 (November 2025)

## Related Issues
- ValueError when returning string with numeric units
- Service calls failing silently
- Integration stopping updates during service gaps

## Home Assistant Best Practices

**For Numeric Sensors:**
- ✅ Return numeric value when data available
- ✅ Return `None` when data unavailable
- ❌ Never return strings when units are defined

**For String Sensors:**
- ✅ Remove `native_unit_of_measurement`
- ✅ Can return any string value
- ✅ Use for status sensors (e.g., "On Time", "Delayed")

**For Service Handlers:**
- ✅ Validate all inputs
- ✅ Provide detailed error messages
- ✅ Raise exceptions with context
- ✅ Log successes with entity IDs
