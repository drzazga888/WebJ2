import { combineReducers } from 'redux'

import * as actions from '../actions/audios'

const loaded = (state = true, action) => {
    switch (action.type) {
        case actions.AUDIO_POST_REQUEST:
        case actions.AUDIO_PATCH_REQUEST:
        case actions.AUDIO_DELETE_REQUEST:
            return false
        case actions.AUDIO_POST_DONE:
        case actions.AUDIO_POST_ERROR:
        case actions.AUDIO_PATCH_DONE:
        case actions.AUDIO_PATCH_ERROR:
        case actions.AUDIO_DELETE_ERROR:
            return true
        default:
            return state
    }
}

const error = (state = null, action) => {
    switch (action.type) {
        case actions.AUDIO_POST_ERROR:
        case actions.AUDIO_PATCH_ERROR:
        case actions.AUDIO_DELETE_ERROR:
            return action.error
        case actions.AUDIO_POST_REQUEST:
        case actions.AUDIO_PATCH_REQUEST:
        case actions.AUDIO_DELETE_REQUEST:
            return null
        default:
            return state
    }
}

const id = (state = null, action) => {
    switch (action.type) {
        case actions.AUDIO_POST_DONE:
            return action.payload.id
        default:
            return state
    }
}

const name = (state = null, action) => {
    switch (action.type) {
        case actions.AUDIO_POST_DONE:
        case actions.AUDIO_PATCH_DONE:
            return action.form.name
        default:
            return state
    }
}

const length = (state = null, action) => {
    switch (action.type) {
        case actions.AUDIO_POST_DONE:
            return action.payload.length
        default:
            return state
    }
}

const amplitudeOverTime = (state = null, action) => {
    switch (action.type) {
        case actions.AUDIO_POST_DONE:
            return action.payload.amplitudeOverTime
        default:
            return state
    }
}

const content = (state = null, action) => {
    switch (action.type) {
        case actions.AUDIO_POST_DONE:
            return action.content
        case actions.AUDIO_GET_DONE:
            return action.payload
        default:
            return state
    }
}

const contentLoaded = (state = true, action) => {
    switch (action.type) {
        case actions.AUDIO_GET_REQUEST:
            return false
        case actions.AUDIO_GET_DONE:
        case actions.AUDIO_GET_ERROR:
            return true
        default:
            return state
    }
}

const contentError = (state = null, action) => {
    switch (action.type) {
        case actions.AUDIO_GET_ERROR:
            return action.error
        case actions.AUDIO_GET_REQUEST:
            return null
        default:
            return state
    }
}

export default combineReducers({ loaded, error, id, name, length, amplitudeOverTime, content, contentLoaded, contentError })