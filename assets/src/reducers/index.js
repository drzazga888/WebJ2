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
export const getUserPassword = (state) => fromUser.getUserPassword(state.user)
export const getUserFname = (state) => fromUser.getUserFname(state.user)
export const getUserLname = (state) => fromUser.getUserLname(state.user)

export const getAudiosEntries = (state) => fromAudios.getAudiosEntries(state.audios)
export const getAudiosLoaded = (state) => fromAudios.getAudiosLoaded(state.audios)
export const getAudiosError = (state) => fromAudios.getAudiosError(state.audios)
export const getAudioContent = (id, state) => fromAudios.getAudioContent(id, state.audios)

export const getProjectsEntries = (state) => fromProjects.getProjectsEntries(state.projects)
export const getProjectsLoaded = (state) => fromProjects.getProjectsLoaded(state.projects)
export const getProjectsError = (state) => fromProjects.getProjectsError(state.projects)

export const getActiveProjectId = (state) => fromActiveProject.getActiveProjectId(state.activeProject)

export const getMessages = (state) => fromMessages.getMessages(state.messages)