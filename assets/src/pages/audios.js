import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { getAudiosEntries, getAudiosLoaded, getAudiosError } from '../reducers'
import AudioWrapper from '../components/audio-wrapper'
import * as audioActions from '../actions/audios'

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

    render() {
        const { entries, loaded, error } = this.props
        return (
            <div>
                <h2>Pliki audio</h2>
                <section>
                    <h3>Obecne pliki</h3>
                    {this.props.entries && this.props.entries.length ? (
                        <div className="audios">{this.props.entries.map(audio => <AudioWrapper {...audio} key={audio.id} getAudio={() => this.props.getAudio(audio.id)} />)}</div>
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

const mapDispatchToProps = {
    getAudio: audioActions.getAudio
}

export default connect(mapStateToProps, mapDispatchToProps)(AudiosPage)