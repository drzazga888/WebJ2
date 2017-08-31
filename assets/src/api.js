import { basePath } from './constants'

const getBasicAuthorization = ({ email, password }) => `Basic ${btoa(`${email}:${password}`)}`

const jsonOrThrow = (response) => response.json().then(payload => response.ok ? payload : Promise.reject({ payload, response }))

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

export const getProjects = (credentials) => fetch(basePath + 'projects', {
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