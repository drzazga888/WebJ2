import { combineReducers } from 'redux'

import * as userActions from '../actions/user'

const loading = (state = false, action) => {
    switch (action.type) {
        case userActions.SIGN_IN_REQUESTED:
        case userActions.SIGN_UP_REQUESTED:
        case userActions.UPDATE_PROFILE_REQUESTED:
        case userActions.REMOVE_PROFILE_REQUESTED:
            return true
        case userActions.SIGN_IN_DONE:
        case userActions.SIGN_IN_ERROR:
        case userActions.SIGN_UP_DONE:
        case userActions.SIGN_UP_ERROR:
        case userActions.UPDATE_PROFILE_DONE:
        case userActions.UPDATE_PROFILE_ERROR:
        case userActions.REMOVE_PROFILE_DONE:
        case userActions.REMOVE_PROFILE_ERROR:
            return false
        default:
            return state
    }
}

const credentials = (state = null, action) => {
    switch (action.type) {
        case userActions.SIGN_IN_DONE:
            return action.credentials
        case userActions.UPDATE_PROFILE_DONE:
            return {
                email: action.updatedData.email,
                password: action.updatedData.password
            }
        case userActions.LOGOUT:
        case userActions.REMOVE_PROFILE_DONE:
            return null
        default:
            return state
    }
}

const details = (state = null, action) => {
    switch (action.type) {
        case userActions.SIGN_IN_DONE:
            return action.payload
        case userActions.UPDATE_PROFILE_DONE:
            return {
                fname: action.updatedData.fname,
                lname: action.updatedData.lname
            }
        case userActions.LOGOUT:
        case userActions.REMOVE_PROFILE_DONE:
            return null
        default:
            return state
    }
}

export default combineReducers({ loading, credentials, details })

export const getIsUserLoading = (state) => {
    return state.loading
}

export const getCredentials = (state) => {
    return state.credentials
}