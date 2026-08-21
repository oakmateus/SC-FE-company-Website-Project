export default function UsernameModal({ formData, handleChange, onClose, handleUsername, error }) {
    return (
        <div className="overlay">
            <form className="username-modal" onSubmit={handleUsername}>
                <h1>Trocar nome de usuário</h1>

                <input 
                    type="text" 
                    name="new_username" 
                    value={formData.new_username}
                    onChange={handleChange}
                    placeholder="Novo nome de usuário"
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