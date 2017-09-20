const btoa = require('btoa')

const apiPath = 'https://localhost:9443/webj2/api/'

const EMAIL_VALID = 'janek@kowalski.pl'
const PASSWORD_VALID = 'Ja-8-fajnie-nowe'

const getBasicCredentials = () => `Basic ${btoa(`${EMAIL_VALID}:${PASSWORD_VALID}`)}`

module.exports = { apiPath, getBasicCredentials, EMAIL_VALID, PASSWORD_VALID }