import React from 'react'
import { Link } from 'react-router-dom'

export default class AudiosPage extends React.Component {

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

    _renderAudio({ id, name }) {
        <li>
            <a href="javascript:void(0)" onClick={this.deleteAudio.bind(this, id)} className="icon-trash deleter">Usuń</a>
            <span><small>#{id}</small> {name}</span>
        </li>
    }

    render() {
        return (
            <div>
                <section>
                    <h3>Obecne pliki</h3>
                    {this.props.audios && this.props.audios.length ? (
                        <ul class="deletable-list">
                            {this.props.audios.map(audio => this._renderAudio(audio))}
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