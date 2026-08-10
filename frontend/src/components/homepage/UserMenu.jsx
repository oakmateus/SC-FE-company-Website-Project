import { Link } from "react-router-dom";
import ProfilePicture from "../../assets/ProfilePicture.png"


export default function UserMenu({ user }) {

    return (
        <>
            <Link className="history-button" to="/conta/historico">
                Histórico
            </Link>

            <Link className="profile-button" to="/conta/perfil">
                <span>Acessar Perfil</span>

                <div className="profile-picture">
                    <img src={ProfilePicture} alt="pfp" />
                </div>
            </Link>
        </>
    );
}