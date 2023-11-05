import pandas as pd

# Get station name, latitudes and longitudes from csv file
def get_station_name_lat_lon():
    csv_file_path = 'excel/station20230327free.csv'

    # Reading the CSV file again
    station_csv_data = pd.read_csv(csv_file_path, encoding='utf-8')

    # Displaying the first few rows
    return station_csv_data[['name', 'lat', 'lon']]

if __name__ == '__main__':
    # extract_stations_and_location()
    df = get_station_name_lat_lon()
    df.to_csv('./results/rail_station.csv', index=False)