import React, {useEffect, useState, useRef} from 'react';
import '../App.css';
import Map from './Map';
import Table from './Table';
import axios from "axios";
import Form from "./Form";
import {baseUrl} from '../config';

function Home() {
    const [maxDistance, setMaxDistance] = useState(1.0);
    const [limit] = useState(100);
    const [data, setData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedPref, setSelectedPref] = useState(0);
    const [prefectures, setPrefectures] = useState(() => {
        const savedData = localStorage.getItem('prefectures');
        return savedData ? JSON.parse(savedData) : [];
    });
    const [mode, setMode] = useState('initial');
    const [loading, setLoading] = useState(false);

    // Ref to track if the component is mounted to avoid updating state on unmounted component
    const isMounted = useRef(true);

    useEffect(() => {
        // Set the flag to true when the component mounts
        isMounted.current = true;

        // Cleanup function to run when the component unmounts
        return () => {
            isMounted.current = false;
        };
    }, []);

    const fetchPrefectureData = async () => {
        const response = await axios.get(`${baseUrl}/prefectures/`);
        return response.data;
    };

    const fetchDistanceData = async (limit, maxDistance, selectedPref) => {
        const apiUrl = `${baseUrl}/distances/?offset=0&limit=${limit}&max_distance=${maxDistance}&pref_code=${selectedPref}`;

        setLoading(true); // Moved setLoading here to ensure it's set before the request is made.

        try {
            const response = await axios.get(apiUrl);
            if (isMounted.current) {
                setData(response.data.records);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchDistanceData(limit, maxDistance, selectedPref);
        // The cleanup function is not required here as fetchDistanceData already checks for the mounted state.
    }, [maxDistance, limit, selectedPref]);

    useEffect(() => {
        if (prefectures.length === 0) {
            fetchPrefectureData().then((data) => {
                if (isMounted.current) {
                    setPrefectures(data);
                    localStorage.setItem('prefectures', JSON.stringify(data));
                }
            });
        }
    }, [prefectures.length]);


    const handleSelectPrefOnForm = (e) => {
        const selectedCode = e.target.value;
        setSelectedPref(selectedCode);
        setMode('prefecture');
    }

    const handleSelectItemOnTable = (item) => {
        setSelectedItem(item);
        setMode('item');
    }


    return (
        <main className="isolate">
            <div className="container mx-auto">
                <div className="grid grid-cols-5 gap-1">
                    <div className="col-span-3 bg-white-300 p-1">
                        <Map items={data}
                             prefectures={prefectures}
                             selectedItem={selectedItem}
                             selectedPref={selectedPref}
                             mode={mode}
                             loading={loading}
                        />
                    </div>
                    <div className="col-span-2 bg-white-300 p-1">
                        <Form maxDistance={maxDistance}
                              setMaxDistance={(e) => setMaxDistance(e.target.value)}
                              selectedPref={selectedPref}
                              handleSelectPref={handleSelectPrefOnForm}
                              prefectures={prefectures}
                        />
                        <Table items={data}
                               handleSelectItem={handleSelectItemOnTable}
                               mode={mode}
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Home;
