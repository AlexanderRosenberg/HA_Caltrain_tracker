# Implementation Roadmap

## Research Phase ✅ COMPLETE

### Completed Items:
- ✅ Verified 511 API endpoints (vehicle positions, trip updates, alerts)
- ✅ Tested GTFS Realtime protobuf parsing
- ✅ Identified 43 active Caltrain stop IDs
- ✅ Confirmed data structure and update frequency
- ✅ Created test scripts for API exploration
- ✅ Documented technical architecture
- ✅ Documented station reference data

### Key Findings:
- API returns GTFS Realtime protobuf format
- Requires `gtfs-realtime-bindings` library
- ~8 active vehicles, ~13 active trips currently
- Data updates in real-time
- 43 stop IDs currently active (26 stations, bidirectional)

## Phase 1: Core Integration (NEXT - Priority 1)

### 1.1 Basic Structure
- [ ] Create proper `manifest.json` with dependencies
- [ ] Implement `const.py` with API constants and hardcoded station data
- [ ] Create basic `__init__.py` with integration setup
- [ ] Add `strings.json` for UI translations

**Estimated time**: 2-3 hours

### 1.2 Configuration Flow
- [ ] Implement `config_flow.py`
  - [ ] User input step for API key
  - [ ] API key validation
  - [ ] Optional home/work station selection
  - [ ] Success/error handling
- [ ] Create `translations/en.json`

**Estimated time**: 3-4 hours

### 1.3 Data Coordinator
- [ ] Implement `coordinator.py`
  - [ ] DataUpdateCoordinator class
  - [ ] Async API fetch methods
  - [ ] GTFS protobuf parsing
  - [ ] Error handling and retries
  - [ ] Data caching
- [ ] Add helper functions for ETA calculation

**Estimated time**: 4-5 hours

### 1.4 Basic Sensors
- [ ] Implement `sensor.py`
  - [ ] CaltrainStationSensor class
  - [ ] Setup platform function
  - [ ] ETA calculation from trip updates
  - [ ] State and attributes
- [ ] Create sensors for configured stations

**Estimated time**: 3-4 hours

### 1.5 Testing & Debugging
- [ ] Deploy to test Home Assistant instance
- [ ] Verify sensor creation
- [ ] Test data updates
- [ ] Fix bugs
- [ ] Test error scenarios (API down, invalid key, etc.)

**Estimated time**: 2-3 hours

**Phase 1 Total**: ~15-20 hours of development

## Phase 2: Enhanced Features (Priority 2)

### 2.1 Service Alerts
- [ ] Add service alerts sensor
- [ ] Parse alert messages
- [ ] Link alerts to affected stations
- [ ] Display in sensor attributes

**Estimated time**: 2 hours

### 2.2 Multiple Station Support
- [ ] Allow configuring multiple favorite stations
- [ ] Create sensor for each configured station
- [ ] Station list management in config flow

**Estimated time**: 2-3 hours

### 2.3 Improved ETA Display
- [ ] Show next 2-3 trains (not just next)
- [ ] Display route type (Local, Limited, Express)
- [ ] Show delay information
- [ ] Destination information

**Estimated time**: 2-3 hours

**Phase 2 Total**: ~6-8 hours

## Phase 3: Advanced Features (Priority 3)

### 3.1 Vehicle Tracking
- [ ] Implement `device_tracker.py`
- [ ] Create device tracker for each active train
- [ ] Update GPS coordinates
- [ ] Link to trip information

**Estimated time**: 3-4 hours

### 3.2 Trip-Based Sensors
- [ ] Add "Home to Work" sensor
- [ ] Add "Work to Home" sensor
- [ ] Calculate journey time
- [ ] Consider current time and direction

**Estimated time**: 2-3 hours

### 3.3 Location-Based Station
- [ ] Detect nearest station from user's location
- [ ] Use Home Assistant person/device tracker
- [ ] Auto-switch sensor based on location

**Estimated time**: 3-4 hours

**Phase 3 Total**: ~8-11 hours

## Phase 4: Polish & Documentation (Priority 4)

### 4.1 Documentation
- [ ] Write comprehensive README.md
- [ ] Create setup guide
- [ ] Document configuration options
- [ ] Add troubleshooting section
- [ ] Create example automations
- [ ] Add screenshots

**Estimated time**: 3-4 hours

### 4.2 Code Quality
- [ ] Add type hints throughout
- [ ] Write docstrings
- [ ] Add logging statements
- [ ] Code cleanup and refactoring
- [ ] Handle edge cases

**Estimated time**: 2-3 hours

### 4.3 Testing
- [ ] Unit tests for coordinator
- [ ] Unit tests for sensors
- [ ] Integration tests
- [ ] Mock API responses for tests

**Estimated time**: 4-5 hours

**Phase 4 Total**: ~9-12 hours

## Phase 5: Custom Card (Separate Project - Priority 5)

### 5.1 Lovelace Card Setup
- [ ] Create separate repository for card
- [ ] Setup TypeScript/JavaScript build
- [ ] Mushroom theme integration

**Estimated time**: 2-3 hours

### 5.2 Card Features
- [ ] Station selector dropdown
- [ ] Next trains display
- [ ] ETA countdown
- [ ] Service alerts display
- [ ] GPS-based nearest station button

**Estimated time**: 6-8 hours

### 5.3 Card Polish
- [ ] Styling and animations
- [ ] Configuration options
- [ ] Documentation
- [ ] HACS integration

**Estimated time**: 3-4 hours

**Phase 5 Total**: ~11-15 hours

## Total Estimated Time

- **Phase 1 (Core)**: 15-20 hours ⭐ PRIORITY
- **Phase 2 (Enhanced)**: 6-8 hours
- **Phase 3 (Advanced)**: 8-11 hours
- **Phase 4 (Polish)**: 9-12 hours
- **Phase 5 (Card)**: 11-15 hours

**Total**: 49-66 hours of development

## Quick Start (MVP - Minimum Viable Product)

For fastest path to working integration:

### MVP Scope (6-8 hours)
1. Basic `manifest.json` ✅
2. Minimal `const.py` with 10 major stations only ✅
3. Simple coordinator (trip updates only) ✅
4. Single station sensor (hardcoded San Francisco) ✅
5. Basic config flow (API key only) ✅
6. Manual testing ✅

This would give you a working integration you can deploy and test immediately.

## Decision Points

### Before Starting Phase 1:
1. **Station Data**: Hardcode vs. Dynamic
   - **Recommendation**: Hardcode for v1.0
   
2. **API Key**: Keep in code vs. .gitignore
   - **Recommendation**: Remove from AI_GUIDE.md, add to .env.example
   
3. **Initial Sensor Scope**: All stations vs. User-selected
   - **Recommendation**: User-selected for better UX

### Before Starting Phase 3:
4. **Vehicle Tracking**: Implement now vs. later
   - Can defer if time-constrained
   
5. **Location Features**: Manual vs. Auto-detect
   - Start with manual, add auto-detect later

### Before Starting Phase 5:
6. **Card Framework**: Custom vs. Use existing card
   - Custom gives more control but more work
   - Could start with standard entities card

## Next Steps

1. **Immediate**: Get developer confirmation on Phase 1 scope
2. **Next**: Begin implementing Phase 1.1 (Basic Structure)
3. **After each phase**: Test, get feedback, iterate

## Questions for Developer

1. Do you want to proceed with Phase 1 (Core Integration) now?
2. Should we do MVP first (6-8 hours) or full Phase 1 (15-20 hours)?
3. Any specific stations you want to prioritize?
4. What's your Home Assistant version? (for compatibility testing)
5. Do you have a test instance or using production?

## API Key Management

**IMPORTANT**: Before committing code, we need to:
- [ ] Remove API key from AI_GUIDE.md
- [ ] Add `.env.example` with placeholder
- [ ] Update .gitignore to exclude API keys
- [ ] Document how to get 511 API key

## Success Criteria

### Phase 1 Complete When:
- ✅ Integration loads without errors
- ✅ Config flow works and saves API key
- ✅ At least one station sensor appears
- ✅ Sensor shows valid ETA data
- ✅ Updates every 30 seconds
- ✅ Handles API errors gracefully

### Project Complete When:
- ✅ All sensors working reliably
- ✅ Service alerts displaying
- ✅ Documentation complete
- ✅ Tested on live Home Assistant
- ✅ Ready for GitHub release
- ✅ (Optional) Custom card functional
