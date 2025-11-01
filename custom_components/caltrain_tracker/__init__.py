"""The Caltrain Tracker integration."""
from __future__ import annotations

import logging
from datetime import timedelta

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator

from .const import DOMAIN, DEFAULT_SCAN_INTERVAL
from .coordinator import CaltrainDataCoordinator

_LOGGER = logging.getLogger(__name__)

PLATFORMS: list[Platform] = [Platform.SENSOR, Platform.DEVICE_TRACKER]


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Caltrain Tracker from a config entry."""
    coordinator = CaltrainDataCoordinator(hass, entry)
    
    # Fetch initial data
    await coordinator.async_config_entry_first_refresh()
    
    # Store coordinator
    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = coordinator
    
    # Setup platforms
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    
    # Register update listener for options changes
    entry.async_on_unload(entry.add_update_listener(async_update_options))
    
    # Register service to create trip sensors dynamically
    async def handle_create_trip_sensor(call):
        """Handle create_trip_sensor service call - creates a new trip planning sensor."""
        origin = call.data.get("origin")
        destination = call.data.get("destination")
        max_trips = call.data.get("max_trips", 2)
        
        if not origin or not destination:
            _LOGGER.error("Origin and destination are required")
            return
        
        # Get the coordinator info from stored data
        if "_coordinators" in hass.data[DOMAIN] and entry.entry_id in hass.data[DOMAIN]["_coordinators"]:
            coordinator_info = hass.data[DOMAIN]["_coordinators"][entry.entry_id]
            coordinator = coordinator_info["coordinator"]
            add_entities = coordinator_info["add_entities"]
            trip_sensors = coordinator_info["trip_sensors"]
            
            # Create sensor key
            origin_id = origin.lower().replace(' ', '_')
            dest_id = destination.lower().replace(' ', '_')
            sensor_key = f"{origin_id}_{dest_id}"
            
            # Check if already exists
            if sensor_key in trip_sensors:
                _LOGGER.info(f"Trip sensor already exists: {origin} to {destination}")
                return
            
            # Create new trip sensor
            from .sensor import CaltrainTripSensor
            trip_sensor = CaltrainTripSensor(coordinator, origin, destination, max_trips)
            add_entities([trip_sensor])
            trip_sensors[sensor_key] = trip_sensor
            
            _LOGGER.info(f"Created trip sensor: {origin} to {destination}")
    
    hass.services.async_register(
        DOMAIN,
        "create_trip_sensor",
        handle_create_trip_sensor,
    )
    
    return True


async def async_update_options(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Handle options update - reload the integration to pick up new stations."""
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    if unload_ok := await hass.config_entries.async_unload_platforms(entry, PLATFORMS):
        hass.data[DOMAIN].pop(entry.entry_id)
    
    return unload_ok