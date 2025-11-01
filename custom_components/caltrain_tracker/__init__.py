"""The Caltrain Tracker integration."""
from __future__ import annotations

import logging
from datetime import timedelta

import voluptuous as vol

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator

from .const import DOMAIN, DEFAULT_SCAN_INTERVAL
from .coordinator import CaltrainDataCoordinator

_LOGGER = logging.getLogger(__name__)

PLATFORMS: list[Platform] = [Platform.SENSOR, Platform.DEVICE_TRACKER]

# Service schema for create_trip_sensor
SERVICE_CREATE_TRIP_SENSOR_SCHEMA = vol.Schema({
    vol.Required("origin"): cv.string,
    vol.Required("destination"): cv.string,
    vol.Optional("max_trips", default=2): vol.All(vol.Coerce(int), vol.Range(min=1, max=5)),
})


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    """Set up the Caltrain Tracker component."""
    # This function is needed for services.yaml to be loaded
    hass.data.setdefault(DOMAIN, {})
    return True


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
    async def handle_create_trip_sensor(call: ServiceCall) -> None:
        """Handle create_trip_sensor service call - creates a new trip planning sensor."""
        try:
            _LOGGER.debug(f"Service call data: {call.data}")
            
            # Validate the input data manually
            try:
                validated_data = SERVICE_CREATE_TRIP_SENSOR_SCHEMA(call.data)
                origin = validated_data["origin"]
                destination = validated_data["destination"]
                max_trips = validated_data.get("max_trips", 2)
            except vol.Invalid as err:
                error_msg = f"Invalid service data: {err}"
                _LOGGER.error(error_msg)
                raise ValueError(error_msg) from err
            
            _LOGGER.debug(f"Validated values - origin: {origin}, destination: {destination}, max_trips: {max_trips}")
            
            if not origin or not destination:
                error_msg = f"Origin and destination are required. Got origin={origin}, destination={destination}"
                _LOGGER.error(error_msg)
                raise ValueError(error_msg)
            
            # Get the coordinator info from stored data
            if "_coordinators" not in hass.data.get(DOMAIN, {}):
                error_msg = "No coordinators found. Integration may not be fully loaded."
                _LOGGER.error(error_msg)
                raise ValueError(error_msg)
                
            if entry.entry_id not in hass.data[DOMAIN]["_coordinators"]:
                error_msg = f"Coordinator for entry {entry.entry_id} not found"
                _LOGGER.error(error_msg)
                raise ValueError(error_msg)
                
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
            _LOGGER.info(f"Creating trip sensor: {origin} to {destination} (max_trips={max_trips})")
            from .sensor import CaltrainTripSensor
            trip_sensor = CaltrainTripSensor(coordinator, origin, destination, max_trips)
            add_entities([trip_sensor])
            trip_sensors[sensor_key] = trip_sensor
            
            _LOGGER.info(f"Successfully created trip sensor: sensor.caltrain_trip_{origin_id}_{dest_id}")
            
        except Exception as err:
            _LOGGER.exception(f"Error creating trip sensor: {err}")
            raise
    
    # Register service for creating trip sensors
    # Note: services.yaml provides the UI schema, this validates at runtime
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