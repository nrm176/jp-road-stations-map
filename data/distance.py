from math import sin, cos, sqrt, atan2, radians
import pandas as pd


def calc_distance_between_two_points(lat1, lon1, lat2, lon2):
    # Radius of the Earth in kilometers
    R = 6371.0

    # Converting coordinates from degrees to radians
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])

    # Differences in coordinates
    dlat = lat2 - lat1
    dlon = lon2 - lon1

    # Haversine formula
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    # Distance in kilometers
    distance = R * c

    return distance


def run():
    df_rail_station = pd.read_csv('results/rail_station.csv')
    df_road_station = pd.read_csv('results/road_station.csv')

    result_df = pd.DataFrame(columns=['rail_station_name', 'road_station_name', 'distance'])
    # iterate through each row in df_rail_station
    for index2, road_station in df_road_station.iterrows():
        # iterate through each row in df_road_station
        for index, rail_station in df_rail_station.iterrows():
            # calculate distance between two points
            distance = calc_distance_between_two_points(
                rail_station['lat'], rail_station['lon'],
                road_station['lat'], road_station['lon'])

            # check if distance is less than 1.5
            if distance < 1.5:
                print(f'{rail_station["name"]} is {distance} km away from {road_station["name"]}')

                result_df = result_df._append(
                    pd.Series(
                        {'rail_station_name': rail_station['name'], 'road_station_name': road_station['name'],
                         'distance': distance})
                    , ignore_index=True)
    result_df.to_csv('results/result.csv', index=False)


if __name__ == '__main__':
    run()
