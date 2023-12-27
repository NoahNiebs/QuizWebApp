import {Link} from "react-router-dom";

export const Navigation = () => {
    return (
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <ul className="navbar-nav mr-auto">
                    <ul className="nav-item">
                        <Link to="/">Home</Link>
                    </ul>
                    <ul className="nav-item">
                        <Link to="/Leaderboard">Leaderboard</Link>
                    </ul>
                </ul>
            </nav>
    )
}