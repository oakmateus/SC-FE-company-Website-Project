import TopBar from "./TopBar";
import ImageCarousel from "./ImageCarousel";

import SchedulingIcon from "../../assets/SchedulingIcon.png"

import { Link } from "react-router-dom";

export default function HomePage({ user }) {
    return (
        <div className="homepage-container">
            <TopBar user={user}/>
            <ImageCarousel />
            <Link className="scheduling" to="/agendamento">
                <img src={SchedulingIcon} alt="shceduling" />
                <span className="scheduling-text">Agendamento</span>
            </Link>
        </div>
    )
}