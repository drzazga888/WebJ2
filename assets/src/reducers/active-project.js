import { combineReducers } from 'redux'

import * as actions from '../actions/active-project'
import * as userActions from '../actions/user'

const loaded = (state = true, action) => {
    switch (action.type) {
        case actions.PROJECT_GET_REQUEST:
        case actions.PROJECT_PUT_REQUEST:
            return false
        case actions.PROJECT_GET_DONE:
        case actions.PROJECT_GET_ERROR:
        case actions.PROJECT_PUT_DONE:
        case actions.PROJECT_PUT_ERROR:
        case userActions.USER_DELETE_DONE:
        case userActions.USER_LOGOUT:
            return true
        default:
            return state
    }
}

const error = (state = null, action) => {
    switch (action.type) {
        case actions.PROJECT_GET_ERROR:
        case actions.PROJECT_PUT_ERROR:
            return action.error
        case actions.PROJECT_GET_REQUEST:
        case actions.PROJECT_PUT_REQUEST:
        case userActions.USER_DELETE_DONE:
        case userActions.USER_LOGOUT:
            return null
        default:
            return state
    }
}

const id = (state = null, action) => {
    switch (action.type) {
        case actions.PROJECT_GET_DONE:
            return action.id
        case userActions.USER_DELETE_DONE:
        case userActions.USER_LOGOUT:
            return null
        default:
            return state
    }
}

const data = (state = null, action) => {
    switch (action.type) {
        case actions.PROJECT_GET_DONE:
            return action.payload
        case actions.PROJECT_PUT_DONE:
            return action.form
        case userActions.USER_DELETE_DONE:
        case userActions.USER_LOGOUT:
            return null
        default:
            return state
    }
}

export default combineReducers({ loaded, error, id, data })

export const getActiveProjectId = (state) => state.id