import React from 'react'

import AmplitudeOverTime from './amplitude-over-time'
import PreviewItem from './preview-item'
import { getSecondsFormatted } from '../converters'

export default class AudioWrapper extends React.PureComponent {

    state = {
        playing: false
    }

    render() {
        const { id, name, amplitudeOverTime, length, contentLoaded, onNameChange, onDelete, loaded } = this.props
        const { crosshairPos, playing } = this.state
        const audioControlClasses = contentLoaded ? playing ? 'icon-stop' : 'icon-play' : 'icon-spin1 animate-spin'
        const audioControlTitle = playing ? 'Zatrzymaj' : 'Posłuchaj'
        const audioControlAction = playing ? this.stopAudio : this.playAudio
        return (
            <div className="audio-wrapper">
                <PreviewItem className="audio-details" id={id} name={name} loaded={loaded} onNameChange={onNameChange} />
                <i className={'clickable audio-delete icon-trash'} title='Usuń plik audio' onClick={onDelete}></i>
                <i className={`clickable audio-control ${audioControlClasses}`} title={audioControlTitle} onClick={audioControlAction}></i>
                <div className="audio-preview">
                    <div className="audio-preview-length">{getSecondsFormatted(length)}</div>
                    <AmplitudeOverTime className="audio-preview-box" data={amplitudeOverTime} width={450} height={70} color="#D45D5A" />
                </div>
            </div>
        )
    }

    ensureAudio = () => {
        if (this.decodedAudio) {
            return Promise.resolve(this.decodedAudio)
        } else {
            return this.props.getAudio(this.props.id).then((audioData) => {
                return new Promise((resolve, reject) => {
                    this.props.audioContext.decodeAudioData(audioData, (buffer) => {
                        this.decodedAudio = buffer
                        resolve(this.decodedAudio)
                    })
                })
            })
        }
    }

    playAudio = () => {
        this.ensureAudio().then(buffer => {
            this.audioSrc = this.props.audioContext.createBufferSource()
            this.audioSrc.buffer = buffer
            this.audioSrc.connect(this.props.audioContext.destination)
            this.audioSrc.onended = () => this.setState({ playing: false })
            this.audioSrc.start(0)
            this.setState({ playing: true })
        })
    }

    stopAudio = () => {
        this.audioSrc && this.audioSrc.stop()
        this.setState({ playing: false })
    }

}