const chakram = require('chakram')
const { apiPath, getBasicCredentials, EMAIL_VALID, PASSWORD_VALID } = require('./general')

// consts

const userEndpoint = apiPath + 'users'

const FNAME_VALID = 'Jan'
const FNAME_TOO_LONG = 'asqoldksjuasqoldksjuasqoldksjuasqoldksjua'
const LNAME_VALID = 'Kowalski'
const LNAME_TOO_LONG = FNAME_TOO_LONG
const EMAIL_INVALID = 'yfyugvdfgdg'

// requests

const postEmptyFname = () => chakram.post(userEndpoint, {})

const postTooLongFname = () => chakram.post(userEndpoint, {
    fname: FNAME_TOO_LONG
})

const postEmptyLname = () => chakram.post(userEndpoint, {
    fname: FNAME_VALID
})

const postTooLongLname = () => chakram.post(userEndpoint, {
    fname: FNAME_VALID,
    lname: LNAME_TOO_LONG
})

const postEmptyEmail = () => chakram.post(userEndpoint, {
    fname: FNAME_VALID,
    lname: LNAME_VALID
})

const postInvalidEmail = () => chakram.post(userEndpoint, {
    fname: FNAME_VALID,
    lname: LNAME_VALID,
    email: EMAIL_INVALID
})

const postEmptyPassword = () => chakram.post(userEndpoint, {
    fname: FNAME_VALID,
    lname: LNAME_VALID,
    email: EMAIL_VALID
})

// TODO need to finish invalid post user requests

const postUser = () => chakram.post(userEndpoint, {
    fname: FNAME_VALID,
    lname: LNAME_VALID,
    email: EMAIL_VALID,
    password: PASSWORD_VALID,
    password2: PASSWORD_VALID
})

const deleteUser = () => chakram.delete(userEndpoint + '/me', null, {
    headers: {
        'Authorization': getBasicCredentials()
    }
})

module.exports = { postUser, deleteUser }