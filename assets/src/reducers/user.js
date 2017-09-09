import * as actions from '../actions/credentials'

export default (state = null, action) => {
    switch (action.type) {
        case actions.CREDENTIALS_SET:
            return action.credentials
        case actions.CREDENTIALS_UNSET:
            return null
        default:
            return state
    }
}

