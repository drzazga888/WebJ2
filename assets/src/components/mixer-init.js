var isInit = true;

/**
 * Inicjalizacja aplikacji
 */
$(document).ready(function() {

    Mixer.init(80);
    Storage.init();
    if (Storage.isLocalStorageFilled()) {
        Mixer.parse(Storage.getFromLocalStorage(), audios);
    }
    else {
        Mixer.parse(content, audios);
    }
    isInit = false;

});