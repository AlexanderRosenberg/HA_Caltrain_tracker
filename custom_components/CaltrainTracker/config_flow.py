"""Config flow for Caltrain Tracker integration."""
from __future__ import annotations

import logging
from typing import Any
import urllib.request
import urllib.error

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResult
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.selector import (
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
)

from google.transit import gtfs_realtime_pb2

from .const import (
    DOMAIN,
    API_BASE_URL,
    API_AGENCY,
    ENDPOINT_TRIP_UPDATES,
    CONF_API_KEY,
    CONF_STATIONS,
    STATION_NAMES,
)

_LOGGER = logging.getLogger(__name__)


async def validate_api_key(hass: HomeAssistant, api_key: str) -> bool:
    """Validate the API key by making a test request."""
    url = f"{API_BASE_URL}/{ENDPOINT_TRIP_UPDATES}?api_key={api_key}&agency={API_AGENCY}"
    
    def _test_api():
        try:
            with urllib.request.urlopen(url, timeout=10) as response:
                feed = gtfs_realtime_pb2.FeedMessage()
                feed.ParseFromString(response.read())
                return True
        except urllib.error.HTTPError as err:
            if err.code in (401, 403):
                raise InvalidAuth
            raise CannotConnect
        except Exception:
            raise CannotConnect
    
    return await hass.async_add_executor_job(_test_api)


class CaltrainConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for Caltrain Tracker."""

    VERSION = 1

    def __init__(self):
        """Initialize the config flow."""
        self.api_key = None
        self.stations = []

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Handle the initial step - API key entry."""
        errors = {}

        if user_input is not None:
            try:
                await validate_api_key(self.hass, user_input[CONF_API_KEY])
                self.api_key = user_input[CONF_API_KEY]
                
                # Move to station selection
                return await self.async_step_stations()
                
            except CannotConnect:
                errors["base"] = "cannot_connect"
            except InvalidAuth:
                errors["base"] = "invalid_auth"
            except Exception:  # pylint: disable=broad-except
                _LOGGER.exception("Unexpected exception")
                errors["base"] = "unknown"

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_API_KEY): str,
                }
            ),
            errors=errors,
            description_placeholders={
                "api_url": "https://511.org/open-data/token"
            },
        )

    async def async_step_stations(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Handle station selection step."""
        errors = {}

        if user_input is not None:
            self.stations = user_input.get(CONF_STATIONS, [])
            
            # Create the config entry
            return self.async_create_entry(
                title="Caltrain Tracker",
                data={
                    CONF_API_KEY: self.api_key,
                    CONF_STATIONS: self.stations,
                },
            )

        # Create selector for stations
        station_options = list(STATION_NAMES.keys())
        
        return self.async_show_form(
            step_id="stations",
            data_schema=vol.Schema(
                {
                    vol.Optional(
                        CONF_STATIONS,
                        default=list(STATION_NAMES.keys()),  # Default to all stations
                    ): SelectSelector(
                        SelectSelectorConfig(
                            options=station_options,
                            multiple=True,
                            mode=SelectSelectorMode.DROPDOWN,
                        )
                    ),
                }
            ),
            errors=errors,
        )


class CannotConnect(HomeAssistantError):
    """Error to indicate we cannot connect."""


class InvalidAuth(HomeAssistantError):
    """Error to indicate there is invalid auth."""
