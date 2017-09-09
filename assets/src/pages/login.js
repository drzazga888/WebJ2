import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

//import * as actions from '../actions/credentials'
//import { getCredentialsLoaded } from '../reducers'

class LoginPage extends React.Component {

    state = {
        email: '',
        password: '',
        loaded: false
    }

    login = e => {
        e.preventDefault()
    }

    onFieldChange = ({ target }) => {
        this.setState({ [target.name]: target.value })
    }

    render() {
        const { loaded } = this.props
        return (
            <div>
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

/*const stateToProps = (state) => null
const dispatchToProps = {
    setCredentials: actions.setCredentials
    unsetCredentials: actions.unsetCredentials
}

export default connect(stateToProps, dispatchToProps)(LoginPage)*/
export default LoginPage