import { useState } from "react";
import "./BackgroundShapes.css";

export default function BackgroundShapes() {
    const circleCount = 10;
    const triangleCount = 10;

    const [circles] = useState(() =>
        Array.from({ length: circleCount }, (_, index) => ({
            id: `circle-${index}`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${8 + Math.random() * 12}s`,
            animationDelay: `${Math.random() * -15}s`,
        }))
    );

    const [triangles] = useState(() =>
        Array.from({ length: triangleCount }, (_, index) => ({
            id: `triangle-${index}`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${8 + Math.random() * 12}s`,
            animationDelay: `${Math.random() * -15}s`,
        }))
    );

    return (
        <div className="background-shapes">

            {circles.map((circle) => (
                <span
                    key={circle.id}
                    className="background-circle"
                    style={{
                        left: circle.left,
                        animationDuration: circle.animationDuration,
                        animationDelay: circle.animationDelay,
                    }}
                />
            ))}

            {triangles.map((triangle) => (
                <svg
                    key={triangle.id}
                    className="background-triangle"
                    viewBox="0 0 100 100"
                    style={{
                        left: triangle.left,
                        animationDuration: triangle.animationDuration,
                        animationDelay: triangle.animationDelay,
                    }}
                >
                    <polygon
                        points="50,5 95,95 5,95"
                        fill="none"
                        stroke="var(--color-brown)"
                        strokeWidth="4"
                    />
                </svg>
            ))}

        </div>
    );
}