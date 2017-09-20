import chai, { expect } from 'chai'
import fetchMock from 'fetch-mock'
import btoa from 'btoa'

import reducer from '../src/reducers'
import * as projectsActions from '../src/actions/projects'
import { basePath } from '../src/api'

global.btoa = btoa

describe('Projects part of the redux store', function() {

    let state
    const dispatch = (action) => { state = reducer(state, action) }
    const getState = () => state

    it('should init with desired structure', () => {
        state = reducer(undefined, {})
        expect(state.projects).to.deep.equal({ loaded: true, error: null, entries: null })
    })

    it('should load project list on GET list request', () => {
        const result = [{"id":4,"name":"Test Project","createdAt":1505905413901,"updatedAt":1505905222098,"duration":15.999433}]
        state = reducer({ user: { email: 'aaa@aaa.pl', password: 'aaAA--33' }}, {})
        fetchMock.get(basePath + 'projects', result)
        return projectsActions.getProjects()(dispatch, getState).then(() => {
            expect(state.projects).to.deep.equal({ loaded: true, error: null, entries: result.map(a => Object.assign({
                error: null, loaded: true
            }, a)) })
        })
    })

    it('should mutate name of the project on PATCH', () => {
        const projectsInit = [{"id":4,"name":"Test Project","createdAt":1505905413901,"updatedAt":1505905222098,"duration":15.999433}]
        state = reducer({ user: { email: 'aaa@aaa.pl', password: 'aaAA--33' }, projects: { entries: projectsInit }}, {})
        fetchMock.patch(basePath + 'projects/4', { updatedAt: 1505931756316 })
        return projectsActions.patchProject({ name: 'changed' }, 4)(dispatch, getState).then(() => {
            expect(state.projects).to.deep.equal({ loaded: true, error: null, entries: projectsInit.map(p => Object.assign({}, p, {
                error: null, loaded: true, name: p.id === 4 ? 'changed' : p.name, updatedAt: p.id === 4 ? 1505931756316 : p.updatedAt
            })) })
        })
    })

    it('should delete project on DELETE', () => {
        const projectsInit = [{"id":4,"name":"Test Project","createdAt":1505905413901,"updatedAt":1505905222098,"duration":15.999433}]
        state = reducer({ user: { email: 'aaa@aaa.pl', password: 'aaAA--33' }, projects: { entries: projectsInit }}, {})
        fetchMock.delete(basePath + 'projects/4', {})
        return projectsActions.deleteProject(4)(dispatch, getState).then(() => {
            expect(state.projects).to.deep.equal({ loaded: true, error: null, entries: [] })
        })
    })

    afterEach('un-mock fetch api and clock', function() {
        fetchMock.restore()
    })

})