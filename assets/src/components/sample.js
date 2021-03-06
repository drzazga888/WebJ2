import React from 'react'
import { DragSource } from 'react-dnd'

import AmplitudeOverTime from '../components/amplitude-over-time'
import { SAMPLE_DRAGGABLE_TYPE } from '../constants'
import dragImg from '../img/sample_drag.png'

class Sample extends React.PureComponent {

    componentDidMount() {
        const img = new Image()
        img.src = dragImg
        img.onload = () => this.props.connectDragPreview(img)
    }
    
    render() {
        const { onChangeParam, onRemove, offset, duration, start, gain, amplitudeOverTime, audioDuration, name, pixelsPerSecond, connectDragSource, className } = this.props
        return connectDragSource(
            <div className={`sample${className ? ` ${className}` : ''}`} style={{
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
                    <p>start [s]: <em><input name="start" type="number" min={0} max={999.9} className="start" value={start} onChange={onChangeParam} /></em></p>
                    <p>offset [s]: <em><input name="offset" type="number" min={0} max={999.9} className="offset" value={offset} onChange={onChangeParam} /></em></p>
                    <p>długość [s]: <em><input name="duration" type="number" min={0} max={999.9} className="duration" value={duration} onChange={onChangeParam} /></em></p>
                    <p>wzmocnienie: <em><input name="gain" type="number" min={0} max={10.0} className="gain" value={gain} onChange={onChangeParam} /></em></p>
                    <p className="deleter icon-cancel" onClick={onRemove}></p>
                </div>
            </div>
        , { dropEffect: 'move' })
    }

    static defaultProps = {
        onChangeParam() {},
        onRemove() {}
    }

}

const sampleDraggableSource = {
    beginDrag(props, monitor) {
        return { i: props.i, j: props.j }
    }
}

export default DragSource(SAMPLE_DRAGGABLE_TYPE, sampleDraggableSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
}))(Sample)