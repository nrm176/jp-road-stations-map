import pandas as pd
import sqlite3
import re
import numpy as np
from multiprocessing import Pool
from functools import partial


# Function to convert CSV to SQLite3 database with a custom 'id' column
def csv_to_sqlite_with_custom_id(csv_path, db_path, table_name):
    # Read the CSV file into a DataFrame
    df = pd.read_csv(csv_path)

    # Create a new 'id' column by concatenating 'station_name', 'lat', and 'lon'
    df['id'] = df['name'].astype(str) + "_" + df['lat'].astype(str) + "_" + df['lon'].astype(str)

    # Rearrange columns to have 'id' as the first column
    df = df[['id', 'name', 'lat', 'lon']]

    # Connect to SQLite3 database
    conn = sqlite3.connect(db_path)

    # Drop the table if it already exists
    conn.execute(f"DROP TABLE IF EXISTS {table_name}")

    # Create the new table and insert the data
    df.to_sql(table_name, conn, index=False)

    # Close the database connection
    conn.close()


# Function to convert CSV to SQLite3 database with custom 'id' and 'postal_code' columns
def csv_to_sqlite_with_custom_id_and_postal_code(csv_path, db_path, table_name):
    # Read the CSV file into a DataFrame
    df = pd.read_csv(csv_path)

    # Create a new 'id' column by concatenating 'name', 'lat', and 'lon'
    df['id'] = df['name'].astype(str) + "_" + df['lat'].astype(str) + "_" + df['lon'].astype(str)

    # Safely extract postal code from 'full_address' and create a new 'postal_code' column
    df['postal_code'] = df['full_address'].apply(
        lambda x: re.search(r'〒(\d{3}-\d{4})', str(x)).group(1) if re.search(r'〒(\d{3}-\d{4})', str(x)) else None)

    # Extract prefecture from `full_address` and create a new `prefecture` column
    # Regular expression pattern to match prefectures anywhere in the string
    pattern = r'(東京都|北海道|(京都|大阪)府|.{2,3}県)'

    # Extract prefectures using re.search() and apply it to the DataFrame
    df['prefecture'] = df['full_address'].apply(
        lambda x: re.search(pattern, str(x)).group() if re.search(pattern, str(x)) is not None else None)

    df['prefecture'] = df['prefecture'].str.strip()

    # Rearrange columns
    df = df[['id', 'name', 'lat', 'lon', 'postal_code', 'full_address', 'prefecture']]

    # Connect to SQLite3 database
    conn = sqlite3.connect(db_path)

    # Drop the table if it already exists
    conn.execute(f"DROP TABLE IF EXISTS {table_name}")

    # Create the new table and insert the data
    df.to_sql(table_name, conn, index=False)

    # Close the database connection
    conn.close()


def haversine_vectorized(lon1, lat1, lon2, lat2):
    lon1, lat1, lon2, lat2 = map(np.radians, [lon1, lat1, lon2, lat2])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = np.sin(dlat / 2.0) ** 2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon / 2.0) ** 2
    c = 2 * np.arcsin(np.sqrt(a))
    km = 6371 * c
    return km


def calculate_chunk(chunk, lon1, lat1, lon2, lat2, df_road, df_rail):
    road_indices, rail_indices = chunk
    distances = haversine_vectorized(lon1[road_indices], lat1[road_indices], lon2[rail_indices], lat2[rail_indices])
    result = []
    for road_idx, rail_idx, distance in zip(road_indices, rail_indices, distances):
        road_id = df_road.iloc[road_idx]['id']
        rail_id = df_rail.iloc[rail_idx]['id']
        result.append({
            'road_station_id': road_id,
            'rail_station_id': rail_id,
            'distance': distance
        })
    return result


def read_databases(db_path):
    db = sqlite3.connect(db_path)
    df_road = pd.read_sql("SELECT * FROM road_station", db)
    df_rail = pd.read_sql("SELECT * FROM rail_station", db)
    db.close()
    return df_road, df_rail


def create_chunks(road_indices, rail_indices, chunk_size=1000):
    total_pairs = len(road_indices)
    num_chunks = (total_pairs // chunk_size) + int(total_pairs % chunk_size > 0)
    return [(road_indices[i * chunk_size:(i + 1) * chunk_size], rail_indices[i * chunk_size:(i + 1) * chunk_size]) for i
            in range(num_chunks)]


def save_to_database(df, db_path):
    conn = sqlite3.connect(db_path)
    df.to_sql('distance', conn, index=False, if_exists='replace')
    conn.close()

def csv_to_sqlite_with_pref_code(csv_path, db_path, table_name):
    df = pd.read_csv(csv_path)
    df['code'] = df['code'].astype(str)
    conn = sqlite3.connect(db_path)
    df.to_sql(table_name, conn, index=False, if_exists='replace')

def calculate_distances(db_path):
    df_road, df_rail = read_databases(db_path)

    lon1 = df_road['lon'].values
    lat1 = df_road['lat'].values
    lon2 = df_rail['lon'].values
    lat2 = df_rail['lat'].values

    road_indices, rail_indices = np.where(lon1[:, np.newaxis] != lon2)
    chunks = create_chunks(road_indices, rail_indices)

    with Pool() as pool:
        func = partial(calculate_chunk, lon1=lon1, lat1=lat1, lon2=lon2, lat2=lat2, df_road=df_road, df_rail=df_rail)
        results = pool.map(func, chunks)

    results_flat = [item for sublist in results for item in sublist]
    df_distance = pd.DataFrame(results_flat)

    save_to_database(df_distance, db_path)



if __name__ == '__main__':
    # File paths
    csv_paths = ['./data/results/rail_station.csv', './data/results/road_station.csv']
    db_path = './backend/project.db'
    table_names = ['rail_station', 'road_station']

    # Call the function to perform the conversion
    csv_to_sqlite_with_custom_id(csv_paths[0], db_path, table_names[0])
    csv_to_sqlite_with_custom_id_and_postal_code(csv_paths[1], db_path, table_names[1])
    # calculate_distances(db_path)

    csv_to_sqlite_with_pref_code('./data/excel/pref_code.csv', db_path, 'pref_code')

