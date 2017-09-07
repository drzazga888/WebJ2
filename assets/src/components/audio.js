/**
 * Konstruktor, inicjule obiekt Audio ustawiając odpowiendie zmienne i podpinając zdarzenia
 * @param name - nazwa obiektu audio, na jej podstawie ładowane są określone pliki muzyki z serwera, nazwa ta taż widnieje na przycisku kawałka audio na dole miksera.
 * @param id - nr id audio
 * @constructor
 */
function Audio(name, id) {
    this.name = name;
    this.id = id;
    this.source = null;
    this.buffer = null;
    this.dom = $('<div data-id="' + this.id + '" class="audio button icon-play" draggable="true">' + this.name + '</div>');
    this.dom[0].addEventListener("click", Audio.events.click, true);
    this.dom[0].addEventListener("dragstart", Audio.events.dragstart, true);
    this.dom[0].addEventListener("dragend", Audio.events.dragend, true);
    Audio.collection[this.id] = this;
    this.loadBuffer();
}

/**
 * Metoda na podstawie skróconego obiektu odtwarza pierwotny obiekt Audio
 * @param obj - skrócony obiekt, w formacie {{id: *, name: *}}
 * @returns {Audio} - pełny obiekt Audio
 */
Audio.enlarge = function(obj) {
    return new Audio(obj.name, obj.id);
};

/**
 * Metoda ma na celu asynchroniczne załadowanie pliku muzycznego z serwera, wczytane dane zapisuje do pola buffer
 */
Audio.prototype.loadBuffer = function() {
    var request = new XMLHttpRequest();
    var audio = this;
    request.open('GET', '/?controller=audio&action=get-audio&id=' + this.id, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
        Audio.ctx.decodeAudioData(request.response, function(buffer) {
            audio.buffer = buffer;
        });
    };
    request.send();
};

/**
 * Metoda odtwarza muzykę (po naciśnięciu nazwy muzyki na podglądzie). W tym celu wykorzystuje Web Audio API
 */
Audio.prototype.play = function() {
    if (!this.buffer || this.source)
        return;
    this.source = Audio.ctx.createBufferSource();
    this.source.buffer = this.buffer;
    this.source.connect(Audio.ctx.destination);
    var dom = this.dom;
    dom.removeClass("icon-play").addClass("icon-pause");
    this.timeoutId = window.setTimeout(function() {
        dom.removeClass("icon-pause").addClass("icon-play");
    }, this.buffer.duration * 1000);
    this.source.start(0);
};

/**
 * Metoda zatrzymuje puszczoną muzykę w tle. Wykorzystano Web Audio API
 */
Audio.prototype.pause = function() {
    if (!this.buffer || !this.source)
        return;
    this.dom.removeClass("icon-pause").addClass("icon-play");
    window.clearInterval(this.timeoutId);
    this.source.stop();
    this.source = null;
};

/**
 * Metoda zwraca obiekt Audio, do którego należy obiekt DOM - przydatne podczas obsługi zdarzeń, gdyż na podstawie elementu dom (dostęp do niego przez this lub event.target) możemy na wyjściu uzyskać szukany obiekt Audio
 * @param dom - obiekt DOM (Document Object Model)
 * @returns {*} - obiekt Audio
 */
Audio.getAudio = function(dom) {
    return Audio.collection[$(dom).closest(".audio").data("id")];
};

/**
 * Kontener, który przechowuje funkcje wywołane do obsługi zdarzeń na obiekcie Audio
 * @type {{dragstart: Function, dragend: Function, click: Function}}
 */
Audio.events = {

    /**
     * Metoda wywołana gdy zaczniemy przesuwać (tzn. "oderwiemy") obiekt Audio
     * @param event - obiekt typu Event - zawiera informacje do obsługi żądanie, generowany automatycznie
     * @returns {boolean} - zwracany jest false kiedy nie możemy jeszcze przesuwać elementu Audio (np ładuje się muzyka z serwera - metoda Audio.prototype.loadBuffer nie zostałą wykonana)
     */
    dragstart: function(event) {
        var audio = Audio.getAudio(event.target);
        if (!audio.buffer)
            return false;
        var ref = new Sample(0, 0, audio.buffer.duration, audio, Mixer.pixelsPerSecond);
        Mixer.draggedSample = {
            ref: ref
        };
        event.dataTransfer.setData("text/plain", (audio.buffer.duration * Mixer.pixelsPerSecond * 0.5));
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.dropEffect = "move";
        Mixer.trackTimelinesDom.addClass("dragging");
    },

    /**
     * Metoda wywołana kiedy przestaniemy przenosić obiekt Audio
     * @param event - obiekt typu Event - zawiera informacje do obsługi żądanie, generowany automatycznie
     */
    dragend: function(event) {
        Mixer.trackTimelinesDom.removeClass("dragging");
        Mixer.draggedSample = null;
        Storage.actualize();
    },

    /**
     * Metoda wywoływana gdy naciśniemy obiekt Audio - muzyka zaczyna wtedy grać lub przestaje grać
     * @param event - obiekt typu Event - zawiera informacje do obsługi żądanie, generowany automatycznie
     */
    click: function(event) {
        var audio = Audio.getAudio(event.target);
        if (!audio.source)
            audio.play();
        else
            audio.pause();
    }

};

Audio.collection = {};
Audio.ctx = new AudioContext();