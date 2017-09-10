import { combineReducer } from 'redux'

import * as actions from '../actions/projects'

const loaded = (state = true, action) => {
    switch (action.type) {
        case actions.PROJECT_POST_REQUEST:
        case actions.PROJECT_PATCH_REQUEST:
        case actions.PROJECT_DELETE_REQUEST:
            return false
        case actions.PROJECT_POST_DONE:
        case actions.PROJECT_POST_ERROR:
        case actions.PROJECT_PATCH_DONE:
        case actions.PROJECT_PATCH_ERROR:
        case actions.PROJECT_DELETE_ERROR:
            return true
        default:
            return state
    }
}

const error = (state = null, action) => {
    switch (action.type) {
        case actions.PROJECT_POST_ERROR:
        case actions.PROJECT_PATCH_ERROR:
        case actions.PROJECT_DELETE_ERROR:
            return action.error
        case actions.PROJECT_POST_REQUEST:
        case actions.PROJECT_PATCH_REQUEST:
        case actions.PROJECT_DELETE_REQUEST:
            return null
        default:
            return state
    }
}

const id = (state = null, action) => {
    switch (action.type) {
        case actions.PROJECT_POST_DONE:
            return action.payload.id
        default:
            return state
    }
}

const name = (state = null, action) => {
    switch (action.type) {
        case actions.PROJECT_PATCH_DONE:
        case actions.PROJECT_POST_DONE:
            return action.form.name
        default:
            return state
    }
}

const duration = (state = null, action) => {
    switch (action.type) {
        case actions.PROJECT_POST_DONE:
            return 0
        default:
            return state
    }
}

const createdAt = (state = null, action) => {
    switch (action.type) {
        case actions.PROJECT_POST_DONE:
            return action.payload.createdAt
        default:
            return state
    }
}

const updatedAt = (state = null, action) => {
    switch (action.type) {
        case actions.PROJECT_POST_DONE:
        case actions.PROJECT_PATCH_DONE:
            return action.payload.updatedAt
        default:
            return state
    }
}

export default combineReducer({ loaded, error, id, name, duration, createdAt, updatedAt })