import React from 'react'
import { DropTarget } from 'react-dnd'

import { AUDIO_DRAGGABLE_TYPE, SAMPLE_DRAGGABLE_TYPE } from '../constants'
import Sample from './sample'
import TrackLayer from '../components/track-layer'

class Track extends React.PureComponent {

    componentDidUpdate(prevProps) {
        if (!prevProps.didDrop && this.props.didDrop && prevProps.isOver) {
            const { item, itemType, i, pixelsPerSecond, addSample, moveSample, audios, tracks, dropResult } = this.props
            const { clientOffset, initialClientOffset } = dropResult
            if (this.props.itemType === AUDIO_DRAGGABLE_TYPE) {
                const audio = audios.filter(audio => audio.id === item.id).shift() || {}
                addSample(i, item.id, Math.max((clientOffset.x - 180) / pixelsPerSecond - audio.length / 2, 0))
            } else if (this.props.itemType === SAMPLE_DRAGGABLE_TYPE) {
                const sample = tracks[item.i].samples[item.j] || {}
                moveSample(item.i, item.j, i, Math.max((clientOffset.x - initialClientOffset.x) / pixelsPerSecond + sample.start, 0))
            }
        }
    }

    render() {
        const { i, pixelsPerSecond, audios, samples, changeSampleParam, removeSample, moveSample, connectDropTarget, isOver, item, itemType, tracks } = this.props
        return connectDropTarget(
            <div className="track timeline">
                {samples.map((s, j) => {
                    const audio = audios ? audios.filter(a => s.audioId === a.id).shift() : {}
                    return <Sample
                        className={(itemType === SAMPLE_DRAGGABLE_TYPE && item.i === i && item.j === j) ? 'invisible' : ''}
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
                        i={i}
                        j={j}
                    />
                })}
                <TrackLayer
                    tracks={tracks}
                    pixelsPerSecond={pixelsPerSecond}
                    audios={audios}
                    isOver={isOver}
                />
            </div>
        )
    }

}

const trackTarget = {
    drop(props, monitor) {
        const clientOffset = monitor.getClientOffset()
        const initialClientOffset = monitor.getInitialClientOffset()
        return { clientOffset, initialClientOffset }
    }
}

export default DropTarget([ AUDIO_DRAGGABLE_TYPE, SAMPLE_DRAGGABLE_TYPE ], trackTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    didDrop: monitor.didDrop(),
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    dropResult: monitor.getDropResult()
}))(Track)