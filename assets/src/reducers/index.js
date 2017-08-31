import { combineReducers } from 'redux'

import user, * as fromUser from './user'
import messages, * as fromMessages from './messages'
import projects, * as fromProjects from './projects'

export default combineReducers({ user, messages, projects })

export const getIsUserLoading = (state) => fromUser.getIsUserLoading(state.user)
export const getCredentials = (state) => fromUser.getCredentials(state.user)
export const getAreProjectsLoading = (state) => fromProjects.getAreProjectsLoading(state.projects)
export const getProjectById = (state, id) => fromProjects.getProjectById(state.projects, id)