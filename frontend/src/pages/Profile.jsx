import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileForm from "../components/ProfilePage/ProfileForm"

import "./profile.css"

export default function Profile() {

    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        async function loadProfile() {
            
            let token = sessionStorage.getItem("access_token");

            if (!token) {
                navigate("/");
                return;
            }

            let response = await fetch(
                "/api/users/me/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 401) {
                const refreshToken = localStorage.getItem("refresh_token");

                if (!refreshToken) {
                    navigate("/");
                    return;
                }

                const refreshResponse = await fetch(
                    "/api/login/refresh",
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${refreshToken}`,
                        },
                    }
                );

                if (!refreshResponse.ok) {
                    sessionStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");

                    navigate("/");
                    return;
                }

                const refreshData = await refreshResponse.json();

                token = refreshData.access_token;

                sessionStorage.setItem(
                    "access_token",
                    token
                );

                response = await fetch(
                    "/api/users/me/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }


            if (!response.ok) {
                return;
            }

            const data = await response.json();
            setUser(data);
            console.log(data.username);
        }

        loadProfile();

    }, [navigate]);

    return(
        <div>
            <ProfileForm 
                user={user}    
            />
        </div>
    )
}