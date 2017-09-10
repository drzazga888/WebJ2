import { combineReducer } from 'redux'

import * as actions from '../actions/projects'
import * as userActions from '../actions/user'
import projectListItem from './project-list-item'

const loaded = (state = true, action) => {
    switch (action.type) {
        case actions.PROJECTS_GET_REQUEST:
            return false
        case actions.PROJECTS_GET_DONE:
        case actions.PROJECT_DELETE_ERROR:
        case userActions.USER_DELETE_DONE:
        case userActions.USER_LOGOUT:
            return true
        default:
            return state
    }
}

const error = (state = null, action) => {
    switch (action.type) {
        case actions.PROJECTS_GET_ERROR:
            return action.error
        case actions.PROJECT_DELETE_REQUEST:
        case userActions.USER_DELETE_DONE:
        case userActions.USER_LOGOUT:
            return null
        default:
            return state
    }
}

const entries = (state = null, action) => {
    switch (action.type) {
        case actions.PROJECTS_GET_DONE:
            return action.payload.map(entry => projectListItem(entry))
        case actions.PROJECT_POST_REQUEST:
        case actions.PROJECT_POST_DONE:
        case actions.PROJECT_POST_ERROR:
        case actions.PROJECT_PATCH_REQUEST:
        case actions.PROJECT_PATCH_DONE:
        case actions.PROJECT_PATCH_ERROR:
        case actions.PROJECT_DELETE_REQUEST:
        case actions.PROJECT_DELETE_ERROR:
            return state ? state.map(entry => entry.id === action.id ? projectListItem(entry, action) : entry) : state
        case actions.PROJECT_DELETE_DONE:
            return state ? state.filter(entry => entry.id !== action.id) : state
        case userActions.USER_DELETE_DONE:
        case userActions.USER_LOGOUT:
            return null
        default:
            return state
    }
}

export default combineReducer({ loaded, error, entries })