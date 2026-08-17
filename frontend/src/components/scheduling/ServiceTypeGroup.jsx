import { useState } from "react";
import CustomServiceField from "./CustomServiceField"

export default function ServiceTypeGroup({formData, handleChange}) {
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
        <div className="service-type-group">
            <button className="service-type-button" type="button" onClick={handleGroupToggle}>
                <span>Tipos de Serviços ☰</span>
            </button>

            {isOpen && (
                <div className="services-list">
                    <div className="service-list-content">
                        <label>
                            <input
                                type="checkbox"
                                name="service_types"
                                value="Cerimonialismo"
                                data-array="true"
                                checked={formData.service_types.includes("Cerimonialismo")}
                                onChange={handleChange}
                            />
                            Cerimonialismo
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                name="service_types"
                                value="Ornamentação"
                                data-array="true"
                                checked={formData.service_types.includes("Ornamentação")}
                                onChange={handleChange}
                            />
                            Ornamentação
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                name="service_types"
                                value="Mentoria"
                                data-array="true"
                                checked={formData.service_types.includes("Mentoria")}
                                onChange={handleChange}
                            />
                            Mentoria
                        </label>

                        <label>
                            <input
                                type="checkbox"
                                name="service_types"
                                value="Cozinha"
                                data-array="true"
                                checked={formData.service_types.includes("Cozinha")}
                                onChange={handleChange}
                            />
                            Cozinha
                        </label>

                        {formData.service_types.includes("Cozinha") && (
                            <div className="optional-kitchens-list">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="optional_kitchens"
                                        value="Confeitaria"
                                        data-array="true"
                                        checked={formData.optional_kitchens.includes("Confeitaria")}
                                        onChange={handleChange}
                                    />
                                    Confeitaria
                                </label>

                                <label>
                                    <input
                                        type="checkbox"
                                        name="optional_kitchens"
                                        value="Salgados"
                                        data-array="true"
                                        checked={formData.optional_kitchens.includes("Salgados")}
                                        onChange={handleChange}
                                    />
                                    Salgados
                                </label>

                                <label>
                                    <input
                                        type="checkbox"
                                        name="optional_kitchens"
                                        value="Boleria"
                                        data-array="true"
                                        checked={formData.optional_kitchens.includes("Boleria")}
                                        onChange={handleChange}
                                    />
                                    Boleria
                                </label>
                            </div>
                    
                        )}
                    </div>

                </div>
            )}
        <CustomServiceField 
            formData={formData}
            handleChange={handleChange}
            isOpen={isCustom}
            onToggle={handleCustomToggle}
        />
        </div>
    )
}