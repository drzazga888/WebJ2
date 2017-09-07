import React from 'react'
import { Link } from 'react-router-dom'

export default class LoginPage extends React.Component {

    state = {
        email: '',
        password: ''
    }

    login = e => {
        e.preventDefault()
        console.log('TODO')
    }

    onFieldChange = ({ target }) => {
        this.setState({ [target.name]: target.value })
    }

    render() {
        return (
            <div>
                <section>
                    <h3>Zaloguj się do aplikacji</h3>
                    <form onSubmit={this.login}>
                        <fieldset>
                            <legend>Formularz logowania</legend>
                            <label>E-mail: <input type="email" name="email" required value={this.state.email} onChange={this.onFieldChange} /></label>
                            <label>Hasło: (od 6 do 16 znaków) <input type="password" name="password" pattern=".{6,16}" required  value={this.state.password} onChange={this.onFieldChange}/></label>
                            <button type="submit">Zaloguj się</button>
                        </fieldset>
                    </form>
                </section>
            </div>
        )
    }

}