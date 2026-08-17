import { useState } from "react";
import LoginForm from "../components/LoginForm";
import { useNavigate } from "react-router-dom";
import { refreshSession } from "../components/Refresh";

import "./login.css";

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember_me: false,
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

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null)

        const body = new URLSearchParams();
        body.append('email', formData.email)
        body.append('password', formData.password)
        body.append('remember_me', formData.remember_me)

        try {
            const response = await fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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

                return;
            } else {
                sessionStorage.setItem("access_token", data.access_token);

                if (data.refresh_token) {
                    localStorage.setItem("refresh_token", data.refresh_token);
                }
                navigate('/users/me');
            }
        } catch (err) {
            setError('Algum erro ocorreu. Por favor, tente novamente.');
        };
    };

    return (
        <form onSubmit={handleLogin}>
            <LoginForm 
                formData={formData}
                handleChange={handleChange}
                error={error}
            />
        </form>
    );
}

export default Login;