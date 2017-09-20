import chai, { expect } from 'chai'
import fetchMock from 'fetch-mock'
import btoa from 'btoa'

import reducer from '../src/reducers'
import * as activeProjectActions from '../src/actions/active-project'
import { basePath } from '../src/api'

global.btoa = btoa

describe('Active project part of the redux store', function() {

    let state
    const dispatch = (action) => { state = reducer(state, action) }
    const getState = () => state

    it('should init with desired structure', () => {
        state = reducer(undefined, {})
        expect(state.activeProject).to.deep.equal({ loaded: true, error: null, id: null, data: null })
    })

    it('should load project on GET', () => {
        const result = {"name":"Test Project","tracks":[{"name":"FX 2","samples":[{"start":2.15,"duration":3.0,"offset":0.0,"gain":1.0,"audioId":2}],"gain":0.8},{"name":"Choir","samples":[{"start":0.0,"duration":15.999251,"offset":0.0,"gain":1.0,"audioId":19}],"gain":1.0},{"name":"Drums","samples":[{"start":0.0,"duration":15.999433,"offset":0.0,"gain":1.0,"audioId":23}],"gain":0.3},{"name":"Guitar","samples":[{"start":0.0,"duration":15.999274,"offset":0.0,"gain":1.0,"audioId":24}],"gain":0.5},{"name":"FX","samples":[{"start":0.0,"duration":6.5,"offset":0.0,"gain":0.8,"audioId":3}],"gain":1.2}],"createdAt":1505905413901,"updatedAt":1505905222098}
        state = reducer({ user: { email: 'aaa@aaa.pl', password: 'aaAA--33' }}, {})
        fetchMock.get(basePath + 'projects/4', result)
        return activeProjectActions.getProject(4)(dispatch, getState).then(() => {
            expect(state.activeProject).to.deep.equal({ loaded: true, error: null, id: 4, data: result })
        })
    })

    it('should react to the project changes vis PUT', () => {
        const initProject = {"name":"Test Project","tracks":[{"name":"FX 2","samples":[{"start":2.15,"duration":3.0,"offset":0.0,"gain":1.0,"audioId":2}],"gain":0.8},{"name":"Choir","samples":[{"start":0.0,"duration":15.999251,"offset":0.0,"gain":1.0,"audioId":19}],"gain":1.0},{"name":"Drums","samples":[{"start":0.0,"duration":15.999433,"offset":0.0,"gain":1.0,"audioId":23}],"gain":0.3},{"name":"Guitar","samples":[{"start":0.0,"duration":15.999274,"offset":0.0,"gain":1.0,"audioId":24}],"gain":0.5},{"name":"FX","samples":[{"start":0.0,"duration":6.5,"offset":0.0,"gain":0.8,"audioId":3}],"gain":1.2}],"createdAt":1505905413901,"updatedAt":1505905222098}
        state = reducer({ user: { email: 'aaa@aaa.pl', password: 'aaAA--33' }, activeProject: { id: 4, data: initProject }}, {})
        fetchMock.put(basePath + 'projects/4', {})
        return activeProjectActions.putActiveProject(Object.assign({}, initProject, { name: 'changed' }))(dispatch, getState).then(() => {
            expect(state.activeProject).to.deep.equal({ loaded: true, error: null, id: 4, data: Object.assign({}, initProject, {
                name: 'changed'
            }) })
        })
    })

    afterEach('un-mock fetch api and clock', function() {
        fetchMock.restore()
    })

})