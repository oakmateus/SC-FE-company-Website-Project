import { Link } from "react-router-dom";
import ProfilePicture from "../../assets/ProfilePicture.png"
import History from "../historybutton/History";


export default function UserMenu({ user }) {

    return (
        <>
            <History />
            
            <Link className="profile-button" to="/users/me/profile">
                <span>Acessar Perfil</span>

                <div className="profile-picture">
                    <img src={ProfilePicture} alt="pfp" />
                </div>
            </Link>
        </>
    );
}