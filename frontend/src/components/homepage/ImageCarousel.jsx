import { useEffect, useState } from "react";
import "./ImageCarousel.css";
    
import birthday from "../../assets/Birthday.png";
import wedding from "../../assets/Wedding.png";
import event from "../../assets/CustomEvents.png";

export default function ImageCarousel() {
    const images = [
        {
            src: wedding,
            alt: "Wedding"
        },
        {
            src: birthday,
            alt: "Birthday"
        },
        {
            src: event,
            alt: "Custom Event"
        }
    ];
    
    const [active, setActive] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActive((current) => (current + 1) % images.length);
        }, 6000);

        return () => clearInterval(interval);
    }, []);

    const getPosition = (index) => {
        if (index === active) {
            return "active";
        }

        if (index === (active + 1) % images.length) {
            return "next";
        }

        return "previous";
    };

    return(
        <section className="image-carousel">
            <div className="carousel-container">

                {images.map((image, index) => (
                    <div
                        key={image.src}
                        className={`carousel-card ${getPosition(index)}`}
                    >
                        <img
                            src={image.src}
                            alt={image.alt}
                        />
                    </div>
                ))}

            </div>
        </section>
    );
}