import { useNavigate } from "react-router-dom";

export default function Logout() {

    const navigate = useNavigate();

    async function handleLogout() {
        const refreshToken = localStorage.getItem("refresh_token");

        try {
            await fetch("http://localhost:8000/users/me/logout", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${refreshToken}`,
                }
            });
        } finally {
            sessionStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");

            navigate("/login");
        }     
    }

    return(
        <button className="logout"
            onClick={handleLogout}
        >
            Sair da conta
        </button>
    );
}