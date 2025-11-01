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
    
    async_add_entities(sensors)


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
    def native_value(self) -> int | str | None:
        """Return the state of the sensor (minutes until next train)."""
        next_trains = self.coordinator.get_next_trains(self._stop_id, limit=1)
        
        if not next_trains:
            return "No trains"
        
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
