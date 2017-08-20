const chakram = require('chakram')
const { apiPath, getBasicCredentials } = require('./general')

const projectEndpoint = apiPath + 'projects'

const PROJECT_NAME_VALID_1 = "My cool project"

const postProject = name => chakram.post(projectEndpoint, {
    name: name
}, {
    headers: {
        'Authorization': getBasicCredentials(),
        'Content-Type': 'application/json'
    }
})

const getProjects = () => chakram.get(projectEndpoint, {
    headers: {
        'Authorization': getBasicCredentials()
    }
})

const getProject = id => chakram.get(projectEndpoint + '/' + id, {
    headers: {
        'Authorization': getBasicCredentials()
    }
})

module.exports = { PROJECT_NAME_VALID_1, postProject, getProjects, getProject }