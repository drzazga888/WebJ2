import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { getAudiosEntries, getAudiosLoaded, getAudiosError, getUserEmail } from '../reducers'
import AudioWrapper from '../components/audio-wrapper'
import * as audioActions from '../actions/audios'

class AudiosPage extends React.Component {

    state = {
        newAudioContent: null,
        newAudioName: '',
    }

    changeNewAudioName = ({ target }) => {
        this.setState({ newAudioName: target.value })
    }

    changeNewAudioFile = ({ target }) => {
        if (!target.files || !target.files.length) {
            this.setState({ newAudioContent: null })
        } else {
            const file = target.files[0]
            if (!file) {
                this.setState({ newAudioContent: null })
            } else {
                const r = new FileReader()
                r.onload = () => this.setState({ newAudioContent: r.result })
                r.readAsDataURL(file)
            }
        }
    }

    addNewFile = e => {
        e.preventDefault()
        this.props.postAudio({ name: this.state.newAudioName }, this.state.newAudioContent)
        this.setState({ newAudioName: '', newAudioContent: '' })
        this.refs.newFile.value = ''
    }

    onNameChange = (id, name) => {
        this.props.patchAudio({ name }, id)
    }

    onDelete = id => {
        if (confirm(`Czy na pewno chcesz usunąć plik audio ${id}?`)) {
            this.props.deleteAudio(id)
        }
    }

    renderPage() {
        const { entries, loaded, error, getAudio } = this.props
        return (
            <div className={loaded ? '' : 'indeterminate'}>
                <section>
                    <h3>Obecne pliki</h3>
                    {entries && entries.length ? (
                        <div className="audios">{entries.map(audio => <AudioWrapper {...audio}
                            key={audio.id}
                            getAudio={() => getAudio(audio.id)}
                            onDelete={() => this.onDelete(audio.id)}
                            onNameChange={name => this.onNameChange(audio.id, name)}
                        />)}</div>
                    ) : (
                        <p>Brak utworów</p>
                    )}   
                </section>
                <section>
                    <h3>Dodawanie nowych plików</h3>
                    <p>Obsługiwane formaty: wav</p>
                    <form onSubmit={this.addNewFile}>
                        <fieldset>
                            <legend>Formularz dodawania pliku</legend>
                            <label>Wybierz plik: <input ref="newFile" type="file" accept="audio/wav" name="newAudioContent" required onChange={this.changeNewAudioFile} /></label>
                            <label>Nazwa audio: <input type="text" name="newAudioName" required value={this.state.newAudioName} onChange={this.changeNewAudioName} /></label>
                            <button type="submit">Prześlij plik</button>
                        </fieldset>
                    </form>
                </section>
            </div>
        )
    }

    render() {
        return (
            <div>
                <h2>Pliki audio</h2>
                {this.props.userLoggenIn ? this.renderPage() : <p>Musisz się zalogować, aby korzystać z tej strony</p>}
            </div>
        )
    }

}

const mapStateToProps = (state) => ({
    entries: getAudiosEntries(state),
    loaded: getAudiosLoaded(state),
    error: getAudiosError(state),
    userLoggenIn: getUserEmail(state)
})

const mapDispatchToProps = {
    getAudio: audioActions.getAudio,
    patchAudio: audioActions.patchAudio,
    deleteAudio: audioActions.deleteAudio,
    postAudio: audioActions.postAudio
}

export default connect(mapStateToProps, mapDispatchToProps)(AudiosPage)