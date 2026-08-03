export async function refreshSession(data, setError) {
    try {
        if (!data.refresh_token) {
            setError('Algum erro ocorreu. Por favor, tente novamente.');
            return false;
        };
        
        return true;

        const response = await fetch("http://localhost:8000/login/refresh", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${data.refresh_token}`,
            },
        });

        const result = await response.json();

        if (!response.ok) {
            if (Array.isArray(data.detail)) {
                setError(data.detail[0].msg);
            } else {
                setError(data.detail);
            }
        }

        sessionStorage.setItem("access_token", result.access_token);

    } catch (err) {
        setError("Algum erro ocorreu. Por favor, tente novamente.");
    }
}
    