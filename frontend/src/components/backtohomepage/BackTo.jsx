import BackToGuestHomePage from "./BackToGuestHomePage"
import BackToUserHomePage from "./BackToUserHomePage"

import "./backto.css"

export default function BackTo({ user }) {
    return (
        <div className="back-to">
            {user 
                ? <BackToUserHomePage user={user} /> 
                : <BackToGuestHomePage />}
        </div>
    );
}