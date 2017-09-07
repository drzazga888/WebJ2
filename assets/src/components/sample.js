/**
 * Konstruktor obiektu Sample - jest to już przeciągnięty fragment muzyki na ścieżkę muzyczną
 * @param when - czas startu grania muzyki, w sekundach
 * @param offset - przesunięcie grania muzyki względem początku wzorcowego kawałka audio, w sekundach
 * @param duration - czas trwania kawałka, w sekundach
 * @param audio - obiekt Audio, służy jako odniesienie do konkretnego fragmentu muzyki wstawionego w linię czasu
 * @param pixelsPerSecond - ilość pikseli (w szerokości) na sekundę - stosunek rozciągnięcia - parametr służy obiektowi do odpowiedniego wyskalowania samego siebie na linii czasu
 * @param id - nr identyfikacyjny
 * @constructor
 */
function Sample(when, offset, duration, audio, pixelsPerSecond, id) {
    this.isPlaying = false;
    this.audio = audio;
    this.dom = $('<div draggable="true" class="sample">' +
        '<p>' + this.audio.name + '</p>' +
        '<p>start [s]: <em><input type="number" step="0.01" min="0" max="999.99" class="offset" /></em></p>' +
        '<p>dlugość [s]: <em><input type="number" step="0.01" min="0" max="999.99" class="duration" /></em></p>' +
        '<p class="deleter icon-cancel"></p>' +
        '</div>');
    if (id !== undefined) {
        this.id = id;
        this.dom.data("id", id);
        Sample.collection[id] = this;
    }
    this.pixelsPerSecond = pixelsPerSecond;
    this.setWhen(when);
    this.setOffset(offset);
    this.setDuration(duration);
    this.dom[0].addEventListener("dragstart", Sample.events.dragstart, true);
    this.dom[0].addEventListener("dragend", Sample.events.dragend, true);
    this.dom.find(".deleter")[0].addEventListener("click", Sample.events.delete, true);
    this.dom.find(".duration")[0].addEventListener("change", Sample.events.changeDuration, true);
    this.dom.find(".offset")[0].addEventListener("change", Sample.events.changeOffset, true);
}

/**
 * Metoda przygotowuje skróconą wersję obiektu typu Sample
 * @returns {{id: *, audioId: (*|obj.id|string|Track.id|Audio.id|Mixer.id), when: *, offset: *, duration: *}}
 */
Sample.prototype.shorten = function() {
    return {
        id: this.id,
        audioId: this.audio.id,
        when: this.when,
        offset: this.offset,
        duration: this.duration
    };
};

/**
 * Metoda zwraca utworzony pełny obiekt typu Sample na podstawie jego skróconej wersji
 * @param obj - skrócona wersja Sample
 * @param pixelsPerSecond - ilość (w szerokości) pikseli na sekundę - przybliżenie widzenia sampla
 * @returns {Sample} - utworzony obiekt Sample
 */
Sample.enlarge = function(obj, pixelsPerSecond) {
    return new Sample(obj.when, obj.offset, obj.duration, Audio.collection[obj.audioId], pixelsPerSecond, obj.id);
};

/**
 * Metoda przypisuje odpowiednie ID do sample, jeśli nie jest ustawione
 */
Sample.prototype.assignId = function() {
    if (this.id !== undefined)
        return;
    var i = 0;
    while (Sample.collection[i] !== undefined)
        ++i;
    this.id = i;
    this.dom.data("id", this.id);
};

/**
 * Metoda puszcza muzykę reprezentowaną przez obiekt Sample
 */
Sample.prototype.play = function() {
    if (!this.audio.buffer || this.isPlaying)
        return;
    this.source = Audio.ctx.createBufferSource();
    this.source.buffer = this.audio.buffer;
    this.source.loop = true;
    this.source.connect(Audio.ctx.destination);
    var sample = this;
    this.source.onended = function() {
        sample.isPlaying = false;
    };
    this.startTimeout = window.setTimeout(function() {
        sample.isPlaying = true;
        sample.source.start(0, sample.offset);
        sample.stopTimeout = window.setTimeout(function() {
            sample.pause();
        }, sample.duration * 1000);
    }, sample.when * 1000);
};

/**
 * Metoda zatrzymuje muzykę
 */
Sample.prototype.pause = function() {
    window.clearTimeout(this.stopTimeout);
    window.clearTimeout(this.startTimeout);
    if (!this.audio.buffer || !this.isPlaying)
        return;
    if (this.source !== undefined) {
        this.source.stop();
        this.source = undefined;
    }
    this.isPlaying = false;
};

/**
 * Metoda ustawia czas rozpoczęcia grania Sampla
 * @param when - czas rozpoczęcia w sekundach
 */
Sample.prototype.setWhen = function(when) {
    this.when = when > 0 ? when : 0;
    this.dom.css("left", (this.when * this.pixelsPerSecond) + "px");
};

/**
 * Metoda ustawia przesunięcie odtwarzanej muzyki
 * @param offset - czas przesunięcia w sekundach
 */
Sample.prototype.setOffset = function(offset) {
    offset = Number(offset);
    if (isNaN(offset))
        return;
    this.offset = offset;
    this.dom.find(".offset").val(offset.toFixed(2));
};

/**
 * Metoda ustawia czas trwania Sampla
 * @param duration - czas trwania sampal w sekundach
 */
Sample.prototype.setDuration = function(duration) {
    if (isNaN(duration))
        return;
    this.duration = duration;
    this.dom.css("width", (this.duration * this.pixelsPerSecond) + "px");
    this.dom.find(".duration").val(Number(duration).toFixed(2));
};

/**
 * Metoda zmienia skalę podglądu sampla na linii czasu
 * @param pixelsPerSecond - ilość pikseli na sekundę (w szerokości)
 */
Sample.prototype.changeScale = function(pixelsPerSecond) {
    this.pixelsPerSecond = pixelsPerSecond;
    this.dom.css("width", (this.duration * this.pixelsPerSecond) + "px");
    this.dom.css("left", (this.when * this.pixelsPerSecond) + "px");
};

/**
 * Funkcja zwraca obiekt typu Sample na podstawie DOM tego obiektu
 * @param dom - obiekt DOM - Document Object Model
 * @returns {*} - obiekt Sample
 */
Sample.getSample = function(dom) {
    return Sample.collection[$(dom).closest(".sample").data("id")];
};

/**
 * Obiekt zbiorczy na funkcję obsługujące zdarzenia
 * @type {{dragstart: Function, dragend: Function, changeDuration: Function, changeOffset: Function}}
 */
Sample.events = {

    /**
     * Metoda wywoływana, gdy zaczynamy przenosić nasze sample
     * @param event - obiekt typu Event - zawiera informacje do obsługi żądanie, generowany automatycznie
     */
    dragstart: function(event) {
        var ref = Sample.getSample(event.target);
        Mixer.draggedSample = {
            ref: ref,
            origin: {
                when: ref.when,
                track: Track.getTrack(ref.dom)
            }
        };
        delete Sample.collection[Mixer.draggedSample.ref.id];
        var track = Track.getTrack($(event.target).closest(".track"));
        track.removeSample(Mixer.draggedSample.ref);
        event.dataTransfer.setData("text/plain", event.layerX);
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.dropEffect = "move";
        event.dataTransfer.setDragImage(Sample.dragImg[0], 0, -12);
        Mixer.trackTimelinesDom.addClass("dragging");
    },

    /**
     * Metoda wywoływana podczas zakończenia przenoszania sampla
     * @param event - obiekt typu Event - zawiera informacje do obsługi żądanie, generowany automatycznie
     */
    dragend: function(event) {
        Mixer.trackTimelinesDom.removeClass("dragging");
        if (Mixer.draggedSample !== null) {
            var sample = Mixer.draggedSample.ref;
            Sample.collection[sample.id] = sample;
            Mixer.draggedSample.origin.track.addSample(sample);
            sample.dom.removeClass('ghost');
            Mixer.draggedSample = null;
        }
        else
            Storage.actualize();
    },

    /**
     * Metoda wywoływana, gdy użytkownik zmieni czas trwania sampla
     * @param event - obiekt typu Event - zawiera informacje do obsługi żądanie, generowany automatycznie
     */
    changeDuration: function(event) {
        var sample = Sample.getSample(event.target);
        sample.setDuration(event.target.value);
        Storage.actualize();
    },

    /**
     * Metoda wywoływana, gdy użytkownik zmeni przesunięcie sampla
     * @param event - obiekt typu Event - zawiera informacje do obsługi żądanie, generowany automatycznie
     */
    changeOffset: function(event) {
        var sample = Sample.getSample(event.target);
        sample.setOffset(event.target.value);
        Storage.actualize();
    },

    /**
     * Callback wywołany, gdy naciśniemy przycisk usuwający sampla
     * @param event - obiekt zdarzenia
     */
    delete: function(event) {
        var sample = Sample.getSample(event.target);
        var track = Track.getTrack(event.target);
        sample.dom.remove();
        track.removeSample(sample);
        delete Sample.collection[sample.id];
        Storage.actualize();
    }

};

Sample.collection = {};
Sample.dragImg = $('<img />').attr('src', '/assets/img/sample_drag.png');