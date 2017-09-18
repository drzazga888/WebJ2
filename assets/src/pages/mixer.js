import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { getUserEmail, getActiveProjectError, getActiveProjectLoaded, getActiveProjectData } from '../reducers'
import * as activeProjectActions from '../actions/active-project'

class MixerPage extends React.PureComponent {

    componentDidMount() {
        if (this.props.userLoggenIn) {
            this.props.getProject(this.props.match.params.id)
        }
    }

    renderTrackHead(track, i) {
        return (
            <div key={i} className="track track-head">
                <input type="text" placeholder="Nazwij track" className="name" defaultValue={track.name} required />
                <p className="icon-cancel deleter">Usuń</p>
            </div>
        )
    }

    getTrackLength(track) {
        return track.samples.reduce((cumm, s) => Math.max(cumm, s.duration + s.start), 0)
    }

    getSongLength() {
        return this.props.data.tracks.reduce((cumm, t) => Math.max(cumm, this.getTrackLength(t)), 0)
    }

    renderTimes() {
        return (
            <div className="time">{(new Array(Math.ceil(this.getSongLength()))).fill(null).map((v, i) => (
                <div key={i} className="time-item" style={{ left: (80 * i) + 'px' }}>{i}s</div>
            ))}</div>
        )
    }

    renderSample(s, i) {
        return (
            <div key={i} draggable={true} className="sample" style={{
                left: (60 * s.start) + 'px',
                width: (60 * s.duration) + 'px'
            }}>
                <p>{s.audioId}</p>
                <p>start [s]: <em><input type="number" step={0.01} min={0} max={999.9} className="offset" defaultValue={s.offset} /></em></p>
                <p>długość [s]: <em><input type="number" step={0.01} min={0} max={999.9} className="duration" defaultValue={s.duration} /></em></p>
                <p className="deleter icon-cancel"></p>
            </div>
        )
    }

    renderTracks() {
        return this.props.data.tracks.map((t, i) => (
            <div key={i} className="track timeline">{t.samples.map((s, j) => this.renderSample(s, j))}</div>
        ))
    }

    renderPage() {
        const { loaded, data, match } = this.props
        if (!loaded) {
            return <p>Ładowanie...</p>
        }
        if (!data) {
            return <p>Brak danych</p>
        }
        return (
            <div>
                <section>
                    <h3>Mixer</h3>
                    <p>ID piosenki: <span id="song-id">{match.params.id}</span></p>
                    <label className="inline-form">Nazwa utworu: <input type="text" id="mixer-name" required defaultValue={data.name} /></label>
                    <div id="tracks" className="grid">
                        <aside className="grid-item">{data.tracks.map((t, i) => this.renderTrackHead(t, i))}</aside>
                        <div className="grid-item">
                            <div className="scrollable">
                                <div className="timelines" style={{
                                    backgroundImage: 'repeating-linear-gradient(to right, transparent, transparent 79px, rgb(76, 166, 204) 80px)',
                                    width: '1600px'
                                }}>
                                    {this.renderTimes()}
                                    <div className="pipe"></div>
                                    {this.renderTracks()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <button id="new-track" className="icon-plus">Dodaj ścieżkę</button>
                    <button id="play" className="icon-play">Graj</button>
                    <span className="icon-resize-horizontal">Rozciągnij
                        <button id="zoom-out" className="icon-minus"></button>
                        <button id="zoom-in" className="icon-plus"></button>
                    </span>
                    <span>Długość utworu:
                        <input type="number" step="0.01" min="0.1" max="999.99" id="timeline-duration" title="Długość utworu" />
                    </span>
                    <a href="javascript:void(0)"><button>Utwórz</button></a>
                </section>
                <section>
                    <h3>Dostępna muzyka</h3>
                    <div id="audios"></div>
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
    data: getActiveProjectData(state)
})

const mapDispatchToProps = {
    getProject: activeProjectActions.getProject
}

export default connect(mapStateToProps, mapDispatchToProps)(MixerPage)