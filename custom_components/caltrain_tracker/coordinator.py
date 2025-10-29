"""Data coordinator for Caltrain Tracker."""
from __future__ import annotations

from datetime import timedelta, datetime
import logging
import urllib.request
import urllib.error
import asyncio

from google.transit import gtfs_realtime_pb2

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator, UpdateFailed
from homeassistant.exceptions import ConfigEntryAuthFailed

from .const import (
    DOMAIN,
    API_BASE_URL,
    API_AGENCY,
    ENDPOINT_TRIP_UPDATES,
    ENDPOINT_SERVICE_ALERTS,
    DEFAULT_SCAN_INTERVAL,
    CONF_API_KEY,
)

_LOGGER = logging.getLogger(__name__)


class CaltrainDataCoordinator(DataUpdateCoordinator):
    """Coordinate fetching Caltrain data from 511 API."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        """Initialize coordinator."""
        super().__init__(
            hass,
            _LOGGER,
            name=DOMAIN,
            update_interval=timedelta(seconds=DEFAULT_SCAN_INTERVAL),
        )
        self.api_key = entry.data[CONF_API_KEY]
        self.entry = entry

    async def _async_update_data(self) -> dict:
        """Fetch data from API."""
        try:
            # Fetch trip updates (contains ETAs)
            trips = await self.hass.async_add_executor_job(
                self._fetch_trip_updates
            )
            
            # Fetch service alerts
            alerts = await self.hass.async_add_executor_job(
                self._fetch_service_alerts
            )
            
            return {
                "trips": trips,
                "alerts": alerts,
                "last_update": datetime.now(),
            }
        except urllib.error.HTTPError as err:
            if err.code == 401 or err.code == 403:
                raise ConfigEntryAuthFailed(
                    f"Invalid API key: {err.code}"
                ) from err
            raise UpdateFailed(f"Error communicating with API: {err}") from err
        except Exception as err:
            raise UpdateFailed(f"Error updating data: {err}") from err

    def _fetch_trip_updates(self) -> list:
        """Fetch trip updates from 511 API (synchronous)."""
        url = f"{API_BASE_URL}/{ENDPOINT_TRIP_UPDATES}?api_key={self.api_key}&agency={API_AGENCY}"
        
        feed = gtfs_realtime_pb2.FeedMessage()
        
        with urllib.request.urlopen(url, timeout=10) as response:
            feed.ParseFromString(response.read())
        
        trips_data = []
        for entity in feed.entity:
            trip_update = entity.trip_update
            
            # Extract stop time updates
            stop_updates = []
            for stop_time_update in trip_update.stop_time_update:
                stop_updates.append({
                    "stop_id": stop_time_update.stop_id,
                    "arrival_time": stop_time_update.arrival.time if stop_time_update.HasField("arrival") else None,
                    "departure_time": stop_time_update.departure.time if stop_time_update.HasField("departure") else None,
                    "sequence": stop_time_update.stop_sequence,
                })
            
            trips_data.append({
                "trip_id": trip_update.trip.trip_id,
                "route_id": trip_update.trip.route_id,
                "vehicle_id": trip_update.vehicle.id if trip_update.HasField("vehicle") else None,
                "stops": stop_updates,
                "timestamp": trip_update.timestamp if trip_update.HasField("timestamp") else None,
            })
        
        _LOGGER.debug(f"Fetched {len(trips_data)} trip updates")
        return trips_data

    def _fetch_service_alerts(self) -> list:
        """Fetch service alerts from 511 API (synchronous)."""
        url = f"{API_BASE_URL}/{ENDPOINT_SERVICE_ALERTS}?api_key={self.api_key}&agency={API_AGENCY}"
        
        feed = gtfs_realtime_pb2.FeedMessage()
        
        try:
            with urllib.request.urlopen(url, timeout=10) as response:
                feed.ParseFromString(response.read())
        except Exception as err:
            _LOGGER.warning(f"Error fetching service alerts: {err}")
            return []
        
        alerts_data = []
        for entity in feed.entity:
            alert = entity.alert
            
            # Extract header text
            header = ""
            if alert.header_text.translation:
                header = alert.header_text.translation[0].text
            
            # Extract description
            description = ""
            if alert.description_text.translation:
                description = alert.description_text.translation[0].text
            
            alerts_data.append({
                "id": entity.id,
                "header": header,
                "description": description,
            })
        
        _LOGGER.debug(f"Fetched {len(alerts_data)} service alerts")
        return alerts_data

    def get_next_trains(self, stop_id: str, limit: int = 2) -> list:
        """Get next trains for a specific stop."""
        if not self.data or "trips" not in self.data:
            return []
        
        current_time = datetime.now().timestamp()
        upcoming_trains = []
        
        for trip in self.data["trips"]:
            for stop in trip["stops"]:
                if stop["stop_id"] == stop_id:
                    arrival_time = stop["arrival_time"]
                    if arrival_time and arrival_time > current_time:
                        eta_minutes = int((arrival_time - current_time) / 60)
                        upcoming_trains.append({
                            "trip_id": trip["trip_id"],
                            "route": trip["route_id"],
                            "eta_minutes": eta_minutes,
                            "arrival_time": arrival_time,
                        })
        
        # Sort by arrival time and limit results
        upcoming_trains.sort(key=lambda x: x["arrival_time"])
        return upcoming_trains[:limit]
