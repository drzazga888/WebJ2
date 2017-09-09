import * as api from '../api'
import { getCrendentials } from '../reducers'
import { addSuccessMessage, addErrorFromResponseCode } from './messages'

export const AUDIOS_GET_REQUEST = 'AUDIOS_GET_REQUEST'
export const AUDIOS_GET_DONE = 'AUDIOS_GET_DONE'
export const AUDIOS_GET_ERROR = 'AUDIOS_GET_ERROR'

export const AUDIO_GET_REQUEST = 'AUDIO_GET_REQUEST'
export const AUDIO_GET_DONE = 'AUDIO_GET_DONE'
export const AUDIO_GET_ERROR = 'AUDIO_GET_ERROR'

export const AUDIO_POST_REQUEST = 'AUDIO_POST_REQUEST'
export const AUDIO_POST_DONE = 'AUDIO_POST_DONE'
export const AUDIO_POST_ERROR = 'AUDIO_POST_ERROR'

export const AUDIO_PATCH_REQUEST = 'AUDIO_PATCH_REQUEST'
export const AUDIO_PATCH_DONE = 'AUDIO_PATCH_DONE'
export const AUDIO_PATCH_ERROR = 'AUDIO_PATCH_ERROR'

export const AUDIO_DELETE_REQUEST = 'AUDIO_DELETE_REQUEST'
export const AUDIO_DELETE_DONE = 'AUDIO_DELETE_DONE'
export const AUDIO_DELETE_ERROR = 'AUDIO_DELETE_ERROR'

export const getAudios = () => (dispatch) => {
    const credentials = getCrendentials(getState())
    dispatch({ type: AUDIOS_GET_REQUEST })
    api.getAudios(credentials).then(
        (payload) => dispatch({ type: AUDIOS_GET_DONE, payload }),
        (error) => dispatch({ type: AUDIOS_GET_ERROR, error })
    )
}

export const getAudio = (id) => (dispatch) => {
    const credentials = getCrendentials(getState())
    dispatch({ type: AUDIO_GET_REQUEST })
    api.getAudio(credentials, id).then(
        (payload) => dispatch({ type: AUDIO_GET_DONE, payload, id }),
        (error) => dispatch({ type: AUDIO_GET_ERROR, error, id })
    )
}

export const postAudio = (form, content) => (dispatch, getState) => {
    const credentials = getCrendentials(getState())
    dispatch({ type: AUDIO_POST_REQUEST })
    api.postAudio(credentials, form, content).then(
        (payload) => {
            dispatch({ type: AUDIO_POST_DONE, payload, form, content })
            addSuccessMessage('Nowy plik audio został pomyślnie utworzony')
        },
        (error) => {
            dispatch({ type: AUDIO_POST_ERROR, error })
            addErrorFromResponseCode(error)
        }
    )
}

export const patchAudio = (form, id) => (dispatch, getState) => {
    const credentials = getCrendentials(getState())
    dispatch({ type: AUDIO_PATCH_REQUEST })
    api.patchAudio(credentials, id, form).then(
        (payload) => {
            dispatch({ type: AUDIO_PATCH_DONE, payload, form, id })
            addSuccessMessage(`Plik audio ${id} został pomyślnie zaktualizowany`)
        },
        (error) => {
            dispatch({ type: AUDIO_PATCH_ERROR, error, id })
            addErrorFromResponseCode(error)
        }
    )
}

export const deleteAudio = (id) => (dispatch, getState) => {
    const credentials = getCrendentials(getState())
    dispatch({ type: AUDIO_DELETE_REQUEST })
    api.deleteAudio(credentials, id).then(
        (payload) => {
            dispatch({ type: AUDIO_DELETE_DONE, payload, id })
            addSuccessMessage(`Plik audio ${id} został właśnie usunięty`)
        },
        (error) => {
            dispatch({ type: AUDIO_DELETE_ERROR, error, id })
            addErrorFromResponseCode(error)
        }
    )
}
