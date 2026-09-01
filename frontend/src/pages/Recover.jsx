import { useState } from "react";
import RecoverForm from "../components/RecoverForm";
import { useNavigate } from "react-router-dom";

import "./recover.css";

function Recover() {
    const [formData, setFormData] = useState({
        email: '',
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

    const handleRecover = async (e) => {
        e.preventDefault();
        setError(null)

        try {
            const response = await fetch('/api/login/recover', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                if (Array.isArray(data.detail)) {
                    setError(data.detail[0].msg);
                } else {
                    setError(data.detail);
                }
            } else {
                sessionStorage.setItem('recovery_token', data.recovery_token);
                navigate('/login/recover/confirmation');
            }
        } catch (err) {
            setError('Algum erro ocorreu. Por favor, tente novamente.');
        };
    };

    return (
        <form onSubmit={handleRecover}>
            <RecoverForm 
                formData={formData}
                handleChange={handleChange}
                error={error}
            />
        </form>
    );
}

export default Recover;