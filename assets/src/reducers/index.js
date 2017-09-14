import { combineReducers } from 'redux'

import audios, * as fromAudios from './audios'
import messages, * as fromMessages from './messages'
import projects, * as fromProjects from './projects'
import activeProject, * as fromActiveProject from './active-project'
import user, * as fromUser from './user'

export default combineReducers({ audios, messages, projects, activeProject, user })

export const getCredentials = (state) => fromUser.getCredentials(state.user)
export const getUserLoaded = (state) => fromUser.getUserLoaded(state.user)
export const getUserError = (state) => fromUser.getUserError(state.user)
export const getUserEmail = (state) => fromUser.getUserEmail(state.user)
export const getActiveProjectId = (state) => fromActiveProject.getActiveProjectId(state.activeProject)
export const getMessages = (state) => fromMessages.getMessages(state.messages)