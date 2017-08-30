const chakram = require('chakram')
const expect = chakram.expect
const { postUser, deleteUser } = require('../requests/user')
const { getAudioPath, AUDIO_1, AUDIO_2, AUDIO_NAME_VALID_1, AUDIO_NAME_VALID_2, postAudio, getAudios, getAudio, putAudioInfo, deleteAudio }  = require('../requests/audio')
const { PROJECT_NAME_VALID_1, projectUpdate1Producer, postProject, getProjects, getProject, putProject, deleteProject } = require('../requests/project')

describe('Project endpoint', function() {

    let audio1PostResponse
    let audio2PostResponse
    let postResponse
    let getListResponse
    let putResponse
    let getResponse
    let deleteResponse

    before('do necessary requests', function() {
        return postUser().then(request => {
            return postAudio(AUDIO_1, AUDIO_NAME_VALID_1)
        }).then(response => {
            audio1PostResponse = response
            return postAudio(AUDIO_2, AUDIO_NAME_VALID_2)
        }).then(response => {
            audio2PostResponse = response
            return postProject(PROJECT_NAME_VALID_1)
        }).then(response => {
            postResponse = response
            return getProjects()
        }).then(response => {
            getListResponse = response
            return putProject(postResponse.body.id, projectUpdate1Producer(audio1PostResponse.body.id, audio2PostResponse.body.id))
        }).then(response => {
            putResponse = response
            return getProject(postResponse.body.id)
        }).then(response => {
            getResponse = response
            return deleteProject(postResponse.body.id)
        }).then(response => {
            deleteResponse = response
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
                },
                additionalProperties: false
            },
            additionalProperties: false
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
                    createdAt: {
                        type: "integer"
                    },
                    updatedAt: {
                        type: "integer"
                    },
                    duration: {
                        type: "number"
                    }
                },
                additionalProperties: false
            }
        })
    })

    it('containts info about newly created projects', function() {
        const newId = postResponse.body.id
        const filteredAudios = getListResponse.body.filter(project => project.id === newId)
        return expect(filteredAudios.length).to.equal(1)
    })

    it('returns 200 OK on valid project update', function() {
        return expect(putResponse).to.have.status(200)
    })

    it('returns 200 OK on project GET', function() {
        return expect(getResponse).to.have.status(200)
    })

    it('returns valid json schema on project GET', function() {
        return expect(getResponse).to.have.schema({
            type: "object",
            properties: {
                name: {
                    type: "string"
                },
                createdAt: {
                    type: "integer"
                },
                updatedAt: {
                    type: "integer"
                },
                tracks: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            name: {
                                type: "string"
                            },
                            gain: {
                                type: "number"
                            },
                            samples: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        audioId: {
                                            type: "integer"
                                        },
                                        start: {
                                            type: "number"
                                        },
                                        duration: {
                                            type: "number"
                                        },
                                        offset: {
                                            type: "number"
                                        },
                                        gain: {
                                            type: "number"
                                        }
                                    },
                                    additionalProperties: false
                                }
                            }
                        },
                        additionalProperties: false
                    }
                }
            },
            additionalProperties: false
        })
    })

    it('returns updated project on GET', function() {
        return expect(getResponse).to.comprise.of.json(projectUpdate1Producer(audio1PostResponse.body.id, audio2PostResponse.body.id))
    })

    it('returns 200 on project DELETE', function() {
        return expect(deleteResponse).to.have.status(200)
    })

    after('remove user', function() {
        return deleteUser()
    })

})