import UserMenu from "./UserMenu";
import GuestMenu from "./GuestMenu";
import Logo from "../../assets/Logo.png";
import InstagramIcon from "../../assets/InstagramIcon.png";
import WhatsappIcon from "../../assets/WhatsappIcon.png";
import Line from "../../assets/Line.png";
import EmailIcon from "../../assets/EmailIcon.png";
import { Link } from "react-router-dom";
import { useState } from "react";

import "./TopBar.css"

export default function TopBar({ user }) {

    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="top-bar">
            <div className="top-bar-content">
                <div className="buttons">
                    <div className="contact-menu">
                        <button className="left-button" onClick={() => setIsOpen(!isOpen)}>
                            <span>Contatos ☰</span>
                        </button>

                        {isOpen && (
                            <div className="dropdown">
                                <a className="social-media" href="https://www.instagram.com/silvacarvalhofestaseventos/">
                                    <div className="instagram-icon">
                                        <img src={InstagramIcon} alt="insta" />
                                    </div>

                                    <span>Instagram</span>
                                </a>

                                <a className="chat-bot" href="">
                                    <div className="whatsapp-icon">
                                        <img src={WhatsappIcon} alt="bot" />
                                    </div>

                                    <span>ChatBot</span>
                                </a>

                                <a className="whatsapp-chat" href="https://wa.me/5521992983104">
                                    <div className="whatsapp-icon">
                                        <img src={WhatsappIcon} alt="wpp" />
                                    </div>

                                    <span>Atendimento</span>
                                </a>

                                <div className="line">
                                    <img src={Line} alt="line" />
                                </div>

                                <a className="email" href="mailto:silvacarvalhofestaseventos@gmail.com">
                                    <div className="email-icon">
                                        <img src={EmailIcon} alt="email" />
                                    </div>

                                    <span>E-Mail</span>
                                </a>
                            </div>
                        )}
                    </div>
                    <div className="about">
                        <Link to="/about" className="left-button">Sobre</Link>
                    </div>
                </div>
            

                <div className="logo-top-bar">
                    <img src={Logo} alt="Logo" />
                </div>
                
                <div className="buttons">
                    {user ? <UserMenu user={user} /> : <GuestMenu />}
                </div>
            </div>
        </nav>
    );
}