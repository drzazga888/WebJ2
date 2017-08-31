import { combineReducers } from 'redux'

import * as projectsActions from '../actions/projects'

const loaded = (state = true, action) => {
    switch (action.type) {
        case projectsActions.CREATE_PROJECT_REQUESTED:
        case projectsActions.UPDATE_PROJECT_REQUESTED:
        case projectsActions.DELETE_PROJECT_REQUESTED:
            return false
        case projectsActions.CREATE_PROJECT_DONE:
        case projectsActions.CREATE_PROJECT_ERROR:
        case projectsActions.UPDATE_PROJECT_DONE:
        case projectsActions.UPDATE_PROJECT_ERROR:
        case projectsActions.DELETE_PROJECT_DONE:
        case projectsActions.DELETE_PROJECT_ERROR:
            return true
        default:
            return state
    }
}

const id = (state = null, action) => {
    switch (action.type) {
        case projectsActions.FETCH_PROJECTS_DONE:
        case projectsActions.CREATE_PROJECT_DONE:
            return action.payload.id
        default:
            return state
    }
}

const name = (state = null, action) => {
    switch (action.type) {
        case projectsActions.FETCH_PROJECTS_DONE:
            return action.payload.name
        case projectsActions.CREATE_PROJECT_REQUESTED:
        case projectsActions.UPDATE_PROJECT_REQUESTED:
            return action.formData.name
        case projectsActions.UPDATE_PROJECT_ERROR:
            return action.prevData.name
        default:
            return state
    }
}

const duration = (state = 0, action) => {
    switch (action.type) {
        case projectsActions.FETCH_PROJECTS_DONE:
            return action.payload.duration
        default:
            return state
    }
}

const createdAt = (state = null, action) => {
    switch (action.type) {
        case projectsActions.FETCH_PROJECTS_DONE:
        case projectsActions.CREATE_PROJECT_DONE:
            return action.payload.createdAt
        default:
            return state
    }
}

const updatedAt = (state = null, action) => {
    switch (action.type) {
        case projectsActions.FETCH_PROJECTS_DONE:
        case projectsActions.CREATE_PROJECT_DONE:
            return action.payload.updatedAt
        default:
            return state
    }
}

export default combineReducers({ loaded, id, name, duration, createdAt, updatedAt })