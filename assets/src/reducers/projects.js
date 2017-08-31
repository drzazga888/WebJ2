import { combineReducers } from 'redux'

import * as projectsActions from '../actions/projects'
import project from './project'

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

const entries = (state = null, action) => {
    switch (action.type) {
        case projectsActions.FETCH_PROJECTS_DONE:
            return action.payload.map(entry => project(undefined, { type: action.type, payload: entry }))
        case projectsActions.CREATE_PROJECT_REQUESTED:
            return state ? [ ...state, project(undefined, action) ] : state
        case projectsActions.CREATE_PROJECT_DONE:
            return state ? state.map(entry => entry.name === action.name ? project(entry, action) : entry) : state
        case projectsActions.CREATE_PROJECT_ERROR:
            return state ? state.filter(entry => entry.name !== action.name) : state
        case projectsActions.UPDATE_PROJECT_REQUESTED:
        case projectsActions.UPDATE_PROJECT_DONE:
        case projectsActions.UPDATE_PROJECT_ERROR:
        case projectsActions.DELETE_PROJECT_REQUESTED:
        case projectsActions.DELETE_PROJECT_ERROR:
            return state ? state.map(entry => entry.id === action.id ? project(entry, action) : entry) : state
        case projectsActions.DELETE_PROJECT_DONE:
            return state ? state.filter(entry => entry.id !== action.id) : state
        case projectsActions.CLEAN_PROJECTS:
            return null
        default:
            return state
    }
}

export default combineReducers({ loading, error, entries })

export const getAreProjectsLoading = (state) => {
    return state.loading
}

export const getProjectById = (state, id) => {
    return (state.entries && state.entries.filter(entry => entry.id === id).shift()) || null
}