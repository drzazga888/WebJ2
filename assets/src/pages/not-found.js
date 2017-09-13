import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage = () => (
    <div>
        <h2>404 Not Found!</h2>
        <section>
            <h3>Nie znaleziono strony!</h3>
            <p>Wystąpił błąd 404.</p>
            <Link to="/"><button>Przejdź na stronę główną</button></Link>
        </section>
    </div>
)

export default NotFoundPage