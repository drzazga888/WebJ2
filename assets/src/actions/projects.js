import { getAreProjectsLoading, getCredentials } from '../reducers'
import * as api from '../api'

export const FETCH_PROJECTS_REQUESTED = 'FETCH_PROJECTS_REQUESTED'
export const FETCH_PROJECTS_DONE = 'FETCH_PROJECTS_DONE'
export const FETCH_PROJECTS_ERROR = 'FETCH_PROJECTS_ERROR'

export const fetchProjects = () => (dispatch, getState) => {
    const state = getState()
    if (getAreProjectsLoading(state)) {
        return Promise.resolve()
    }
    dispatch({ type: FETCH_PROJECTS_REQUESTED })
    return api.getProjects(getCredentials(state)).then(
        payload => dispatch({ type: FETCH_PROJECTS_DONE, payload }),
        ({ payload, response }) => dispatch({ type: FETCH_PROJECTS_ERROR, payload, statusCode: response.status })
    )
}