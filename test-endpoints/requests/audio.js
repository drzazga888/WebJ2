const chakram = require('chakram')
const fs = require('fs')
const path = require('path')
const { apiPath, getBasicCredentials } = require('./general')

const audioEndpoint = apiPath + 'audios'

const AUDIO_NAME_VALID_1 = 'Audio name 1'
const AUDIO_NAME_VALID_2 = 'Audio name 2'
const AUDIO_1 = '111127__stephensaldanha__scifi-transforming-sound-01.wav'
const AUDIO_2 = '130630__ombrios57__hi-string-fx.wav'

const getAudioPath = filename => path.join(__dirname, '..', 'audios', filename)

const getBase64AudioFromFile = filename => {
    var audio = fs.readFileSync(getAudioPath(filename))
    return new Buffer(audio).toString('base64')
}

const postAudio = (filename, name) => chakram.post(audioEndpoint, {
    name: name,
    base64StringAudio: getBase64AudioFromFile(filename)
}, {
    headers: {
        'Authorization': getBasicCredentials(),
        'Content-Type': 'application/json'
    }
})

const getAudios = () => chakram.get(audioEndpoint, {
    headers: {
        'Authorization': getBasicCredentials()
    }
})

const getAudio = id => chakram.get(audioEndpoint + '/' + id, {
    headers: {
        'Authorization': getBasicCredentials()
    },
    json: false
})

const patchAudioInfo = (id, name) => chakram.patch(audioEndpoint + '/' + id, {
    name: name
}, {
    headers: {
        'Authorization': getBasicCredentials()
    }
})

const deleteAudio = id => chakram.delete(audioEndpoint + '/' + id, null, {
    headers: {
        'Authorization': getBasicCredentials()
    }
})

module.exports = { getAudioPath, AUDIO_1, AUDIO_2, AUDIO_NAME_VALID_1, AUDIO_NAME_VALID_2, postAudio, getAudios, getAudio, patchAudioInfo, deleteAudio }