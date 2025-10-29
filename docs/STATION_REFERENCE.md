# Caltrain Station Reference Data

## Station List (North to South)

Based on public Caltrain information and GTFS stop ID patterns discovered from 511 API.

### Stop ID Pattern Analysis:
- Stop IDs follow pattern: 700XX
- Last digit: 1 = Northbound, 2 = Southbound
- Example: 70012 = San Francisco Southbound, 70261 = Tamien Northbound

### Known Stations (32 total):

1. **San Francisco** - Zone 1
   - Stop IDs: 70011, 70012
   - Address: 700 4th St., San Francisco 94107
   - Terminal station (northernmost)

2. **22nd Street** - Zone 1
   - Stop IDs: 70021, 70022
   
3. **Bayshore** - Zone 1
   - Stop IDs: 70031, 70032

4. **South San Francisco** - Zone 1
   - Stop IDs: 70041, 70042

5. **San Bruno** - Zone 1
   - Stop IDs: 70051, 70052

6. **Millbrae** - Zone 2
   - Stop IDs: 70061, 70062
   - Major transfer point (BART connection)

7. **Broadway (Burlingame)** - Zone 2
   - Stop IDs: 70071, 70072

8. **Burlingame** - Zone 2
   - Stop IDs: 70081, 70082

9. **San Mateo** - Zone 2
   - Stop IDs: 70091, 70092

10. **Hayward Park** - Zone 2
    - Stop IDs: 70101, 70102

11. **Hillsdale** - Zone 3
    - Stop IDs: 70111, 70112

12. **Belmont** - Zone 3
    - Stop IDs: 70121, 70122

13. **San Carlos** - Zone 3
    - Stop IDs: 70131, 70132

14. **Redwood City** - Zone 3
    - Stop IDs: 70141, 70142
    - Major station

15. **Atherton** - Zone 3
    - Stop IDs: 70151, 70152

16. **Menlo Park** - Zone 3
    - Stop IDs: 70161, 70162

17. **Palo Alto** - Zone 4
    - Stop IDs: 70171, 70172
    - Major station

18. **California Avenue** - Zone 4
    - Stop IDs: 70181, 70182

19. **San Antonio** - Zone 4
    - Stop IDs: 70191, 70192

20. **Mountain View** - Zone 4
    - Stop IDs: 70201, 70202
    - Major station

21. **Sunnyvale** - Zone 4
    - Stop IDs: 70211, 70212

22. **Lawrence** - Zone 4
    - Stop IDs: 70221, 70222

23. **Santa Clara** - Zone 5
    - Stop IDs: 70231, 70232

24. **College Park** - Zone 5
    - Stop IDs: 70241, 70242

25. **San Jose Diridon** - Zone 5
    - Stop IDs: 70251, 70252
    - Major station (connections to Amtrak, ACE, VTA)

26. **Tamien** - Zone 6
    - Stop IDs: 70261, 70262
    - Southern terminus for most trains
    - Note: Electric service suspended as of June 2025

27-32. **South County Stations** (Limited weekday commute service only)
    - Morgan Hill
    - San Martin  
    - Gilroy

### Stop IDs Found in Current API Data (43 stops):
From live data extraction, these stop IDs are currently active:
- 70012, 70021, 70022, 70031, 70032, 70041, 70042
- 70051, 70052, 70061, 70062, 70081, 70082, 70091, 70092
- 70101, 70102, 70111, 70112, 70121, 70122, 70131, 70132
- 70141, 70142, 70161, 70162, 70171, 70172, 70191, 70192
- 70201, 70202, 70211, 70212, 70221, 70222, 70231, 70232
- 70241, 70242, 70251, 70261

### Missing from Live Data:
Some station IDs not seen in current data (may be weekend-only or off-peak):
- 70071, 70072 (Broadway)
- 70151, 70152 (Atherton)
- 70181, 70182 (California Avenue)
- 70252 (San Jose Diridon Southbound)
- 70262 (Tamien Southbound)

### Service Notes:
- **Baby Bullet** service: Express trains, limited stops
- **Limited** service: Fewer stops than Local
- **Local Weekday/Weekend**: All stops service
- Tamien to Gilroy: Weekday commute hours only (free bus service other times)

## Data Sources for Complete Station Info:

1. **Option 1: Hardcode from public data**
   - Use publicly available Caltrain station list
   - Include coordinates from known sources
   - Fastest implementation, no external dependencies
   
2. **Option 2: GTFS Static Feed**
   - Download from: http://www.caltrain.com/Assets/GTFS/caltrain/GTFS-Caltrain-Devs.zip
   - Contains: stops.txt with station names, coordinates
   - Parse once during setup
   
3. **Option 3: 511 Static Data**
   - May be available through 511 API
   - Need to explore endpoints further

## Recommended Approach:
**Hardcode station data for v1.0** with option to refresh from GTFS in future versions.

This provides:
- No external dependency at runtime
- Faster startup
- Reliable data even if GTFS feed is temporarily unavailable
- Can still validate/update from GTFS periodically
