export default function HistoryModal({ pdfUrl, onClose }) {
    return (
        <div className="overlay">
            <div className="history-modal">
                <button className="close-overlay" onClick={onClose}>‹</button>

                <div className="history-modal-content">

                    <h1>Histórico de Agendamentos</h1>
                    <p>Todos os seus eventos em PDF.</p>

                    <a
                        href={pdfUrl}
                        download="historico.pdf"
                    >
                        Baixar
                    </a>

                    <iframe
                        src={pdfUrl}
                    />

                </div>
            </div>
        </div>
    );
}