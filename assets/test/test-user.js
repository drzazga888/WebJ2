import chai, { expect } from 'chai'
import fetchMock from 'fetch-mock'
import btoa from 'btoa'

import reducer from '../src/reducers'
import * as userActions from '../src/actions/user'
import { basePath } from '../src/api'

global.btoa = btoa

describe('User part of the redux store', function() {

    let state
    const dispatch = (action) => { state = reducer(state, action) }
    const getState = () => state

    it('should init with desired structure', () => {
        state = reducer(undefined, {})
        expect(state.user).to.deep.equal({ loaded: true, error: null, fname: null, lname: null, email: null, password: null })
    })

    it('should load user info on GET request', () => {
        state = reducer(undefined, {})
        fetchMock.get(basePath + 'users/me', { fname: 'Bbbbb', lname: 'Aaaa' })
        return userActions.getUser({ email: 'aaa@aaa.pl', password: 'aaAA--33' })(dispatch, getState).then(() => {
            expect(state.user).to.deep.equal({ loaded: true, error: null, fname: 'Bbbbb', lname: 'Aaaa', email: 'aaa@aaa.pl', password: 'aaAA--33' })
        })
    })

    it('should be not changed on POST request', () => {
        state = reducer(undefined, {})
        fetchMock.post(basePath + 'users', { status: 201, body: {}})
        return userActions.postUser({ fname: 'Bbbbb', lname: 'Aaaa', email: 'aaa@aaa.pl', password: 'aaAA--33', password2: 'aaAA--33' })(dispatch, getState).then(() => {
            expect(state.user).to.deep.equal({ loaded: true, error: null, fname: null, lname: null, email: null, password: null })
        })
    })

    it('should update user info on PUT request', () => {
        state = reducer({ user: { loaded: true, error: null, fname: 'Bbbbb', lname: 'Aaaa', email: 'aaa@aaa.pl', password: 'aaAA--33' }}, {})
        fetchMock.put(basePath + 'users/me', { status: 200, body: {}})
        return userActions.putUser({ fname: 'Jan', lname: 'Kowalski', email: 'bbb@bbb.pl', password: 'aaAA--444', password2: 'aaAA--44' })(dispatch, getState).then(() => {
            expect(state.user).to.deep.equal({ loaded: true, error: null, fname: 'Jan', lname: 'Kowalski', email: 'bbb@bbb.pl', password: 'aaAA--444' })
        })
    })

    it('should clean state on DELETE request', () => {
        state = reducer({ user: { loaded: true, error: null, fname: 'Bbbbb', lname: 'Aaaa', email: 'aaa@aaa.pl', password: 'aaAA--33' }}, {})
        fetchMock.delete(basePath + 'users/me', { status: 200, body: {}})
        return userActions.deleteUser()(dispatch, getState).then(() => {
            expect(state.user).to.deep.equal({ loaded: true, error: null, fname: null, lname: null, email: null, password: null })
        })
    })

    it('should clean state on logout', () => {
        state = reducer({ user: { loaded: true, error: null, fname: 'Bbbbb', lname: 'Aaaa', email: 'aaa@aaa.pl', password: 'aaAA--33' }}, {})
        userActions.logout()(dispatch, getState)
        expect(state.user).to.deep.equal({ loaded: true, error: null, fname: null, lname: null, email: null, password: null })
    })

    afterEach('un-mock fetch api and clock', function() {
        fetchMock.restore()
    })

})