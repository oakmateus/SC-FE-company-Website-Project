import Logo from "../../assets/Logo.png"
import Logout from "./ActionButtons/Logout"
import BackTo from "../backtohomepage/BackTo"
import ChangeUsername from "./ActionButtons/ChangeUsername"
import History from "../historybutton/History"
import ChangeEmail from "./ActionButtons/ChangeEmail"
import ChangePassword from "./ActionButtons/ChangePassword"
import ChangePhone from "./ActionButtons/ChangePhone"
import Delete from "./ActionButtons/Delete"
import BottomBar from "../BottomBar"
import BackgroundShapes from "../BackgroundShapes"

export default function ProfileForm({ user }) {
    return(
        <div className="profile-page">
            <main>
                <BackTo user={user} />
                <section className="title-content">
                    <div className="logo-section">
                        <img className="profile-page-logo" src={Logo} alt="Logo" />
                    </div>
                </section>

                <section className="buttons-container">
                    <div className="buttons-section">
                        <h1>Informações de Perfil</h1>

                        <div className="username-container">
                            <p className="username">{user?.username || ""}</p>
                            <ChangeUsername />
                        </div>

                        <div className="email-and-password">
                            <ChangeEmail />
                            <ChangePassword />
                        </div>

                        <div className="phone-and-delete">
                            <ChangePhone />
                            <Delete />
                        </div>

                        <div className="history-and-logout">
                            <History />
                            <Logout />
                        </div>
                    </div>
                </section>
            </main>
            <BottomBar />
            <BackgroundShapes />
        </div>
    );
}