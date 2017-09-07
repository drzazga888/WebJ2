import React from 'react'
import { Link } from 'react-router-dom'

const MainPage = ({ description, message, messageClass, children, userEmail }) => (
    <div>
        <header>
            <h1>Web<em>J</em></h1>
            <h2>{description}</h2>
        </header>
        <nav>
            <ul class="menu">
                <li><Link to="/">Strona główna</Link></li>
                <li><Link to="/projects">Mixer</Link></li>
                <li><Link to="/audios">Zarządzaj audio</Link></li>
                <li><Link to="/doc">Dokumentacja</Link></li>
            </ul>
        </nav>
        <main>
            {message ? <p class={`message ${messageClass || ''}`}>{message}</p> : null}
            {children}
        </main>
        <footer>
            <p><small>Autor: <strong>Kamil Drzazga</strong>.</small></p>
        </footer>
        <ul className="stick-to-top-right-corner menu">
            <li className="dropdown">
                <a className="icon-user" href="javascript:void(0);">{userName || 'Niezalogowany'}</a>
                <div class="dropdown-body">
                    {!userName ? <p><Link to="/register">Rejestracja</Link></p> : null}
                    {!userName ? <p><Link to="/sign-in">Logowanie</Link></p> : null}
                    {userName ? <p><Link to="/logout">Wyloguj</Link></p> : null}
                </div>
            </li>
        </ul>
    </div>
)

export default MainPage