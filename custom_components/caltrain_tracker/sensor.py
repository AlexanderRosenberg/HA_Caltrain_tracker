"""Sensor platform for Caltrain Tracker."""
from __future__ import annotations

from datetime import datetime
import logging

from homeassistant.components.sensor import SensorEntity, SensorDeviceClass
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN, STATIONS, CONF_STATIONS, STATION_NAMES
from .coordinator import CaltrainDataCoordinator

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up Caltrain sensors based on a config entry."""
    coordinator: CaltrainDataCoordinator = hass.data[DOMAIN][entry.entry_id]
    
    # Get selected stations from options (if updated) or original config
    selected_stations = entry.options.get(CONF_STATIONS) or entry.data.get(CONF_STATIONS, [])
    
    # Convert station names to stop IDs
    stop_ids = []
    for station_name in selected_stations:
        if station_name in STATION_NAMES:
            stop_ids.append(STATION_NAMES[station_name])
    
    # If no stations selected, add all
    if not stop_ids:
        stop_ids = list(STATIONS.keys())
    
    # Create sensor for each station
    sensors = [
        CaltrainStationSensor(coordinator, stop_id)
        for stop_id in stop_ids
    ]
    
    # Create trip sensors from configuration (if specified)
    trip_configs = entry.options.get("trips") or entry.data.get("trips", [])
    for trip_config in trip_configs:
        origin = trip_config.get("origin")
        destination = trip_config.get("destination")
        max_trips = trip_config.get("max_trips", 2)
        
        if origin and destination:
            sensors.append(
                CaltrainTripSensor(coordinator, origin, destination, max_trips)
            )
    
    async_add_entities(sensors)
    
    # Store coordinator and add_entities callback for dynamic sensor creation
    if "_coordinators" not in hass.data[DOMAIN]:
        hass.data[DOMAIN]["_coordinators"] = {}
    hass.data[DOMAIN]["_coordinators"][entry.entry_id] = {
        "coordinator": coordinator,
        "add_entities": async_add_entities,
        "trip_sensors": {},
    }


class CaltrainStationSensor(CoordinatorEntity, SensorEntity):
    """Representation of a Caltrain station sensor."""

    def __init__(
        self,
        coordinator: CaltrainDataCoordinator,
        stop_id: str,
    ) -> None:
        """Initialize the sensor."""
        super().__init__(coordinator)
        self._stop_id = stop_id
        self._attr_has_entity_name = True
        
        station_info = STATIONS[stop_id]
        self._attr_name = f"{station_info['name']} {station_info['direction']}"
        self._attr_unique_id = f"caltrain_{stop_id}"
        self._attr_device_class = None
        self._attr_native_unit_of_measurement = "min"
        self._attr_icon = "mdi:train"

    @property
    def native_value(self) -> int | None:
        """Return the state of the sensor (minutes until next train)."""
        next_trains = self.coordinator.get_next_trains(self._stop_id, limit=1)
        
        if not next_trains:
            return None  # Return None instead of string when no trains
        
        return next_trains[0]["eta_minutes"]

    @property
    def extra_state_attributes(self) -> dict:
        """Return additional attributes."""
        station_info = STATIONS[self._stop_id]
        next_trains = self.coordinator.get_next_trains(self._stop_id, limit=2)
        
        # Format next trains for display
        formatted_trains = []
        for train in next_trains:
            train_data = {
                "trip_id": train["trip_id"],
                "route": train["route"],
                "eta_minutes": train["eta_minutes"],
                "arrival_time": datetime.fromtimestamp(train["arrival_time"]).strftime("%I:%M %p"),
            }
            
            # Add delay information if available
            if "delay" in train and train["delay"] is not None:
                train_data["delay"] = train["delay"]  # in seconds
            
            # Add scheduled time if available
            if "scheduled_time" in train and train["scheduled_time"]:
                train_data["scheduled_time"] = datetime.fromtimestamp(train["scheduled_time"]).strftime("%I:%M %p")
            
            formatted_trains.append(train_data)
        
        attributes = {
            "station_name": station_info["name"],
            "direction": station_info["direction"],
            "zone": station_info["zone"],
            "latitude": station_info["lat"],
            "longitude": station_info["lon"],
            "stop_id": self._stop_id,
            "next_trains": formatted_trains,
            "train_count": len(next_trains),
        }
        
        # Add service alerts if available
        if self.coordinator.data and "alerts" in self.coordinator.data:
            attributes["alerts"] = self.coordinator.data["alerts"]
            attributes["alert_count"] = len(self.coordinator.data["alerts"])
        
        # Add last update time
        if self.coordinator.data and "last_update" in self.coordinator.data:
            last_update = self.coordinator.data["last_update"]
            attributes["last_update"] = last_update.strftime("%Y-%m-%d %H:%M:%S")
        
        return attributes

    @property
    def available(self) -> bool:
        """Return if entity is available."""
        return self.coordinator.last_update_success


class CaltrainTripSensor(CoordinatorEntity, SensorEntity):
    """Sensor for trip planning between two stations."""

    def __init__(
        self,
        coordinator: CaltrainDataCoordinator,
        origin_name: str,
        dest_name: str,
        max_trips: int = 2,
    ) -> None:
        """Initialize the trip sensor."""
        super().__init__(coordinator)
        self._origin = origin_name
        self._destination = dest_name
        self._max_trips = max_trips
        self._attr_has_entity_name = True
        
        # Create a normalized ID (lowercase, no spaces)
        origin_id = origin_name.lower().replace(' ', '_')
        dest_id = dest_name.lower().replace(' ', '_')
        
        self._attr_name = f"{origin_name} to {dest_name}"
        self._attr_unique_id = f"caltrain_trip_{origin_id}_{dest_id}"
        self._attr_device_class = None
        self._attr_native_unit_of_measurement = "min"
        self._attr_icon = "mdi:train-car-passenger"

    @property
    def native_value(self) -> int | None:
        """Return the state of the sensor (minutes until next departure)."""
        trips = self.coordinator.get_trip_options(
            self._origin,
            self._destination,
            max_trips=1
        )
        
        if not trips:
            return None  # Return None instead of string when no trips
        
        return trips[0]['departure_in_minutes']

    @property
    def extra_state_attributes(self) -> dict:
        """Return trip details."""
        from .const import get_travel_direction
        
        trips = self.coordinator.get_trip_options(
            self._origin,
            self._destination,
            max_trips=self._max_trips
        )
        
        direction = get_travel_direction(self._origin, self._destination)
        
        # Format trip information
        formatted_trips = []
        for trip in trips:
            trip_data = {
                'trip_id': trip['trip_id'],
                'route': trip['route'],
                'departure': datetime.fromtimestamp(trip['departure_time']).strftime("%I:%M %p"),
                'arrival': datetime.fromtimestamp(trip['arrival_time']).strftime("%I:%M %p"),
                'departure_in': f"{trip['departure_in_minutes']} min",
                'duration': f"{trip['duration_minutes']} min",
                'stops_between': trip['stops_between'],
                'departure_delay': trip['departure_delay'],
                'arrival_delay': trip['arrival_delay'],
            }
            
            # Add status
            if trip['departure_delay'] > 60:
                trip_data['status'] = f"Delayed {trip['departure_delay'] // 60} min"
            elif trip['departure_delay'] < -60:
                trip_data['status'] = f"Early {abs(trip['departure_delay']) // 60} min"
            else:
                trip_data['status'] = "On time"
            
            formatted_trips.append(trip_data)
        
        attributes = {
            'origin': self._origin,
            'destination': self._destination,
            'direction': direction,
            'trips': formatted_trips,
            'trip_count': len(formatted_trips),
        }
        
        # Add last update time
        if self.coordinator.data and "last_update" in self.coordinator.data:
            last_update = self.coordinator.data["last_update"]
            attributes["last_update"] = last_update.strftime("%Y-%m-%d %H:%M:%S")
        
        return attributes

    @property
    def available(self) -> bool:
        """Return if entity is available."""
        return self.coordinator.last_update_success
