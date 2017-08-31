import chai, { expect } from 'chai'
import fetchMock from 'fetch-mock'
import btoa from 'btoa'
import sinon from 'sinon'

import { basePath, messageTimeout } from '../src/constants'
import * as messageActions from '../src/actions/messages'
import * as userActions from '../src/actions/user'
import * as projectsActions from '../src/actions/projects'
import * as messages from '../src/messages'
import reducer from '../src/reducers'

global.btoa = btoa

describe('Message part of the redux store', function() {

    let state
    let clock
    const dispatch = (action) => { state = reducer(state, action) }
    const getState = () => state

    describe('Backbone of the store', function() {

        it('should init with the desired structure', function() {
            state = reducer(undefined, {})
            expect(state.messages).to.deep.equal([])
        })

        it('should store alias until timeout will end', function() {
            state = reducer({ messages: [] }, {})
            const addMessagePromise = messageActions.showMessage('JUNK_MESSAGE_ALIAS')(dispatch)
            expect(state.messages).to.deep.equal(['JUNK_MESSAGE_ALIAS'])
            clock.tick(messageTimeout + 10)
            return addMessagePromise.then(() => {
                expect(state.messages).to.deep.equal([])
            })
        })

        it('should move alias to the top when mesage exists', function() {
            state = reducer({ messages: ['AA', 'JUNK_MESSAGE_ALIAS', 'BB'] }, {})
            const addMessagePromise = messageActions.showMessage('JUNK_MESSAGE_ALIAS')(dispatch)
            expect(state.messages).to.deep.equal(['AA', 'BB', 'JUNK_MESSAGE_ALIAS'])
            clock.tick(messageTimeout + 10)
            return addMessagePromise.then(() => {
                expect(state.messages).to.deep.equal(['AA', 'BB'])
            })
        })

    })

    describe('Store updated with user-specific messages', function() {

        it('should contain message about success on register success', function() {
            state = reducer({ messages: [] }, {})
            fetchMock.post(basePath + 'users', { status: 201, body: { message: 'created' }})
            return userActions.signUp({
                fname: 'Stefan',
                lname: 'Nafets',
                email: 'stef@an.com',
                password: 'asdf12-P',
                password2: 'asdf12-P'
            })(dispatch, getState).then(() => {
                expect(state.messages).to.deep.equal([messages.MESSAGE_JUST_REGISTERED])
                clock.tick(messageTimeout + 10)
                expect(state.messages).to.deep.equal([])
            })
        })

        it('should contain message about bad params on violated contraints in sign-up form', function() {
            state = reducer({ messages: [] }, {})
            fetchMock.post(basePath + 'users', { status: 400, body: { error: 'bad params' }})
            return userActions.signUp({
                fname: 'Stefan',
                lname: 'Nafets',
                email: 'stef@an.com',
                password: 'asdf12-P',
                password2: 'asdf12-P'
            })(dispatch, getState).then(() => {
                expect(state.messages).to.deep.equal([messages.MESSAGE_FORM_BAD_PARAMS])
                clock.tick(messageTimeout + 10)
                expect(state.messages).to.deep.equal([])
            })
        })

        it('should contain message about e-mail conflict with other profile when conflict returned on sign-up', function() {
            state = reducer({ messages: [] }, {})
            fetchMock.post(basePath + 'users', { status: 409, body: { error: 'user already exists' }})
            return userActions.signUp({
                fname: 'Stefan',
                lname: 'Nafets',
                email: 'stef@an.com',
                password: 'asdf12-P',
                password2: 'asdf12-P'
            })(dispatch, getState).then(() => {
                expect(state.messages).to.deep.equal([messages.MESSAGE_USER_ALREADY_EXISTS])
                clock.tick(messageTimeout + 10)
                expect(state.messages).to.deep.equal([])
            })
        })

        it('should contain message about error during sign-up', function() {
            state = reducer({ messages: [] }, {})
            fetchMock.post(basePath + 'users', { status: 500, body: { error: 'unknown error' }})
            return userActions.signUp({
                fname: 'Stefan',
                lname: 'Nafets',
                email: 'stef@an.com',
                password: 'asdf12-P',
                password2: 'asdf12-P'
            })(dispatch, getState).then(() => {
                expect(state.messages).to.deep.equal([messages.MESSAGE_REGISTER_ERROR])
                clock.tick(messageTimeout + 10)
                expect(state.messages).to.deep.equal([])
            })
        })

        it('should contain message about bad login or password on sign-in bad credentials', function() {
            state = reducer({ messages: [] }, {})
            fetchMock.get(basePath + 'users/me', { status: 401, body: { error: 'unauthorized' }})
            return userActions.signIn({
                email: 'stef@an.com',
                password: 'asdf12-P'
            })(dispatch, getState).then(() => {
                expect(state.messages).to.deep.equal([messages.MESSAGE_LOGIN_BAD_CREDENTIALS])
                clock.tick(messageTimeout + 10)
                expect(state.messages).to.deep.equal([])
            })
        })

        it('should contain message about login error on sign-in error', function() {
            state = reducer({ messages: [] }, {})
            fetchMock.get(basePath + 'users/me', { status: 500, body: { error: 'unknown error' }})
            return userActions.signIn({
                email: 'stef@an.com',
                password: 'asdf12-P'
            })(dispatch, getState).then(() => {
                expect(state.messages).to.deep.equal([messages.MESSAGE_LOGIN_ERROR])
                clock.tick(messageTimeout + 10)
                expect(state.messages).to.deep.equal([])
            })
        })

        it('should contain appropriate message on logout', function() {
            state = reducer({ messages: [] }, {})
            userActions.logout()(dispatch)
            expect(state.messages).to.deep.equal([messages.MESSAGE_LOGOUT])
            clock.tick(messageTimeout + 10)
            expect(state.messages).to.deep.equal([])
        })

        it('should contain message about successful profile update on profile edited', function() {
            state = reducer({
                user: {
                    credentials: {
                        email: 'fake@email.com',
                        password: 'fakePASSWORD1-'
                    },
                    details: {
                        lname: 'Fakelname',
                        fname: 'Fakefname'
                    }
                },
                messages: []
            }, {})
            fetchMock.put(basePath + 'users/me', { status: 200, body: { message: 'updated' }})
            return userActions.updateProfile({
                fname: 'Stefan2',
                lname: 'Nafets2',
                email: 'stef@an2.com',
                password: 'asdf12-P2',
                password2: 'asdf12-P2'
            })(dispatch, getState).then(() => {
                expect(state.messages).to.deep.equal([messages.MESSAGE_PROFILE_UPDATED])
                clock.tick(messageTimeout + 10)
                expect(state.messages).to.deep.equal([])
            })
        })

        it('should contain valid message on bad params error during update', function() {
            state = reducer({
                user: {
                    credentials: {
                        email: 'fake@email.com',
                        password: 'fakePASSWORD1-'
                    },
                    details: {
                        lname: 'Fakelname',
                        fname: 'Fakefname'
                    }
                },
                messages: []
            }, {})
            fetchMock.put(basePath + 'users/me', { status: 400, body: { error: 'bad params' }})
            return userActions.updateProfile({
                fname: 'Stefan2',
                lname: 'Nafets2',
                email: 'stef@an2.com',
                password: 'asdf12-P2',
                password2: 'asdf12-P2'
            })(dispatch, getState).then(() => {
                expect(state.messages).to.deep.equal([messages.MESSAGE_FORM_BAD_PARAMS])
                clock.tick(messageTimeout + 10)
                expect(state.messages).to.deep.equal([])
            })
        })

        it('should contain message about denied access on unauthorized update result', function() {
            state = reducer({
                user: {
                    credentials: {
                        email: 'fake@email.com',
                        password: 'fakePASSWORD1-'
                    },
                    details: {
                        lname: 'Fakelname',
                        fname: 'Fakefname'
                    }
                },
                messages: []
            }, {})
            fetchMock.put(basePath + 'users/me', { status: 401, body: { error: 'bad params' }})
            return userActions.updateProfile({
                fname: 'Stefan2',
                lname: 'Nafets2',
                email: 'stef@an2.com',
                password: 'asdf12-P2',
                password2: 'asdf12-P2'
            })(dispatch, getState).then(() => {
                expect(state.messages).to.deep.equal([messages.MESSAGE_UNAUTHORIZED])
                clock.tick(messageTimeout + 10)
                expect(state.messages).to.deep.equal([])
            })
        })

        it('should contain valid message on confilct error during update', function() {
            state = reducer({
                user: {
                    credentials: {
                        email: 'fake@email.com',
                        password: 'fakePASSWORD1-'
                    },
                    details: {
                        lname: 'Fakelname',
                        fname: 'Fakefname'
                    }
                },
                messages: []
            }, {})
            fetchMock.put(basePath + 'users/me', { status: 409, body: { error: 'conflict' }})
            return userActions.updateProfile({
                fname: 'Stefan2',
                lname: 'Nafets2',
                email: 'stef@an2.com',
                password: 'asdf12-P2',
                password2: 'asdf12-P2'
            })(dispatch, getState).then(() => {
                expect(state.messages).to.deep.equal([messages.MESSAGE_USER_ALREADY_EXISTS])
                clock.tick(messageTimeout + 10)
                expect(state.messages).to.deep.equal([])
            })
        })

        it('should contain valid message on unknown error during update', function() {
            state = reducer({
                user: {
                    credentials: {
                        email: 'fake@email.com',
                        password: 'fakePASSWORD1-'
                    },
                    details: {
                        lname: 'Fakelname',
                        fname: 'Fakefname'
                    }
                },
                messages: []
            }, {})
            fetchMock.put(basePath + 'users/me', { status: 500, body: { error: 'unknown' }})
            return userActions.updateProfile({
                fname: 'Stefan2',
                lname: 'Nafets2',
                email: 'stef@an2.com',
                password: 'asdf12-P2',
                password2: 'asdf12-P2'
            })(dispatch, getState).then(() => {
                expect(state.messages).to.deep.equal([messages.MESSAGE_PROFILE_UPDATE_ERROR])
                clock.tick(messageTimeout + 10)
                expect(state.messages).to.deep.equal([])
            })
        })

        it('should contain message about profile delete on remove done', function() {
            state = reducer({
                user: {
                    credentials: {
                        email: 'fake@email.com',
                        password: 'fakePASSWORD1-'
                    },
                    details: {
                        lname: 'Fakelname',
                        fname: 'Fakefname'
                    }
                },
                messages: []
            }, {})
            fetchMock.delete(basePath + 'users/me', { status: 200, body: { message: 'deleted' }})
            return userActions.removeProfile()(dispatch, getState).then(() => {
                expect(state.messages).to.deep.equal([messages.MESSAGE_PROFILE_REMOVED])
                clock.tick(messageTimeout + 10)
                expect(state.messages).to.deep.equal([])
            })
        })

        it('should contain message about denied request on profile delete unauthorized error', function() {
            state = reducer({
                user: {
                    credentials: {
                        email: 'fake@email.com',
                        password: 'fakePASSWORD1-'
                    },
                    details: {
                        lname: 'Fakelname',
                        fname: 'Fakefname'
                    }
                }
            }, {})
            fetchMock.delete(basePath + 'users/me', { status: 401, body: { error: 'unknown' }})
            return userActions.removeProfile()(dispatch, getState).then(() => {
                expect(state.messages).to.deep.equal([messages.MESSAGE_UNAUTHORIZED])
                clock.tick(messageTimeout + 10)
                expect(state.messages).to.deep.equal([])
            })
        })

        it('should contain message about profile delete error on remove failure', function() {
            state = reducer({
                user: {
                    credentials: {
                        email: 'fake@email.com',
                        password: 'fakePASSWORD1-'
                    },
                    details: {
                        lname: 'Fakelname',
                        fname: 'Fakefname'
                    }
                }
            }, {})
            fetchMock.delete(basePath + 'users/me', { status: 500, body: { error: 'unknown' }})
            return userActions.removeProfile()(dispatch, getState).then(() => {
                expect(state.messages).to.deep.equal([messages.MESSAGE_PROFILE_REMOVE_ERROR])
                clock.tick(messageTimeout + 10)
                expect(state.messages).to.deep.equal([])
            })
        })

    })

    describe('Store updated with project-collection-specific messages', function() {

        it('should contain successfully created project on project create', function() {
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
            return projectsActions.createProject({ name: newProject.name })(dispatch, getState).then(() => {
                expect(state.messages).to.deep.equal([ messages.MESSAGE_PROJECT_CREATED ])
                clock.tick(messageTimeout + 10)
                expect(state.messages).to.deep.equal([])
            })
        })

        it('should contain message about invalid parameters on project creation bad request error', function() {
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
                }
            }
            state = reducer(initState, {})
            fetchMock.post(basePath + 'projects', { status: 400, body: { error: 'bad request' }})
            return projectsActions.createProject({ name: newProject.name })(dispatch, getState).then(() => {
                expect(state.messages).to.deep.equal([ messages.MESSAGE_FORM_BAD_PARAMS ])
                clock.tick(messageTimeout + 10)
                expect(state.messages).to.deep.equal([])
            })
        })

        it('should contain message about denied request on project creation unauthorized error', function() {
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
                }
            }
            state = reducer(initState, {})
            fetchMock.post(basePath + 'projects', { status: 401, body: { error: 'unauthorized' }})
            return projectsActions.createProject({ name: newProject.name })(dispatch, getState).then(() => {
                expect(state.messages).to.deep.equal([ messages.MESSAGE_UNAUTHORIZED ])
                clock.tick(messageTimeout + 10)
                expect(state.messages).to.deep.equal([])
            })
        })

        it('should contain message about already existing project on project creation conflict error', function() {
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
                }
            }
            state = reducer(initState, {})
            fetchMock.post(basePath + 'projects', { status: 409, body: { error: 'conflict' }})
            return projectsActions.createProject({ name: newProject.name })(dispatch, getState).then(() => {
                expect(state.messages).to.deep.equal([ messages.MESSAGE_PROJECT_NAME_CONFLICT ])
                clock.tick(messageTimeout + 10)
                expect(state.messages).to.deep.equal([])
            })
        })

        it('should contain message about project creation failure on project post error', function() {
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
                }
            }
            state = reducer(initState, {})
            fetchMock.post(basePath + 'projects', { status: 500, body: { error: 'unknown' }})
            return projectsActions.createProject({ name: newProject.name })(dispatch, getState).then(() => {
                expect(state.messages).to.deep.equal([ messages.MESSAGE_PROJECT_UPDATE_ERROR ])
                clock.tick(messageTimeout + 10)
                expect(state.messages).to.deep.equal([])
            })
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