import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

import * as userActions from './actions/user'
import { getMessages, getUserEmail } from './reducers'

const Layout = ({ messages, children, userEmail, logout, history }) => (
    <div>
        <header>
            <h1>Web<em>J</em></h1>
        </header>
        <nav>
            <ul className="menu">
                <li><Link to="/">Strona główna</Link></li>
                <li><Link to="/projects">Projekty</Link></li>
                <li><Link to="/audios">Zarządzaj audio</Link></li>
                <li><Link to="/doc">Dokumentacja</Link></li>
            </ul>
            <ul className="stick-to-top-right-corner menu">
                <li className="dropdown expander">
                    <a className="icon-user" href="javascript:void(0);">{userEmail || 'Niezalogowany'}</a>
                    <div className="dropdown-body expandable">
                        {!userEmail ? <p><Link to="/register">Rejestracja</Link></p> : null}
                        {!userEmail ? <p><Link to="/login">Logowanie</Link></p> : null}
                        {userEmail ? <p><Link to="/profile">Ustawienia konta</Link></p> : null}
                        {userEmail ? <p><a href="javascript:void(0)" onClick={(e) => {
                            e.preventDefault()
                            logout()
                            history.push('/')
                        }}>Wyloguj</a></p> : null}
                    </div>
                </li>
            </ul>
        </nav>
        <main>
            <div className="msg-container">
                {messages.map(({ message, severity }) => <p key={message} className={`message ${severity || ''}`}>{message}</p>)}
            </div>
            {children}
        </main>
        <footer>
            <p><small>Autor: <strong>Kamil Drzazga</strong>.</small></p>
        </footer>
    </div>
)

const mapStateToProps = (state) => ({
    messages: getMessages(state),
    userEmail: getUserEmail(state)
})

const mapDispatchToProps = {
    logout: userActions.logout
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Layout))