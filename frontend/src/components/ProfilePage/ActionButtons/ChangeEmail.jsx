import { useState } from "react";
import { useNavigate } from "react-router-dom";
import EmailModal from "./EmailModal";

export default function ChangeEmail() {

    const [formData, setFormData] = useState({
        email: "",
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

    async function handleEmail(event) {
        event.preventDefault();
        setError(null);

        let token = sessionStorage.getItem("access_token");

        if (!token) {
            navigate("/");
            return;
        }

        let response = await fetch(
            "/api/users/me/email",
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

            sessionStorage.setItem("access_token", token);

            response = await fetch(
                "/api/users/me/email",
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
                className="change-email"
                onClick={() => setIsOpen(true)}
            >
                Alterar E-Mail
            </button>

            {isOpen && (
                <EmailModal
                    onClose={() => setIsOpen(false)}
                    handleChange={handleChange}
                    formData={formData}
                    handleEmail={handleEmail}
                    error={error}
                />
            )}
        </div>
    );
}