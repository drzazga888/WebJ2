const chakram = require('chakram')
const expect = chakram.expect

const userEndpoint = 'https://localhost:9443/webj2/api/users'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

describe('User POST endpoint should return error on empty fname', function() {

    let response

    before(function() {
        let payload = {}
        response = chakram.post(userEndpoint, payload)
    })

    it('should return 400', function() {
        return expect(response).to.have.status(400)
    })

    it('should contain valid error message', function() {
        return expect(response).to.have.json('error', 'fname must be provided')
    })

})

describe('User POST endpoint should return error on too long fname', function() {

    let response

    before(function() {
        let payload = {
            fname: 'asqoldksjuasqoldksjuasqoldksjuasqoldksjua'
        }
        response = chakram.post(userEndpoint, payload)
    })

    it('should return 400', function() {
        return expect(response).to.have.status(400)
    })

    it('should contain valid error message', function() {
        return expect(response).to.have.json('error', 'max length of fname is 40')
    })

})

describe('User POST endpoint should return error on empty lname', function() {

    let response

    before(function() {
        let payload = {
            fname: 'Jan'
        }
        response = chakram.post(userEndpoint, payload)
    })

    it('should return 400', function() {
        return expect(response).to.have.status(400)
    })

    it('should contain valid error message', function() {
        return expect(response).to.have.json('error', 'lname must be provided')
    })

})

describe('User POST endpoint should return error on too long fname', function() {

    let response

    before(function() {
        let payload = {
            fname: 'Jan',
            lname: 'asqoldksjuasqoldksjuasqoldksjuasqoldksjua'
        }
        response = chakram.post(userEndpoint, payload)
    })

    it('should return 400', function() {
        return expect(response).to.have.status(400)
    })

    it('should contain valid error message', function() {
        return expect(response).to.have.json('error', 'max length of lname is 40')
    })

})

describe('User POST endpoint should return error on empty email', function() {

    let response

    before(function() {
        let payload = {
            fname: 'Jan',
            lname: 'Kowalski'
        }
        response = chakram.post(userEndpoint, payload)
    })

    it('should return 400', function() {
        return expect(response).to.have.status(400)
    })

    it('should contain valid error message', function() {
        return expect(response).to.have.json('error', 'email must be provided')
    })

})

describe('User POST endpoint should return error on invalid email', function() {

    let response

    before(function() {
        let payload = {
            fname: 'Jan',
            lname: 'Kowalski',
            email: 'yfyugvdfgdg'
        }
        response = chakram.post(userEndpoint, payload)
    })

    it('should return 400', function() {
        return expect(response).to.have.status(400)
    })

    it('should contain valid error message', function() {
        return expect(response).to.have.json('error', 'bad email format')
    })

})

/*describe('User POST endpoint should return error on empty password', function() {

    let response

    before(function() {
        let payload = {
            fname: 'Jan',
            lname: 'Kowalski',
            email: 'jan@kowalski.pl'
        }
        response = chakram.post(userEndpoint, payload)
    })

    it('should return 400', function() {
        return expect(response).to.have.status(400)
    })

    it('should contain valid error message', function() {
        return expect(response).to.have.json('error', 'bad email format')
    })

})*/