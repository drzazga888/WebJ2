import React from 'react'
import { DropTarget } from 'react-dnd'
import { AUDIO_DRAGGABLE_TYPE, SAMPLE_DRAGGABLE_TYPE } from '../constants'
import { compose } from 'redux'

import Sample from './sample'

class Track extends React.PureComponent {

    render() {
        const  { i, pixelsPerSecond, audios, samples, changeSampleParam, removeSample, connectAudioDropTarget, connectSampleDropTarget, startDrag, endDrag } = this.props
        return compose(connectAudioDropTarget, connectSampleDropTarget)(
            <div className="track timeline">
                {samples.map((s, j) => {
                    const audio = audios ? audios.filter(a => s.audioId === a.id).shift() : {}
                    return <Sample
                        onChangeParam={changeSampleParam.bind(this, j)}
                        onRemove={removeSample.bind(this, j)}
                        offset={s.offset}
                        duration={s.duration}
                        start={s.start}
                        gain={s.gain}
                        pixelsPerSecond={pixelsPerSecond}
                        amplitudeOverTime={audio.amplitudeOverTime || []}
                        audioDuration={audio.length || 0}
                        name={audio.name || s.audioId}
                        key={j}
                        startDrag={startDrag}
                        i={i}
                        j={j}
                    />
                })}
            </div>
        )
    }

}

const audioTarget = {
    drop(props) {
        return { id: props.id }
    }
}

const sampleTarget = {
    drop(props) {
        return { i: props.i, j: props.j }
    }
}

export default compose(
    DropTarget(AUDIO_DRAGGABLE_TYPE, audioTarget, (connect, monitor) => ({
        connectAudioDropTarget: connect.dropTarget(),
        audioOffset: monitor.getClientOffset(),
        isAudioOver: monitor.isOver(),
        didAudioDrop: monitor.didDrop()
    })),
    DropTarget(SAMPLE_DRAGGABLE_TYPE, sampleTarget, (connect, monitor) => ({
        connectSampleDropTarget: connect.dropTarget(),
        sampleOffset: monitor.getClientOffset(),
        sampleInitialOffset: monitor.getInitialClientOffset(),
        isSampleOver: monitor.isOver(),
        didSampleDrop: monitor.didDrop()
    }))
)(Track)