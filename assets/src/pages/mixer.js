import React from 'react'
import { Link } from 'react-router-dom'

const MixerPage = ({ content, audios, getMusicDownloadPath }) => (
    <div>
        <h2>Edycja utworu</h2>
        <section>
            <h3>Mixer</h3>
            <p>ID piosenki: <span id="song-id">{this.props.params.id}</span></p>
            <label class="inline-form">Nazwa utworu: <input type="text" id="mixer-name" required /></label>
            <div id="tracks" class="grid">
                <aside class="grid-item"></aside>
                <div class="grid-item">
                    <div class="scrollable">
                        <div class="timelines">
                            <div class="time"></div>
                            <div class="pipe"></div>
                        </div>
                    </div>
                </div>
            </div>
            <button id="new-track" class="icon-plus">Dodaj ścieżkę</button>
            <button id="play" class="icon-play">Graj</button>
            <span class="icon-resize-horizontal">Rozciągnij
                <button id="zoom-out" class="icon-minus"></button>
                <button id="zoom-in" class="icon-plus"></button>
            </span>
            <span>Długość utworu:
                <input type="number" step="0.01" min="0.1" max="999.99" id="timeline-duration" title="Długość utworu" />
            </span>
            <a href={getMusicDownloadPath(this.props.params.id)}><button>Utwórz</button></a>
        </section>
        <section>
            <h3>Dostępna muzyka</h3>
            <div id="audios"></div>
        </section>
        <section>
            <h3>Stan aplikacji</h3>
            <p>Online: <span id="is-online" class="online">tak</span></p>
            <p>Dane w local storage: <span id="local-storage-last-modified"></span></p>
        </section>
    </div>
)

export default MixerPage