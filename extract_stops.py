#!/usr/bin/env python3
"""Script to extract and build Caltrain station mapping."""
import urllib.request
from google.transit import gtfs_realtime_pb2

API_KEY = "d6fb7771-ed7d-476e-b30a-7df41884cb98"
AGENCY = "CT"

def get_all_stops():
    """Extract all stops from current trip updates."""
    url = f"http://api.511.org/transit/tripupdates?api_key={API_KEY}&agency={AGENCY}"
    
    feed = gtfs_realtime_pb2.FeedMessage()
    with urllib.request.urlopen(url) as response:
        feed.ParseFromString(response.read())
    
    stop_sequences = {}  # {stop_id: [trip_sequences]}
    
    for entity in feed.entity:
        trip_update = entity.trip_update
        for stop_update in trip_update.stop_time_update:
            stop_id = stop_update.stop_id
            sequence = stop_update.stop_sequence
            
            if stop_id not in stop_sequences:
                stop_sequences[stop_id] = []
            stop_sequences[stop_id].append(sequence)
    
    # Sort stops by their typical sequence number
    sorted_stops = sorted(stop_sequences.items(), key=lambda x: min(x[1]))
    
    print("Caltrain Stops (ordered by typical sequence):")
    print("=" * 60)
    for stop_id, sequences in sorted_stops:
        avg_seq = sum(sequences) / len(sequences)
        print(f"Stop ID: {stop_id:6s} - Avg Sequence: {avg_seq:5.1f} - Appearances: {len(sequences):3d}")
    
    return sorted_stops

if __name__ == "__main__":
    stops = get_all_stops()
    print(f"\nTotal unique stops: {len(stops)}")
