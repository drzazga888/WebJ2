export const CREDENTIALS_SET = 'CREDENTIALS_SET'
export const CREDENTIALS_UNSET = 'CREDENTIALS_UNSET'

export const setCredentials = credentials => ({ type: CREDENTIALS_SET, credentials })

export const unsetCredentials = () => ({ type: CREDENTIALS_UNSET })