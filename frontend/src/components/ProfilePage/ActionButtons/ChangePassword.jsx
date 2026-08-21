import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PasswordModal from "./PasswordModal";

export default function ChangePassword() {

    const [formData, setFormData] = useState({
        email: "",
        new_password: "",
        password: "",
    });

    function handleChange(e) {
        const {name, value, type, checked} = e.target;

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked: value,
        });
    };

    const [error, setError] = useState(null);

    const [isOpen, setIsOpen] = useState(false);

    const navigate = useNavigate();

    async function handlePassword(event) {
        event.preventDefault();
        setError(null);

        let token = sessionStorage.getItem("access_token");

        if (!token) {
            navigate("/");
            return;
        }

        let response = await fetch(
            "http://localhost:8000/users/me/password",
            {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            if (Array.isArray(data.detail)) {
                setError(data.detail[0].msg);
            } else {
                setError(data.detail);
            }

            return;
        };

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
                "http://localhost:8000/users/me/password",
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

        if (Array.isArray(data.message)) {
            setError(data.message[0].msg);
        } else {
            setError(data.message);
        }

        setIsOpen(false);
        navigate("/users/me");
    }

    return (
        <div>
            <button
                className="change-password"
                onClick={() => setIsOpen(true)}
            >
                Alterar Senha
            </button>

            {isOpen && (
                <PasswordModal
                    onClose={() => setIsOpen(false)}
                    handleChange={handleChange}
                    formData={formData}
                    handlePassword={handlePassword}
                    error={error}
                />
            )}
        </div>
    );
}