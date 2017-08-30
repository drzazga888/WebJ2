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
            expect(state.projects).to.deep.equal({ loading: false, error: null, entries: [ fakeProject ]})
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

    beforeEach('mock clocks', function() {
        clock = sinon.useFakeTimers()
    })

    afterEach('un-mock fetch api and clocks', function() {
        clock.restore()
        fetchMock.restore()
    })

})