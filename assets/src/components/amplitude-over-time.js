import React from 'react'

export default class AmplitudeOverTime extends React.PureComponent {

    componentDidMount() {
        this._paint()
    }

    componentDidUpdate() {
        this._paint()
    }

    _paint() {
        const { data, color } = this.props
        const canvas = this.refs.canvas
        const ctx = canvas.getContext('2d')
        const maxV = Math.max(...data)
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
        const { className, width, height, data, color, ...rest } = this.props
        const finalClassName = `amplitude-over-time${className ? ` ${className}` : ''}`
        return <canvas ref="canvas" className={finalClassName} width={width} height={height} {...rest}></canvas>
    }

}