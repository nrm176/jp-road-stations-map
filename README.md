### ChatGPT
- https://chat.openai.com/share/f361f79b-6dcd-4c9b-89e3-ddd3a3989e1f

### 道の駅
- https://www.mlit.go.jp/road/Michi-no-Eki/file/list.xls

### 鉄道駅
- https://ekidata.jp/dl/?p=1
- https://ekidata.jp/dl/f.php?t=5&d=20230327

### Google Places API

### 都道府県ごとの中央座標
- https://www.benricho.org/chimei/latlng_data-center.html

### How to run
- ```docker build --tag jp-road_stations .```
- ```docker run -d -p 3001:3001 -p 80:80 --name jp-road_stations jp-road_stations```