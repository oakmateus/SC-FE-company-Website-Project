import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SchedulingForm from "../components/scheduling/SchedulingForm"

import "./scheduling.css"

export default function Shceduling() {

    const [user, setUser] = useState(null);

    const [formData, setFormData] = useState({
        event_types: "",
        custom_event: "",
        service_types: [],
        custom_service: "",
        optional_kitchens: [],
        estimated_date: "",
        event_address: "",
        estimated_gests_quantity: "",
        estimated_budget: "",
        optional_observatios: ""
    });

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    function handleChange(e) {
        const {
            name,
            value,
            type,
            checked,
            dataset
        } = e.target;

        setFormData(prev => {

            if (dataset.array === "true") {
                return {
                    ...prev,
                    [name]: checked
                        ? [...prev[name], value]
                        : prev[name].filter(item => item !== value)
                };
            }

            if (name === "event_types") {
                return {
                    ...prev,
                    event_types: value,
                    custom_event: ""
                };
            }

            if (name === "custom_event") {
                return {
                    ...prev,
                    custom_event: value,
                    event_types: ""
                };
            }

            if (name === "service_types") {
                return {
                    ...prev,
                    service_types: value,
                    custom_service: ""
                };
            }

            if (name === "custom_service") {
                return {
                    ...prev,
                    custom_service: value,
                    service_types: [],
                    optional_kitchens: []
                };
            }

            return {
                ...prev,
                [name]: type === "checkbox" ? checked : value
            };
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setError(null);

        const token = sessionStorage.getItem("access_token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {

            if (formData.estimated_budget === "") {
                setError("Informe o orçamento estimado.");
                return;
            }

            if (formData.estimated_date === "") {
                setError("Informe uma data compatível.");
                return;
            }

            const data = {
                ...formData,
                estimated_gests_quantity:
                    formData.estimated_gests_quantity === ""
                        ? null
                        : Number(formData.estimated_gests_quantity),


                estimated_budget: Number(formData.estimated_budget),

                estimated_date: formData.estimated_date,
            };

            const response = await fetch(
                "/api/users/me/scheduling",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                }
            );

            const dataResponse = await response.json();

            if (!response.ok) {
                if (Array.isArray(dataResponse.detail)) {
                    setError(dataResponse.detail[0].msg);
                } else {
                    setError(dataResponse.detail);
                }

                return;
            } else {
                setSuccess(dataResponse.message);
                setTimeout(() => {
                    navigate('/users/me');
                }, 2000);
                return;
            }

        } catch (error) {
            console.error(error);

            setError(
                "Não foi possível conectar ao servidor."
            );
        }
    }

    const navigate = useNavigate();

    useEffect(() => {

        async function loadUser() {
            try {
                let token = sessionStorage.getItem("access_token");

                if (!token) {
                    navigate("/login");
                    return;
                }

                let response = await fetch("/api/users/me/", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.status === 401) {
                    const refreshToken = localStorage.getItem("refresh_token");

                    if (!refreshToken) {
                        navigate("/login");
                        return;
                    }

                    const refreshResponse = await fetch(
                        "/api/login/refresh",
                        {
                            method: "POST",
                            headers: {
                                Authorization: `Bearer ${refreshToken}`
                            }
                        }
                    );

                    if (!refreshResponse.ok) {
                        sessionStorage.removeItem("access_token");
                        localStorage.removeItem("refresh_token");

                        navigate("/login");
                        return;
                    }

                    const refreshData = await refreshResponse.json();

                    token = refreshData.access_token;

                    sessionStorage.setItem(
                        "access_token",
                        refreshData.access_token
                    );

                    response = await fetch("/api/users/me/", {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${refreshData.access_token}`
                        }
                    });
                }

                if (!response.ok) {
                    navigate("/login");
                    return;
                }

                const data = await response.json();

                setUser(data);

            } catch (error) {
                console.error(error);
            }
        }

        loadUser();

    }, [navigate]);

    return (
        <form onSubmit={handleSubmit}>
            <SchedulingForm
                formData={formData}
                handleChange={handleChange}
                error={error}
                success={success}
                user={user}
            />
        </form>
    );
}