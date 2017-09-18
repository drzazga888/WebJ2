import React from 'react'
import { Link } from 'react-router-dom'

const MixerPage = ({ content, audios, getMusicDownloadPath, match }) => (
    <div>
        <h2>Edycja utworu</h2>
        <section>
            <h3>Mixer</h3>
            <p>ID piosenki: <span id="song-id">{match.params.id}</span></p>
            <label className="inline-form">Nazwa utworu: <input type="text" id="mixer-name" required /></label>
            <div id="tracks" className="grid">
                <aside className="grid-item"></aside>
                <div className="grid-item">
                    <div className="scrollable">
                        <div className="timelines">
                            <div className="time"></div>
                            <div className="pipe"></div>
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
        <section>
            <h3>Stan aplikacji</h3>
            <p>Online: <span id="is-online" className="online">tak</span></p>
            <p>Dane w local storage: <span id="local-storage-last-modified"></span></p>
        </section>
    </div>
)

export default MixerPage