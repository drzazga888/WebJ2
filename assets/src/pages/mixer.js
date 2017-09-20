import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { DragDropContext, DragSource } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

import { getUserEmail, getActiveProjectError, getActiveProjectLoaded, getActiveProjectData,
    getAudiosEntries, getAudiosLoaded, getAudiosError } from '../reducers'
import * as activeProjectActions from '../actions/active-project'
import * as audiosActions from '../actions/audios'
import { getSecondsFormatted } from '../converters'
import AudioDraggable from '../components/audio-draggable'
import Track from '../components/track'

class MixerPage extends React.PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            pixelsPerSecond: 160,
            data: this.props.data,
            dataChanged: false,
            audioBuffers: this.props.audiosEntries ? this.props.audiosEntries.reduce((c, a) => (c[a.id] = null, c), {}) : null,
            playingCursor: null
        }
    }

    addSample = (i, audioId, start) => {
        const { data } = this.state
        const { audiosEntries } = this.props
        this.setState({ data: Object.assign({}, data, {
            tracks: [
                ...(data.tracks.slice(0, i)),
                Object.assign({}, data.tracks[i], {
                    samples: [
                        ...(data.tracks[i].samples),
                        {
                            audioId,
                            start: Math.round(start * 100) / 100,
                            offset: 0,
                            gain: 1,
                            duration: audiosEntries ? audiosEntries.filter(audio => audio.id === audioId).shift().length : 0
                        }
                    ]
                }),
                ...(data.tracks.slice(i + 1))
            ]
        }), dataChanged: true })
    }

    moveSample = (i, j, newI, start) => {
        const { data } = this.state
        const sample = data.tracks[i].samples[j]
        const cleanedState = Object.assign({}, data, {
            tracks: [
                ...(data.tracks.slice(0, i)),
                Object.assign({}, data.tracks[i], {
                    samples: [
                        ...(data.tracks[i].samples.slice(0, j)),
                        ...(data.tracks[i].samples.slice(j + 1))
                    ]
                }),
                ...(data.tracks.slice(i + 1))
            ]
        })
        const newState = Object.assign({}, cleanedState, {
            tracks: [
                ...(cleanedState.tracks.slice(0, newI)),
                Object.assign({}, cleanedState.tracks[newI], {
                    samples: [
                        ...(cleanedState.tracks[newI].samples),
                        Object.assign({}, sample, {
                            start: Math.round(start * 100) / 100
                        })
                    ]
                }),
                ...(cleanedState.tracks.slice(newI + 1))
            ]
        })
        this.setState({ data: newState, dataChanged: true })
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.data !== nextProps.data) {
            this.setState({
                data: nextProps.data,
                dataChanged: false
            })
        }
        if (!this.props.audiosEntries && nextProps.audiosEntries) {
            this.setState({
                audioBuffers: nextProps.audiosEntries.reduce((c, a) => (c[a.id] = null, c), {})
            })
        }
    }

    changePixelsPerSecond = ({ target }) => {
        this.setState({ pixelsPerSecond: (target.value * target.value) / 2000 })
    }

    componentDidMount() {
        if (this.props.userLoggenIn) {
            this.props.getProject(this.props.match.params.id)
        }
        if (this.props.audiosEntries) {
            this.fetchAudios()
        }
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.audiosEntries && this.props.audiosEntries) {
            this.fetchAudios()
        }
    }

    ensureAudio = (id) => {
        return this.props.getAudio(id).then((audioData) => {
            if (!this.audioContext) {
                this.audioContext = new AudioContext()
            }
            return new Promise((resolve, reject) => {
                this.audioContext.decodeAudioData(audioData, buffer => resolve(buffer))
            })
        })
    }

    fetchAudios() {
        this.props.audiosEntries.forEach(audio => {
            this.ensureAudio(audio.id).then(buffer => {
                this.setState({ audioBuffers: Object.assign({}, this.state.audioBuffers, { [audio.id]: buffer }) })
            })
        })
    }

    renderTrackHead(track, i) {
        return (
            <div key={i} className="track track-head">
                <input type="text" placeholder="Nazwij track" className="name" value={track.name} onChange={e => this.changeTrackName(i, e.target.value)} required />
                <p className="track-gain" title="wzmocnienie"><i className="icon-volume-up"></i> <em><input type="number" step={0.01} min={0} max={10.0} className="gain" onChange={e => this.changeTrackGain(i, Number(e.target.value))} value={track.gain} /></em></p>
                <p className="icon-cancel deleter" onClick={() => this.removeTrack(i)}>Usuń</p>
            </div>
        )
    }

    getTrackLength(track) {
        return track.samples.reduce((cumm, s) => Math.max(cumm, s.duration + s.start), 0)
    }

    getSongLength() {
        return this.state.data.tracks.reduce((cumm, t) => Math.max(cumm, this.getTrackLength(t)), 0)
    }

    renderTime(key, t) {
        return (
            <div key={key} className="time-item" style={{ left: (this.state.pixelsPerSecond * t) + 'px' }}>
                <div className="time-item-value">{getSecondsFormatted(t)}s</div>
            </div>
        )
    }

    renderTimes(songLength) {
        const period = Math.pow(2, Math.floor(Math.log2(200 / this.state.pixelsPerSecond)))
        return (
            <div className="time">{
                [
                    ...(new Array(Math.ceil(songLength / period))).fill(null).map((v, i) => this.renderTime(i, i * period)), 
                    this.renderTime('last', songLength)
                ]}
            </div>
        )
    }

    renderTracks() {
        return this.state.data.tracks.map((t, i) => (
            <Track
                {...t}
                pixelsPerSecond={this.state.pixelsPerSecond}
                audios={this.props.audiosEntries}
                changeSampleParam={this.changeSampleParam.bind(this, i)}
                removeSample={this.removeSample.bind(this, i)}
                moveSample={this.moveSample}
                addSample={this.addSample}
                i={i}
                key={i}
                tracks={this.state.data.tracks}
            />
        ))
    }

    addNewTrack = () => {
        this.setState({ data: Object.assign({}, this.state.data, {
            tracks: [ ...this.state.data.tracks, { name: '', gain: 1, samples: [] }]
        }), dataChanged: true })
    }

    removeTrack = (i) => {
        if (!this.state.data.tracks[i].samples.length || confirm('Czy na pewno chcesz usunąć ścieżkę, która zawiera sample?')) {
            this.setState({ data: Object.assign({}, this.state.data, {
                tracks: [ ...(this.state.data.tracks.slice(0, i)), ...(this.state.data.tracks.slice(i + 1)) ]
            }), dataChanged: true })
        }
    }

    changeSongName = ({ target }) => {
        this.setState({ data: Object.assign({}, this.state.data, {
            name: target.value
        }), dataChanged: true })
    }

    changeTrackName = (i, name) => {
        this.setState({ data: Object.assign({}, this.state.data, {
            tracks: [
                ...(this.state.data.tracks.slice(0, i)),
                Object.assign({}, this.state.data.tracks[i], { name }),
                ...(this.state.data.tracks.slice(i + 1))
            ]
        }), dataChanged: true })
    }

    changeTrackGain = (i, gain) => {
        this.setState({ data: Object.assign({}, this.state.data, {
            tracks: [
                ...(this.state.data.tracks.slice(0, i)),
                Object.assign({}, this.state.data.tracks[i], { gain }),
                ...(this.state.data.tracks.slice(i + 1))
            ]
        }), dataChanged: true })
    }

    removeSample = (i, j) => {
        this.setState({ data: Object.assign({}, this.state.data, {
            tracks: [
                ...(this.state.data.tracks.slice(0, i)),
                Object.assign({}, this.state.data.tracks[i], { samples: [
                    ...(this.state.data.tracks[i].samples.slice(0, j)),
                    ...(this.state.data.tracks[i].samples.slice(j + 1))
                ]}),
                ...(this.state.data.tracks.slice(i + 1))
            ]
        }), dataChanged: true })
    }

    changeSampleParam = (i, j, { target }) => {
        this.setState({ data: Object.assign({}, this.state.data, {
            tracks: [
                ...(this.state.data.tracks.slice(0, i)),
                Object.assign({}, this.state.data.tracks[i], { samples: [
                    ...(this.state.data.tracks[i].samples.slice(0, j)),
                    Object.assign({}, this.state.data.tracks[i].samples[j], { [target.name]: Number(target.value) }),
                    ...(this.state.data.tracks[i].samples.slice(j + 1))
                ]}),
                ...(this.state.data.tracks.slice(i + 1))
            ]
        }), dataChanged: true})
    }

    saveData = () => {
        this.props.putActiveProject(this.state.data)
    }

    downloadProjectAudio = () => {
        if (this.state.dataChanged) {
            alert('Należy najpierw zapisać projekt przed pobraniem utworu')
        } else {
            this.props.getProjectAudio().then(data => {
                let a = document.createElement('a')
                a.href = URL.createObjectURL(data)
                a.download = this.props.data.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()
                document.body.appendChild(a)
                a.click()
                document.body.removeChild(a)
            })
        }
    }

    stop = () => {
        this.playInterval && clearInterval(this.playInterval)
        this.stopTimeout && clearTimeout(this.stopTimeout)
        this.timeouts && this.timeouts.forEach(t => clearTimeout(t))
        this.audioSrcs && this.audioSrcs.forEach(a => a.stop())
        this.setState({ playingCursor: null })
    }

    play = () => {
        this.stop()
        this.timeouts = []
        this.audioSrcs = []
        this.state.data.tracks.reduce((c, t) => c.concat([ t.samples.map(s => {
            let audioSrc = this.audioContext.createBufferSource()
            audioSrc.buffer = this.state.audioBuffers[s.audioId]
            audioSrc.connect(this.audioContext.destination)
            audioSrc.loop = true
            this.timeouts.push(setTimeout(() => {
                audioSrc.start(0, s.offset, s.duration)
                this.audioSrcs.push(audioSrc)
            }, s.start * 1000))
        })]), [])
        this.setState({ playingCursor: 0 })
        this.playInterval = setInterval(() => this.setState({ playingCursor: this.state.playingCursor + 0.05 }), 50)
        this.stopTimeout = setTimeout(() => this.stop(), this.getSongLength() * 1000)
    }

    renderMixer() {
        const { loaded } = this.props
        const { data, dataChanged, audioBuffers, playingCursor, pixelsPerSecond } = this.state
        const songLength = this.getSongLength()
        const playDisabled = !audioBuffers || Object.values(audioBuffers).some(ab => ab === null)
        return (
            <div className={loaded ? '' : ' indeterminate'}>
                <label className="inline-form">Nazwa utworu: <input type="text" id="mixer-name" required value={data.name} onChange={this.changeSongName} /></label>
                <div id="tracks" className="grid">
                    <aside className="grid-item">{data.tracks.map((t, i) => this.renderTrackHead(t, i))}</aside>
                    <div className="grid-item">
                        <div className="scrollable">
                            <div className="timelines" style={{
                                width: (this.state.pixelsPerSecond * Math.max(songLength, 1)) + 'px'
                            }}>
                                {this.renderTimes(songLength)}
                                <div className="pipe" style={{
                                    display: playingCursor ? 'block' : 'none',
                                    left: playingCursor ? (playingCursor * pixelsPerSecond) + 'px' : 'auto'
                                }}></div>
                                {this.renderTracks()}
                            </div>
                        </div>
                    </div>
                </div>
                <button disabled={!dataChanged} className="icon-floppy" onClick={this.saveData}>{dataChanged ? 'Zapisz' : 'Aktualne'}</button>
                <button className="icon-plus" onClick={this.addNewTrack}>Dodaj ścieżkę</button>
                <button disabled={playDisabled} className={playingCursor ? 'icon-stop' : 'icon-play'} onClick={playingCursor ? this.stop : this.play}>{playingCursor ? 'Zatrzymaj' : 'Graj'}</button>
                <button onClick={this.downloadProjectAudio} className="icon-download">Utwórz</button>
                <span className="icon-resize-horizontal">
                    Rozciągnij: 
                    <input type="range" className="pixels-per-second-range" min={200} max={2000} value={Math.sqrt(2000 * this.state.pixelsPerSecond)} onChange={this.changePixelsPerSecond} />
                    <em>{Number(this.state.pixelsPerSecond).toFixed(2)}</em> px/s
                </span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span>Długość utworu: <em>{getSecondsFormatted(songLength)}</em> s</span>
            </div>
        )
    }

    renderAudios() {
        const { audiosEntries, getAudio, audiosLoaded } = this.props
        return (
            <div className={`audios-draggable${audiosLoaded ? '' : ' indeterminate'}`}>
                {audiosEntries.map((audio) => <AudioDraggable key={audio.id} audioBuffer={this.state.audioBuffers[audio.id]} {...audio} />)}
            </div>
        )
    }

    renderPage() {
        const { loaded, audiosLoaded, audiosEntries } = this.props
        const { data } = this.state
        return (
            <div>
                <section>
                    <h3>Mixer</h3>
                    {data ? this.renderMixer() : (loaded ? <p>Brak danych</p> : <p>Ładowanie</p>)}
                </section>
                <section>
                    <h3>Dostępna muzyka</h3>
                    {audiosEntries ? this.renderAudios() : (audiosLoaded ? <p>Brak danych</p> : <p>Ładowanie</p>)}
                </section>
            </div>
        )
    }

    render() {
        return (
            <div>
                <h2>Edycja utworu <small>ID piosenki: <strong id="song-id">{this.props.match.params.id}</strong></small></h2>
                {this.props.userLoggenIn ? this.renderPage() : <p>Musisz się zalogować, aby korzystać z tej strony</p>}
            </div>
        )
    }

}

const mapStateToProps = (state) => ({
    userLoggenIn: getUserEmail(state),
    error: getActiveProjectError(state),
    loaded: getActiveProjectLoaded(state),
    data: getActiveProjectData(state),
    audiosEntries: getAudiosEntries(state),
    audiosLoaded: getAudiosLoaded(state),
    audiosError: getAudiosError(state)
})

const mapDispatchToProps = {
    getProject: activeProjectActions.getProject,
    getAudio: audiosActions.getAudio,
    putActiveProject: activeProjectActions.putActiveProject,
    getProjectAudio: activeProjectActions.getProjectAudio
}

export default compose(
    DragDropContext(HTML5Backend),
    connect(mapStateToProps, mapDispatchToProps)
)(MixerPage)