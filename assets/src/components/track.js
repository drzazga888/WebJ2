import React from 'react'
import { DropTarget } from 'react-dnd'
import { AUDIO_DRAGGABLE_TYPE, SAMPLE_DRAGGABLE_TYPE } from '../constants'
import { compose } from 'redux'

import Sample from './sample'

const Track = ({ pixelsPerSecond, audios, samples, changeSampleParam, removeSample, connectAudioDropTarget, connectSampleDropTarget }) => (
    compose(connectAudioDropTarget, connectSampleDropTarget)(
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
                />
            })}
        </div>
    )
)

const trackAudioTarget = {
    hover(targetProps, monitor) {
        const sourceProps = monitor.getItem()
        console.log('audio dragging over track', sourceProps, targetProps)
    }
}

const trackSampleTarget = {
    hover(targetProps, monitor) {
        const sourceProps = monitor.getItem()
        console.log('sample dragging over track', sourceProps, targetProps)
    }
}

export default compose(
    DropTarget(AUDIO_DRAGGABLE_TYPE, trackAudioTarget, connect => ({
        connectAudioDropTarget: connect.dropTarget()
    })),
    DropTarget(SAMPLE_DRAGGABLE_TYPE, trackSampleTarget, connect => ({
        connectSampleDropTarget: connect.dropTarget()
    }))
)(Track)