import TopBar from "./TopBar";
import BottomBar from "../BottomBar";
import ImageCarousel from "./ImageCarousel";
import BackgroundShapes from "../BackgroundShapes";

import SchedulingIcon from "../../assets/SchedulingIcon.png"
import EventPicture1 from "../../assets/EventPicture1.jpeg"
import EventPicture2 from "../../assets/EventPicture2.jpeg"
import BridePhoto from "../../assets/BridePhoto.png"
import GuestPhoto from "../../assets/GuestPhoto.png"

import { Link } from "react-router-dom";

export default function HomePage({ user }) {
    return (
        <main>
            <section className="main-content">
                <TopBar user={user}/>
                <ImageCarousel />
                <Link className="scheduling" to="/users/me/scheduling">
                    <img src={SchedulingIcon} alt="shceduling" />
                    <span className="scheduling-text">Agendamento</span>
                </Link>
            </section>

            <section className="second-content">
                <div className="testimonials">
                    <div className="title-box">
                        <h1>Depoimentos</h1>
                        <p>Veja a opinião de outros clientes!</p>
                    </div>
                    <div className="testimonials-group">
                        <div className="bride-testimonial">
                            <img src={BridePhoto} alt="bride" />
                            <span className="label">NOIVA • Emilly</span>
                            <span className="testimonial-box-two">
                                Desde o primeiro momento, deu para sentir o cuidado, a organização e o amor com que tudo foi preparado. Foi um privilégio imenso fazer parte desse dia tão marcante e recomendo de olhos fechados.
                            </span>
                        </div>
                        <div className="guest-testimonial">
                            <img src={GuestPhoto} alt="guest" />
                            <span className="label">CONVIDADO • Valdemir</span>
                            <span className="testimonial-box-one">
                                Cada detalhe foi preparado com muito cuidado, tornando esse momento ainda mais lindo, especial e inesquecível. Foi maravilhoso ver tudo acontecer com tanta excelência e profissionalismo.
                            </span>
                        </div>
                    </div>
                </div>
                <div className="pictures-group">
                    <img src={EventPicture1} alt="picture" className="pictures" />
                    <img src={EventPicture2} alt="picture" className="pictures" />
                </div>
            </section>
            <BottomBar />
            <BackgroundShapes />
        </main>
    )
}