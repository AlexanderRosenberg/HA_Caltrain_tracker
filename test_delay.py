#!/usr/bin/env python3
"""Test script to check delay information in GTFS feed."""
import urllib.request
from google.transit import gtfs_realtime_pb2
from datetime import datetime

API_KEY = "d6fb7771-ed7d-476e-b30a-7df41884cb98"
AGENCY = "CT"

def test_delay_data():
    """Check what delay information is available."""
    url = f"http://api.511.org/transit/tripupdates?api_key={API_KEY}&agency={AGENCY}"
    
    feed = gtfs_realtime_pb2.FeedMessage()
    with urllib.request.urlopen(url) as response:
        feed.ParseFromString(response.read())
    
    print("=" * 80)
    print("Testing Delay Data in Trip Updates")
    print("=" * 80)
    
    if feed.entity:
        for i, entity in enumerate(feed.entity[:3]):  # Check first 3 trips
            trip_update = entity.trip_update
            print(f"\nTrip {i+1}: {trip_update.trip.trip_id} - {trip_update.trip.route_id}")
            print("-" * 80)
            
            if trip_update.stop_time_update:
                for j, stop_update in enumerate(trip_update.stop_time_update[:5]):  # First 5 stops
                    print(f"  Stop {j+1}: {stop_update.stop_id}")
                    
                    # Check arrival
                    if stop_update.HasField("arrival"):
                        print(f"    Arrival Time: {stop_update.arrival.time} " +
                              f"({datetime.fromtimestamp(stop_update.arrival.time).strftime('%I:%M %p')})")
                        if stop_update.arrival.HasField("delay"):
                            print(f"    Arrival Delay: {stop_update.arrival.delay} seconds")
                        else:
                            print(f"    Arrival Delay: Not available")
                    
                    # Check departure
                    if stop_update.HasField("departure"):
                        print(f"    Departure Time: {stop_update.departure.time} " +
                              f"({datetime.fromtimestamp(stop_update.departure.time).strftime('%I:%M %p')})")
                        if stop_update.departure.HasField("delay"):
                            print(f"    Departure Delay: {stop_update.departure.delay} seconds")
                        else:
                            print(f"    Departure Delay: Not available")
                    
                    # Check for schedule relationship
                    if stop_update.HasField("schedule_relationship"):
                        print(f"    Schedule Relationship: {stop_update.schedule_relationship}")
                    
                    print()

if __name__ == "__main__":
    try:
        test_delay_data()
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
