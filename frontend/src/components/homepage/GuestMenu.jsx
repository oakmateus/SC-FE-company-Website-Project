import { Link } from "react-router-dom";

export default function GuestMenu() {

    return (
        <>
            <Link className="right-button" to="/login">Entrar</Link>
            <Link className="right-button" to="/register">Registrar</Link>
        </>
    );
}