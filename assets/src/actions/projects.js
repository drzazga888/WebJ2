import * as api from '../api'
import { getCrendentials } from '../reducers'
import { addSuccessMessage, addErrorFromResponseCode } from './messages'

export const PROJECTS_GET_REQUEST = 'PROJECTS_GET_REQUEST'
export const PROJECTS_GET_DONE = 'PROJECTS_GET_DONE'
export const PROJECTS_GET_ERROR = 'PROJECTS_GET_ERROR'

export const PROJECT_GET_REQUEST = 'PROJECT_GET_REQUEST'
export const PROJECT_GET_DONE = 'PROJECT_GET_DONE'
export const PROJECT_GET_ERROR = 'PROJECT_GET_ERROR'

export const PROJECT_POST_REQUEST = 'PROJECT_POST_REQUEST'
export const PROJECT_POST_DONE = 'PROJECT_POST_DONE'
export const PROJECT_POST_ERROR = 'PROJECT_POST_ERROR'

export const PROJECT_PATCH_REQUEST = 'PROJECT_PATCH_REQUEST'
export const PROJECT_PATCH_DONE = 'PROJECT_PATCH_DONE'
export const PROJECT_PATCH_ERROR = 'PROJECT_PATCH_ERROR'

export const PROJECT_PUT_REQUEST = 'PROJECT_PUT_REQUEST'
export const PROJECT_PUT_DONE = 'PROJECT_PUT_DONE'
export const PROJECT_PUT_ERROR = 'PROJECT_PUT_ERROR'

export const PROJECT_DELETE_REQUEST = 'PROJECT_DELETE_REQUEST'
export const PROJECT_DELETE_DONE = 'PROJECT_DELETE_DONE'
export const PROJECT_DELETE_ERROR = 'PROJECT_DELETE_ERROR'

export const getProjects = () => (dispatch) => {
    const credentials = getCrendentials(getState())
    dispatch({ type: PROJECTS_GET_REQUEST })
    api.getProjects(credentials).then(
        (payload) => dispatch({ type: PROJECTS_GET_DONE, payload }),
        (error) => dispatch({ type: PROJECTS_GET_ERROR, error })
    )
}

export const getProject = (id) => (dispatch) => {
    const credentials = getCrendentials(getState())
    dispatch({ type: PROJECT_GET_REQUEST })
    api.getProject(credentials, id).then(
        (payload) => dispatch({ type: PROJECT_GET_DONE, payload, id }),
        (error) => dispatch({ type: PROJECT_GET_ERROR, error, id })
    )
}

export const postProject = (form) => (dispatch, getState) => {
    const credentials = getCrendentials(getState())
    dispatch({ type: PROJECT_POST_REQUEST })
    api.postProject(credentials, form).then(
        (payload) => {
            dispatch({ type: PROJECT_POST_DONE, payload, form })
            addSuccessMessage('Projekt został utworzony')
        },
        (error) => {
            dispatch({ type: PROJECT_POST_ERROR, error })
            addErrorFromResponseCode(error)
        }
    )
}

export const patchProject = (form, id) => (dispatch, getState) => {
    const credentials = getCrendentials(getState())
    dispatch({ type: PROJECT_PATCH_REQUEST })
    api.patchProject(credentials, id, form).then(
        (payload) => {
            dispatch({ type: PROJECT_PATCH_DONE, payload, form, id })
            addSuccessMessage(`Nazwa projektu ${id} została zmieniona`)
        },
        (error) => {
            dispatch({ type: PROJECT_PATCH_ERROR, error, id })
            addErrorFromResponseCode(error)
        }
    )
}

export const putProject = (form, id) => (dispatch, getState) => {
    const credentials = getCrendentials(getState())
    dispatch({ type: PROJECT_PUT_REQUEST })
    api.putProject(credentials, id, form).then(
        (payload) => {
            dispatch({ type: PROJECT_PUT_DONE, payload, form, id })
            addSuccessMessage(`Projekt ${id} został zaktualizowany`)
        },
        (error) => {
            dispatch({ type: PROJECT_PUT_ERROR, error, id })
            addErrorFromResponseCode(error)
        }
    )
}

export const deleteProject = (id) => (dispatch, getState) => {
    const credentials = getCrendentials(getState())
    dispatch({ type: PROJECT_DELETE_REQUEST })
    api.deleteProject(credentials, id).then(
        (payload) => {
            dispatch({ type: PROJECT_DELETE_DONE, payload, id })
            addSuccessMessage(`Projekt ${id} został usunięty`)
        },
        (error) => {
            dispatch({ type: PROJECT_DELETE_ERROR, error, id })
            addErrorFromResponseCode(error)
        }
    )
}
