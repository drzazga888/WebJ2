import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { getUserEmail, getActiveProjectError, getActiveProjectLoaded, getActiveProjectData,
    getAudiosEntries, getAudiosLoaded, getAudiosError } from '../reducers'
import * as activeProjectActions from '../actions/active-project'
import * as audiosActions from '../actions/audios'
import { getSecondsFormatted } from '../converters'
import AmplitudeOverTime from '../components/amplitude-over-time'
import AudioDraggable from '../components/audio-draggable'

class MixerPage extends React.PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            pixelsPerSecond: 160,
            data: this.props.data
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.data !== nextProps.data) {
            this.setState({
                data: nextProps.data
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

    getAudioName(audioId) {
        return this.props.audiosEntries ? this.props.audiosEntries.filter(a => audioId === a.id).shift().name : audioId
    }

    getAudioAmplitudeOverTime(audioId) {
        return this.props.audiosEntries ? this.props.audiosEntries.filter(a => audioId === a.id).shift().amplitudeOverTime : []
    }

    getAudioDuration(audioId) {
        return this.props.audiosEntries ? this.props.audiosEntries.filter(a => audioId === a.id).shift().length : 0
    }

    renderSample(s, i, j) {
        const bindedChangeFun = this.changeSampleParam.bind(this, i, j)
        return (
            <div key={j} draggable={true} className="sample" style={{
                left: (this.state.pixelsPerSecond * s.start) + 'px',
                width: (this.state.pixelsPerSecond * s.duration) + 'px'
            }}>
                <AmplitudeOverTime
                    className="sample-amplitude"
                    data={this.getAudioAmplitudeOverTime(s.audioId)}
                    offset={s.offset}
                    duration={s.duration}
                    start={s.start}
                    audioDuration={this.getAudioDuration(s.audioId)}
                    height={100}
                    color="rgba(0, 0, 0, 0.3)"
                />
                <div className="sample-controls">
                    <p><strong>{this.getAudioName(s.audioId)}</strong></p>
                    <p>start [s]: <em><input name="start" type="number" step={0.01} min={0} max={999.9} className="start" value={s.start} onChange={bindedChangeFun} /></em></p>
                    <p>offset [s]: <em><input name="offset" type="number" step={0.01} min={0} max={999.9} className="offset" value={s.offset} onChange={bindedChangeFun} /></em></p>
                    <p>długość [s]: <em><input name="duration" type="number" step={0.01} min={0} max={999.9} className="duration" value={s.duration} onChange={bindedChangeFun} /></em></p>
                    <p>wzmocnienie: <em><input name="gain" type="number" step={0.01} min={0} max={10.0} className="gain" value={s.gain} onChange={bindedChangeFun} /></em></p>
                    <p className="deleter icon-cancel" onClick={() => this.removeSample(i, j)}></p>
                </div>
            </div>
        )
    }

    renderTracks() {
        return this.state.data.tracks.map((t, i) => (
            <div key={i} className="track timeline">{t.samples.map((s, j) => this.renderSample(s, i, j))}</div>
        ))
    }

    addNewTrack = () => {
        this.setState({ data: Object.assign({}, this.state.data, {
            tracks: [ ...this.state.data.tracks, { name: '', gain: 1, samples: [] }]
        })})
    }

    removeTrack = (i) => {
        if (!this.state.data.tracks[i].samples.length || confirm('Czy na pewno chcesz usunąć ścieżkę, która zawiera sample?')) {
            this.setState({ data: Object.assign({}, this.state.data, {
                tracks: [ ...(this.state.data.tracks.slice(0, i)), ...(this.state.data.tracks.slice(i + 1)) ]
            })})
        }
    }

    changeSongName = ({ target }) => {
        this.setState({ data: Object.assign({}, this.state.data, {
            name: target.value
        })})
    }

    changeTrackName = (i, name) => {
        this.setState({ data: Object.assign({}, this.state.data, {
            tracks: [
                ...(this.state.data.tracks.slice(0, i)),
                Object.assign({}, this.state.data.tracks[i], { name }),
                ...(this.state.data.tracks.slice(i + 1))
            ]
        })})
    }

    changeTrackGain = (i, gain) => {
        this.setState({ data: Object.assign({}, this.state.data, {
            tracks: [
                ...(this.state.data.tracks.slice(0, i)),
                Object.assign({}, this.state.data.tracks[i], { gain }),
                ...(this.state.data.tracks.slice(i + 1))
            ]
        })})
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
        })})
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
        })})
    }

    renderMixer() {
        const { loaded, match } = this.props
        const { data }  = this.state
        const songLength = this.getSongLength()
        return (
            <div>
                <p>ID piosenki: <span id="song-id">{match.params.id}</span></p>
                <label className="inline-form">Nazwa utworu: <input type="text" id="mixer-name" required value={data.name} onChange={this.changeSongName} /></label>
                <div id="tracks" className="grid">
                    <aside className="grid-item">{data.tracks.map((t, i) => this.renderTrackHead(t, i))}</aside>
                    <div className="grid-item">
                        <div className="scrollable">
                            <div className="timelines" style={{
                                width: (this.state.pixelsPerSecond * songLength) + 'px'
                            }}>
                                {this.renderTimes(songLength)}
                                <div className="pipe"></div>
                                {this.renderTracks()}
                            </div>
                        </div>
                    </div>
                </div>
                <button id="new-track" className="icon-plus" onClick={this.addNewTrack}>Dodaj ścieżkę</button>
                <button id="play" className="icon-play">Graj</button>
                <span className="icon-resize-horizontal">
                    Rozciągnij: 
                    <input type="range" className="pixels-per-second-range" min={1} max={2000} value={Math.sqrt(2000 * this.state.pixelsPerSecond)} onChange={this.changePixelsPerSecond} />
                    <em>{Number(this.state.pixelsPerSecond).toFixed(4)}</em> px/s
                </span>
                &nbsp;&nbsp;&nbsp;
                <span>Długość utworu: <em>{getSecondsFormatted(songLength)}</em> s</span>
                <a href="javascript:void(0)"><button>Utwórz</button></a>
            </div>
        )
    }

    renderAudios() {
        const { audiosEntries, getAudio } = this.props
        return (
            <div className="audios-draggable">
                {audiosEntries.map((audio) => <AudioDraggable key={audio.id} getAudio={() => getAudio(audio.id)} {...audio} />)}
            </div>
        )
    }

    renderPage() {
        const { loaded, data, audiosLoaded, audiosEntries } = this.props
        return (
            <div>
                <section>
                    <h3>Mixer</h3>
                    {!loaded ? <p>Ładowanie</p> : (!data ? <p>Brak danych</p> : this.renderMixer())}
                </section>
                <section>
                    <h3>Dostępna muzyka</h3>
                    {!audiosLoaded ? <p>Ładowanie</p> : (!audiosEntries ? <p>Brak danych</p> : this.renderAudios())}
                </section>
            </div>
        )
    }

    render() {
        return (
            <div>
                <h2>Edycja utworu</h2>
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
    getAudio: audiosActions.getAudio
}

export default connect(mapStateToProps, mapDispatchToProps)(MixerPage)