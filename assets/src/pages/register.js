import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import * as actions from '../actions/user'
import { getUserLoaded, getUserError, getUserEmail } from '../reducers'

class RegisterPage extends React.Component {

    state = {
        fname: '',
        lname: '',
        email: '',
        password: '',
        password2: ''
    }

    register = e => {
        e.preventDefault()
        this.props.register(this.state)
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.loaded && this.props.loaded && !this.props.error) {
            this.props.history.push('/')
        }
    }

    onFieldChange = ({ target }) => {
        this.setState({ [target.name]: target.value })
        if (target.name === 'password2') {
            if (this.state.password !== target.value) {
                this.refs.password2.setCustomValidity('Hasła muszą być takie same!')
            } else {
                this.refs.password2.setCustomValidity('')
            }
        }
    }

    render() {
        const { signedIn, loaded } = this.props
        if (signedIn) {
            return <p>Panel rejestracji jest dostępny dla niezarejestrowanych użytkowników</p>
        }
        return (
            <div>
                <h2>Panel Rejestracji</h2>
                <section>
                    <h3>Zarejestruj się by móc korzystać z usługi</h3>
                    <form onSubmit={this.register}>
                        <fieldset>
                            <legend>Formularz rejestracji</legend>
                            <label>Imię (max. 40 znaków): <input disabled={!loaded} type="text" name="fname" maxLength="40" required value={this.state.fname} onChange={this.onFieldChange} /></label>
                            <label>Nazwisko (max. 40 znaków): <input disabled={!loaded} type="text" name="lname" maxLength="40" required value={this.state.lname} onChange={this.onFieldChange} /></label>
                            <label>E-mail: <input disabled={!loaded} type="email" name="email" required value={this.state.email} onChange={this.onFieldChange} /></label>
                            <label title="Minimum 8 znaków, musi zawierać co najmniej 1 dużą literę, 1 małą, 1 cyfrę oraz 1 znak specjalny z puli: #?!@$%^&amp;*-">Hasło: (min. 8 znaków, ...) <input disabled={!loaded} type="password" name="password" pattern="(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^\x26*-]).{8,}" required value={this.state.password} onChange={this.onFieldChange} /></label>
                            <label>Powtórz hasło: <input disabled={!loaded} ref="password2" type="password" name="password2" required value={this.state.password2} onChange={this.onFieldChange} /></label>
                            <button type="submit">{loaded ? `Zarejestruj się` : `Rejestrowanie...`}</button>
                        </fieldset>
                    </form>
                </section>
            </div>
        )
    }

}

const stateToProps = (state) => ({
    loaded: getUserLoaded(state),
    error: getUserError(state),
    signedIn: getUserEmail(state)
})

const dispatchToProps = {
    register: actions.postUser
}

export default connect(stateToProps, dispatchToProps)(RegisterPage)