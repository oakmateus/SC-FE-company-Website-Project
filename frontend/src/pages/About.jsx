import BackTo from "../components/backtohomepage/BackTo";
import BottomBar from "../components/BottomBar";
import BackgroundShapes from "../components/BackgroundShapes";
import Logo from "../assets/Logo.png";
import Leadership1 from "../assets/Leadership1.jpeg";
import Leadership2 from "../assets/Leadership2.jpeg";

import "./about.css"

export default function About() {
    return (
        <div className="about-page">
            <main>
                <BackTo />
                <section className="main-title">
                    <div className="about-logo">
                        <img src={Logo} alt="Logo" />
                    </div>
                    <div className="about-title">
                        <h1>Sobre nós</h1>
                        <p>Um pouco sobre a nossa paixão</p>
                    </div>
                </section>

                <section className="story-group">
                    <div className="story-container">
                        <p className="first-paragraph">
                            A <strong>Silva Carvalho Festas e Eventos</strong> nasceu em 2021, 
                            a partir de um momento muito especial: 
                            a comemoração dos 50 anos da irmã mais velha da família. 
                            O que começou como uma celebração familiar se transformou
                            em um <strong>propósito.</strong>
                        </p>

                        <p className="secondd-paragraph">
                            Desde então, seguimos crescendo e transformando momentos importantes em <strong>experiências 
                            inesquecíveis</strong>, levando nossos serviços para todo o Rio de Janeiro e regiões próximas.
                        </p>
                    </div>
                </section>

                <section className="leadership-group">
                    <div className="leadership-container">
                        <h1>Família Silva Carvalho</h1>
                        <p>Sócios e membros das equipes que realizam sonhos</p>
                        <div className="leadership-pictures">
                            <img className="leadership-one" src={Leadership1} alt="leadership" />
                            <img className="leadership-two" src={Leadership2} alt="leadership" />
                        </div>
                    </div>
                </section>

                <section className="identity-group">
                    <div className="identity-container">
                        <div className="mission">
                            <h1>Missão</h1>
                            <div className="identity-text">
                                <p>
                                    Transformar sonhos em momentos inesquecíveis, 
                                    <strong> cuidando de cada detalhe</strong> para que nossos clientes 
                                    possam celebrar <strong>aquilo que realmente importa</strong>.
                                </p>
                            </div>
                        </div>

                        <div className="vision">
                            <h1>Visão</h1>
                            <div className="identity-text">
                                <p>
                                    Ser referência em festas e eventos no Rio de Janeiro, 
                                    reconhecida pela <strong>qualidade, dedicação</strong> e pela capacidade 
                                    de <strong>transformar sonhos em realidade</strong>.
                                </p>
                            </div>
                        </div>

                        <div className="values">
                            <h1>Valores</h1>
                            <div className="identity-text">
                                <p>
                                    Acreditamos que cada celebração deve ser um momento de <strong>união, 
                                    amor e pertencimento</strong>, valorizando as <strong>famílias</strong>, respeitando cada 
                                    história e <strong>acolhendo a todos com carinho</strong>.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <BottomBar />
            <BackgroundShapes />
        </div>
    );
}