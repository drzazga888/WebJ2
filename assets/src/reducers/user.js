import { combineReducers } from 'redux'

import * as actions from '../actions/user'

const loaded = (state = true, action) => {
    switch (action.type) {
        case actions.USER_GET_REQUEST:
        case actions.USER_POST_REQUEST:
        case actions.USER_PUT_REQUEST:
        case actions.USER_DELETE_REQUEST:
            return false
        case actions.USER_GET_DONE:
        case actions.USER_GET_ERROR:
        case actions.USER_POST_DONE:
        case actions.USER_POST_ERROR:
        case actions.USER_PUT_DONE:
        case actions.USER_PUT_ERROR:
        case actions.USER_DELETE_DONE:
        case actions.USER_DELETE_ERROR:
        case actions.USER_LOGOUT:
            return true
        default:
            return state
    }
}

const error = (state = null, action) => {
    switch (action.type) {
        case actions.USER_GET_ERROR:
        case actions.USER_POST_ERROR:
        case actions.USER_PUT_ERROR:
        case actions.USER_DELETE_ERROR:
            return action.error
        case actions.USER_GET_REQUEST:
        case actions.USER_POST_REQUEST:
        case actions.USER_PUT_REQUEST:
        case actions.USER_DELETE_REQUEST:
        case actions.USER_LOGOUT:
            return null
        default:
            return state
    }
}

const fname = (state = null, action) => {
    switch (action.type) {
        case actions.USER_GET_DONE:
            return action.payload.fname
        case actions.USER_PUT_DONE:
            return action.form.fname
        case actions.USER_DELETE_DONE:
        case actions.USER_LOGOUT:
            return null
        default:
            return state
    }
}

const lname = (state = null, action) => {
    switch (action.type) {
        case actions.USER_GET_DONE:
            return action.payload.lname
        case actions.USER_PUT_DONE:
            return action.form.lname
        case actions.USER_DELETE_DONE:
        case actions.USER_LOGOUT:
            return null
        default:
            return state
    }
}

const email = (state = null, action) => {
    switch (action.type) {
        case actions.USER_GET_DONE:
            return action.credentials.email
        case actions.USER_PUT_DONE:
            return action.form.email
        case actions.USER_DELETE_DONE:
        case actions.USER_LOGOUT:
            return null
        default:
            return state
    }
}

const password = (state = null, action) => {
    switch (action.type) {
        case actions.USER_GET_DONE:
            return action.credentials.password
        case actions.USER_PUT_DONE:
            return action.form.password
        case actions.USER_DELETE_DONE:
        case actions.USER_LOGOUT:
            return null
        default:
            return state
    }
}

export default combineReducers({ loaded, error, fname, lname, email, password })

export const getCredentials = (state) => ({ email: state.email, password: state.password })
export const getUserLoaded = (state) => state.loaded
export const getUserEmail = (state) => state.email
export const getUserError = (state) => state.error