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

# Station data - Palo Alto and San Antonio (both directions)
# Format: stop_id -> {name, direction, zone, latitude, longitude}
STATIONS = {
    "70171": {
        "name": "Palo Alto",
        "direction": "Northbound",
        "zone": 4,
        "lat": 37.4429,
        "lon": -122.1643
    },
    "70172": {
        "name": "Palo Alto",
        "direction": "Southbound",
        "zone": 4,
        "lat": 37.4429,
        "lon": -122.1643
    },
    "70191": {
        "name": "San Antonio",
        "direction": "Northbound",
        "zone": 4,
        "lat": 37.4070,
        "lon": -122.1064
    },
    "70192": {
        "name": "San Antonio",
        "direction": "Southbound",
        "zone": 4,
        "lat": 37.4070,
        "lon": -122.1064
    }
}

# Helper to get station names for UI
STATION_NAMES = {
    f"{station['name']} {station['direction']}": stop_id
    for stop_id, station in STATIONS.items()
}

# Sensor types
SENSOR_TYPE_NEXT_TRAIN = "next_train"
SENSOR_TYPE_SERVICE_ALERTS = "service_alerts"
