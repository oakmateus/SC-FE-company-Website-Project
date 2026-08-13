import "./BackgroundShapes.css"

export default function BackgroundShapes() {
    const circleCount = 10;
    const triangleCount = 10;

    return (
        <div className="background-shapes">

            {Array.from({ length: circleCount }).map((_, index) => (
                <span
                    key={`circle-${index}`}
                    className="background-circle"
                    style={{
                        left: `${Math.random() * 100}%`,
                        animationDuration: `${8 + Math.random() * 12}s`,
                        animationDelay: `${Math.random() * -15}s`,
                    }}
                />
            ))}

            {Array.from({ length: triangleCount }).map((_, index) => (
                <svg
                    key={`triangle-${index}`}
                    className="background-triangle"
                    viewBox="0 0 100 100"
                    style={{
                        left: `${Math.random() * 100}%`,
                        animationDuration: `${8 + Math.random() * 12}s`,
                        animationDelay: `${Math.random() * -15}s`,
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