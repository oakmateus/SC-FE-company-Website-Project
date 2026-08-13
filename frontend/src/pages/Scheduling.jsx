import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Shceduling() {

    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {

        const token = sessionStorage.getItem("access_token");

        if (!token) {
            navigate('/login');
            return;
        }

        async function loadUser() {

            try {

                const response = await fetch("http://localhost:8000/users/me/scheduling", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    sessionStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");

                    navigate('/login');
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

    return (<></>);
}