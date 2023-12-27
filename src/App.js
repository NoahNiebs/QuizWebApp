import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Home} from "./Pages/Home";
import Leaderboard from "./Pages/Leaderboard";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path ="/" element={<Home/>}></Route>
                <Route path ="/Leaderboard" element={<Leaderboard/>}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App;
