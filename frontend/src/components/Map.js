import React, {useEffect, useState} from 'react';
import {MapContainer, TileLayer, Marker, Popup, Tooltip, useMap} from 'react-leaflet';

const FocusOnItem = ({center, zoom}) => {
    const map = useMap();
    map.setView(center, zoom);
    return null;
}

const Map = ({items, prefectures, selectedItem, selectedPref, mode, loading}) => {
    const prefecture = prefectures.find(pref => pref.code === selectedPref)

    return (
        <>
            {loading ?
                (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <h1>Loading...</h1>
                </div>
            ) : <MapContainer center={[35.676, 139.65]} zoom={5}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {items.map((item, index) => (
                        <Marker key={index} position={[item.road_station.lat, item.road_station.lon]}>
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
                        </Marker>
                    ))}
                    {mode === 'item' ?
                        <FocusOnItem center={[selectedItem.road_station.lat, selectedItem.road_station.lon]} zoom={13}/> :
                        mode === 'prefecture' && prefecture && selectedPref != 0 ?
                            <FocusOnItem center={[prefecture.lat, prefecture.lon]} zoom={8}/> :
                            <FocusOnItem center={[35.676, 139.65]} zoom={5}/>
                    }
                </MapContainer>}
        </>
    );
};

export default Map;
