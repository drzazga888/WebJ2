/**
 * Inicjalizacja obiektu Storage - zarządza połączeniem z serwerem i stanem aplikaji; przechowuje lokalnie stan miksera, potrafi wysłać na serwer ten stan jeśli jest włączony tryb online
 * @type {{}}
 */
var Storage = {};

/**
 * "Nazwany konstruktor" obiektu Storage, należy go wywołać po załadowaniu strony
 */
Storage.init = function() {
    this.isOnlineHandler = $("#is-online");
    this.lastModifiedHandler = $("#local-storage-last-modified");
    this.isOnline = true;
    this.lastModifiedHandler.text("brak (wszystko aktualne na serwerze)");
    this.prompted = false;
};

/**
 * Funckcja zapisuje stan miksera w localStorage
 */
Storage.saveToLocalStorage = function() {
    var modifyDate = (new Date()).toLocaleString();
    localStorage["WebJ-" + Mixer.id + "-content"] = Mixer.stringify();
    localStorage["WebJ-" + Mixer.id + "-date"] = modifyDate;
    this.lastModifiedHandler.text(modifyDate);
};

/**
 * Funkcja usuwa stan miksera z localStorage
 */
Storage.deleteFromLocalStorage = function() {
    localStorage.removeItem("WebJ-" + Mixer.id + "-content");
    localStorage.removeItem("WebJ-" + Mixer.id + "-date");
    this.lastModifiedHandler.text("brak (wszystko aktualne na serwerze)");
};

/**
 * Funkcja pobiera stan miksera z localStorage i go usuwa
 * @returns {*} - skrócona werja obiektu Mixer w postaci JSON
 */
Storage.getFromLocalStorage = function() {
    var content = localStorage["WebJ-" + Mixer.id + "-content"];
    this.deleteFromLocalStorage();
    return content;
};

/**
 * Metoda sprawdza, czy stan miksera (skrócona werja obiektu Mixer w postaci JSON) jest zapsiana w localStorage
 * @returns {boolean} - true, jeśli taki element istanieje, w przeciwnym wypdaku false
 */
Storage.isLocalStorageFilled = function() {
    return localStorage.getItem("WebJ-" + Mixer.id + "-content") !== null;
};

/**
 * Metoda, która powinna być wywołana w celu zapisania stanu obiektu w localStorage. Funkcja próbuje też wysłać ten obiekt na serwer.
 */
Storage.actualize = function() {
    if (isInit)
        return;
    this.saveToLocalStorage();
    this.sendToServer();
};

/**
 * Funckja wysyła asynchronicznie stan miksera do serwera
 */
Storage.sendToServer = function() {
    $.ajax('/?controller=song&action=update&id=' + Mixer.id, {
        type: "POST",
        data: {
            content: localStorage["WebJ-" + Mixer.id + "-content"]
        },
        statusCode: {
            404: function() {
                Storage.changeStatus(false);
            },
            200: function() {
                Storage.changeStatus(true);
                Storage.deleteFromLocalStorage();
            },
            0: function () {
                Storage.changeStatus(false);
            }
        }
    });
};

/**
 * Funkcja zmienia stan aplikacji
 * @param isOnline - nowy stan aplikacji - online czy offline (true lub false)
 */
Storage.changeStatus = function(isOnline) {
    if (this.isOnline == true && isOnline == false) {
        this.isOnlineHandler.removeClass("online").addClass("offline").text("nie");
        if (this.intervalId !== undefined)
            window.clearInterval(this.intervalId);
        this.intervalId = window.setInterval(Storage.sendToServer, 10000);
        window.addEventListener("beforeunload", Storage.warnUser, true);
    } else if (this.isOnline == false && isOnline == true) {
        this.isOnlineHandler.removeClass("offline").addClass("online").text("tak");
        window.clearInterval(this.intervalId);
        window.removeEventListener("beforeunload", Storage.warnUser);
    }
    this.isOnline = isOnline;
};

/**
 * Funckcja wywoływana, gdy trzeba powiadomić użytkownika o niebezpieczeństwie opuszenia strony w trybie offline
 * @param event - informacje dostarczone przez przeglądarkę na temat wywołaia zdarzenia
 * @returns {string} - napis do wyświetlenia dla użytkownika
 */
Storage.warnUser = function(event) {
    if (!this.prompted) {
        var message = 'Uwaga! Jesteś w trybie offline! Po wyjściu z tej strony może nastąpić błąd. Tak czy inaczej dane zostały zapisane w localStorage...';
        if (typeof event == 'undefined') {
            event = window.event;
        }
        if (event) {
            event.returnValue = message;
        }
        this.prompted = true;
        return message;
    }
};