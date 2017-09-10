import * as actions from '../actions/messages'

export default (state = [], action) => {
    switch (action.type) {
        case actions.REMOVE_MESSAGE:
            return removeMessageIfExists(state, action.message)
        case actions.ADD_MESSAGE:
            return [ ...removeMessageIfExists(state, action.message), { message: action.message, type: action.type }]
        default:
            return state
    }
}

const removeMessageIfExists = (state, message) => {
    const pos = Object.keys(state).filter(i => state[i].message === message).shift()
    return pos ? [ ...state.slice(0, pos), ...state.slice(pos + 1) ] : state
}