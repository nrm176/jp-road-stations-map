import React, {useEffect, useState} from 'react';
import '../App.css';
import Map from './Map';
import Table from './Table';
import axios from "axios";
import Form from "./Form";
import {baseUrl} from '../config';

function Home() {
    const [maxDistance, setMaxDistance] = useState(1.0);
    const [limit,] = useState(100);
    const [data, setData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedPref, setSelectedPref] = useState(0);
    const [prefectures, setPrefectures] = useState(() => {
        const savedData = localStorage.getItem('prefectures');
        return savedData ? JSON.parse(savedData) : [];
    });
    const [mode, setMode] = useState('initial');
    const [loading, setLoading] = useState(false);


    const fetchPrefectureData = async () => {
        const response = await axios.get(`${baseUrl}/prefectures/`)
        return response.data;
    }

    const fetchDistanceData = async (limit, maxDistance, selectedPref) => {
        const apiUrl = `${baseUrl}/distances/?offset=0&limit=${limit}&max_distance=${maxDistance}&pref_code=${selectedPref}`;
        const response = await axios.get(apiUrl);
        return response.data.records;
    }

    useEffect(() => {
        async function fetchData() {
            setLoading(true);

            try {
                const response = await fetchDistanceData(limit, maxDistance, selectedPref);
                setData(response);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [maxDistance, limit, selectedPref]); // Dependency array to re-run the effect when these values change


    useEffect(() => {
        async function fetchData() {
            if (prefectures.length === 0) {
                try {
                    const data = await fetchPrefectureData();
                    setPrefectures(data);
                    localStorage.setItem('prefectures', JSON.stringify(data));
                } catch (error) {
                    // Handle the error, e.g., set an error state, log it, etc.
                    console.error('Failed to fetch prefectures:', error);
                }
            }
        }

        fetchData();
    }, [prefectures.length]);


    const handleSelectPrefOnForm = (e) => {
        const selectedCode = e.target.value;
        setSelectedPref(selectedCode);
        setMode('prefecture');
    }

    const handleSelectItemOnTable = (item) => {
        console.log(item)
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
