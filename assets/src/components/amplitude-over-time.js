import React from 'react'

export default class AmplitudeOverTime extends React.PureComponent {

    componentDidMount() {
        this._paint()
    }

    componentDidUpdate() {
        this._paint()
    }

    _paint() {
        const { amplitudeOverTime, color } = this.props
        const canvas = this.refs.canvas
        const ctx = canvas.getContext('2d')
        const maxV = Math.max(...amplitudeOverTime)
        const w = canvas.width
        const h = canvas.height
        const len = amplitudeOverTime.length
        ctx.clearRect(0, 0, w, h)
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.moveTo(0, h)
        amplitudeOverTime.forEach((v, i) => ctx.lineTo(i * w / len, h - (v * h / maxV)))
        ctx.lineTo(w, h)
        ctx.fill()
    }

    render() {
        return <canvas ref="canvas" className="amplitude-over-time" width={this.props.width} height={this.props.height}></canvas>
    }

}