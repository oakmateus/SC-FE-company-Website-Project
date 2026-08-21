import { Link } from "react-router-dom";

import "./BottomBar.css"

export default function BottomBar() {
    return(
        <nav className="bottom-bar">
            <Link to="/about" className="botton-buttons">Sobre</Link>
            <div className="circle"></div>
            <Link to="/terms" className="botton-buttons">Termos</Link>
        </nav>
    );
}