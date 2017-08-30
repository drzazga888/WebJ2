import { combineReducers } from 'redux'

import user, * as fromUser from './user'
import messages, * as fromMessages from './messages'
import projects, * as fromProjects from './projects'

export default combineReducers({ user, messages, projects })

export const getIsUserLoading = (store) => fromUser.getIsUserLoading(store.user)
export const getCredentials = (store) => fromUser.getCredentials(store.user)
export const getAreProjectsLoading = (store) => fromProjects.getAreProjectsLoading(store.projects)