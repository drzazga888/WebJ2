import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import * as actions from '../actions/user'
import { getCredentialsLoaded, getUserLoaded, getUserEmail } from '../reducers'

class LoginPage extends React.Component {

    state = {
        email: '',
        password: ''
    }

    componentDidUpdate() {
        if (this.props.signedIn) {
            this.props.history.push('/')
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
        const { loaded } = this.props
        return (
            <div>
                <h2>Panel logowania</h2>
                <section>
                    <h3>Zaloguj się do aplikacji</h3>
                    <form onSubmit={this.login}>
                        <fieldset>
                            <legend>Formularz logowania</legend>
                            <label>E-mail: <input disabled={!loaded} type="email" name="email" required value={this.state.email} onChange={this.onFieldChange} /></label>
                            <label>Hasło: (od 6 do 16 znaków) <input disabled={!loaded} type="password" name="password" pattern=".{6,16}" required  value={this.state.password} onChange={this.onFieldChange}/></label>
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
    login: actions.getUser
}

export default connect(stateToProps, dispatchToProps)(LoginPage)