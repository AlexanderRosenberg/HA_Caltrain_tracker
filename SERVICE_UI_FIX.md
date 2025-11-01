# Service UI Fix - Create Trip Sensor

## Problem
The `caltrain_tracker.create_trip_sensor` service appeared in Developer Tools but had **no input fields**, making it impossible to use from the UI.

## Root Cause
Home Assistant only automatically loads `services.yaml` (which defines the UI fields) when an integration has an `async_setup()` function at the top level. 

Our integration only had `async_setup_entry()`, which meant:
- ✅ The service was registered and appeared in the UI
- ❌ The `services.yaml` file was never loaded
- ❌ No input fields were shown

## Solution
Added `async_setup()` function to `__init__.py`:

```python
async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Set up the Caltrain Tracker component."""
    # This function is needed for services.yaml to be loaded
    hass.data.setdefault(DOMAIN, {})
    return True
```

This allows Home Assistant to:
1. Discover and load `services.yaml` automatically
2. Display the proper input fields in the UI
3. Show field descriptions, examples, and validation rules

## Changes Made

### File: `custom_components/caltrain_tracker/__init__.py`

1. **Added `async_setup()` function** (lines 29-33)
   - Required for services.yaml to be loaded
   - Initializes the integration's data dictionary

2. **Updated service handler** (lines 59-75)
   - Added proper type hints: `ServiceCall -> None`
   - Added schema validation with try/except
   - Added debug logging for troubleshooting

3. **Kept validation schema** (lines 23-27)
   - Validates data at runtime
   - Enforces required fields
   - Validates max_trips range (1-5)

### File: `custom_components/caltrain_tracker/services.yaml`
No changes needed - file was already correctly configured with:
- Field names (origin, destination, max_trips)
- Field types and selectors (text, number slider)
- Descriptions and examples
- Required/optional flags

## Testing Instructions

1. **Restart Home Assistant**
   - Go to Settings → System → Restart Home Assistant
   - OR use CLI: `ha core restart`

2. **Clear browser cache** (if needed)
   - Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
   - Or use incognito/private window

3. **Test the service**
   - Navigate to: Developer Tools → Services
   - Select: **"Caltrain Tracker: Create Trip Sensor"**
   - You should now see **three input fields**:
     - **Origin Station** (text field)
     - **Destination Station** (text field)
     - **Maximum Trips** (number slider, 1-5, default 2)

4. **Create a test sensor**
   ```yaml
   service: caltrain_tracker.create_trip_sensor
   data:
     origin: "San Antonio"
     destination: "Palo Alto"
     max_trips: 2
   ```

5. **Verify sensor creation**
   - Go to: Developer Tools → States
   - Search for: `sensor.caltrain_trip_san_antonio_palo_alto`
   - Should show minutes until next departure
   - Check attributes for trip list

## Expected Behavior After Fix

✅ Service appears in Developer Tools  
✅ Three input fields are visible  
✅ Fields have labels and descriptions  
✅ Max Trips shows as slider (1-5)  
✅ Required fields are marked  
✅ Service validates input before execution  
✅ Creates trip sensor successfully  

## Technical Details

**Home Assistant Service Loading**:
- Integrations with only `async_setup_entry()`: Services work but UI metadata not loaded
- Integrations with `async_setup()`: Automatically loads `services.yaml` for UI
- Both functions can coexist - `async_setup()` for integration-level setup, `async_setup_entry()` for config entries

**Service Registration**:
- Registration: `hass.services.async_register(DOMAIN, service_name, handler)`
- Validation: Done in handler via schema validation
- UI Metadata: Loaded from `services.yaml` by Home Assistant core

## Version
Fixed in: v1.5.0 (November 2025)

## Related Files
- `custom_components/caltrain_tracker/__init__.py` - Main integration setup
- `custom_components/caltrain_tracker/services.yaml` - Service UI definitions
- `custom_components/caltrain_tracker/sensor.py` - CaltrainTripSensor implementation
