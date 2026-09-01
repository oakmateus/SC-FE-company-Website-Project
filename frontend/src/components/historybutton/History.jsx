import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HistoryModal from "./HistoryModal";

import "./HistoryLayout.css";

export default function History() {

    const [isOpen, setIsOpen] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null);

    const handleClick = async () => {
        await handleHistory();
        setIsOpen(true);
    };

    const navigate = useNavigate();

    async function handleHistory() {
        let token = sessionStorage.getItem("access_token");

        if (!token) {
            navigate("/");
            return;
        }

        let response = await fetch(
            "/api/users/me/history",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

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

            sessionStorage.setItem(
                "access_token",
                token
            );

            response = await fetch(
                "/api/users/me/history",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        }

        if (!response.ok) {
            return;
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        setPdfUrl(url);
    }

    return(
        <div>
            <button className="history-button" onClick={handleClick}
            >
                Histórico
            </button>

            {isOpen && (
                <HistoryModal 
                    pdfUrl={pdfUrl}
                    onClose={() => {
                        setIsOpen(false);
                        URL.revokeObjectURL(pdfUrl);
                    }}
                />
            )}
        </div>
    )
}