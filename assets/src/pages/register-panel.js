import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import Message from '../components/message'
import InputGroup from '../components/input-group'
import Panel from '../components/panel'
import * as userActions from '../actions/user'

class RegisterPanel extends React.PureComponent {

    state = {
        fname: 'Miszko',
        lname: 'Pirwszy',
        email: 'miszko@pir.pl',
        password: 'aaAA--11',
        password2: 'aaAA--11'
    }

    componentWillReceiveProps(newProps) {
        if (this.props.isLoading && !newProps.isLoading && !newProps.error) {
            newProps.history.push('/login', { reason: "JUST_REGISTERED" })
        }
    }

    onSubmitClick = (e) => {
        e.preventDefault()
        this.props.register(this.state)
    }

    onSwitchClick = (e) => {
        e.preventDefault()
        this.props.switchToLogin(false)
    }

    onChange = ({ target }) => this.setState({ [target.name]: target.value })

    validate() {
        const { fname, lname, email, password, password2 } = this.state
        return {
            lname: lname && lname.length <= 40,
            fname: fname && fname.length <= 40,
            email: email && /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}/.test(email),
            password: password && /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(password),
            password2: password2 && password === password2
        }
    }

    _getErrorMessage() {
        if (this.props.error) {
            switch (this.props.error.statusCode) {
                case 409:
                    return <Message type="error">Użytkownik o podanym adresie email już istnieje</Message>
                default:
                    return <Message type="error">Wystąpił błąd podczas rejestrowania</Message>
            }
        }
        return null
    }

    render() {
        const { switchToLogin, error, isLoading } = this.props
        const { fname, lname, email, password, password2 } = this.state
        const validated = this.validate()
        return (
            <Panel title="Rejestracja">
                <p>Posiadasz już konto? <Link to="/login">Zaloguj się!</Link></p>
                {this._getErrorMessage()}
                <form onSubmit={this.onSubmitClick}>
                    <InputGroup 
                        label="Imię"
                        validationMessage="Pole wymagane, max. 40 znaków"
                        isValid={validated.fname}
                    >
                        <input disabled={isLoading} type="text" name="fname" value={fname} onChange={this.onChange} />
                    </InputGroup>
                    <InputGroup
                        label="Nazwisko"
                        validationMessage="Pole wymagane, max. 40 znaków"
                        isValid={validated.lname}
                    >
                        <input disabled={isLoading} type="text" name="lname" value={lname} onChange={this.onChange} />
                    </InputGroup>
                    <InputGroup
                        label="E-mail"
                        validationMessage="Pole wymagane, należy wprowadzić prawidłowy adres e-mail"
                        isValid={validated.email}
                    >
                        <input disabled={isLoading} type="text" name="email" value={email} onChange={this.onChange} />
                    </InputGroup>
                    <InputGroup
                        label="Hasło"
                        validationMessage="Pole wymagane, min. 8 znaków, pole musi posiadać conajmiej 1 małą literę, 1 dużą, 1 cyfrę i 1 znak specjalny (#?!@$%^&amp;*-)"
                        isValid={validated.password}
                    >
                        <input disabled={isLoading} type="password" name="password" value={password} onChange={this.onChange} />
                    </InputGroup>
                    <InputGroup
                        label="Hasło (powtórnie)"
                        validationMessage="Pole wymagane, musi być zgodne z polem Hasło"
                        isValid={validated.password2}
                    >
                        <input disabled={isLoading} type="password" name="password2" value={password2} onChange={this.onChange} />
                    </InputGroup>
                    <p>
                        <button
                            type="submit"
                            disabled={isLoading || Object.values(validated).some(valid => !valid)}
                        >
                            { isLoading ? 'Rejestrowanie...' : 'Zarejestruj się' }
                        </button>
                    </p>
                </form>
            </Panel>
        )
    }

}

const mapStateToProps = (state) => ({
    isLoading: state.registerRequested,
    error: state.registerError
})

const mapDispatchToProps = (dispatch) => ({
    register: (userData) => dispatch(userActions.register(userData))
})

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPanel)