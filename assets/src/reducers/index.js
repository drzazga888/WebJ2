import { combineReducers } from 'redux'

import audios, * as fromAudios from '../actions/audios'
import messages, * as fromMessages from '../actions/messages'
import projects, * as fromProjects from '../actions/projects'
import activeProject, * as fromActiveProject from '../actions/active-project'
import user, * as fromUser from '../actions/user'

export default combineReducers({ audios, messages, projects, user })

export const getCredentials = (state) => fromUser.getCredentials(state.user)
export const getActiveProjectId = (state) => fromActiveProject.getActiveProjectId(state.activeProject)