const chakram = require('chakram')
const { apiPath, getBasicCredentials } = require('./general')

const projectEndpoint = apiPath + 'projects'

const PROJECT_NAME_VALID_1 = "My cool project"
const PROJECT_NAME_VALID_2 = "My cool updated project"

function projectUpdate1Producer(audio1, audio2) {
    return {
        name: PROJECT_NAME_VALID_2,
        tracks: [
            {
                name: '',
                gain: 0.8,
                samples: [
                    {
                        audioId: audio1,
                        start: 2.0,
                        duration: 4.5,
                        offset: 0.0,
                        gain: 1.0
                    },
                    {
                        audioId: audio2,
                        start: 6.5,
                        duration: 2.5,
                        offset: 1.0,
                        gain: 0.6
                    }
                ]
            },
            {
                name: 'Background',
                gain: 1.2,
                samples: [
                    {
                        audioId: audio2,
                        start: 0.0,
                        duration: 6.5,
                        offset: 0.0,
                        gain: 0.8
                    }
                ]
            }
        ]
    }
}

const postProject = name => chakram.post(projectEndpoint, {
    name: name
}, {
    headers: {
        'Authorization': getBasicCredentials()
    }
})

const getProjects = () => chakram.get(projectEndpoint, {
    headers: {
        'Authorization': getBasicCredentials()
    }
})

const getProject = id => chakram.get(projectEndpoint + '/' + id, {
    headers: {
        'Authorization': getBasicCredentials(),
        'Accept': 'application/json'
    }
})

const putProject = (id, project) => chakram.put(projectEndpoint + '/' + id, project, {
    headers: {
        'Authorization': getBasicCredentials()
    }
})

const deleteProject = id => chakram.delete(projectEndpoint + '/' + id, null, {
    headers: {
        'Authorization': getBasicCredentials()
    }
})

module.exports = { PROJECT_NAME_VALID_1, postProject, getProjects, getProject, putProject, deleteProject, projectUpdate1Producer }