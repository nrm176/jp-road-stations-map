import os
import pandas as pd
import requests
# use .env file to load environment variables
from dotenv import load_dotenv

load_dotenv()


def extract_stations_and_location():
    # ファイルの読み込み
    file_path = 'excel/list.xls'
    df = pd.read_excel(file_path)

    # rename df columns
    df.rename(columns={'駅 名': 'name', '所在地': 'address'}, inplace=True)

    # 駅名と所在地の列を抽出
    stations_and_locations = df[['name', 'address']]

    # 結果を表示
    return stations_and_locations


def get_address(place_name, api_key):
    base_url = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json?"
    params = {
        "input": place_name,
        "inputtype": "textquery",
        "fields": "formatted_address",
        "key": api_key
    }
    response = requests.get(base_url, params=params)
    if response.status_code == 200:
        results = response.json().get('candidates', [])
        if results:
            return results[0]['formatted_address']
    return None


def get_lat_lon(address, api_key):
    base_url = "https://maps.googleapis.com/maps/api/geocode/json?"
    params = {
        "address": address,
        "key": api_key
    }
    response = requests.get(base_url, params=params)
    if response.status_code == 200:
        results = response.json().get('results', [])
        if results:
            location = results[0]['geometry']['location']
            return location['lat'], location['lng']
    return None, None


def add_lat_lon(df):
    # Google APIキー
    api_key = os.getenv('GOOGLE_API_KEY')

    # 緯度、経度の列を追加
    df['lon'] = None
    df['lat'] = None

    # 各駅に対して緯度と経度を取得
    for idx, row in df.iterrows():
        address = '道の駅 ' + row['name'] + ' ' + row['address']
        full_address = get_address(address, api_key)
        df.at[idx, 'full_address'] = full_address

    for idx, row in df.iterrows():
        lat, lon = get_lat_lon(row['full_address'], api_key)
        df.at[idx, 'lat'] = lat
        df.at[idx, 'lon'] = lon

    # 結果を保存
    result_path = 'results/road_station.csv'
    df.to_csv(result_path, index=False)


if __name__ == '__main__':
    df = extract_stations_and_location()
    add_lat_lon(df)
