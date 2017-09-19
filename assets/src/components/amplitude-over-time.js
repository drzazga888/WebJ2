import React from 'react'

export default class AmplitudeOverTime extends React.PureComponent {

    componentDidMount() {
        this._paint()
    }

    componentDidUpdate() {
        this._paint()
    }

    prepareData() {
        const { start, duration, offset, data, audioDuration } = this.props
        if (duration) {
            const sampleStart = offset
            const sampleEnd = sampleStart + duration
            const numberOfRepeats = Math.ceil(sampleEnd / audioDuration)
            const repeatedData = (new Array(numberOfRepeats)).fill(null).reduce(c => c.concat(data), [])
            const coef = repeatedData.length / (numberOfRepeats * audioDuration)
            return repeatedData.slice(Math.floor(sampleStart * coef), Math.floor(sampleEnd * coef))
        }
        return data
    }

    _paint() {
        const { color } = this.props
        const maxV = Math.max(...(this.props.data))
        const data  = this.prepareData()
        const canvas = this.refs.canvas
        const ctx = canvas.getContext('2d')
        const w = canvas.width
        const h = canvas.height
        const len = data.length
        ctx.clearRect(0, 0, w, h)
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.moveTo(0, h)
        data.forEach((v, i) => ctx.lineTo(i * w / len, h - (v * h / maxV)))
        ctx.lineTo(w, h)
        ctx.fill()
    }

    render() {
        const { className, width, height, data, color, start, duration, audioDuration, offset, ...rest } = this.props
        const finalClassName = `amplitude-over-time${className ? ` ${className}` : ''}`
        const realWidth = width || (duration * 300)
        return <canvas ref="canvas" className={finalClassName} width={realWidth} height={height} {...rest}></canvas>
    }

}