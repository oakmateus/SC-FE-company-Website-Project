import passwordChecks from "./passwordChecks";
import Logo from "../assets/Logo.png"
import BackTo from "./backtohomepage/BackTo";
import BottomBar from "./BottomBar";
import BackgroundShapes from "./BackgroundShapes";

export default function RecoverConfirmationForm( {formData, handleChange, error} ) {
    const checks = passwordChecks(formData.password);
    return (
        <main>
            <BackTo user={null} />
            <div className="recover-confirmation-container">
                <div className="logo-box">
                    <img src={Logo} alt="Logo" />
                </div>
                <div className="form-confirmation-container">
                    <div className="header-confirmation-text">
                        <h1>Recuperação de Senha</h1>
                        <p>Confirme o código e digite a nova senha</p>
                    </div>

                    <div className="form-confirmation-box">
                        <div className="confirmation-input-group">
                            <input 
                                name="code"
                                type="text"
                                className="confirmation-input-field"
                                value={formData.code}
                                placeholder="Código de Confirmação"
                                onChange={handleChange}
                                required
                            />

                            <input 
                                name="password"
                                type="password"
                                className="confirmation-input-field"
                                value={formData.password}
                                placeholder="Nova Senha"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="recover-requirements">

                            <div className="recover-requirement">
                                <span className={`dot ${checks.minLength ? "valid" : "invalid"}`}></span>
                                <span>8 Dígitos</span>
                            </div>

                            <div className="recover-requirement">
                                <span className={`recover-dot ${checks.number ? "valid" : "invalid"}`}></span>
                                <span>Um Número</span>
                            </div>

                            <div className="recover-requirement">
                                <span className={`recover-dot ${checks.uppercase ? "valid" : "invalid"}`}></span>
                                <span>Letra Maiúscula</span>
                            </div>

                            <div className="recover-requirement">
                                <span className={`recover-dot ${checks.special ? "valid" : "invalid"}`}></span>
                                <span>Caractere Especial</span>
                            </div>

                        </div>

                        <button className="submit-confirmation" type='submit'>
                            Confirmar
                        </button>

                        {error && (
                            <div className="error-message-confirmation">
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <BottomBar />
            <BackgroundShapes />
        </main>
    );
}