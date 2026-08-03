import { Link } from "react-router-dom";

export default function UserMenu({ user }) {

    return (
        <>
            <Link to="/conta/historico">
                Histórico
            </Link>

            <Link to="/conta/perfil">
                Acessar Perfil
            </Link>
        </>
    );
}