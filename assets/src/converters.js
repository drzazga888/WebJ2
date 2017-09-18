export const getBasicAuthorization = ({ email, password }) => `Basic ${btoa(`${email}:${password}`)}`

export const jsonOrThrow = (response) => response.ok ? response.json() : Promise.reject(response.status)

export const blobOrThrow = (response) => response.ok ? response.blob() : Promise.reject(response.status)

export const convertArrayBufferToBase64 = (content) => new Uint8Array(content).reduce((data, byte) => data + String.fromCharCode(byte), '')

export const mergeArrayBufferWithForm = (form, content) => Object.assign({
    base64StringAudio: content.replace(/^data:audio\/wav;base64,/, '')
}, form)