# AI Guide

## Mission
- Provide Home Assistant realtime & static information for the transit agency Caltrain, via avialable APIs. 
    - Will setup logical entities, devices and sensors to be used with other default cards and custom card
    - Create a custom card to utilize the sensors created using the mushroom theme
        - card will allow the picking up stations, or for a station to be chosen based on the user's gps location
        - show eta for the next two trains
        - show expected time to selected destination train
    - Interfaces with home assistant
- End User Interaction Goals
    - Provide realtime eta for a given station
    - GPS locations for each station
    - Realtime GPS location for the trains
    - Allow the station to be selected based on the location of the user
    - have a default home and work station
    - Indicate if train is running late
    - fail back to static GTFS information

## Constraints
- must function with the current version of home assistant 
- should not require uncommon home assistant HAC addons
- Must not violate 511 API usage
- Follow "https://developers.home-assistant.io/docs/creating_component_index" for integration development

## APIs we need
- 511, see "Open 511 Data Exchange Specifications - Transit.pdf" for detailed information
- API key: Users must obtain their own free API key from https://511.org/open-data/token
- Basic info webpage "https://511.org/open-data/transit"
- Operator ID for Caltrain = "CT"
- Example valid API call for Realtime vehicle Positions "http://api.511.org/transit/vehiclepositions?api_key={YOUR_API_KEY}&agency=CT"

## Test Strategy
- Developer can deploy to home assistant for testing

## Don’ts
- Don't commit the API key

## Dos
- Ask for more information when needed or clarifications when unsure of devloper intent
