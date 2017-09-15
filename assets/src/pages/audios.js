import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import moment from 'moment'

import { getAudiosEntries, getAudiosLoaded, getAudiosError } from '../reducers'
import AmplitudeOverTime from '../components/amplitude-over-time'

class AudiosPage extends React.Component {

    state = {
        newAudioContent: '',
        newAudioName: '',
    }

    deleteAudio(id, e) {
        e.preventDefault()
        console.log('TODO', id)
    }

    onFieldChange = ({ target }) => {
        this.setState({ [target.name]: target.value })
    }

    addNewFile = e => {
        e.preventDefault()
        console.log('TODO')
    }

    _renderAudio({ id, name, amplitudeOverTime, length }) {
        const momentLen = moment(length * 1000)
        return (
            <li key={id}>
                <span><small>#{id}</small> {name}</span>
                <span>, Długość: <em>{`${momentLen.minutes()}:${momentLen.format('ss:SSS')}`}</em></span>
                <AmplitudeOverTime amplitudeOverTime={amplitudeOverTime} width={400} height={50} color="#D45D5A" />
                <a href="javascript:void(0)" onClick={this.deleteAudio.bind(this, id)} className="icon-trash deleter">Usuń</a>
            </li>
        )
    }

    render() {
        const { entries, loaded, error } = this.props
        return (
            <div>
                <h2>Pliki audio</h2>
                <section>
                    <h3>Obecne pliki</h3>
                    {this.props.entries && this.props.entries.length ? (
                        <ul className="deletable-list">
                            {this.props.entries.map(audio => this._renderAudio(audio))}
                        </ul>
                    ) : (
                        <p>Brak utworów</p>
                    )}   
                </section>
                <section>
                    <h3>Dodawanie nowych plików</h3>
                    <p>Obsługiwane formaty: wav</p>
                    <form action={this.addNewFile}>
                        <fieldset>
                            <legend>Formularz dodawania pliku</legend>
                            <label>Wybierz plik: <input type="file" name="newAudioContent" required onChange={this.onFieldChange} /></label>
                            <label>Nazwa audio: <input type="text" name="newAudioName" required value={this.state.fname} onChange={this.onFieldChange} /></label>
                            <button type="submit">Prześlij plik</button>
                        </fieldset>
                    </form>
                </section>
            </div>
        )
    }

}

const mapStateToProps = (state) => ({
    entries: getAudiosEntries(state),
    loaded: getAudiosLoaded(state),
    error: getAudiosError(state)
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(AudiosPage)