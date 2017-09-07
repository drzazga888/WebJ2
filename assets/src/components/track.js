/**
 * Konstruktor obiektu Track - reperezentuje on pojedyńczą ścieżkę z samplami
 * @param id - nr id ścieżki
 * @param name - nazwa ścieżki
 * @constructor
 */
function Track(id, name) {
    this.samples = [];
    if (id !== undefined)
        this.id = id;
    else
        this.assignId();
    if (name !== undefined)
        this.name = name;
    else
        this.name = "Track #" + this.id;
    this.headDom = $('<div data-id="' + this.id + '" class="track track-head">' +
        '<input type="text" class="name" value="' + this.name + '" required />' +
        '<p class="icon-cancel deleter">Usuń</p>' +
        '</div>');
    this.timelineDom = $('<div data-id="' + this.id + '" class="track timeline"></div>');
    this.timelineDom[0].addEventListener("dragenter", Track.events.dragenter, true);
    this.timelineDom[0].addEventListener("dragleave", Track.events.dragleave, true);
    this.timelineDom[0].addEventListener("dragover", Track.events.dragover, true);
    this.timelineDom[0].addEventListener("drop", Track.events.drop, true);
    this.headDom.find(".name")[0].addEventListener("change", Track.events.changeName, true);
}

/**
 * Metoda zwraca skróconą wersję obiektu Track
 * @returns {{id: *, name: *, samples: Array}} - skrócona wersja tracka
 */
Track.prototype.shorten = function() {
    var obj = {
        id: this.id,
        name: this.name,
        samples: []
    };
    for (var i = 0; i < this.samples.length; ++i) {
        if (this.samples[i] !== undefined)
            obj.samples.push(this.samples[i].shorten());
        else
            obj.samples.push(undefined);
    }
    return obj;
};

/**
 * Metoda zwraca pełny obiekt Track na podstawie jego skróconej wersji
 * @param obj - skrócona wersja tracka
 * @returns {*} - pełny obiekt Track
 */
Track.enlarge = function(obj) {
    var track;
    if (obj.id !== null && obj.name !== null)
        track = new Track(obj.id, obj.name);
    else
        track = new Track();
    for (var i = 0; i < obj.samples.length; ++i) {
        var sample = Sample.enlarge(obj.samples[i], Mixer.pixelsPerSecond);
        track.samples.push(sample);
        track.timelineDom.append(sample.dom);
    }
    return track;
};

/**
 * Metoda przypisuje nr ID do ścieżki
 */
Track.prototype.assignId = function() {
    if (this.id !== undefined)
        return;
    var i = 0;
    while (Mixer.tracks[i] !== undefined)
        ++i;
    this.id = i;
};

/**
 * Metoda dodaje sampla do ścieżki
 * @param sample - sample do dodania
 */
Track.prototype.addSample = function(sample) {
    this.samples.push(sample);
    this.timelineDom.append(sample.dom);
};

/**
 * Metoda usuwa sample ze ścieżki
 * @param sample - sample do usunięcia (odczepienia) od tracka
 */
Track.prototype.removeSample = function(sample) {
    for (var i = 0; i < this.samples.length; ++i) {
        if (this.samples[i] === sample) {
            this.samples.splice(i, 1);
            return;
        }
    }
    throw Error("Nie można usunąć sampla ID = " +
        sample.id +
        " z tracku ID = " +
        this.id +
        " i nazwie " +
        this.name +
        ", gdyż go tam nie ma");
};

/**
 * Metoda zwraca tracka na podstawie DOM
 * @param dom - obiekt typu DOM - Document Object Model
 * @returns {*} - obiekt typu Track
 */
Track.getTrack = function(dom) {
    return Mixer.tracks[$(dom).closest(".track").data("id")];
};

/**
 * Obiekt zbiorczy na funkcje obsługujące zdarzenia
 * @type {{dragenter: Function, dragover: Function, dragleave: Function, drop: Function, changeName: Function}}
 */
Track.events = {

    /**
     * Metoda wywoływana gdy przeniesiemy plik muzyczny na ścieżkę
     * @param event - obiekt typu Event - zawiera informacje do obsługi żądanie, generowany automatycznie
     */
    dragenter: function(event) {
        $(event.target).addClass("emphase");
        var track = Track.getTrack(event.target);
        Mixer.draggedSample.ref.dom.removeClass("ghost").appendTo(track.timelineDom);
    },

    /**
     * Metoda wywoływana gdy przesuwamy samplem po ścieżce
     * @param event - obiekt typu Event - zawiera informacje do obsługi żądanie, generowany automatycznie
     */
    dragover: function(event) {
        event.preventDefault();
        var elemLayerX = event.dataTransfer.getData("text/plain");
        Mixer.draggedSample.ref.setWhen((event.layerX - elemLayerX) / Mixer.draggedSample.ref.pixelsPerSecond);
    },

    /**
     * Metoda wywoływana, gdy przeniesiemy sampla poza ścieżkę
     * @param event - obiekt typu Event - zawiera informacje do obsługi żądanie, generowany automatycznie
     */
    dragleave: function(event) {
        $(event.target).removeClass("emphase");
        if (Mixer.draggedSample.origin !== undefined) {
            Mixer.draggedSample.ref.dom.addClass("ghost").appendTo(
                Mixer.draggedSample.origin.track.timelineDom
            );
            Mixer.draggedSample.ref.setWhen(Mixer.draggedSample.origin.when);
        }
        else {
            Mixer.draggedSample.ref.dom.remove();
            //Mixer.draggedSample.dom.data("id", Mixer.draggedSample.id);
        }
    },

    /**
     * Metoda wywoływana, gdy plik muzyki upuścimy na tracku
     * @param event
     */
    drop: function(event) {
        event.preventDefault();
        $(event.target).removeClass("emphase");
        var track = Track.getTrack(event.target);
        if (Mixer.draggedSample.ref.id === undefined)
            Mixer.draggedSample.ref.assignId();
        track.addSample(Mixer.draggedSample.ref);
        Sample.collection[Mixer.draggedSample.ref.id] = Mixer.draggedSample.ref;
        Mixer.draggedSample = null;
    },

    /**
     * Metoda wywoływana, gdy zmieniamy nazwę ścieżki z muzyką
     * @param event
     */
    changeName: function(event) {
        var track = Track.getTrack(event.target);
        track.name = event.target.value;
        Storage.actualize();
    }

};