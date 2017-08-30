import React from 'react'
import { BrowserRouter as Router, Route, Link, NavLink, Redirect, Switch } from 'react-router-dom'
import { connect } from 'react-redux'

import * as userActions from './actions/user'
import LoginPanel from './pages/login-panel'
import RegisterPanel from './pages/register-panel'

// util routes

const AuthRoute = ({ component: Component, isUserLoggedIn, ...rest }) => (
    <Route {...rest} render={props => {
        if (isUserLoggedIn) {
            return <Component {...props} />
        } else {
            return <Redirect to={{ pathname: "/login", state: { reason: "UNAUTHENTICATED" }}} />
        }
    }} />
)

const NoAuthRoute = ({ component: Component, isUserLoggedIn, ...rest }) => (
    <Route {...rest} render={props => {
        if (!isUserLoggedIn) {
            return <Component {...props} />
        } else {
            return <Redirect to={{ pathname: "/projects", state: { reason: "ALREADY_LOGGED_ID" }}} />
        }
    }} />
)

// util components

const WelcomeMessage = () => (
    <header className="app-welcome-header">
        <h1 className="title">WebJ</h1>
        <p className="description">Aplikacja do tworzenia muzyki online</p>
        <p className="more-info"><Link to="/login">Zaloguj się</Link> bądź <Link to="/register">utwórz konto</Link>!</p>
    </header>
)

const AppFooter = () => (
    <footer className="app-footer">
        <p>Autor: Kamil Drzazga, IS WFiIS AGH Kraków, 2017</p>
    </footer>
)

const TopBar = ({ userFname, logout }) => (
    <nav className="app-top-bar">
        <header className="app-mini-header">
            <h1 className="title">WebJ</h1>
        </header>
        <ul className="app-nav-links">
            <li><NavLink to="/projects">Projekty</NavLink></li>
            <li><NavLink to="/audios">Pliki audio</NavLink></li>
            <li><NavLink to="/user">Konto</NavLink></li>
        </ul>
        <div className="app-current-user">
            <span className="user-greetings">Witaj, <em>{userFname}</em></span>
            <button className="user-logout-button" onClick={() => logout()}>Wyloguj się</button>
        </div>
    </nav>
)

// TODO export to files

const Projects = ({ location }) => <p>Projects {location.state && location.state.reason === "ALREADY_LOGGED_ID" ? '(przekierowano z logowanie/rejestracj)' : ''}</p>
const Project = ({ params }) => <p>Project ID = {params.id}</p>
const Audios = () => <p>Audios</p>
const User = () => <p>User</p>
const NotFound = () => <p>Not Found</p>

// main app with routing

const App = ({ userFname, logout }) => (
    <Router>
        <div>
            { userFname ? <TopBar userFname={userFname} logout={logout} /> : <WelcomeMessage /> }
            <main>
                <Switch>
                    <Route exact path="/" render={() => <Redirect to={userFname ? '/projects' : '/login'} />} />
                    <AuthRoute path="/projects" component={Projects} isUserLoggedIn={userFname} />
                    <AuthRoute path="/projects/:id" component={Project} isUserLoggedIn={userFname} />
                    <AuthRoute path="/audios" component={Audios} isUserLoggedIn={userFname} />
                    <AuthRoute path="/user" component={User} isUserLoggedIn={userFname} />
                    <NoAuthRoute path="/login" component={LoginPanel} isUserLoggedIn={userFname} />
                    <NoAuthRoute path="/register" component={RegisterPanel} />
                    <Route component={NotFound} />
                </Switch>
            </main>
            <AppFooter />
        </div>
    </Router>
)

const mapStateToProps = (state) => ({
    userFname: state.user && state.user.fname,
})

const mapDispatchToProps = (dispatch) => ({
    logout: () => dispatch(userActions.logout())
})

export default connect(mapStateToProps, mapDispatchToProps)(App)