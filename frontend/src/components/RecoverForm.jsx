import Logo from "../assets/Logo.png"

export default function RecoverForm( {formData, handleChange, error} ) {
    return (
        <div className="recover-container">
            <div className="logo-box">
                <img src={Logo} alt="Logo" />
            </div>
            <div className="form-recover-container">
                <div className="header-recover-text">
                    <h1>Recuperação de Senha</h1>
                    <p>Insira o seu e-mail</p>
                </div>

                <div className="form-recover-box">
                    <div className="recover-input-group">
                        <input 
                            name="email"
                            type="text"
                            className="recover-input-field"
                            value={formData.username}
                            placeholder="E-Mail"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button className="submit-recover" type='submit'>
                        Continuar
                    </button>

                    {error && (
                        <div className="error-message-recover">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}