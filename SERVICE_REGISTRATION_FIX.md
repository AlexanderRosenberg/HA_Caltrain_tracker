# Service Registration Fix - Enable UI Form Fields

## Problem
The service appeared in Developer Tools but showed a **YAML editor** instead of form fields with dropdowns and inputs. This meant `services.yaml` was not being loaded by Home Assistant.

## Root Cause
**Service registration location matters!**

Home Assistant loads `services.yaml` automatically ONLY when:
1. An integration has `async_setup()` function ✅
2. Services are registered at the **integration level** ❌ (we were registering per config entry)

**What was wrong:**
- ✅ We had `async_setup()` function
- ❌ Service was registered inside `async_setup_entry()` (per config entry)
- ❌ Service handler was inside `async_setup_entry()` (per config entry)
- Result: Service worked but UI metadata from `services.yaml` wasn't loaded

## Solution
Moved service registration to integration level (`async_setup()`):

### Before (Wrong):
```python
async def async_setup(hass, config):
    """Set up component."""
    hass.data.setdefault(DOMAIN, {})
    return True  # ← Only initialized data, no service

async def async_setup_entry(hass, entry):
    """Set up config entry."""
    # ... setup code ...
    
    async def handle_create_trip_sensor(call):
        # ... handler code ...
    
    hass.services.async_register(...)  # ← WRONG: Per entry!
```

### After (Correct):
```python
async def async_setup(hass, config):
    """Set up component."""
    hass.data.setdefault(DOMAIN, {})
    
    # Define service handler at integration level
    async def handle_create_trip_sensor(call):
        # ... handler code ...
    
    # Register service once at integration level
    hass.services.async_register(
        DOMAIN,
        "create_trip_sensor", 
        handle_create_trip_sensor,
    )
    return True

async def async_setup_entry(hass, entry):
    """Set up config entry."""
    # ... setup code only ...
    # No service registration here!
```

## Changes Made

### File: `custom_components/caltrain_tracker/__init__.py`

1. **Moved service handler to `async_setup()`** (lines 34-96)
   - Handler is now defined once at integration level
   - Accessible to all config entries
   - Finds coordinator from any available entry

2. **Moved service registration to `async_setup()`** (lines 98-102)
   - Service registered once when integration loads
   - Not duplicated per config entry
   - `services.yaml` now loaded automatically

3. **Removed duplicate code from `async_setup_entry()`**
   - Deleted duplicate handler definition
   - Deleted duplicate service registration
   - Cleaned up to ~70 fewer lines

4. **Updated coordinator lookup**
   - Changed from specific `entry.entry_id`
   - To first available coordinator: `next(iter(hass.data[DOMAIN]["_coordinators"]))`
   - Works because all coordinators share the same Caltrain API data

## Expected Behavior After Fix

**When you open Developer Tools → Services:**

### Before (YAML mode):
```
Service: caltrain_tracker.create_trip_sensor

Service Data:
[YAML Editor showing empty or example YAML]
```

### After (Form mode):
```
Service: Caltrain Tracker: Create Trip Sensor

Origin Station *
[___________________] (text input)

Destination Station *
[___________________] (text input)

Maximum Trips
[====●====] 1  2  3  4  5 (slider)

[Call Service button]
```

## Testing Instructions

1. **Restart Home Assistant completely**
   - Settings → System → Restart Home Assistant
   - Wait for full restart

2. **Clear browser cache** (important!)
   - Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
   - Or open incognito/private window

3. **Open Developer Tools → Services**
   - Search for: `caltrain_tracker`
   - Select: **"Caltrain Tracker: Create Trip Sensor"**

4. **Verify UI shows form fields:**
   - ✅ "Origin Station" text input
   - ✅ "Destination Station" text input
   - ✅ "Maximum Trips" slider (1-5)

5. **Test creating a sensor:**
   - Origin: `San Antonio`
   - Destination: `Palo Alto`
   - Max Trips: `2`
   - Click **Call Service**

6. **Verify sensor created:**
   - Developer Tools → States
   - Search: `sensor.caltrain_trip_san_antonio_palo_alto`

## Why This Matters

**Integration-level vs Entry-level:**

| Aspect | Per Entry (Wrong) | Integration Level (Correct) |
|--------|-------------------|----------------------------|
| Registration | Once per config entry | Once for entire integration |
| services.yaml | Not loaded | ✅ Automatically loaded |
| UI Fields | YAML editor only | ✅ Form fields with validation |
| Service count | Duplicates if multiple entries | Single service |
| Maintenance | Handler duplicated | Handler defined once |

## Technical Details

**Home Assistant Service Loading Sequence:**
1. Integration loads via `async_setup()`
2. Home Assistant checks for `services.yaml` in integration folder
3. If found, loads UI metadata (field names, types, descriptions)
4. Service registration at this level gets UI metadata attached
5. Config entries load via `async_setup_entry()` after
6. Services registered in `async_setup_entry()` don't get UI metadata

**Key Insight:**  
`services.yaml` is loaded at integration setup time, not config entry setup time!

## Additional Fixes Included

1. **ReadOnlyDict handling** (line 44)
   - Converts `call.data` to mutable dict: `dict(call.data)`
   - Prevents `RuntimeError: Cannot modify ReadOnlyDict`

2. **Better coordinator lookup** (lines 60-64)
   - Uses first available coordinator
   - More robust than hardcoded entry ID
   - Works with multiple config entries

3. **Comprehensive error handling** (lines 42-95)
   - Validates all inputs
   - Clear error messages
   - Detailed logging for troubleshooting

## Version
Fixed in: v1.5.0 (November 2025)

## Related Files
- `custom_components/caltrain_tracker/__init__.py` - Service registration
- `custom_components/caltrain_tracker/services.yaml` - UI metadata
- `custom_components/caltrain_tracker/sensor.py` - CaltrainTripSensor

## Home Assistant Best Practices

✅ **DO:**
- Register integration-wide services in `async_setup()`
- Use `services.yaml` for UI metadata
- Define service handlers at appropriate scope
- Clear error messages and logging

❌ **DON'T:**
- Register services in `async_setup_entry()` (unless entry-specific)
- Duplicate service registration
- Assume services.yaml loads everywhere
- Register same service multiple times
