import {Route, Routes} from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';

function App() {
    return (
        <div className="App">
            <div className="container mx-auto">
                <Header/>
                <Routes>
                    <Route index element={<Home/>}/>
                </Routes>
                <Footer/>
            </div>
        </div>
    );
}

export default App;
