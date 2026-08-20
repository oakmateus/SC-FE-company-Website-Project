import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UsernameModal from "./UsernameModal";

export default function ChangeUsername() {

    const [formData, setFormData] = useState({
        new_username: "",
    });

    function handleChange(e) {
        const {name, value, type, checked} = e.target;

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked: value,
        });
    }

    const [isOpen, setIsOpen] = useState(false);

    const navigate = useNavigate();

    async function handleUsername(event) {
        event.preventDefault();

        let token = sessionStorage.getItem("access_token");

        if (!token) {
            navigate("/");
            return;
        }

        let response = await fetch(
            "http://localhost:8000/users/me/username",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            }
        );

        if (response.status === 401) {
            const refreshToken = localStorage.getItem("refresh_token");

            if (!refreshToken) {
                navigate("/");
                return;
            }

            const refreshResponse = await fetch(
                "http://localhost:8000/login/refresh",
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

            sessionStorage.setItem("access_token", token);

            response = await fetch(
                "http://localhost:8000/users/me/username",
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );
        }

        if (!response.ok) {
            return;
        }

        const result = await response.json();
        console.log(result);
        setIsOpen(false);

        navigate("/users/me");
    }

    return (
        <div>
            <button
                className="change-username"
                onClick={() => setIsOpen(true)}
            >
                Trocar nome
            </button>

            {isOpen && (
                <UsernameModal
                    onClose={() => setIsOpen(false)}
                    handleChange={handleChange}
                    formData={formData}
                    handleUsername={handleUsername}
                />
            )}
        </div>
    );
}