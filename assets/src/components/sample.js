import React from 'react'
import { DragSource } from 'react-dnd'

import AmplitudeOverTime from '../components/amplitude-over-time'
import { SAMPLE_DRAGGABLE_TYPE } from '../constants'

const Sample = ({ onChangeParam, onRemove, offset, duration, start, gain, amplitudeOverTime, audioDuration, name, pixelsPerSecond, connectDragSource }) => connectDragSource(
    <div className="sample" style={{
        left: (pixelsPerSecond * start) + 'px',
        width: (pixelsPerSecond * duration) + 'px'
    }}>
        <AmplitudeOverTime
            className="sample-amplitude"
            data={amplitudeOverTime}
            offset={offset}
            duration={duration}
            start={start}
            audioDuration={audioDuration}
            height={100}
            color="rgba(0, 0, 0, 0.3)"
        />
        <div className="sample-controls">
            <p><strong>{name}</strong></p>
            <p>start [s]: <em><input name="start" type="number" step={0.01} min={0} max={999.9} className="start" value={start} onChange={onChangeParam} /></em></p>
            <p>offset [s]: <em><input name="offset" type="number" step={0.01} min={0} max={999.9} className="offset" value={offset} onChange={onChangeParam} /></em></p>
            <p>długość [s]: <em><input name="duration" type="number" step={0.01} min={0} max={999.9} className="duration" value={duration} onChange={onChangeParam} /></em></p>
            <p>wzmocnienie: <em><input name="gain" type="number" step={0.01} min={0} max={10.0} className="gain" value={gain} onChange={onChangeParam} /></em></p>
            <p className="deleter icon-cancel" onClick={onRemove}></p>
        </div>
    </div>
)

const sampleDraggableSource = {
    beginDrag(props) {
        console.log('beginDrag sample', props)
        return {}
    }
}

export default DragSource(SAMPLE_DRAGGABLE_TYPE, sampleDraggableSource, connect => ({
    connectDragSource: connect.dragSource()
}))(Sample)