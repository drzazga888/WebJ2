import React from 'react'
import { connect } from 'react-redux'

import { getUserEmail, getUserPassword, getUserFname, getUserLname, getUserLoaded, getUserError } from '../reducers'
import * as userActions from '../actions/user'

class ProfilePage extends React.PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            lname: this.props.lname,
            fname: this.props.fname,
            email: this.props.email,
            password: this.props.password,
            password2: this.props.password
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.loaded && nextProps.loaded && nextProps.error) {
            this.setState({
                lname: this.props.lname,
                fname: this.props.fname,
                email: this.props.email,
                password: this.props.password,
                password2: this.props.password
            })
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.email && !this.props.email) {
            this.props.history.push('/')
        }
    }

    onDelete= () => {
        if (confirm('Czy na pewno chcesz usunąć konto? Akcja jest nieodwracalnia; wraz z nią stracisz wszystkie swoje projekty i przesłane audio.')) {
            this.props.deleteUser()
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

    onUpdate = (e) => {
        e.preventDefault()
        this.props.putUser(this.state)
    }

    renderPage() {
        const { email, password, fname, lname, loaded, error } = this.props
        return (
            <div className={loaded ? '' : 'indeterminate'}>
                <section>
                    <h3>Zmiana danych</h3>
                    <form onSubmit={this.onUpdate}>
                        <fieldset>
                            <legend>Formularz z danymi profilowymi</legend>
                            <label>Imię (max. 40 znaków): <input disabled={!loaded} type="text" name="fname" maxLength="40" required value={this.state.fname} onChange={this.onFieldChange} /></label>
                            <label>Nazwisko (max. 40 znaków): <input disabled={!loaded} type="text" name="lname" maxLength="40" required value={this.state.lname} onChange={this.onFieldChange} /></label>
                            <label>E-mail: <input disabled={!loaded} type="email" name="email" required value={this.state.email} onChange={this.onFieldChange} /></label>
                            <label title="Minimum 8 znaków, musi zawierać co najmniej 1 dużą literę, 1 małą, 1 cyfrę oraz 1 znak specjalny z puli: #?!@$%^&amp;*-">Hasło: (min. 8 znaków, ...) <input disabled={!loaded} type="password" name="password" pattern="(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^\x26*-]).{8,}" required value={this.state.password} onChange={this.onFieldChange} /></label>
                            <label>Powtórz hasło: <input disabled={!loaded} ref="password2" type="password" name="password2" required value={this.state.password2} onChange={this.onFieldChange} /></label>
                            <button type="submit">{loaded ? `Aktualizuj dane` : `Aktualizowanie...`}</button>
                        </fieldset>
                    </form>
                </section>
                <section>
                    <h3>Usuwanie konta</h3>
                    <p className="centered"><button onClick={this.onDelete}>Usuń konto</button></p>
                </section>
            </div>
        )
    }

    render() {
        return (
            <div>
                <h2>Ustawienia konta</h2>
                {this.props.email ? this.renderPage() : <p>Musisz się zalogować, aby korzystać z tej strony</p>}
            </div>
        )
    }

}

const mapStateToProps = (state) => ({
    email: getUserEmail(state),
    password: getUserPassword(state),
    fname: getUserFname(state),
    lname: getUserLname(state),
    loaded: getUserLoaded(state),
    error: getUserError(state)
})

const mapDispatchToProps = {
    deleteUser: userActions.deleteUser,
    putUser: userActions.putUser
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage)