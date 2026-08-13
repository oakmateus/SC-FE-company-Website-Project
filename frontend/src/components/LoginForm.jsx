import Logo from "../assets/Logo.png"

export default function LoginForm( {formData, handleChange, error} ) {
    return (
        <div className="login-container">
            <div className="logo-box">
                <img src={Logo} alt="Logo" />
            </div>
            <div className="form-login-container">
                <div className="header-wellcome-text">
                    <h1>Bem-vindo de volta!</h1>
                    <p>Entre em sua conta</p>
                </div>

                <div className="form-login-box">
                    <div className="login-input-group">
                        <input 
                            name="email"
                            type="email"
                            className="login-input-field"
                            value={formData.email}
                            placeholder="E-Mail"
                            onChange={handleChange}
                            required
                        />

                        <input
                            name="password"
                            type="password"
                            className="login-input-field"
                            value={formData.password}
                            placeholder="Senha"
                            onChange={handleChange}
                            required 
                        />

                        <div className="optionals">
                            <label className="remember-me">
                                <input
                                    type="checkbox"
                                    name="remember_me"
                                    className="remember-check"
                                    checked={formData.remember_me}
                                    onChange={handleChange}
                                />
                                Lembre de mim
                            </label>

                            <a className="forgot-password" href="/login/recover">Esqueci minha senha</a>
                        </div>

                        <button className="submit-login" type='submit'>
                            Entrar
                        </button>

                        {error && (
                            <div className="error-message-login">
                                {error}
                            </div>
                        )}

                        <p className="form-link-login">Primeira vez por aqui? <a href="/register">Cadastre-se</a></p>

                    </div>
                </div>
            </div>
        </div>
    );
} 