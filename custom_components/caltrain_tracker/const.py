"""Constants for the Caltrain Tracker integration."""

DOMAIN = "caltrain_tracker"

# API Configuration
API_BASE_URL = "http://api.511.org/transit"
API_AGENCY = "CT"

# API Endpoints
ENDPOINT_VEHICLE_POSITIONS = "vehiclepositions"
ENDPOINT_TRIP_UPDATES = "tripupdates"
ENDPOINT_SERVICE_ALERTS = "servicealerts"

# Update intervals (seconds)
DEFAULT_SCAN_INTERVAL = 30
MIN_SCAN_INTERVAL = 15
ALERTS_SCAN_INTERVAL = 300

# Configuration keys
CONF_API_KEY = "api_key"
CONF_STATIONS = "stations"

# Station data - All Caltrain stations (North to South)
# Format: stop_id -> {name, direction, zone, latitude, longitude}
STATIONS = {
    # Zone 1 - San Francisco Peninsula North
    "70011": {"name": "San Francisco", "direction": "Northbound", "zone": 1, "lat": 37.7765, "lon": -122.3944},
    "70012": {"name": "San Francisco", "direction": "Southbound", "zone": 1, "lat": 37.7765, "lon": -122.3944},
    "70021": {"name": "22nd Street", "direction": "Northbound", "zone": 1, "lat": 37.7572, "lon": -122.3923},
    "70022": {"name": "22nd Street", "direction": "Southbound", "zone": 1, "lat": 37.7572, "lon": -122.3923},
    "70031": {"name": "Bayshore", "direction": "Northbound", "zone": 1, "lat": 37.7087, "lon": -122.4015},
    "70032": {"name": "Bayshore", "direction": "Southbound", "zone": 1, "lat": 37.7087, "lon": -122.4015},
    "70041": {"name": "South San Francisco", "direction": "Northbound", "zone": 1, "lat": 37.6541, "lon": -122.4029},
    "70042": {"name": "South San Francisco", "direction": "Southbound", "zone": 1, "lat": 37.6541, "lon": -122.4029},
    "70051": {"name": "San Bruno", "direction": "Northbound", "zone": 1, "lat": 37.6295, "lon": -122.4111},
    "70052": {"name": "San Bruno", "direction": "Southbound", "zone": 1, "lat": 37.6295, "lon": -122.4111},
    
    # Zone 2 - Mid-Peninsula
    "70061": {"name": "Millbrae", "direction": "Northbound", "zone": 2, "lat": 37.5997, "lon": -122.3869},
    "70062": {"name": "Millbrae", "direction": "Southbound", "zone": 2, "lat": 37.5997, "lon": -122.3869},
    "70071": {"name": "Broadway", "direction": "Northbound", "zone": 2, "lat": 37.5870, "lon": -122.3651},
    "70072": {"name": "Broadway", "direction": "Southbound", "zone": 2, "lat": 37.5870, "lon": -122.3651},
    "70081": {"name": "Burlingame", "direction": "Northbound", "zone": 2, "lat": 37.5795, "lon": -122.3457},
    "70082": {"name": "Burlingame", "direction": "Southbound", "zone": 2, "lat": 37.5795, "lon": -122.3457},
    "70091": {"name": "San Mateo", "direction": "Northbound", "zone": 2, "lat": 37.5681, "lon": -122.3240},
    "70092": {"name": "San Mateo", "direction": "Southbound", "zone": 2, "lat": 37.5681, "lon": -122.3240},
    "70101": {"name": "Hayward Park", "direction": "Northbound", "zone": 2, "lat": 37.5438, "lon": -122.3087},
    "70102": {"name": "Hayward Park", "direction": "Southbound", "zone": 2, "lat": 37.5438, "lon": -122.3087},
    
    # Zone 3 - Central Peninsula
    "70111": {"name": "Hillsdale", "direction": "Northbound", "zone": 3, "lat": 37.5373, "lon": -122.2971},
    "70112": {"name": "Hillsdale", "direction": "Southbound", "zone": 3, "lat": 37.5373, "lon": -122.2971},
    "70121": {"name": "Belmont", "direction": "Northbound", "zone": 3, "lat": 37.5208, "lon": -122.2760},
    "70122": {"name": "Belmont", "direction": "Southbound", "zone": 3, "lat": 37.5208, "lon": -122.2760},
    "70131": {"name": "San Carlos", "direction": "Northbound", "zone": 3, "lat": 37.5069, "lon": -122.2607},
    "70132": {"name": "San Carlos", "direction": "Southbound", "zone": 3, "lat": 37.5069, "lon": -122.2607},
    "70141": {"name": "Redwood City", "direction": "Northbound", "zone": 3, "lat": 37.4854, "lon": -122.2314},
    "70142": {"name": "Redwood City", "direction": "Southbound", "zone": 3, "lat": 37.4854, "lon": -122.2314},
    "70151": {"name": "Atherton", "direction": "Northbound", "zone": 3, "lat": 37.4628, "lon": -122.1991},
    "70152": {"name": "Atherton", "direction": "Southbound", "zone": 3, "lat": 37.4628, "lon": -122.1991},
    "70161": {"name": "Menlo Park", "direction": "Northbound", "zone": 3, "lat": 37.4542, "lon": -122.1817},
    "70162": {"name": "Menlo Park", "direction": "Southbound", "zone": 3, "lat": 37.4542, "lon": -122.1817},
    
    # Zone 4 - South Peninsula / Silicon Valley North
    "70171": {"name": "Palo Alto", "direction": "Northbound", "zone": 4, "lat": 37.4429, "lon": -122.1643},
    "70172": {"name": "Palo Alto", "direction": "Southbound", "zone": 4, "lat": 37.4429, "lon": -122.1643},
    "70181": {"name": "California Avenue", "direction": "Northbound", "zone": 4, "lat": 37.4291, "lon": -122.1420},
    "70182": {"name": "California Avenue", "direction": "Southbound", "zone": 4, "lat": 37.4291, "lon": -122.1420},
    "70191": {"name": "San Antonio", "direction": "Northbound", "zone": 4, "lat": 37.4070, "lon": -122.1064},
    "70192": {"name": "San Antonio", "direction": "Southbound", "zone": 4, "lat": 37.4070, "lon": -122.1064},
    "70201": {"name": "Mountain View", "direction": "Northbound", "zone": 4, "lat": 37.3946, "lon": -122.0764},
    "70202": {"name": "Mountain View", "direction": "Southbound", "zone": 4, "lat": 37.3946, "lon": -122.0764},
    "70211": {"name": "Sunnyvale", "direction": "Northbound", "zone": 4, "lat": 37.3777, "lon": -122.0305},
    "70212": {"name": "Sunnyvale", "direction": "Southbound", "zone": 4, "lat": 37.3777, "lon": -122.0305},
    "70221": {"name": "Lawrence", "direction": "Northbound", "zone": 4, "lat": 37.3702, "lon": -121.9971},
    "70222": {"name": "Lawrence", "direction": "Southbound", "zone": 4, "lat": 37.3702, "lon": -121.9971},
    
    # Zone 5 - San Jose
    "70231": {"name": "Santa Clara", "direction": "Northbound", "zone": 5, "lat": 37.3532, "lon": -121.9371},
    "70232": {"name": "Santa Clara", "direction": "Southbound", "zone": 5, "lat": 37.3532, "lon": -121.9371},
    "70241": {"name": "College Park", "direction": "Northbound", "zone": 5, "lat": 37.3428, "lon": -121.9148},
    "70242": {"name": "College Park", "direction": "Southbound", "zone": 5, "lat": 37.3428, "lon": -121.9148},
    "70251": {"name": "San Jose Diridon", "direction": "Northbound", "zone": 5, "lat": 37.3299, "lon": -121.9024},
    "70252": {"name": "San Jose Diridon", "direction": "Southbound", "zone": 5, "lat": 37.3299, "lon": -121.9024},
    
    # Zone 6 - South County
    "70261": {"name": "Tamien", "direction": "Northbound", "zone": 6, "lat": 37.3113, "lon": -121.8839},
    "70262": {"name": "Tamien", "direction": "Southbound", "zone": 6, "lat": 37.3113, "lon": -121.8839},
}

# Helper to get station names for UI
STATION_NAMES = {
    f"{station['name']} {station['direction']}": stop_id
    for stop_id, station in STATIONS.items()
}

# Sensor types
SENSOR_TYPE_NEXT_TRAIN = "next_train"
SENSOR_TYPE_SERVICE_ALERTS = "service_alerts"
