import chai, { expect } from 'chai'
import fetchMock from 'fetch-mock'
import btoa from 'btoa'
import sinon from 'sinon'

import { basePath, messageTimeout } from '../src/constants'
import reducer from '../src/reducers'
import * as audiosActions from '../src/actions/audios'
import { getArrayBufferFromFile } from './audios'

global.btoa = btoa

describe('Audios part of the redux store', function() {

    let state
    let clock
    const dispatch = (action) => { state = reducer(state, action) }
    const getState = () => state

    it('should init with the desired structure', function() {
        state = reducer(undefined, {})
        expect(state.audios).to.deep.equal({ loading: false, error: null, entries: null })
    })

    it('should contain audios after successful audios fetching', function() {
        const audiosFetchResult = [
            {
                id: 3,
                name: 'Audio 1 name',
                length: 8.11,
                amplitudeOverTime: [
                    1.22,
                    1.0012,
                    0.211
                ]
            },
            {
                id: 4,
                name: 'Audio 2 name',
                length: 3.23,
                amplitudeOverTime: [
                    0,
                    1.02,
                    0.00921,
                    0.0012,
                    1.112
                ]
            }
        ]
        const initState = {
            user: {
                credentials: {
                    email: 'fake@email.com',
                    password: 'fakePASSWORD1-'
                }
            }
        }
        state = reducer(initState, {})
        fetchMock.get(basePath + 'audios', audiosFetchResult)
        const fetchAudios = audiosActions.fetchAudios()(dispatch, getState)
        expect(state.audios).to.deep.equal({ loading: true, error: null, entries: null })
        return fetchAudios.then(() => {
            expect(state.audios).to.deep.equal({
                loading: false,
                error: null,
                entries: audiosFetchResult.map(audio => Object.assign({
                    loaded: true,
                    content: null,
                    contentLoaded: true
                }, audio))
            })
        })
    })

    it('should reset state after failed audios fetching', function() {
        const initState = {
            user: {
                credentials: {
                    email: 'fake@email.com',
                    password: 'fakePASSWORD1-'
                }
            }
        }
        state = reducer(initState, {})
        fetchMock.get(basePath + 'audios', { status: 500, body: { error: 'unknown' }})
        const fetchAudios = audiosActions.fetchAudios()(dispatch, getState)
        expect(state.audios).to.deep.equal({ loading: true, error: null, entries: null })
        return fetchAudios.then(() => {
            expect(state.audios).to.deep.equal({
                loading: false,
                error: { error: 'unknown'},
                entries: null
            })
        })
    })

    it('should should be added to list of audios after successful upload', function() {
        const audio1 = {
            id: 3,
            name: 'Audio 1 name',
            length: 8.11,
            amplitudeOverTime: [
                1.22,
                1.0012,
                0.211
            ]
        }
        const audio2 = {
            id: 4,
            name: 'Audio 2 name',
            length: 3.23,
            amplitudeOverTime: [
                0,
                1.02,
                0.00921,
                0.0012,
                1.112
            ]
        }
        const audio2content = getArrayBufferFromFile('111127__stephensaldanha__scifi-transforming-sound-01')
        const initState = {
            user: {
                credentials: {
                    email: 'fake@email.com',
                    password: 'fakePASSWORD1-'
                }
            },
            audios: {
                entries: [audio1]
            }
        }
        state = reducer(initState, {})
        fetchMock.post(basePath + 'audios', { status: 201, body: {
            message: 'created',
            id: audio2.id,
            length: audio2.length,
            amplitudeOverTime: audio2.amplitudeOverTime
        }})
        const fetchAudios = audiosActions.addAudio({ name: audio2.name }, audio2content)(dispatch, getState)
        expect(state.audios).to.deep.equal({ loading: false, error: null, entries: [ audio1, {
            id: null,
            name: audio2.name,
            length: null,
            amplitudeOverTime: null,
            loaded: false,
            content: audio2content,
            contentLoaded: true
        }]})
        return fetchAudios.then(() => {
            expect(state.audios).to.deep.equal({ loading: false, error: null, entries: [ audio1, Object.assign({
                content: audio2content,
                contentLoaded: true,
                loaded: true
            }, audio2) ]})
        })
    })

    it('should restore list of audios after failed audio upload', function() {
        const audio1 = {
            id: 3,
            name: 'Audio 1 name',
            length: 8.11,
            amplitudeOverTime: [
                1.22,
                1.0012,
                0.211
            ]
        }
        const audio2 = {
            id: 4,
            name: 'Audio 2 name',
            length: 3.23,
            amplitudeOverTime: [
                0,
                1.02,
                0.00921,
                0.0012,
                1.112
            ]
        }
        const audio2content = getArrayBufferFromFile('111127__stephensaldanha__scifi-transforming-sound-01')
        const initState = {
            user: {
                credentials: {
                    email: 'fake@email.com',
                    password: 'fakePASSWORD1-'
                }
            },
            audios: {
                entries: [audio1]
            }
        }
        state = reducer(initState, {})
        fetchMock.post(basePath + 'audios', { status: 500, body: { error: 'unknown' }})
        const fetchAudios = audiosActions.addAudio({ name: audio2.name }, audio2content)(dispatch, getState)
        expect(state.audios).to.deep.equal({ loading: false, error: null, entries: [ audio1, {
            id: null,
            name: audio2.name,
            length: null,
            amplitudeOverTime: null,
            loaded: false,
            content: audio2content,
            contentLoaded: true
        }]})
        return fetchAudios.then(() => {
            expect(state.audios).to.deep.equal({ loading: false, error: null, entries: [ audio1 ]})
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