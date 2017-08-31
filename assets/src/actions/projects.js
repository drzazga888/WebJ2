import { getAreProjectsLoading, getCredentials, getProjectById } from '../reducers'
import * as api from '../api'
import * as messagesActions from '../actions/messages'
import * as messages from '../messages'

export const FETCH_PROJECTS_REQUESTED = 'FETCH_PROJECTS_REQUESTED'
export const FETCH_PROJECTS_DONE = 'FETCH_PROJECTS_DONE'
export const FETCH_PROJECTS_ERROR = 'FETCH_PROJECTS_ERROR'
export const CREATE_PROJECT_REQUESTED = 'CREATE_PROJECT_REQUESTED'
export const CREATE_PROJECT_DONE = 'CREATE_PROJECT_DONE'
export const CREATE_PROJECT_ERROR = 'CREATE_PROJECT_ERROR'
export const UPDATE_PROJECT_REQUESTED = 'UPDATE_PROJECT_REQUESTED'
export const UPDATE_PROJECT_DONE = 'UPDATE_PROJECT_DONE'
export const UPDATE_PROJECT_ERROR = 'UPDATE_PROJECT_ERROR'
export const DELETE_PROJECT_REQUESTED = 'DELETE_PROJECT_REQUESTED'
export const DELETE_PROJECT_DONE = 'DELETE_PROJECT_DONE'
export const DELETE_PROJECT_ERROR = 'DELETE_PROJECT_ERROR'
export const CLEAN_PROJECTS = 'CLEAN_PROJECTS'

export const fetchProjects = () => (dispatch, getState) => {
    const state = getState()
    if (getAreProjectsLoading(state)) {
        return Promise.resolve()
    }
    dispatch({ type: FETCH_PROJECTS_REQUESTED })
    return api.getProjects(getCredentials(state)).then(
        payload => dispatch({ type: FETCH_PROJECTS_DONE, payload }),
        ({ payload, response }) => dispatch({ type: FETCH_PROJECTS_ERROR, payload, statusCode: response.status })
    )
}

export const createProject = (formData) => (dispatch, getState) => {
    const state = getState()
    if (getAreProjectsLoading(state)) {
        return Promise.resolve()
    }
    dispatch({ type: CREATE_PROJECT_REQUESTED, formData })
    return api.postProject(getCredentials(state), formData).then(
        payload => {
            dispatch({ type: CREATE_PROJECT_DONE, payload, name: formData.name })
            messagesActions.showMessage(messages.MESSAGE_PROJECT_CREATED)(dispatch)
        },
        ({ payload, response }) => {
            dispatch({ type: CREATE_PROJECT_ERROR, payload, statusCode: response.status, name: formData.name })
            switch (response.status) {
                case 400:
                    messagesActions.showMessage(messages.MESSAGE_FORM_BAD_PARAMS)(dispatch)
                    break
                case 401:
                    messagesActions.showMessage(messages.MESSAGE_UNAUTHORIZED)(dispatch)
                    break
                case 409:
                    messagesActions.showMessage(messages.MESSAGE_PROJECT_NAME_CONFLICT)(dispatch)
                    break
                default:
                    messagesActions.showMessage(messages.MESSAGE_PROJECT_UPDATE_ERROR)(dispatch)
            }
        }
    )
}

export const updateProject = (id, formData) => (dispatch, getState) => {
    const state = getState()
    if (getAreProjectsLoading(state)) {
        return Promise.resolve()
    }
    dispatch({ type: UPDATE_PROJECT_REQUESTED, id, formData })
    return api.patchProject(getCredentials(state), id, formData).then(
        payload => {
            dispatch({ type: UPDATE_PROJECT_DONE, id })
            messagesActions.showMessage(messages.MESSAGE_PROFILE_UPDATED)(dispatch)
        },
        ({ payload, response }) => {
            dispatch({ type: UPDATE_PROJECT_ERROR, payload, statusCode: response.status, id, prevData: getProjectById(state, id) })
        }
    )
}

export const deleteProject = (id) => (dispatch, getState) => {
    const state = getState()
    if (getAreProjectsLoading(state)) {
        return Promise.resolve()
    }
    dispatch({ type: DELETE_PROJECT_REQUESTED, id })
    return api.deleteProject(getCredentials(state), id).then(
        payload => {
            dispatch({ type: DELETE_PROJECT_DONE, id })
        },
        ({ payload, response }) => {
            dispatch({ type: DELETE_PROJECT_ERROR, id })
        }
    )
}

export const cleanProjects = () => ({
    type: CLEAN_PROJECTS
})