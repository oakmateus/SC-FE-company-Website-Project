export default function CustomEvent({formData, handleChange, isOpen, onToggle}) {
    return (
        <div className="custom-service-group">

            <label>
                <input
                    type="checkbox"
                    onChange={onToggle}
                />
                Serviço personalizado
            </label>

            {isOpen && (
                <div className="custom-text-box">
                    <textarea
                        type="text"
                        name="custom_service"
                        value={formData.custom_service}
                        onChange={handleChange}
                        placeholder="Personalize seu serviço!"
                    />
                </div>
            )}

        </div>
    );
}