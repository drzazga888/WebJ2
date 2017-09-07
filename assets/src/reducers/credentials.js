import * as actions from '../actions/credentials'

export default (state = null, action) => {
    switch (action.type) {
        case actions.CREDENTIALS_SET:
            return actions.credentials
        case actions.CREDENTIALS_UNSET:
            return null
        default:
            return state
    }
}