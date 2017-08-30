import { combineReducers } from 'redux'

import * as projectsActions from '../actions/projects'

const loading = (state = false, action) => {
    switch (action.type) {
        case projectsActions.FETCH_PROJECTS_REQUESTED:
            return true
        case projectsActions.FETCH_PROJECTS_DONE:
        case projectsActions.FETCH_PROJECTS_ERROR:
            return false
        default:
            return state
    }
}

const error = (state = null, action) => {
    switch (action.type) {
        case projectsActions.FETCH_PROJECTS_REQUESTED:
            return null
        case projectsActions.FETCH_PROJECTS_ERROR:
            return { payload: action.payload, statusCode: action.statusCode }
        default:
            return state
    }
}

const id = (state = null, action) => {
    switch (action.type) {
        case projectsActions.FETCH_PROJECTS_DONE:
            return action.payload.id
        default:
            return state
    }
}

const name = (state = null, action) => {
    switch (action.type) {
        case projectsActions.FETCH_PROJECTS_DONE:
            return action.payload.name
        default:
            return state
    }
}

const duration = (state = null, action) => {
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
            return action.payload.createdAt
        default:
            return state
    }
}

const updatedAt = (state = null, action) => {
    switch (action.type) {
        case projectsActions.FETCH_PROJECTS_DONE:
            return action.payload.updatedAt
        default:
            return state
    }
}

const project = combineReducers({ id, name, duration, createdAt, updatedAt })

const entries = (state = [], action) => {
    switch (action.type) {
        case projectsActions.FETCH_PROJECTS_DONE:
            return action.payload.map(entry => project(undefined, { type: action.type, payload: entry }))
        default:
            return state
    }
}

export default combineReducers({ loading, error, entries })

export const getAreProjectsLoading = (state) => {
    return state.loading
}