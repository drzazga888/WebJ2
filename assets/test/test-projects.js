import chai, { expect } from 'chai'
import fetchMock from 'fetch-mock'
import btoa from 'btoa'
import sinon from 'sinon'

import { basePath, messageTimeout } from '../src/constants'
import * as projectsActions from '../src/actions/projects'
import reducer from '../src/reducers'

global.btoa = btoa

describe('Projects part of the redux store', function() {

    let state
    let clock
    const dispatch = (action) => { state = reducer(state, action) }
    const getState = () => state

    it('should init with the desired structure', function() {
        state = reducer(undefined, {})
        expect(state.projects).to.deep.equal({ loading: false, error: null, entries: [] })
    })

    it('should load projects into store on fetch projects request', function() {
        const initState = {
            user: {
                credentials: {
                    email: 'fake@email.com',
                    password: 'fakePASSWORD1-'
                }
            }
        }
        const fakeProject = {
            id: 17,
            name: 'Fake name',
            createdAt: 123456,
            updatedAt: 123459,
            duration: 12.5
        }
        state = reducer(initState, {})
        fetchMock.get(basePath + 'projects', [ fakeProject ])
        const fetchProjects = projectsActions.fetchProjects()(dispatch, getState)
        expect(state.projects).to.deep.equal({ loading: true, error: null, entries: [] })
        return fetchProjects.then(() => {
            expect(state.projects).to.deep.equal({ loading: false, error: null, entries: [ Object.assign({
                loaded: true
            }, fakeProject) ]})
        })
    })

    it('should restore state on fetch projects error', function() {
        const initState = {
            user: {
                credentials: {
                    email: 'fake@email.com',
                    password: 'fakePASSWORD1-'
                }
            }
        }
        const fakeProject = {
            id: 17,
            name: 'Fake name',
            createdAt: 123456,
            updatedAt: 123459,
            duration: 12.5
        }
        state = reducer(initState, {})
        fetchMock.get(basePath + 'projects', { status: 500, body: { error: 'undefined' }})
        const fetchProjects = projectsActions.fetchProjects()(dispatch, getState)
        expect(state.projects).to.deep.equal({ loading: true, error: null, entries: [] })
        return fetchProjects.then(() => {
            expect(state.projects).to.deep.equal({ loading: false, error: { payload: { error: 'undefined' }, statusCode: 500 }, entries: [] })
        })
    })

    it('should update projects list after successful project creation', function() {
        const existingProject = {
            id: 17,
            name: 'Fake name',
            createdAt: 123456,
            updatedAt: 123459,
            duration: 12.5,
            loaded: true
        }
        const newProject = {
            id: 18,
            name: 'Fake name 2',
            createdAt: 823456,
            updatedAt: 923459,
            duration: 0,
            loaded: true
        }
        const initState = {
            user: {
                credentials: {
                    email: 'fake@email.com',
                    password: 'fakePASSWORD1-'
                }
            },
            projects: {
                entries: [existingProject]
            }
        }
        state = reducer(initState, {})
        fetchMock.post(basePath + 'projects', {
            status: 201,
            body: {
                message: 'created',
                id: newProject.id, 
                createdAt: newProject.createdAt,
                updatedAt: newProject.updatedAt
            }
        })
        const createProject = projectsActions.createProject({ name: newProject.name })(dispatch, getState)
        expect(state.projects).to.deep.equal({ loading: false, error: null, entries: [ existingProject, {
            loaded: false,
            id: null,
            name: 'Fake name 2',
            createdAt: null,
            updatedAt: null,
            duration: 0
        }]})
        return createProject.then(() => {
            expect(state.projects).to.deep.equal({ loading: false, error: null, entries: [ existingProject, newProject ]})
        })
    })

    it('should restore state after failed project creation', function() {
        const existingProject = {
            id: 17,
            name: 'Fake name',
            createdAt: 123456,
            updatedAt: 123459,
            duration: 12.5
        }
        const newProject = {
            id: 18,
            name: 'Fake name 2',
            createdAt: 823456,
            updatedAt: 923459,
            duration: 0
        }
        const initState = {
            user: {
                credentials: {
                    email: 'fake@email.com',
                    password: 'fakePASSWORD1-'
                }
            },
            projects: {
                entries: [existingProject]
            }
        }
        state = reducer(initState, {})
        fetchMock.post(basePath + 'projects', { status: 500, body: { error: 'unknown' }})
        const createProject = projectsActions.createProject({ name: newProject.name })(dispatch, getState)
        expect(state.projects).to.deep.equal({ loading: false, error: null, entries: [ existingProject, {
            loaded: false,
            id: null,
            name: 'Fake name 2',
            createdAt: null,
            updatedAt: null,
            duration: 0
        }]})
        return createProject.then(() => {
            expect(state.projects).to.deep.equal({ loading: false, error: null, entries: [ existingProject ]})
        })
    })

    it('should update project name in projects list after successful entry patch', function() {
        const project1 = {
            id: 17,
            name: 'Fake name',
            createdAt: 123456,
            updatedAt: 123459,
            duration: 12.5,
            loaded: true
        }
        const project2 = {
            id: 18,
            name: 'Fake name 2',
            createdAt: 823456,
            updatedAt: 923459,
            duration: 40.3,
            loaded: true
        }
        const initState = {
            user: {
                credentials: {
                    email: 'fake@email.com',
                    password: 'fakePASSWORD1-'
                }
            },
            projects: {
                entries: [project1, project2]
            }
        }
        state = reducer(initState, {})
        fetchMock.patch(basePath + 'projects/18', { message: 'patched' })
        const updateProject = projectsActions.updateProject(18, { name: 'Fake name patched' })(dispatch, getState)
        expect(state.projects).to.deep.equal({ loading: false, error: null, entries: [ project1, Object.assign({}, project2, { name: 'Fake name patched', loaded: false }) ]})
        return updateProject.then(() => {
            expect(state.projects).to.deep.equal({ loading: false, error: null, entries: [ project1, Object.assign({}, project2, { name: 'Fake name patched' }) ]})
        })
    })

    it('should revert project name in projects list after entry patch error', function() {
        const project1 = {
            id: 17,
            name: 'Fake name',
            createdAt: 123456,
            updatedAt: 123459,
            duration: 12.5,
            loaded: true
        }
        const project2 = {
            id: 18,
            name: 'Fake name 2',
            createdAt: 823456,
            updatedAt: 923459,
            duration: 40.3,
            loaded: true
        }
        const initState = {
            user: {
                credentials: {
                    email: 'fake@email.com',
                    password: 'fakePASSWORD1-'
                }
            },
            projects: {
                entries: [project1, project2]
            }
        }
        state = reducer(initState, {})
        fetchMock.patch(basePath + 'projects/18', { status: 500, body: { error: 'unknown' }})
        const updateProject = projectsActions.updateProject(18, { name: 'Fake name patched' })(dispatch, getState)
        expect(state.projects).to.deep.equal({ loading: false, error: null, entries: [ project1, Object.assign({}, project2, { name: 'Fake name patched', loaded: false }) ]})
        return updateProject.then(() => {
            expect(state.projects).to.deep.equal({ loading: false, error: null, entries: [ project1, project2 ]})
        })
    })

    beforeEach('mock clocks', function() {
        clock = sinon.useFakeTimers()
    })

    afterEach('un-mock fetch api and clocks', function() {
        clock.restore()
        fetchMock.restore()
    })

})