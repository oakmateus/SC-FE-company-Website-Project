export default function PasswordModal({ formData, handleChange, onClose, handlePassword }) {
    return (
        <div className="overlay">
            <form className="password-modal" onSubmit={handlePassword}>
                <h1>Alterar Senha</h1>

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

                <input 
                    type="password" 
                    name="new_password" 
                    value={formData.new_password}
                    onChange={handleChange}
                    placeholder="Insira a nova senha:"
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