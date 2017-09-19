import React from 'react'

import Sample from './sample'

const Track = ({ pixelsPerSecond, audios, samples, changeSampleParam, removeSample }) => (
    <div className="track timeline">
        {samples.map((s, j) => {
            const audio = audios ? audios.filter(a => s.audioId === a.id).shift() : {}
            return <Sample
                onChangeParam={changeSampleParam.bind(this, j)}
                onRemove={removeSample.bind(this, j)}
                offset={s.offset}
                duration={s.duration}
                start={s.start}
                gain={s.gain}
                pixelsPerSecond={pixelsPerSecond}
                amplitudeOverTime={audio.amplitudeOverTime || []}
                audioDuration={audio.length || 0}
                name={audio.name || s.audioId}
                key={j}
            />
        })}
    </div>
)

export default Track