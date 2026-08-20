export default function PhoneModal({ formData, handleChange, onClose, handlePhone }) {
    return (
        <div className="overlay">
            <form className="phone-modal" onSubmit={handlePhone}>
                <h1>Alterar Número de Celular</h1>

                <input 
                    type="text" 
                    name="phone_number" 
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="Novo Número de Celular:"
                    required
                />

                <input 
                    type="password" 
                    name="password" 
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Insira sua senha:"
                    required
                />

                <div className="submit-and-cancel">
                    <button className="change-submit" type="submit">
                        Salvar
                    </button>

                    <button className="cancel" type="button" onClick={onClose}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}