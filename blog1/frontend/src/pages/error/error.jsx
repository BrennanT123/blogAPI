import { Link } from "react-router-dom";
import { useEffect, useState } from 'react'
import errorStyles from "../styles/error.module.css"
import linkStyles from "../styles/linkStyles.module.css"

function Error() {
    return (
        <main>
            <h1 className= {errorStyles.errorHeader}>
                 404 Page Not Found

            </h1>
            <div className={errorStyles.linkContainer}>
                <Link to={-1}>Go Back </Link>
                <Link to="/"> Home </Link>

            </div>
        </main>
    )
}

export default Error;