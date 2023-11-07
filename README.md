

<img width="1328" alt="2023-11-07 13 34 03" src="https://github.com/nrm176/jp-road-stations-map/assets/9022835/fd622eed-5648-4ade-bb97-e35c99b7d20d">


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

### Docker Compose
- ```docker-compose up -d```