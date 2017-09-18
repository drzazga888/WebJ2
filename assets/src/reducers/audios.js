import { combineReducers } from 'redux'

import * as actions from '../actions/audios'
import * as userActions from '../actions/user'
import audioListItem, * as fromAudioListItem from './audio-list-item'

const loaded = (state = true, action) => {
    switch (action.type) {
        case actions.AUDIOS_GET_REQUEST:
        case actions.AUDIO_POST_REQUEST:
            return false
        case actions.AUDIOS_GET_DONE:
        case actions.AUDIOS_GET_ERROR:
        case actions.AUDIO_POST_DONE:
        case actions.AUDIO_POST_ERROR:
        case userActions.USER_DELETE_DONE:
        case userActions.USER_LOGOUT:
            return true
        default:
            return state
    }
}

const error = (state = null, action) => {
    switch (action.type) {
        case actions.AUDIOS_GET_ERROR:
            return action.error
        case actions.AUDIOS_GET_REQUEST:
        case userActions.USER_DELETE_DONE:
        case userActions.USER_LOGOUT:
            return null
        default:
            return state
    }
}

const entries = (state = null, action) => {
    switch (action.type) {
        case actions.AUDIOS_GET_DONE:
            return action.payload.map(entry => audioListItem(entry, {}))
        case actions.AUDIO_POST_DONE:
            return [ ...(state || []), audioListItem(undefined, action) ]
        case actions.AUDIO_PATCH_DONE:
        case actions.AUDIO_PATCH_REQUEST:
        case actions.AUDIO_PATCH_ERROR:
        case actions.AUDIO_DELETE_REQUEST:
        case actions.AUDIO_DELETE_ERROR:
        case actions.AUDIO_GET_DONE:
        case actions.AUDIO_GET_REQUEST:
        case actions.AUDIO_GET_ERROR:
            return state ? state.map(entry => entry.id === action.id ? audioListItem(entry, action) : entry) : state
        case actions.AUDIO_DELETE_DONE:
            return state ? state.filter(entry => entry.id !== action.id) : state
        case userActions.USER_DELETE_DONE:
        case userActions.USER_LOGOUT:
            return null
        default:
            return state
    }
}

export default combineReducers({ loaded, error, entries })

export const getAudiosEntries = (state) => state.entries
export const getAudiosLoaded = (state) => state.loaded
export const getAudiosError = (state) => state.error
export const getAudioContent = (id, state) => {
    const found = state.entries ? state.entries.filter(entry => entry.id === id).shift() : null
    return found ? fromAudioListItem.getAudioContent(found) : null
}