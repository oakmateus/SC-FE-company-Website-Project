export default function CustomEvent({formData, handleChange, isOpen, onToggle}) {
    return (
        <div className="custom-event-group">

            <label>
                <input
                    type="checkbox"
                    onChange={onToggle}
                />
                Evento personalizado
            </label>

            {isOpen && (
                <div className="custom-text-box">
                    <textarea
                        type="text"
                        name="custom_event"
                        value={formData.custom_event}
                        onChange={handleChange}
                        placeholder="O evento do seu jeito!"
                    />
                </div>
            )}

        </div>
    );
}