import {Marker, Popup, Tooltip} from "react-leaflet";

const MapMarker = ({item}) => {
    return (<Marker position={[item.road_station.lat, item.road_station.lon]}>
        <Tooltip>{item.rail_station.name}</Tooltip>
        <Popup>
            <div>
                <span>鉄道駅: {item.rail_station.name}</span>
            </div>
            <div>
                <span>道の駅: {item.road_station.name}</span>
            </div>
            <div>
                <span>直線距離: {item.distance} km</span>
            </div>
            <div>
                <a href={`https://www.google.co.jp/maps/dir/${item.rail_station.lat},${item.rail_station.lon}/${item.road_station.lat},${item.road_station.lon}`}
                   target="_blank" rel="noopener noreferrer">
                    <span>経路検索</span>
                </a>
            </div>
            <div>
                            <span>
                                <a href={`https://www.google.com/search?q=道の駅+${item.road_station.name}`}
                                   target="_blank" rel="noopener noreferrer">
                                            Google Maps
                                </a>
                            </span>
            </div>
        </Popup>
    </Marker>)
}

export default MapMarker;