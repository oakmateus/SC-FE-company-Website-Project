import { Link } from "react-router-dom";

export default function GuestMenu() {

    return (
        <>
            <Link className="right-button" to="/login">Entrar</Link>
            <div className="register">
                <Link className="right-button" to="/register">Registrar</Link>
            </div>
        </>
    );
}