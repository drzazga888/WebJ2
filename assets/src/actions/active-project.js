import * as api from '../api'
import { getCredentials, getActiveProjectId } from '../reducers'
import { addSuccessMessage, addErrorFromResponseCode } from './messages'

export const PROJECT_GET_REQUEST = 'PROJECT_GET_REQUEST'
export const PROJECT_GET_DONE = 'PROJECT_GET_DONE'
export const PROJECT_GET_ERROR = 'PROJECT_GET_ERROR'

export const PROJECT_PUT_REQUEST = 'PROJECT_PUT_REQUEST'
export const PROJECT_PUT_DONE = 'PROJECT_PUT_DONE'
export const PROJECT_PUT_ERROR = 'PROJECT_PUT_ERROR'

export const getProject = (id) => (dispatch, getState) => {
    const credentials = getCredentials(getState())
    dispatch({ type: PROJECT_GET_REQUEST })
    return api.getProject(credentials, id).then(
        (payload) => dispatch({ type: PROJECT_GET_DONE, payload, id }),
        (error) => dispatch({ type: PROJECT_GET_ERROR, error, id })
    )
}

export const putActiveProject = (form) => (dispatch, getState) => {
    const state = getState()
    const credentials = getCredentials(state)
    const id = getActiveProjectId(state)
    if (!id) {
        throw new Error('You need to fetch project firstly before update')
    }
    dispatch({ type: PROJECT_PUT_REQUEST })
    return api.putProject(credentials, id, form).then(
        (payload) => {
            dispatch({ type: PROJECT_PUT_DONE, payload, form })
            addSuccessMessage(`Projekt ${id} został zaktualizowany`)(dispatch)
        },
        (error) => {
            dispatch({ type: PROJECT_PUT_ERROR, error })
            addErrorFromResponseCode(error)(dispatch)
        }
    )
}

export const getProjectAudio = () => (dispatch, getState) => {
    const state = getState()
    const credentials = getCredentials(state)
    const id = getActiveProjectId(state)
    return api.getProjectAudio(credentials, id)
}