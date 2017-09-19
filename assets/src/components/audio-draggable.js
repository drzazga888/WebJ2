import React from 'react'
import { DragSource } from 'react-dnd'

import AmplitudeOverTime from './amplitude-over-time'
import PreviewItem from './preview-item'
import { getSecondsFormatted } from '../converters'
import { AUDIO_DRAGGABLE_TYPE } from '../constants'

class AudioDraggable extends React.PureComponent {

    state = {
        playing: false
    }

    render() {
        const { id, name, amplitudeOverTime, length, contentLoaded, loaded, connectDragSource } = this.props
        const { crosshairPos, playing } = this.state
        const audioControlClasses = contentLoaded ? playing ? 'icon-stop' : 'icon-play' : 'icon-spin1 animate-spin'
        const audioControlTitle = playing ? 'Zatrzymaj' : 'Posłuchaj'
        const audioControlAction = playing ? this.stopAudio : this.playAudio
        return connectDragSource(
            <div className="audio-draggable audio-preview">
                <AmplitudeOverTime className="audio-preview-box" data={amplitudeOverTime} width={450} height={70} color="#D45D5A" />
                <div className="audio-overlay">
                    <div className="audio-preview-length">{getSecondsFormatted(length)}</div>
                    <PreviewItem className="audio-details" id={id} name={name} loaded={loaded} readOnly={true} />
                    <i className={`clickable audio-control ${audioControlClasses}`} title={audioControlTitle} onClick={audioControlAction}></i>
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

const audioDraggableSource = {
    beginDrag(props) {
        console.log('beginDrag audio', props)
        return {}
    }
}

export default DragSource(AUDIO_DRAGGABLE_TYPE, audioDraggableSource, connect => ({
    connectDragSource: connect.dragSource()
}))(AudioDraggable)