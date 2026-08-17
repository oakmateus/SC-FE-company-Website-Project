import { useState } from "react";
import CustomEventField from "./CustomEventField";

export default function EventTypeGroup({formData, handleChange}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isCustom, setIsCustom] = useState(false);

    function handleGroupToggle() {
        if (isCustom) {
            return;
        }

        setIsOpen(prev => !prev);
    }

    function handleCustomToggle(e) {
        const checked = e.target.checked;

        setIsCustom(checked);

        if (checked) {
            setIsOpen(false);
        }
    }

    return (
        <div className="event-type-group">
            <button className="event-type-button" type="button" onClick={handleGroupToggle}>
                <span>Tipo de Evento ☰</span>
            </button>

            {isOpen && (
                <div className="events-list">
                    <div className="list-content">
                        <label>
                            <input
                                type="radio"
                                name="event_types"
                                value="Casamento"
                                data-single="true"
                                checked={formData.event_types === "Casamento"}
                                onChange={handleChange}
                            />
                            Casamento
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="event_types"
                                value="Festa de Aniversário"
                                data-single="true"
                                checked={formData.event_types === "Festa de Aniversário"}
                                onChange={handleChange}
                            />
                            Festa de Aniversário
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="event_types"
                                value="Formatura"
                                data-single="true"
                                checked={formData.event_types === "Formatura"}
                                onChange={handleChange}
                            />
                            Formatura
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="event_types"
                                value="Reunião"
                                data-single="true"
                                checked={formData.event_types === "Reunião"}
                                onChange={handleChange}
                            />
                            Reunião
                        </label>

                        <label>
                            <input
                                type="radio"
                                name="event_types"
                                value="Chá de Bebê"
                                data-single="true"
                                checked={formData.event_types === "Chá de Bebê"}
                                onChange={handleChange}
                            />
                            Chá de Bebê
                        </label>
                    </div>
                </div>
            )}
            <CustomEventField 
                formData={formData}
                handleChange={handleChange}
                isOpen={isCustom}
                onToggle={handleCustomToggle}
            />
        </div>
    );
}