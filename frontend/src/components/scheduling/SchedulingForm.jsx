import Logo from "../../assets/Logo.png";
import EventTypeGroup from "./EventTypeGroup";
import ServiceTypeGroup from "./ServiceTypeGroup";
import BackgroundShapes from "../BackgroundShapes";
import BottomBar from "../BottomBar";
import BackTo from "../backtohomepage/BackTo";

export default function SchedulingForm( {formData, handleChange, error, success, user} ) {
    
    const allowedKeys = [
        "Backspace",
        "Delete",
        "Tab",
        "ArrowLeft",
        "ArrowRight",
        "Home",
        "End"
    ];
    
    return (
        <div className="scheduling-page">
            <main>
                <BackTo user={user}/>
                <section className="title-section">
                    <img className="scheduling-logo" src={Logo} alt="Logo" />
                    <div className="scheduling-title">
                        <h1>Agendamento</h1>
                        <p>Torne seu sonho realidade!</p>
                    </div>
                </section>

                <section className="scheduling-form">
                    <div className="scheduling-container">
                        <div className="checklist-group">
                            <EventTypeGroup
                                formData={formData}
                                handleChange={handleChange}
                            />
                            <ServiceTypeGroup
                                formData={formData}
                                handleChange={handleChange}
                            />
                        </div>
                        <div className="number-fields">
                            <div className="estimated-budget">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    name="estimated_budget"
                                    step="0.01"
                                    value={formData.estimated_budget}
                                    onChange={handleChange}
                                    placeholder="R$00000,00"
                                    onKeyDown={(e) => {
                                        if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                                <span>Orçamento estimado</span>
                            </div>
                            <div className="estimated-guests-quantity">
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    name="estimated_gests_quantity"
                                    value={formData.estimated_gests_quantity}
                                    onChange={handleChange}
                                    placeholder="Qnt.:"
                                    onKeyDown={(e) => {
                                        if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                            e.preventDefault();
                                        }
                                    }}
                                />
                                <span>Número de convidados</span>
                            </div>
                        </div>
                        <div className="date-address-group">
                            <div className="calendar">
                                <label>
                                    <input
                                        type="date"
                                        name="estimated_date"
                                        value={formData.estimated_date}
                                        onChange={handleChange}
                                        min={new Date().toISOString().split("T")[0]}
                                    />
                                    <span>Data do Evento</span>
                                </label>
                            </div>
                            <div className="address">
                                <textarea
                                    type="text"
                                    name="event_address"
                                    value={formData.event_address}
                                    onChange={handleChange}
                                    placeholder="Endereço do Evento"
                                />
                                <span>cidade - cep - bairro - logr. - núm.</span>
                            </div>
                        </div>
                        <div className="optional-observations">
                            <span>Observações (opcional)</span>
                            <textarea
                                type="text"
                                name="optional_observatios"
                                value={formData.optional_observatios}
                                onChange={handleChange}
                            />
                        </div>
                        <button className="scheduling-submit" type="submit">Agendar</button>
                        {error && (
                            <div className="error-scheduling">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="message-scheduling">
                                {success}
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <BottomBar />
            <BackgroundShapes />
        </div>
    )
}