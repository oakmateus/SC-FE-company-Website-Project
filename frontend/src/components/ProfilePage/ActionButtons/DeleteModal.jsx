export default function DeleteModal({ formData, handleChange, onClose, handleDelete }) {
    return (
        <div className="overlay">
            <form className="delete-modal" onSubmit={handleDelete}>
                <h1>Deletar Conta</h1>

                <input 
                    type="text" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Confirme seu E-Mail:"
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
                        Confirmar
                    </button>

                    <button className="cancel" type="button" onClick={onClose}>
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}