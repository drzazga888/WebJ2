import chai, { expect } from 'chai'
import fetchMock from 'fetch-mock'
import btoa from 'btoa'

import { basePath } from '../src/constants'
import * as userActions from '../src/actions/user'
import reducer from '../src/reducers'

global.btoa = btoa

describe('User part of the redux store', function() {

    let state
    const dispatch = (action) => { state = reducer(state, action) }
    const getState = () => state

    it('should init with the desired structure', function() {
        state = reducer(undefined, {})
        expect(state.user).to.deep.equal({ loading: false, credentials: null, details: null })
    })

    it('should set credentials and details on login', function() {
        const userInitState = { loading: false, credentials: null, details: null }
        state = reducer({ user: userInitState }, {})
        fetchMock.get(basePath + 'users/me', { lname: 'Fakelname', fname: 'Fakefname' })
        const doLogin = userActions.signIn({ email: 'fake@email.com', password: 'fakePASSWORD1-' })(dispatch, getState)
        expect(state.user).to.deep.equal({ loading: true, credentials: null, details: null })
        return doLogin.then(() => {
            expect(state.user).to.deep.equal({
                loading: false,
                credentials: {
                    email: 'fake@email.com',
                    password: 'fakePASSWORD1-'
                },
                details: {
                    lname: 'Fakelname',
                    fname: 'Fakefname'
                }
            })
        })
    })

    it('should unset credentials and details on logout', function() {
        const userInitState = {
            loading: false,
            credentials: {
                email: 'fake@email.com',
                password: 'fakePASSWORD1-'
            },
            details: {
                lname: 'Fakelname',
                fname: 'Fakefname'
            }
        }
        state = reducer({ user: userInitState }, {})
        userActions.logout()(dispatch)
        expect(state.user).to.deep.equal({ loading: false, credentials: null, details: null })
    })

    it('should restore state on login error', function() {
        const userInitState = { loading: false, credentials: null, details: null }
        state = reducer({ user: userInitState }, {})
        fetchMock.get(basePath + 'users/me', { status: 401, body: { error: 'error message' }})
        const doLogin = userActions.signIn({ email: 'fake@email.com', password: 'fakePASSWORD1-' })(dispatch, getState)
        expect(state.user).to.deep.equal({ loading: true, credentials: null, details: null })
        return doLogin.then(() => {
            expect(state.user).to.deep.equal({ loading: false, credentials: null, details: null })
        })
    })

    it('should only mutate loading on register action', function() {
        const userInitState = { loading: false, credentials: null, details: null }
        state = reducer({ user: userInitState }, {})
        fetchMock.post(basePath + 'users', { status: 201, body: { message: 'created' }})
        const doRegister = userActions.signUp({
            fname: 'Stefan',
            lname: 'Nafets',
            email: 'stef@an.com',
            password: 'asdf12-P',
            password2: 'asdf12-P'
        })(dispatch, getState)
        expect(state.user).to.deep.equal({ loading: true, credentials: null, details: null })
        return doRegister.then(() => {
            expect(state.user).to.deep.equal({ loading: false, credentials: null, details: null })
        })
    })

    it('should only mutate loading on register error', function() {
        const userInitState = { loading: false, credentials: null, details: null }
        state = reducer({ user: userInitState }, {})
        fetchMock.post(basePath + 'users', { status: 400, body: { error: 'bad params' }})
        const doRegister = userActions.signUp({
            fname: 'Stefan',
            lname: 'Nafets',
            email: 'stef@an.com',
            password: 'asdf12-P',
            password2: 'asdf12-P'
        })(dispatch, getState)
        expect(state.user).to.deep.equal({ loading: true, credentials: null, details: null })
        return doRegister.then(() => {
            expect(state.user).to.deep.equal({ loading: false, credentials: null, details: null })
        })
    })

    it('should update user in right way on success', function() {
        const userInitState = {
            loading: false,
            credentials: {
                email: 'fake@email.com',
                password: 'fakePASSWORD1-'
            },
            details: {
                lname: 'Fakelname',
                fname: 'Fakefname'
            }
        }
        state = reducer({ user: userInitState }, {})
        fetchMock.put(basePath + 'users/me', { status: 200, body: { message: 'updated' }})
        const doUpdate = userActions.updateProfile({
            fname: 'Stefan2',
            lname: 'Nafets2',
            email: 'stef@an2.com',
            password: 'asdf12-P2',
            password2: 'asdf12-P2'
        })(dispatch, getState)
        expect(state.user).to.deep.equal({ ...userInitState, loading: true })
        return doUpdate.then(() => {
            expect(state.user).to.deep.equal({
                loading: false,
                credentials: {
                    email: 'stef@an2.com',
                    password: 'asdf12-P2'
                },
                details: {
                    fname: 'Stefan2',
                    lname: 'Nafets2'
                }
            })
        })
    })

    it('should restore old user data on update failure', function() {
        const userInitState = {
            loading: false,
            credentials: {
                email: 'fake@email.com',
                password: 'fakePASSWORD1-'
            },
            details: {
                lname: 'Fakelname',
                fname: 'Fakefname'
            }
        }
        state = reducer({ user: userInitState }, {})
        fetchMock.put(basePath + 'users/me', { status: 400, body: { error: 'error message' }})
        const doUpdate = userActions.updateProfile({
            fname: 'Stefan2',
            lname: 'Nafets2',
            email: 'stef@an2.com',
            password: 'asdf12-P2',
            password2: 'asdf12-P2'
        })(dispatch, getState)
        expect(state.user).to.deep.equal({ ...userInitState, loading: true })
        return doUpdate.then(() => {
            expect(state.user).to.deep.equal(userInitState)
        })
    })

    it('should remove user on delete request', function() {
        const userInitState = {
            loading: false,
            credentials: {
                email: 'fake@email.com',
                password: 'fakePASSWORD1-'
            },
            details: {
                lname: 'Fakelname',
                fname: 'Fakefname'
            }
        }
        state = reducer({ user: userInitState }, {})
        fetchMock.delete(basePath + 'users/me', { status: 200, body: { message: 'removed' }})
        const doDelete = userActions.removeProfile()(dispatch, getState)
        expect(state.user).to.deep.equal({ ...userInitState, loading: true })
        return doDelete.then(() => {
            expect(state.user).to.deep.equal({ loading: false, credentials: null, details: null })
        })
    })

    it('should preserve user on delete failure', function() {
        const userInitState = {
            loading: false,
            credentials: {
                email: 'fake@email.com',
                password: 'fakePASSWORD1-'
            },
            details: {
                lname: 'Fakelname',
                fname: 'Fakefname'
            }
        }
        state = reducer({ user: userInitState }, {})
        fetchMock.delete(basePath + 'users/me', { status: 500, body: { error: 'error' }})
        const doDelete = userActions.removeProfile()(dispatch, getState)
        expect(state.user).to.deep.equal({ ...userInitState, loading: true })
        return doDelete.then(() => {
            expect(state.user).to.deep.equal(userInitState)
        })
    })

    afterEach('un-mock fetch api', function() {
        fetchMock.restore()
    })

})