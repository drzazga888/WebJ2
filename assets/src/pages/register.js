import React from 'react'
import { Link } from 'react-router-dom'

export default class RegisterPage extends React.Component {

    state = {
        fname: '',
        lname: '',
        email: '',
        password: '',
        password2: ''
    }

    register = e => {
        e.preventDefault()
        if (this.state.password !== this.state.password2) {
            this.refs.password2.setCustomValidity('Hasła muszą być takie same!')
        } else {
            console.log('TODO')
        }
    }

    onFieldChange = ({ target }) => {
        this.setState({ [target.name]: target.value })
    }

    render() {
        return (
            <div>
                <section>
                    <h3>Zarejestruj się by móc korzystać z usługi</h3>
                    <form onSubmit={this.register}>
                        <fieldset>
                            <legend>Formularz rejestracji</legend>
                            <label>Imię: <input type="text" name="fname" required value={this.state.fname} onChange={this.onFieldChange} /></label>
                            <label>Nazwisko: <input type="text" name="lname" required value={this.state.lname} onChange={this.onFieldChange} /></label>
                            <label>E-mail: <input type="email" name="email" required value={this.state.email} onChange={this.onFieldChange} /></label>
                            <label>Hasło: (od 6 do 16 znaków) <input type="password" name="password" pattern=".{6,16}" required value={this.state.password} onChange={this.onFieldChange} /></label>
                            <label>Powtórz hasło: <input ref="password2" type="password" name="password2" required value={this.state.password2} onChange={this.onFieldChange} /></label>
                            <button type="submit">Zarejestruj się</button>
                        </fieldset>
                    </form>
                </section>
            </div>
        )
    }

}