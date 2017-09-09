const basePath = 'https://localhost:9443/webj2/api/'

const getBasicAuthorization = ({ email, password }) => `Basic ${btoa(`${email}:${password}`)}`

const jsonOrThrow = (response) => response.ok ? response.json() : Promise.reject(response.status)

const arrayBufferOrThrow = (response) => response.ok ? response.arrayBuffer() : Promise.reject(response.status)

const convertArrayBufferToBase64 = (content) => new Uint8Array(content).reduce((data, byte) => data + String.fromCharCode(byte), '')

const mergeArrayBufferWithForm = (form, content) => Object.assign({
    base64StringAudio: convertArrayBufferToBase64(content)
}, form)

// user

export const getUser = (credentials) => fetch(basePath + 'users/me', {
    headers: {
        'Authorization': getBasicAuthorization(credentials)
    },
    method: 'get'
}).then(jsonOrThrow)

export const postUser = (payload) => fetch(basePath + 'users', {
    headers: {
        'Content-Type': 'application/json'
    },
    method: 'post',
    body: JSON.stringify(payload)
}).then(jsonOrThrow)

export const putUser = (credentials, form) => fetch(basePath + 'users/me', {
    headers: {
        'Authorization': getBasicAuthorization(credentials),
        'Content-Type': 'application/json'
    },
    method: 'put',
    body: JSON.stringify(form)
}).then(jsonOrThrow)

export const deleteUser = (credentials) => fetch(basePath + 'users/me', {
    headers: {
        'Authorization': getBasicAuthorization(credentials)
    },
    method: 'delete'
}).then(jsonOrThrow)

// audios

export const getAudios = (credentials) => fetch(basePath + 'audios', {
    headers: {
        'Authorization': getBasicAuthorization(credentials)
    },
    method: 'get'
}).then(jsonOrThrow)

export const getAudio = (credentials, id) => fetch(basePath + 'audios/' + id, {
    headers: {
        'Authorization': getBasicAuthorization(credentials)
    },
    method: 'get'
}).then(arrayBufferOrThrow)

export const postAudio = (credentials, form, content) => fetch(basePath + 'audios', {
    headers: {
        'Authorization': getBasicAuthorization(credentials)
    },
    method: 'post',
    body: JSON.stringify(mergeArrayBufferWithForm(form, content))
}).then(jsonOrThrow)

export const patchAudio = (credentials, id, form) => fetch(basePath + 'audios/' + id, {
    headers: {
        'Authorization': getBasicAuthorization(credentials)
    },
    method: 'patch',
    body: JSON.stringify(form)
}).then(jsonOrThrow)

export const deleteAudio = (credentials, id) => fetch(basePath + 'audios/' + id, {
    headers: {
        'Authorization': getBasicAuthorization(credentials)
    },
    method: 'delete'
}).then(jsonOrThrow)

// projects

export const getProjects = (credentials) => fetch(basePath + 'projects', {
    headers: {
        'Authorization': getBasicAuthorization(credentials)
    },
    method: 'get'
}).then(jsonOrThrow)

export const getProject = (credentials, id) => fetch(basePath + 'projects/' + id, {
    headers: {
        'Authorization': getBasicAuthorization(credentials)
    },
    method: 'get'
}).then(jsonOrThrow)

export const postProject = (credentials, form) => fetch(basePath + 'projects', {
    headers: {
        'Authorization': getBasicAuthorization(credentials),
        'Content-Type': 'application/json'
    },
    method: 'post',
    body: JSON.stringify(form)
}).then(jsonOrThrow)

export const putProject = (credentials, id, form) => fetch(basePath + 'projects/' + id, {
    headers: {
        'Authorization': getBasicAuthorization(credentials),
        'Content-Type': 'application/json'
    },
    method: 'put',
    body: JSON.stringify(form)
}).then(jsonOrThrow)

export const patchProject = (credentials, id, form) => fetch(basePath + 'projects/' + id, {
    headers: {
        'Authorization': getBasicAuthorization(credentials),
        'Content-Type': 'application/json'
    },
    method: 'patch',
    body: JSON.stringify(form)
}).then(jsonOrThrow)

export const deleteProject = (credentials, id) => fetch(basePath + 'projects/' + id, {
    headers: {
        'Authorization': getBasicAuthorization(credentials)
    },
    method: 'delete'
}).then(jsonOrThrow)