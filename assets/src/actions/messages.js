const messageTimeout = 5000

export const ADD_MESSAGE = 'ADD_MESSAGE'
export const REMOVE_MESSAGE = 'REMOVE_MESSAGE'

const addMessage = (message, type) => (dispatch) => {
    dispatch({ ADD_MESSAGE, message, type })
    setTimeout(() => {
        dispatch({ REMOVE_MESSAGE, message })
    }, messageTimeout)
}

const addErrorMessage = (message) => addMessage(message, 'error')

export const addSuccessMessage = (message) => addMessage(message, 'success')

export const addErrorFromResponseCode = (code) => {
    switch (code) {
        case 400:
            return addErrorMessage('Przesłane dane nie spełniają narzuconych wymagań')
        case 401:
            return addErrorMessage('Błędny login lub hasło')
        case 403:
            return addErrorMessage('Zasób nie należy do użytkownika')
        case 404:
            return addErrorMessage('Zasób o podanym identyfikatorze nie został znaleziony')
        case 409:
            return addErrorMessage('Zasób nie mógł zostać utworzony, gdyż zasób o podanej nazwie już istnieje')
        case 415:
            return addErrorMessage('Błędny typ pliku - obsługiwane są jedynie pliki typu .wav')
        default:
            return addErrorMessage('Wystąpił błąd podczas przetwarzania żądania: ' + code)
    }
}