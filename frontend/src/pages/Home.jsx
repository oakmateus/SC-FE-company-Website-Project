import { useEffect, useState } from "react";
import TopBar from "../components/homepage/TopBar";

import "./home.css";

export default function Home() {

    const [user, setUser] = useState(null);

    useEffect(() => {

        const token = sessionStorage.getItem("access_token");

        if (!token) {
            return;
        }

        async function loadUser() {

            try {

                const response = await fetch("http://localhost:8000/users/me", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    sessionStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");

                    return;
                }

                const data = await response.json();

                setUser(data);
            } catch (error) {
                console.error(error);
            }
        }

        loadUser();

    }, []);

    return (
        <div className="homepage-container">
            <TopBar user={user}/>
        </div>
    );
}