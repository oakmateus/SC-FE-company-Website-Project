import { useEffect, useState } from "react";
import HomePage from "../components/homepage/HomePage";
import { useNavigate } from "react-router-dom";

import "./home.css";

export default function Home() {

    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {

        async function loadUser() {
            try {
                let token = sessionStorage.getItem("access_token");

                if (!token) {
                    navigate("/");
                    return;
                }
                
                let response = await fetch("/api/users/me", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.status === 401) {
                    const refreshToken = localStorage.getItem("refresh_token");

                    if (!refreshToken) {
                        navigate("/login");
                        return;
                    }

                    const refreshResponse = await fetch(
                        "/api/login/refresh",
                        {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${refreshToken}`
                            }
                        }
                    );

                    if (!refreshResponse.ok) {
                        sessionStorage.removeItem("access_token");
                        localStorage.removeItem("refresh_token");

                        navigate("/login");
                        return;
                    }

                    const refreshData = await refreshResponse.json();

                    token = refreshData.access_token;

                    sessionStorage.setItem(
                        "access_token",
                        refreshData.access_token
                    );

                    response = await fetch("/api/users/me", {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${refreshData.access_token}`
                        }
                    });
                }

                if (!response.ok) {
                    sessionStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");

                    navigate("/login");
                    return;
                }

                const data = await response.json();

                setUser(data);

            } catch (error) {
                console.error(error);
            }
        }

        loadUser();

    }, [navigate]);

    return (
        <div>
            <HomePage user={user}/>
        </div>
    );
}