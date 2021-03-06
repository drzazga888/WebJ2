import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import * as userActions from '../actions/user'
import * as audiosActions from '../actions/audios'
import * as projectsActions from '../actions/projects'
import { getUserLoaded, getUserEmail } from '../reducers'

class LoginPage extends React.Component {

    state = {
        email: '',
        password: ''
    }

    componentDidUpdate() {
        if (this.props.signedIn) {
            this.props.history.push('/')
            this.props.fetchAudios()
            this.props.fetchProjects()
        }
    }

    login = e => {
        e.preventDefault()
        this.props.login(this.state)
    }

    onFieldChange = ({ target }) => {
        this.setState({ [target.name]: target.value })
    }

    render() {
        const { loaded, signedIn } = this.props
        if (signedIn) {
            return <p>Zostałeś już zalogowany</p>
        }
        return (
            <div>
                <h2>Panel logowania</h2>
                <section>
                    <h3>Zaloguj się do aplikacji</h3>
                    <form onSubmit={this.login}>
                        <fieldset>
                            <legend>Formularz logowania</legend>
                            <label>E-mail: <input disabled={!loaded} type="email" name="email" required value={this.state.email} onChange={this.onFieldChange} /></label>
                            <label>Hasło: <input disabled={!loaded} type="password" name="password" required  value={this.state.password} onChange={this.onFieldChange}/></label>
                            <button type="submit" disabled={!loaded}>{loaded ? 'Zaloguj się' : 'Logowanie...'}</button>
                        </fieldset>
                    </form>
                </section>
            </div>
        )
    }

}

const stateToProps = (state) => ({
    loaded: getUserLoaded(state),
    signedIn: getUserEmail(state)
})

const dispatchToProps = {
    login: userActions.getUser,
    fetchAudios: audiosActions.getAudios,
    fetchProjects: projectsActions.getProjects
}

export default connect(stateToProps, dispatchToProps)(LoginPage)