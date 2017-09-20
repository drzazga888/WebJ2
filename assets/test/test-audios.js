import chai, { expect } from 'chai'
import fetchMock from 'fetch-mock'
import btoa from 'btoa'

import reducer from '../src/reducers'
import * as audiosActions from '../src/actions/audios'
import { basePath } from '../src/api'

global.btoa = btoa

describe('Audios part of the redux store', function() {

    let state
    const dispatch = (action) => { state = reducer(state, action) }
    const getState = () => state

    it('should init with desired structure', () => {
        state = reducer(undefined, {})
        expect(state.audios).to.deep.equal({ loaded: true, error: null, entries: null })
    })

    it('should load audio list on GET list request', () => {
        const result = [
            {
              "id": 2,
              "name": "Sci-fi FX",
              "length": 3,
              "amplitudeOverTime": [
                0.004785436,
                0.0035995264
              ]
            },
            {
              "id": 3,
              "name": "Horror Strings",
              "length": 9.418625,
              "amplitudeOverTime": [
                0.00056301965,
                0.0018416841
              ]
            }
        ]
        state = reducer({ user: { email: 'aaa@aaa.pl', password: 'aaAA--33' }}, {})
        fetchMock.get(basePath + 'audios', result)
        return audiosActions.getAudios()(dispatch, getState).then(() => {
            expect(state.audios).to.deep.equal({ loaded: true, error: null, entries: result.map(a => Object.assign({
                content: null, contentError: null, contentLoaded: true, error: null, loaded: true
            }, a)) })
        })
    })

    it('should mutate name of the audio on PATCH', () => {
        const audiosInit = [
            {
              "id": 2,
              "name": "Sci-fi FX",
              "length": 3,
              "amplitudeOverTime": [
                0.004785436,
                0.0035995264
              ]
            },
            {
              "id": 3,
              "name": "Horror Strings",
              "length": 9.418625,
              "amplitudeOverTime": [
                0.00056301965,
                0.0018416841
              ]
            }
        ]
        state = reducer({ user: { email: 'aaa@aaa.pl', password: 'aaAA--33' }, audios: { entries: audiosInit.map(a => Object.assign({
            content: null, contentError: null, contentLoaded: true, error: null, loaded: true
        }, a)) }}, {})
        fetchMock.patch(basePath + 'audios/2', {})
        return audiosActions.patchAudio({ name: 'changed' }, 2)(dispatch, getState).then(() => {
            expect(state.audios).to.deep.equal({ loaded: true, error: null, entries: audiosInit.map(a => Object.assign({}, a, {
                content: null, contentError: null, contentLoaded: true, error: null, loaded: true, name: a.id === 2 ? 'changed' : a.name
            })) })
        })
    })

    it('should delete audio on DELETE', () => {
        const audiosInit = [
            {
              "id": 2,
              "name": "Sci-fi FX",
              "length": 3,
              "amplitudeOverTime": [
                0.004785436,
                0.0035995264
              ]
            },
            {
              "id": 3,
              "name": "Horror Strings",
              "length": 9.418625,
              "amplitudeOverTime": [
                0.00056301965,
                0.0018416841
              ]
            }
        ]
        state = reducer({ user: { email: 'aaa@aaa.pl', password: 'aaAA--33' }, audios: { entries: audiosInit.map(a => Object.assign({
            content: null, contentError: null, contentLoaded: true, error: null, loaded: true
        }, a)) }}, {})
        fetchMock.delete(basePath + 'audios/2', {})
        return audiosActions.deleteAudio(2)(dispatch, getState).then(() => {
            expect(state.audios).to.deep.equal({ loaded: true, error: null, entries: audiosInit.map(a => Object.assign({}, a, {
                content: null, contentError: null, contentLoaded: true, error: null, loaded: true
            }) ).filter(a => a.id !== 2) })
        })
    })

    afterEach('un-mock fetch api and clock', function() {
        fetchMock.restore()
    })

})