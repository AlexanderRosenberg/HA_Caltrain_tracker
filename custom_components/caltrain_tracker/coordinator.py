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
    ENDPOINT_VEHICLE_POSITIONS,
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
            # Fetch all data concurrently
            trips, alerts, vehicles = await asyncio.gather(
                self.hass.async_add_executor_job(self._fetch_trip_updates),
                self.hass.async_add_executor_job(self._fetch_service_alerts),
                self.hass.async_add_executor_job(self._fetch_vehicle_positions),
            )
            
            return {
                "trips": trips,
                "alerts": alerts,
                "vehicles": vehicles,
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
                stop_data = {
                    "stop_id": stop_time_update.stop_id,
                    "arrival_time": stop_time_update.arrival.time if stop_time_update.HasField("arrival") else None,
                    "departure_time": stop_time_update.departure.time if stop_time_update.HasField("departure") else None,
                    "sequence": stop_time_update.stop_sequence,
                }
                
                # Add delay if available from GTFS feed
                if stop_time_update.HasField("arrival") and stop_time_update.arrival.HasField("delay"):
                    stop_data["delay"] = stop_time_update.arrival.delay
                
                stop_updates.append(stop_data)
            
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
                        train_data = {
                            "trip_id": trip["trip_id"],
                            "route": trip["route_id"],
                            "eta_minutes": eta_minutes,
                            "arrival_time": arrival_time,
                        }
                        
                        # Add delay information if available from GTFS feed
                        # Note: GTFS Realtime delay field may not always be present
                        # If not present, delay will be None
                        if "delay" in stop:
                            train_data["delay"] = stop["delay"]
                        
                        upcoming_trains.append(train_data)
        
        # Sort by arrival time and limit results
        upcoming_trains.sort(key=lambda x: x["arrival_time"])
        return upcoming_trains[:limit]

    def _fetch_vehicle_positions(self) -> list:
        """Fetch vehicle positions from 511 API (synchronous)."""
        url = f"{API_BASE_URL}/{ENDPOINT_VEHICLE_POSITIONS}?api_key={self.api_key}&agency={API_AGENCY}"
        
        feed = gtfs_realtime_pb2.FeedMessage()
        
        try:
            with urllib.request.urlopen(url, timeout=10) as response:
                feed.ParseFromString(response.read())
        except Exception as err:
            _LOGGER.warning(f"Error fetching vehicle positions: {err}")
            return []
        
        vehicles_data = []
        for entity in feed.entity:
            vehicle = entity.vehicle
            
            # Only include vehicles with valid position data
            if vehicle.HasField("position"):
                vehicles_data.append({
                    "vehicle_id": vehicle.vehicle.id if vehicle.HasField("vehicle") else entity.id,
                    "trip_id": vehicle.trip.trip_id if vehicle.HasField("trip") else None,
                    "route_id": vehicle.trip.route_id if vehicle.HasField("trip") else None,
                    "latitude": vehicle.position.latitude,
                    "longitude": vehicle.position.longitude,
                    "bearing": vehicle.position.bearing if vehicle.position.HasField("bearing") else None,
                    "speed": vehicle.position.speed if vehicle.position.HasField("speed") else None,
                    "timestamp": vehicle.timestamp if vehicle.HasField("timestamp") else None,
                })
        
        _LOGGER.debug(f"Fetched {len(vehicles_data)} vehicle positions")
        return vehicles_data

    def get_trip_options(
        self,
        origin_name: str,
        dest_name: str,
        max_trips: int = 2
    ) -> list[dict]:
        """
        Get next available trips from origin to destination.
        
        Args:
            origin_name: Origin station name (without direction)
            dest_name: Destination station name (without direction)
            max_trips: Maximum number of trips to return
            
        Returns:
            List of trip dictionaries with departure/arrival times and details
        """
        from .const import get_travel_direction, get_station_stop_ids
        
        if not self.data or "trips" not in self.data:
            return []
        
        # Determine direction of travel
        direction = get_travel_direction(origin_name, dest_name)
        if not direction:
            _LOGGER.warning(f"Could not determine direction for {origin_name} to {dest_name}")
            return []
        
        # Get stop IDs for both stations in the travel direction
        origin_stops = get_station_stop_ids(origin_name)
        dest_stops = get_station_stop_ids(dest_name)
        
        origin_stop = origin_stops.get(direction)
        dest_stop = dest_stops.get(direction)
        
        if not origin_stop or not dest_stop:
            _LOGGER.warning(f"Could not find stop IDs for {origin_name} ({direction}) or {dest_name} ({direction})")
            return []
        
        # Filter trips that stop at both stations
        current_time = datetime.now().timestamp()
        viable_trips = []
        
        for trip in self.data["trips"]:
            # Build a dictionary of stops for this trip
            stops_dict = {}
            for stop in trip["stops"]:
                stops_dict[stop["stop_id"]] = stop
            
            # Check if this trip stops at both origin and destination
            if origin_stop in stops_dict and dest_stop in stops_dict:
                origin_stop_data = stops_dict[origin_stop]
                dest_stop_data = stops_dict[dest_stop]
                
                # Check if destination comes after origin in stop sequence
                origin_seq = origin_stop_data.get("sequence", 0)
                dest_seq = dest_stop_data.get("sequence", 0)
                
                if dest_seq > origin_seq:
                    # Get departure and arrival times
                    departure_time = origin_stop_data.get("departure_time") or origin_stop_data.get("arrival_time")
                    arrival_time = dest_stop_data.get("arrival_time") or dest_stop_data.get("departure_time")
                    
                    # Only include future trips
                    if departure_time and arrival_time and departure_time > current_time:
                        trip_info = {
                            'trip_id': trip['trip_id'],
                            'route': trip['route_id'],
                            'origin_stop': origin_stop,
                            'dest_stop': dest_stop,
                            'departure_time': departure_time,
                            'arrival_time': arrival_time,
                            'departure_delay': origin_stop_data.get('delay', 0),
                            'arrival_delay': dest_stop_data.get('delay', 0),
                            'stops_between': dest_seq - origin_seq - 1,  # Number of intermediate stops
                            'duration_minutes': int((arrival_time - departure_time) / 60),
                            'departure_in_minutes': int((departure_time - current_time) / 60),
                        }
                        viable_trips.append(trip_info)
        
        # Sort by departure time and return next N trips
        viable_trips.sort(key=lambda x: x['departure_time'])
        return viable_trips[:max_trips]
