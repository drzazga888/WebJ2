import { messageTimeout } from '../constants'

export const ADD_MESSAGE = 'ADD_MESSAGE'
export const REMOVE_MESSAGE = 'REMOVE_MESSAGE'

export const showMessage = (alias) => (dispatch) => {
    dispatch({
        type: ADD_MESSAGE,
        alias
    })
    return new Promise(resolve => {
        setTimeout(() => {
            dispatch({
                type: REMOVE_MESSAGE,
                alias
            })
            resolve()
        }, messageTimeout)
    })
}