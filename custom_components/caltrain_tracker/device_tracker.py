"""Device tracker platform for Caltrain Tracker."""
from __future__ import annotations

import logging
from datetime import datetime

from homeassistant.components.device_tracker import SourceType
from homeassistant.components.device_tracker.config_entry import TrackerEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN
from .coordinator import CaltrainDataCoordinator

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up Caltrain device trackers based on a config entry."""
    coordinator: CaltrainDataCoordinator = hass.data[DOMAIN][entry.entry_id]
    
    # We'll create trackers dynamically as vehicles appear
    # Store known vehicle IDs to avoid duplicates
    coordinator.known_vehicles = set()
    
    async def async_update_trackers():
        """Update device trackers when coordinator updates."""
        if not coordinator.data or "vehicles" not in coordinator.data:
            return
        
        current_vehicle_ids = {v["vehicle_id"] for v in coordinator.data["vehicles"]}
        new_vehicle_ids = current_vehicle_ids - coordinator.known_vehicles
        
        if new_vehicle_ids:
            new_trackers = [
                CaltrainVehicleTracker(coordinator, vehicle_id)
                for vehicle_id in new_vehicle_ids
            ]
            async_add_entities(new_trackers)
            coordinator.known_vehicles.update(new_vehicle_ids)
            _LOGGER.debug(f"Added {len(new_trackers)} new train trackers")
    
    # Initial setup
    await async_update_trackers()
    
    # Register callback for future updates
    coordinator.async_add_listener(async_update_trackers)


class CaltrainVehicleTracker(CoordinatorEntity, TrackerEntity):
    """Representation of a Caltrain train device tracker."""

    def __init__(
        self,
        coordinator: CaltrainDataCoordinator,
        vehicle_id: str,
    ) -> None:
        """Initialize the tracker."""
        super().__init__(coordinator)
        self._vehicle_id = vehicle_id
        self._attr_name = f"Caltrain Train {vehicle_id}"
        self._attr_unique_id = f"caltrain_train_{vehicle_id}"
        self._attr_icon = "mdi:train"

    @property
    def source_type(self) -> SourceType:
        """Return the source type of the device."""
        return SourceType.GPS

    @property
    def latitude(self) -> float | None:
        """Return latitude value of the device."""
        vehicle_data = self._get_vehicle_data()
        return vehicle_data["latitude"] if vehicle_data else None

    @property
    def longitude(self) -> float | None:
        """Return longitude value of the device."""
        vehicle_data = self._get_vehicle_data()
        return vehicle_data["longitude"] if vehicle_data else None

    @property
    def location_accuracy(self) -> int:
        """Return the location accuracy of the device in meters."""
        return 50  # GTFS realtime typically has ~50m accuracy

    @property
    def extra_state_attributes(self) -> dict:
        """Return additional attributes."""
        vehicle_data = self._get_vehicle_data()
        
        if not vehicle_data:
            return {}
        
        attributes = {
            "vehicle_id": self._vehicle_id,
            "trip_id": vehicle_data.get("trip_id"),
            "route": vehicle_data.get("route_id"),
            "source": "511 SF Bay API",
        }
        
        # Add bearing if available
        if vehicle_data.get("bearing") is not None:
            attributes["bearing"] = vehicle_data["bearing"]
        
        # Add speed if available (convert from m/s to mph)
        if vehicle_data.get("speed") is not None:
            speed_mph = vehicle_data["speed"] * 2.23694
            attributes["speed_mph"] = round(speed_mph, 1)
        
        # Add timestamp
        if vehicle_data.get("timestamp"):
            last_seen = datetime.fromtimestamp(vehicle_data["timestamp"])
            attributes["last_seen"] = last_seen.strftime("%Y-%m-%d %H:%M:%S")
        
        return attributes

    @property
    def available(self) -> bool:
        """Return if entity is available."""
        return self.coordinator.last_update_success and self._get_vehicle_data() is not None

    def _get_vehicle_data(self) -> dict | None:
        """Get current vehicle data from coordinator."""
        if not self.coordinator.data or "vehicles" not in self.coordinator.data:
            return None
        
        for vehicle in self.coordinator.data["vehicles"]:
            if vehicle["vehicle_id"] == self._vehicle_id:
                return vehicle
        
        return None
