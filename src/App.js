import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Home} from "./Home";
import Customize from "./Pages/Customize";
import Play from "./Pages/Play";
import Leaderboard from "./Pages/Leaderboard";
import {Navigation} from "./Navigation";

function App() {
    return (

        <BrowserRouter>
            <Routes>
                <Route path ="/" element={<Home/>}></Route>
                <Route path ="/Customize" element={<Customize/>}></Route>
                <Route path ="/Play" element={<Play/>}></Route>
                <Route path ="/Leaderboard" element={<Leaderboard/>}></Route>
            </Routes>
        </BrowserRouter>

    )
}

export default App;
