import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteModal from "./DeleteModal";

export default function Delete() {

    const [formData, setFormData] = useState({
        password: "",
        email: "",
    });

    function handleChange(e) {
        const {name, value, type, checked} = e.target;

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked: value,
        });
    }
    const [error, setError] = useState(null);

    const [isOpen, setIsOpen] = useState(false);

    const navigate = useNavigate();

    async function handleDelete(event) {
        event.preventDefault();
        setError(null);

        let token = sessionStorage.getItem("access_token");

        if (!token) {
            navigate("/");
            return;
        }

        let response = await fetch(
            "/api/users/me/delete",
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
                "/api/users/me/delete",
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

        sessionStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        navigate("/register");
    }

    return (
        <div>
            <button
                className="delete"
                onClick={() => setIsOpen(true)}
            >
                Deletar Conta
            </button>

            {isOpen && (
                <DeleteModal
                    onClose={() => setIsOpen(false)}
                    handleChange={handleChange}
                    formData={formData}
                    handleDelete={handleDelete}
                    error={error}
                />
            )}
        </div>
    );
}