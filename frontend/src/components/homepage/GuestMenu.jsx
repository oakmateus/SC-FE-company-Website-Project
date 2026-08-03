import { Link } from "react-router-dom";

export default function GuestMenu() {

    return (
        <>
            <Link to="/login">Entrar</Link>
            <Link to="/conta/registro">Registrar</Link>
        </>
    );
}