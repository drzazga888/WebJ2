import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import Message from '../components/message'
import InputGroup from '../components/input-group'
import Panel from '../components/panel'
import * as userActions from '../actions/user'

class LoginPanel extends React.PureComponent {

    state = {
        email: 'drzazga888@gmail.com',
        password: 'akamcioQ1-'
    }

    onSubmitClick = (e) => {
        e.preventDefault()
        this.props.login(this.state)
    }

    onSwitchClick = (e) => {
        e.preventDefault()
        this.props.switchToRegister(false)
    }

    onChange = ({ target }) => this.setState({ [target.name]: target.value })

    validate() {
        const { email, password } = this.state
        return {
            email: email,
            password: password
        }
    }

    _getErrorMessage() {
        if (this.props.error) {
            switch (this.props.error.statusCode) {
                case 401:
                    return <Message type="error">Błędny e-mail lub hasło</Message>
                default:
                    return <Message type="error">Wystąpił błąd podczas logowania</Message>
            }
        }
        return null
    }

    _getRouterMessage() {
        if (this.props.location.state) {
            switch (this.props.location.state.reason) {
                case 'JUST_REGISTERED':
                    return <Message type="info">Zarejestrowałeś się poprawnie. Teraz możesz się zalogować.</Message>
                case 'UNAUTHENTICATED':
                    return <Message type="warning">Musisz się zalogować, aby mieć dostęp do zabezpieczonych stron.</Message>
                default:
                    return null;
            }
        }
        return null;
    }

    render() {
        const { isLoading } = this.props
        const { email, password } = this.state
        const validated = this.validate()
        return (
            <Panel title="Logowanie">
                <p>Nie posiadasz konta? <Link to="/register">Zarejestruj się!</Link></p>
                {this._getRouterMessage()}
                {this._getErrorMessage()}
                <form onSubmit={this.onSubmitClick}>
                    <InputGroup
                        label="E-mail"
                        validationMessage="Pole wymagane"
                        isValid={validated.email}
                    >
                        <input disabled={isLoading} type="text" name="email" value={email} onChange={this.onChange} />
                    </InputGroup>
                    <InputGroup
                        label="Hasło"
                        validationMessage="Pole wymagane"
                        isValid={validated.password}
                    >
                        <input disabled={isLoading} type="password" name="password" value={password} onChange={this.onChange} />
                    </InputGroup>
                    <p>
                        <button
                            type="submit"
                            disabled={isLoading || Object.values(validated).some(valid => !valid)}
                        >
                            { isLoading ? 'Logowanie...' : 'Zaloguj się' }
                        </button>
                    </p>
                </form>
            </Panel>
        )
    }

}

const mapStateToProps = (state) => ({
    isLoading: state.loginRequested,
    error: state.loginError
})

const mapDispatchToProps = (dispatch) => ({
    login: (credentials) => dispatch(userActions.login(credentials))
})

export default connect(mapStateToProps, mapDispatchToProps)(LoginPanel)