import pandas as pd
import folium

# Reading the CSV files
data_new = pd.read_csv('results/result.csv')
rail_station_data_new = pd.read_csv('results/rail_station.csv')
road_station_data_new = pd.read_csv('results/road_station.csv')

# Filtering the distances to include only those less than 0.5 kilometers
filtered_distances_new = data_new[data_new['distance'] < 0.5]

# Initializing an empty list to store the filtered locations
filtered_locations_new = []

# Looping through the filtered distances to find the corresponding coordinates
for idx, row in filtered_distances_new.iterrows():
    rail_station_name = row['rail_station_name']
    road_station_name = row['road_station_name']
    distance_km = row['distance']

    rail_station_location = rail_station_data_new[rail_station_data_new['station_name'] == rail_station_name]
    road_station_location = road_station_data_new[road_station_data_new['name'] == road_station_name]

    if not rail_station_location.empty and not road_station_location.empty:
        filtered_locations_new.append({
            'rail_station_name': rail_station_name,
            'road_station_name': road_station_name,
            'road_station_lat': road_station_location['lat'].values[0],
            'road_station_lon': road_station_location['lon'].values[0],
            'distance': distance_km
        })

# Converting the list of filtered locations to a DataFrame
filtered_locations_df_new = pd.DataFrame(filtered_locations_new)

# Calculating the map center based on the mean latitude and longitude of the filtered locations
map_center_filtered_new = [filtered_locations_df_new['road_station_lat'].mean(),
                           filtered_locations_df_new['road_station_lon'].mean()]

# Creating a new Folium map
m_filtered_new = folium.Map(location=map_center_filtered_new, zoom_start=6)

# Adding markers to the map for each road station, with tooltips containing the rail station name, road station name, and distance
for idx, row in filtered_locations_df_new.iterrows():
    tooltip = f"Rail Station: {row['rail_station_name']}<br>Road Station: {row['road_station_name']}<br>Distance: {row['distance']:.3f} km"
    folium.Marker([row['road_station_lat'], row['road_station_lon']], popup=row['road_station_name'], tooltip=tooltip,
                  icon=folium.Icon(color='red')).add_to(m_filtered_new)

# Saving the map to an HTML file
map_path_filtered_new = 'results/map_filtered_new.html'
m_filtered_new.save(map_path_filtered_new)
