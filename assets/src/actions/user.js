import * as api from '../api'
import { getCredentials } from '../reducers'
import { addSuccessMessage, addErrorFromResponseCode } from './messages'

export const USER_GET_REQUEST = 'USER_GET_REQUEST'
export const USER_GET_DONE = 'USER_GET_DONE'
export const USER_GET_ERROR = 'USER_GET_ERROR'

export const USER_POST_REQUEST = 'USER_POST_REQUEST'
export const USER_POST_DONE = 'USER_POST_DONE'
export const USER_POST_ERROR = 'USER_POST_ERROR'

export const USER_PUT_REQUEST = 'USER_PUT_REQUEST'
export const USER_PUT_DONE = 'USER_PUT_DONE'
export const USER_PUT_ERROR = 'USER_PUT_ERROR'

export const USER_DELETE_REQUEST = 'USER_DELETE_REQUEST'
export const USER_DELETE_DONE = 'USER_DELETE_DONE'
export const USER_DELETE_ERROR = 'USER_DELETE_ERROR'

export const USER_LOGOUT = 'USER_LOGOUT'

export const getUser = (credentials) => (dispatch) => {
    dispatch({ type: USER_GET_REQUEST })
    return api.getUser(credentials).then(
        (payload) => {
            dispatch({ type: USER_GET_DONE, payload, credentials })
            addSuccessMessage('Zostałeś pomyślnie zalogowany')(dispatch)
        },
        (error) => {
            dispatch({ type: USER_GET_ERROR, error })
            addErrorFromResponseCode(error)(dispatch)
        }
    )
}

export const postUser = (form) => (dispatch) => {
    dispatch({ type: USER_POST_REQUEST })
    return api.postUser(form).then(
        (payload) => {
            dispatch({ type: USER_POST_DONE, payload, form })
            addSuccessMessage('Zostałeś pomyślnie zarejestrowany. Teraz możesz się zalogować')(dispatch)
        },
        (error) => {
            dispatch({ type: USER_POST_ERROR, error })
            addErrorFromResponseCode(error)(dispatch)
        }
    )
}

export const putUser = (form) => (dispatch, getState) => {
    const credentials = getCredentials(getState())
    dispatch({ type: USER_PUT_REQUEST })
    return api.putUser(credentials, form).then(
        (payload) => {
            dispatch({ type: USER_PUT_DONE, payload, form })
            addSuccessMessage('Dane profilowe zostały zaktualizowane')(dispatch)
        },
        (error) => {
            dispatch({ type: USER_PUT_ERROR, error })
            addErrorFromResponseCode(error)(dispatch)
        }
    )
}

export const deleteUser = () => (dispatch, getState) => {
    const credentials = getCredentials(getState())
    dispatch({ type: USER_DELETE_REQUEST })
    return api.deleteUser(credentials).then(
        (payload) => {
            dispatch({ type: USER_DELETE_DONE, payload })
            addSuccessMessage('Twój profil został usunięty')(dispatch)
        },
        (error) => {
            dispatch({ type: USER_DELETE_ERROR, error })
            addErrorFromResponseCode(error)(dispatch)
        }
    )
}

export const logout = () => (dispatch) => {
    dispatch({
        type: USER_LOGOUT
    })
    addSuccessMessage('Zostałeś pomyślnie wylogowany')(dispatch)
}