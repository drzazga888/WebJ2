import moment from 'moment'
import React from 'react'

import AmplitudeOverTime from './amplitude-over-time'
import PreviewItem from './preview-item'

const getSecondsFormatted = (v) => {
    const momentV = moment(v * 1000)
    return `${momentV.minutes()}:${momentV.format('ss:SSS')}`
}

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
                <i href="javascript:void(0)" className={'clickable audio-delete icon-trash'} title='Usuń plik audio' onClick={onDelete}></i>
                <i href="javascript:void(0)" className={`clickable audio-control ${audioControlClasses}`} title={audioControlTitle} onClick={audioControlAction}></i>
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
                if (!this.audioContext) {
                    this.audioContext = new AudioContext()
                }
                return new Promise((resolve, reject) => {
                    this.audioContext.decodeAudioData(audioData, (buffer) => {
                        this.decodedAudio = buffer
                        resolve(this.decodedAudio)
                    })
                })
            })
        }
    }

    playAudio = () => {
        this.ensureAudio().then(buffer => {
            this.audioSrc = this.audioContext.createBufferSource()
            this.audioSrc.buffer = buffer
            this.audioSrc.connect(this.audioContext.destination)
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