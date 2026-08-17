import passwordChecks from "./passwordChecks";
import Logo from "../assets/Logo.png"
import BackTo from "./backtohomepage/BackTo";
import BottomBar from "./BottomBar";
import BackgroundShapes from "./BackgroundShapes";

export default function RegisterForm( {formData, handleChange, error}) {
    const checks = passwordChecks(formData.password);
    return (
        <main>
            <BackTo user={null} />
            <div className="register-container">
                <div className="logo-box">
                    <img src={Logo} alt="Logo" />
                </div>
                <div className="form-register-container">
                    <div className="header-text">
                        <h1>Seja bem-vindo!</h1>
                        <p>Crie sua conta</p>
                    </div>
                    
                    <div className="form-box">
                        <div className="input-group">
                            <input
                                name="client_username"
                                type="text"
                                className="input-field"
                                placeholder="Nome Completo"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <input
                                name="email"
                                type="text"
                                className="input-field"
                                placeholder="E-Mail"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <input
                                name="phone_number"
                                type="tel"
                                className="input-field"
                                placeholder="Número de Celular"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <input
                                name="password"
                                type="password"
                                className="input-field"
                                placeholder="Crie uma senha"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        
                        <div className="input-group">
                            <input
                                name="confirm_password"
                                type="password"
                                className="input-field"
                                placeholder="Confirme sua senha"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="requirements">

                            <div className="requirement">
                                <span className={`dot ${checks.minLength ? "valid" : "invalid"}`}></span>
                                <span>8 Dígitos</span>
                            </div>

                            <div className="requirement">
                                <span className={`dot ${checks.number ? "valid" : "invalid"}`}></span>
                                <span>Um Número</span>
                            </div>

                            <div className="requirement">
                                <span className={`dot ${checks.uppercase ? "valid" : "invalid"}`}></span>
                                <span>Letra Maiúscula</span>
                            </div>

                            <div className="requirement">
                                <span className={`dot ${checks.special ? "valid" : "invalid"}`}></span>
                                <span>Caractere Especial</span>
                            </div>

                        </div>

                        <label className="terms">
                            <input
                                type="checkbox"
                                name="acceptedTerms"
                                className="check"
                                checked={formData.acceptedTerms}
                                onChange={handleChange}
                            />
                            Aceito os <a href="/terms">Termos de Uso e Políticas de Privacidade.</a>
                        </label>

                        <button className="submit" type='submit'>
                            Registrar
                        </button>

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <p className="form-link">Possui uma conta? <a href="/login">Login</a></p>

                    </div>
                </div>
            </div>
            <BottomBar />
            <BackgroundShapes />
        </main>
    );
}