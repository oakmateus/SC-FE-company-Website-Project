import { Link } from "react-router-dom"

export default function BackToUserHomePage() {
    return (
        <>
            <Link to="/users/me" className="back-to-user">‹</Link>
        </>
    )
}