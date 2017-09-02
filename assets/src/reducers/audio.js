import { combineReducers } from 'redux'

import * as actions from '../actions/audios'

const amplitudeOverTime = (state = null, action) => {
    switch (action.type) {
        case actions.ADD_AUDIO_DONE:
            return action.payload.amplitudeOverTime
        default:
            return state
    }
}

const content = (state = null, action) => {
    switch (action.type) {
        case actions.ADD_AUDIO_REQUESTED:
            return action.content
        default:
            return state
    }
}

const contentLoaded = (state = true, action) => {
    switch (action.type) {
        default:
            return state
    }
}

const id = (state = null, action) => {
    switch (action.type) {
        case actions.ADD_AUDIO_DONE:
            return action.payload.id
        default:
            return state
    }
}

const length = (state = null, action) => {
    switch (action.type) {
        case actions.ADD_AUDIO_DONE:
            return action.payload.length
        default:
            return state
    }
}

const loaded = (state = true, action) => {
    switch (action.type) {
        case actions.ADD_AUDIO_REQUESTED:
            return false
        case actions.ADD_AUDIO_ERROR:
        case actions.ADD_AUDIO_DONE:
            return true
        default:
            return state
    }
}

const name = (state = null, action) => {
    switch (action.type) {
        case actions.ADD_AUDIO_REQUESTED:
            return action.name
        default:
            return state
    }
}

export default combineReducers({ amplitudeOverTime, content, contentLoaded, id, length, loaded, name })