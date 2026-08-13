import { useState } from "react";
import RegisterForm from "../components/RegisterForm"
import { useNavigate } from "react-router-dom";

import './register.css';

function Register() {
    const [formData, setFormData] = useState({
        client_username: "",
        email: "",
        phone_number: "",
        password: "",
        confirm_password: "",
        acceptedTerms: false,
    });
    const [error, setError] = useState(null);

    function handleChange(e) {
        const {name, value, type, checked} = e.target;

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked: value,
        });
    }

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);

        if (formData.password != formData.confirm_password) {
            setError('As senhas precisam ser iguais')
            return;
        };

        if (formData.acceptedTerms == false) {
            setError('É necessario aceitar os Termos de Uso')
            return;
        };

        try {
            const response = await fetch('http://localhost:8000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
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
                navigate('/login');
            };

        } catch (err) {
            setError('Algum erro ocorreu. Por favor, tente novamente.');
        };
    };

    return (
        <form onSubmit={handleRegister} className="register-page">
            <RegisterForm 
                formData={formData}
                handleChange={handleChange}
                error={error}
            />
        </form>
    );
}

export default Register;