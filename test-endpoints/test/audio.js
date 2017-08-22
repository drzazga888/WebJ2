const chakram = require('chakram')
const expect = chakram.expect
const { postUser, deleteUser } = require('../requests/user')
const { getAudioPath, AUDIO_1, AUDIO_2, AUDIO_NAME_VALID_1, AUDIO_NAME_VALID_2, postAudio, getAudios, getAudio, putAudioInfo, deleteAudio }  = require('../requests/audio')

describe('Audio endpoint', function() {

    let postResponse
    let getListResponse
    let getResponse
    let getResponseAfterNameChange
    let deleteResponse
    let getAfterDeleteResponse

    before('do necessary requests', function() {
        return postUser().then(() => {
            return postAudio(AUDIO_1, AUDIO_NAME_VALID_1)
        }).then(response => {
            postResponse = response
            return getAudios()
        }).then(response => {
            getListResponse = response
            return getAudio(postResponse.body.id)
        }).then(response => {
            getResponse = response
            return putAudioInfo(postResponse.body.id, AUDIO_NAME_VALID_2)
        }).then(response => {
            return getAudio(postResponse.body.id)
        }).then(response => {
            getResponseAfterNameChange = response
            return deleteAudio(postResponse.body.id)
        }).then(response => {
            deleteResponse = response
            return getAudio(postResponse.body.id)
        }).then(response => {
            getAfterDeleteResponse = response
            return response
        })
    })

    it('returns 201 CREATED on POST success', function() {
        return expect(postResponse).to.have.status(201)
    })

    it('consists of message and id fields on POST', function() {
        return expect(postResponse).to.have.schema({
            type: "object",
            properties: {
                message: {
                    type: "string"
                },
                id: {
                    type: "integer"
                }
            }
        })
    })

    it('returns 200 OK on list GET', function() {
        return expect(getListResponse).to.have.status(200)
    })

    it('returns valid json schema on list GET', function() {
        return expect(getListResponse).to.have.schema({
            type: "array",
            items: {
                type: "object",
                properties: {
                    name: {
                        type: "string"
                    },
                    id: {
                        type: "integer"
                    },
                    length: {
                        type: "number"
                    },
                    amplitudeOverTime: {
                        type: "array",
                        items: {
                            type: "number"
                        }
                    }
                }
            }
        })
    })

    it('containts info about newly created audio', function() {
        const newId = postResponse.body.id
        const filteredAudios = getListResponse.body.filter(audio => audio.id === newId)
        return expect(filteredAudios.length).to.equal(1)
    })

    it('returns 200 OK on audio GET', function() {
        return expect(getResponse).to.have.status(200)
    })

    it('changes name of the audio after PUT', function() {
        return expect(getResponseAfterNameChange).to.have.header('Content-Disposition', `attachment; filename="${AUDIO_NAME_VALID_2}.wav"`)
    })

    it('removes audio resource on DELETE', function() {
        expect(deleteResponse).to.have.status(200)
        expect(getAfterDeleteResponse).to.have.status(404)
        return chakram.wait()
    })

    after('remove user', function() {
        return deleteUser()
    })

})