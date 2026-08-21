export default function EmailModal({ formData, handleChange, onClose, handleEmail, error }) {
    return (
        <div className="overlay">
            <form className="email-modal" onSubmit={handleEmail}>
                <h1>Alterar E-Mail</h1>

                <input 
                    type="text" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Novo E-Mail:"
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

                {error && (
                    <div className="profile-error-message">
                        {error}
                    </div>
                )}
            </form>
        </div>
    );
}