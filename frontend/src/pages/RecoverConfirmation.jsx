import { useState } from "react";
import RecoverConfirmationForm from "../components/RecoverConfirmationForm";
import { useNavigate } from "react-router-dom";

import "./recover_confirmation.css";

function RecoverConfirmation() {
    const [formData, setFormData] = useState({
        password: '',
        code: '',
    });
    const [error, setError] = useState(null);
    
    function handleChange(e) {
        const {name, value} = e.target
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const navigate = useNavigate();

    const handleRecoverConfirmation = async (e) => {
        e.preventDefault();
        setError(null)

        const recoveryToken = sessionStorage.getItem("recovery_token");

        try {
            const response = await fetch("/api/login/recover/confirmation",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${recoveryToken}`,
                    },
                    body: JSON.stringify(formData),
                }
            )

            const data = await response.json();

            if (!response.ok) {
                if (Array.isArray(data.detail)) {
                    setError(data.detail[0].msg);
                } else {
                    setError(data.detail);
                };
            } else {
                sessionStorage.removeItem("recovery_token");
                navigate("/login");
            }
        } catch (err) {
            setError("Algum erro ocorreu. Por favor, tente novamente.");
        };
    };

    return (
        <form onSubmit={handleRecoverConfirmation}>
            <RecoverConfirmationForm 
                formData={formData}
                handleChange={handleChange}
                error={error}
            />
        </form>
    );
};

export default RecoverConfirmation;