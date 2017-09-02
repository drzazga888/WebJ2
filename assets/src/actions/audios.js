import * as api from '../api'
import { getAreAudiosLoading, getCredentials } from '../reducers'

export const FETCH_AUDIOS_REQUESTED = 'FETCH_AUDIOS_REQUESTED'
export const FETCH_AUDIOS_DONE = 'FETCH_AUDIOS_DONE'
export const FETCH_AUDIOS_ERROR = 'FETCH_AUDIOS_ERROR'
export const ADD_AUDIO_REQUESTED = 'ADD_AUDIO_REQUESTED'
export const ADD_AUDIO_DONE = 'ADD_AUDIO_DONE'
export const ADD_AUDIO_ERROR = 'ADD_AUDIO_ERROR'

export const fetchAudios = () => (dispatch, getState) => {
    const state = getState()
    if (getAreAudiosLoading(state)) {
        return Promise.reject()
    }
    dispatch({ type: FETCH_AUDIOS_REQUESTED })
    return api.fetchAudios(getCredentials(state)).then(
        payload => {
            dispatch({ type: FETCH_AUDIOS_DONE, payload })
        },
        ({ payload, response }) => {
            dispatch({ type: FETCH_AUDIOS_ERROR, payload, statusCode: response.status })
        }
    )
}

export const addAudio = (formData, content) => (dispatch, getState) => {
    const state = getState()
    dispatch({ type: ADD_AUDIO_REQUESTED, name: formData.name, content })
    return api.postAudio(getCredentials(state), formData, content).then(
        payload => {
            dispatch({ type: ADD_AUDIO_DONE, payload, name: formData.name })
        },
        ({ payload, response }) => {
            dispatch({ type: ADD_AUDIO_ERROR, payload, statusCode: response.status, name: formData.name  })
        }
    )
}