import * as actions from '../actions/messages'

export default (store = [], action) => {
    switch (action.type) {
        case actions.ADD_MESSAGE:
            return [ ...removeMessage(store, action.alias), action.alias ]
        case actions.REMOVE_MESSAGE:
            return removeMessage(store, action.alias)
        default:
            return store
    }
}

const removeMessage = (store, alias) => {
    const aliasPos = store.indexOf(alias)
    return aliasPos !== -1 ? [ ...store.slice(0, aliasPos), ...store.slice(aliasPos + 1) ] : store
}