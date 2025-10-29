#!/usr/bin/env python3
"""Test script to understand 511 API responses."""
import urllib.request
from google.transit import gtfs_realtime_pb2
import json

API_KEY = "d6fb7771-ed7d-476e-b30a-7df41884cb98"
AGENCY = "CT"

def test_vehicle_positions():
    """Test vehicle positions API."""
    print("=" * 60)
    print("Testing Vehicle Positions API")
    print("=" * 60)
    
    url = f"http://api.511.org/transit/vehiclepositions?api_key={API_KEY}&agency={AGENCY}"
    
    feed = gtfs_realtime_pb2.FeedMessage()
    with urllib.request.urlopen(url) as response:
        feed.ParseFromString(response.read())
    
    print(f"Feed timestamp: {feed.header.timestamp}")
    print(f"Number of entities: {len(feed.entity)}")
    
    if feed.entity:
        print("\nFirst vehicle example:")
        vehicle = feed.entity[0].vehicle
        print(f"  Vehicle ID: {vehicle.vehicle.id}")
        print(f"  Trip ID: {vehicle.trip.trip_id}")
        print(f"  Route ID: {vehicle.trip.route_id}")
        print(f"  Position: lat={vehicle.position.latitude}, lon={vehicle.position.longitude}")
        print(f"  Timestamp: {vehicle.timestamp}")
        
def test_trip_updates():
    """Test trip updates API."""
    print("\n" + "=" * 60)
    print("Testing Trip Updates API")
    print("=" * 60)
    
    url = f"http://api.511.org/transit/tripupdates?api_key={API_KEY}&agency={AGENCY}"
    
    feed = gtfs_realtime_pb2.FeedMessage()
    with urllib.request.urlopen(url) as response:
        feed.ParseFromString(response.read())
    
    print(f"Feed timestamp: {feed.header.timestamp}")
    print(f"Number of entities: {len(feed.entity)}")
    
    if feed.entity:
        print("\nFirst trip update example:")
        trip_update = feed.entity[0].trip_update
        print(f"  Trip ID: {trip_update.trip.trip_id}")
        print(f"  Route ID: {trip_update.trip.route_id}")
        print(f"  Vehicle ID: {trip_update.vehicle.id}")
        
        if trip_update.stop_time_update:
            print(f"  Number of stop updates: {len(trip_update.stop_time_update)}")
            first_stop = trip_update.stop_time_update[0]
            print(f"  First stop ID: {first_stop.stop_id}")
            if first_stop.arrival.time:
                print(f"  First stop arrival: {first_stop.arrival.time}")

def test_service_alerts():
    """Test service alerts API."""
    print("\n" + "=" * 60)
    print("Testing Service Alerts API")
    print("=" * 60)
    
    url = f"http://api.511.org/transit/servicealerts?api_key={API_KEY}&agency={AGENCY}"
    
    feed = gtfs_realtime_pb2.FeedMessage()
    with urllib.request.urlopen(url) as response:
        feed.ParseFromString(response.read())
    
    print(f"Feed timestamp: {feed.header.timestamp}")
    print(f"Number of alerts: {len(feed.entity)}")
    
    if feed.entity:
        print("\nFirst alert example:")
        alert = feed.entity[0].alert
        print(f"  Header: {alert.header_text.translation[0].text if alert.header_text.translation else 'N/A'}")

if __name__ == "__main__":
    try:
        test_vehicle_positions()
        test_trip_updates()
        test_service_alerts()
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
