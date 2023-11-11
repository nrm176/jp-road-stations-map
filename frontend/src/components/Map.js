import {MapContainer, TileLayer, Marker, Popup, Tooltip, useMap} from 'react-leaflet';
import {baseUrl, tileUrlMap} from '../config';
import MapMarker from "./MapMarker";
import React, {useEffect} from 'react';

const FocusOnItem = ({center, zoom}) => {
    console.log(`setting focus on ${center} with zoom ${zoom}`)
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
}

const LoadingOverlay = () => (
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
);

const Map = ({items, prefectures, selectedItem, selectedPref, mode, loading}) => {
    const prefecture = prefectures.find(pref => pref.code === selectedPref)
    const tileUrl = tileUrlMap.ArcGIS;
    console.log(`current mode: ${mode}`);

    const getFocusProps = () => {
        if (mode === 'item') {
            return {center: [selectedItem.road_station.lat, selectedItem.road_station.lon], zoom: 13};
        } else if (mode === 'prefecture' && prefecture && selectedPref !== 0) {
            return {center: [prefecture.lat, prefecture.lon], zoom: 8};
        }
        return {center: [35.676, 139.65], zoom: 5};
    }

    return (
        <>
            {loading ? <LoadingOverlay/> : (
                <MapContainer center={[35.676, 139.65]} zoom={5}>
                    <TileLayer url={tileUrl}/>
                    {items.map((item, index) => (
                        <MapMarker key={index} item={item}/>
                    ))}
                    <FocusOnItem {...getFocusProps()} />
                </MapContainer>
            )}
        </>
    );
};

export default Map;
