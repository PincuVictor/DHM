import React from "react";
import {Link} from "react-router-dom";

function NotFound() {
    return (
        <div>
            Error 404
            <br/>
            Page Not Found
            <Link to="/">Back to HOME page</Link>
        </div>
    )
}

export default NotFound;