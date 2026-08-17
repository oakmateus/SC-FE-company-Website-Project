export async function refreshSession(setError) {
    try {
        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
            setError('Algum erro ocorreu. Por favor, tente novamente.');
            return false;
        };

        const response = await fetch("http://localhost:8000/login/refresh", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${refreshToken}`,
            },
        });

        const result = await response.json();

        if (!response.ok) {
            if (Array.isArray(result.detail)) {
                setError(result.detail[0].msg);
            } else {
                setError(result.detail);
            }
        }

        sessionStorage.setItem("access_token", result.access_token);

        return true;

    } catch (err) {
        setError("Algum erro ocorreu. Por favor, tente novamente.");
        return false;
    }
}
    