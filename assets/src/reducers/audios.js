import { combineReducers } from 'redux'
import * as actions from '../actions/audios'
import audio from './audio'

const loading = (state = false, action) => {
    switch (action.type) {
        case actions.FETCH_AUDIOS_REQUESTED:
            return true
        case actions.FETCH_AUDIOS_ERROR:
        case actions.FETCH_AUDIOS_DONE:
            return false
        default:
            return state
    }
}

const error = (state = null, action) => {
    switch (action.type) {
        case actions.FETCH_AUDIOS_REQUESTED:
            return null
        case actions.FETCH_AUDIOS_ERROR:
            return action.payload
        default:
            return state
    }
}

const entries = (state = null, action) => {
    switch (action.type) {
        case actions.FETCH_AUDIOS_DONE:
            return action.payload.map(entry => audio(entry, {}))
        case actions.ADD_AUDIO_REQUESTED:
            return state ? [ ...state, audio(undefined, action) ] : state
        case actions.ADD_AUDIO_DONE:
            return state ? state.map(entry => entry.name === action.name ? audio(entry, action) : entry) : state
        case actions.ADD_AUDIO_ERROR:
            return state ? state.filter(entry => entry.name !== action.name) : state
        default:
            return state
    }
}

export default combineReducers({ loading, error, entries })

export const getAreAudiosLoading = (state) => {
    return state.loading
}