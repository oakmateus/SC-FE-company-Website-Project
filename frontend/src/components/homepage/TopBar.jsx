import UserMenu from "./UserMenu";
import GuestMenu from "./GuestMenu";
import Logo from "../../assets/Logo.png";

import { Link } from "react-router-dom";

export default function TopBar({ user }) {
    return (
        <nav className="top-bar">
            <div className="left-buttons">
                <Link to="/contatos" className="contatos">Contatos</Link>
                <Link to="/sobre" className="sobre">Sobre</Link>
            </div>

            <div className="logo-top-bar">
                <img src={Logo} alt="Logo" />
            </div>
            
            <div className="left-buttons">
                {user ? <UserMenu user={user} /> : <GuestMenu />}
            </div>
        </nav>
    );
}