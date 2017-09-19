import React from 'react'
import { DragLayer } from 'react-dnd'

import Sample from './sample'
import { AUDIO_DRAGGABLE_TYPE, SAMPLE_DRAGGABLE_TYPE } from '../constants'

const getAudio = (audios, audioId) => {
    return audios ? audios.filter(audio => audio.id === audioId).shift() : {}
}

const getSample = ({ pixelsPerSecond, clientOffset, initialClientOffset, item, itemType, tracks, audios, isOver }) => {
    if (isOver && clientOffset && initialClientOffset) {
        if (itemType === SAMPLE_DRAGGABLE_TYPE) {
            const sample = tracks[item.i].samples[item.j]
            const newStart = Math.max((clientOffset.x - initialClientOffset.x) / pixelsPerSecond + sample.start, 0)
            const audio = getAudio(audios, sample.audioId)
            return <Sample
                {...sample}
                start={newStart}
                pixelsPerSecond={pixelsPerSecond}
                amplitudeOverTime={audio.amplitudeOverTime || []}
                audioDuration={audio.length || 0}
                name={audio.name || sample.audioId}
            />
        }
        if (itemType === AUDIO_DRAGGABLE_TYPE) {
            const audio = getAudio(audios, item.id)
            const newStart = Math.max((clientOffset.x - 180) / pixelsPerSecond - audio.length / 2, 0)
            return <Sample
                start={newStart}
                duration={audio.length || 0}
                offset={0}
                gain={1}
                audioId={item.id}
                pixelsPerSecond={pixelsPerSecond}
                amplitudeOverTime={audio.amplitudeOverTime || []}
                audioDuration={audio.length || 0}
                name={audio.name || item.id}
            />
        }
    }
    return null
}

const TrackLayer = (props) => {
    return (
        <div className="track-layer">
            {getSample(props)}
        </div>
    )
}

export default DragLayer(monitor => ({
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialClientOffset: monitor.getInitialClientOffset(),
    clientOffset: monitor.getClientOffset()
}))(TrackLayer)