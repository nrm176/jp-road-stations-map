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

    useEffect(() => {
        setLoading(true)
        const apiUrl = `${baseUrl}/distances/?offset=0&limit=${limit}&max_distance=${maxDistance}&pref_code=${selectedPref}`;

        axios.get(apiUrl)
            .then(response => {
                setData(response.data.records);
                setLoading(false)
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, [maxDistance, limit, selectedPref]);

    useEffect(() => {
        if (prefectures.length == 0) {
            fetchPrefectureData().then((data) => {
                setPrefectures(data);
                localStorage.setItem('prefectures', JSON.stringify(data));
            });
        }
    }, []);


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
