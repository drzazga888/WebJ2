import * as api from '../api'
import { getIsUserLoading, getCredentials } from '../reducers'
import * as messagesActions from '../actions/messages'
import * as messages from '../messages'

export const SIGN_IN_REQUESTED = "SIGN_IN_REQUESTED"
export const SIGN_IN_DONE = "SIGN_IN_DONE"
export const SIGN_IN_ERROR = "SIGN_IN_ERROR"
export const SIGN_UP_REQUESTED = "SIGN_UP_REQUESTED"
export const SIGN_UP_DONE = "SIGN_UP_DONE"
export const SIGN_UP_ERROR = "SIGN_UP_ERROR"
export const LOGOUT = "LOGOUT"
export const UPDATE_PROFILE_REQUESTED = "UPDATE_REQUESTED"
export const UPDATE_PROFILE_DONE = "UPDATE_DONE"
export const UPDATE_PROFILE_ERROR = "UPDATE_ERROR"
export const REMOVE_PROFILE_REQUESTED = "REMOVE_REQUESTED"
export const REMOVE_PROFILE_DONE = "REMOVE_DONE"
export const REMOVE_PROFILE_ERROR = "REMOVE_ERROR"

export const updateProfile = (formData) => (dispatch, getState) => {
    const state = getState()
    if (getIsUserLoading(state)) {
        return Promise.resolve()
    }
    dispatch({ type: UPDATE_PROFILE_REQUESTED })
    return api.putUser(getCredentials(state), formData).then(
        payload => {
            dispatch({ type: UPDATE_PROFILE_DONE, updatedData: formData })
            messagesActions.showMessage(messages.MESSAGE_PROFILE_UPDATED)(dispatch)
        },
        ({ payload, response }) => {
            dispatch({ type: UPDATE_PROFILE_ERROR, payload, statusCode: response.status })
            switch (response.status) {
                case 400:
                    messagesActions.showMessage(messages.MESSAGE_FORM_BAD_PARAMS)(dispatch)
                    break
                case 401:
                    messagesActions.showMessage(messages.MESSAGE_UNAUTHORIZED)(dispatch)
                    break
                case 409:
                    messagesActions.showMessage(messages.MESSAGE_USER_ALREADY_EXISTS)(dispatch)
                    break
                default:
                    messagesActions.showMessage(messages.MESSAGE_PROFILE_UPDATE_ERROR)(dispatch)
            }
        }
    )
}

export const removeProfile = () => (dispatch, getState) => {
    const state = getState()
    if (getIsUserLoading(state)) {
        return Promise.resolve()
    }
    dispatch({ type: REMOVE_PROFILE_REQUESTED })
    return api.deleteUser(getCredentials(state)).then(
        payload => {
            dispatch({ type: REMOVE_PROFILE_DONE })
            messagesActions.showMessage(messages.MESSAGE_PROFILE_REMOVED)(dispatch)
        },
        ({ payload, response }) => {
            dispatch({ type: REMOVE_PROFILE_ERROR, payload, statusCode: response.status })
            switch (response.status) {
                case 401:
                    messagesActions.showMessage(messages.MESSAGE_UNAUTHORIZED)(dispatch)
                    break
                default:
                    messagesActions.showMessage(messages.MESSAGE_PROFILE_REMOVE_ERROR)(dispatch)
            }
        }
    )
}

export const signIn = (credentials) => (dispatch, getState) => {
    const state = getState()
    if (getIsUserLoading(state)) {
        return Promise.resolve()
    }
    dispatch({ type: SIGN_IN_REQUESTED })
    return api.getUser(credentials).then(
        payload => dispatch({ type: SIGN_IN_DONE, payload, credentials }),
        ({ payload, response }) => {
            dispatch({ type: SIGN_IN_ERROR, payload, statusCode: response.status })
            switch (response.status) {
                case 401:
                    messagesActions.showMessage(messages.MESSAGE_LOGIN_BAD_CREDENTIALS)(dispatch)
                    break
                default:
                    messagesActions.showMessage(messages.MESSAGE_LOGIN_ERROR)(dispatch)
            }
        }
    )
}

export const signUp = (formData) => (dispatch, getState) => {
    const state = getState()
    if (getIsUserLoading(state)) {
        return Promise.resolve()
    }
    dispatch({ type: SIGN_UP_REQUESTED })
    return api.postUser(formData).then(
        payload => {
            dispatch({ type: SIGN_UP_DONE, payload })
            messagesActions.showMessage(messages.MESSAGE_JUST_REGISTERED)(dispatch)
        },
        ({ payload, response }) => {
            dispatch({ type: SIGN_UP_ERROR, payload, statusCode: response.status })
            switch (response.status) {
                case 400:
                    messagesActions.showMessage(messages.MESSAGE_FORM_BAD_PARAMS)(dispatch)
                    break
                case 409:
                    messagesActions.showMessage(messages.MESSAGE_USER_ALREADY_EXISTS)(dispatch)
                    break
                default:
                    messagesActions.showMessage(messages.MESSAGE_REGISTER_ERROR)(dispatch)
            }
        }
    )
}

export const logout = () => (dispatch) => {
    dispatch({
        type: LOGOUT
    })
    messagesActions.showMessage(messages.MESSAGE_LOGOUT)(dispatch)
}