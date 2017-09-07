/**
 * Globalna inicjalizacja obiektu Mixer.
 * Mixer jest obiektem zbiorczym na wszystkie elementy, które są używanie by stworzyć muzykę.
 * @type {{}}
 */
var Mixer = {};

/**
 * "Nazwany konstruktor" obiektu Mixer, powinien zostać wywołany od razu po załadowaniu strony (onload lub $.ready)
 * @param pixelsPerSecond - początkowa wartość "rozciągnięcia" miksera - wskazuje ilość pikseli (w szerokości) która przypada na 1s trwania utworu
 */
Mixer.init = function(pixelsPerSecond) {

    // DOM (jQuery objects) init
    var tracksDom = $("#tracks");
    Mixer.trackHeadsDom = tracksDom.children("aside");
    Mixer.trackTimelinesDom = tracksDom.find(".timelines");
    Mixer.audiosDom = $("#audios");
    Mixer.newTrackButton = $("#new-track");
    Mixer.zoomIn = $("#zoom-in");
    Mixer.zoomOut = $("#zoom-out");
    Mixer.playPauseButton = $("#play");
    Mixer.timeLabels = tracksDom.find(".time");
    Mixer.pipe = tracksDom.find(".pipe");
    Mixer.timelineDurationChanger = $("#timeline-duration");
    Mixer.mixerName = $("#mixer-name");

    // events
    Mixer.newTrackButton.on("click", function() {
        Mixer.addTrack(new Track());
    });
    Mixer.trackHeadsDom.on("click", ".deleter", function(event) {
        Mixer.removeTrack($(this).closest(".track").data("id"));
    });
    Mixer.zoomIn.on("click", function(event) {
        Mixer.setPixelsPerSecond(Mixer.pixelsPerSecond * 1.6);
    });
    Mixer.zoomOut.on("click", function(event) {
        Mixer.setPixelsPerSecond(Mixer.pixelsPerSecond * 0.625);
    });
    Mixer.playPauseButton.on("click", function(event) {
        if (!Mixer.isPlaying)
            Mixer.play();
        else
            Mixer.pause();
    });
    Mixer.timelineDurationChanger.on("change", function(event) {
        Mixer.setTimelineDuration(event.target.value);
    });
    Mixer.mixerName.on("change", function(event) {
        Mixer.setName(event.target.value);
    });

    // setting params
    Mixer.setPixelsPerSecond(pixelsPerSecond);
    Mixer.id = Number($("#song-id").text());

};

/**
 * Metoda przekształca obiekt w jego reprezentację w formacie JSON
 * @returns {*} - napis w formacie JSON
 */
Mixer.stringify = function() {
    var obj = {
        duration: this.timelineDuration,
        name: this.name,
        tracks: {}
    };
    //var i;
    for (var trackId in this.tracks) {
        if (this.tracks.hasOwnProperty(trackId))
            obj.tracks[trackId] = this.tracks[trackId].shorten();
    }
    /*for (i = 0; i < this.tracks.length; ++i) {
        if (this.tracks[i])
            obj.tracks.push(this.tracks[i].shorten());
    }*/
    return JSON.stringify(obj);
};

/**
 * Funkcja parsuje napis w formacie JSON (czyli skróconą reprezentację obiektu Mixer) w wyniku czego zostanie ustawiony odpowiedni stan całego miksera
 * @param stringified - napis do sparsowania
 * @param jsonAudios
 */
Mixer.parse = function(stringified, jsonAudios) {
    var obj = JSON.parse(stringified);
    var objAudios = JSON.parse(jsonAudios);
    //var i;
    for (var audio in objAudios) {
        if (objAudios.hasOwnProperty(audio))
            Mixer.addAudio(Audio.enlarge(objAudios[audio]));
    }
    for (var track in obj.tracks) {
        if (obj.tracks.hasOwnProperty(track))
            Mixer.addTrack(Track.enlarge(obj.tracks[track]));
    }
    /*for (i = 0; i < objAudios.length; ++i)
        Mixer.addAudio(Audio.enlarge(objAudios[i]));
    for (i = 0; i < obj.tracks.length; ++i)
        Mixer.addTrack(Track.enlarge(obj.tracks[i]));*/
    Mixer.setTimelineDuration(obj.duration);
    Mixer.timelineDurationChanger.val(obj.duration);
    Mixer.setName(obj.name);
};

/**
 * Metoda dodaje audio do miksera (muzyka do odsłuchania przed wrzuceniem na linię czasu)
 * @param audio - obiekt Audio do dodania
 */
Mixer.addAudio = function(audio) {
    this.audios[audio.id] = audio;
    audio.dom.appendTo(Mixer.audiosDom);
};

/**
 * Metoda dodaje ścieżkę do miksera
 * @param track - obiekt Track do dodania
 */
Mixer.addTrack = function(track) {
    this.tracks[track.id] = track;
    track.headDom.appendTo(Mixer.trackHeadsDom);
    track.timelineDom.appendTo(Mixer.trackTimelinesDom);
    Storage.actualize();
};

/**
 * Metoda usuwa ścieżkę z miksera
 * @param id - nr id ścieżki która ma być usunięta
 */
Mixer.removeTrack = function(id) {
    this.tracks[id].headDom.remove();
    this.tracks[id].timelineDom.remove();
    for (var i = 0; i < this.tracks[id].samples.length; ++i) {
        for (var j = 0; j < Sample.collection.length; ++j) {
            if (this.tracks[id].samples[i] === Sample.collection[j]) {
                Sample.collection[j] = undefined;
                break;
            }
        }
    }
    delete this.tracks[id];
    Storage.actualize();
};

/**
 * Metoda ustawia czas trwania utworu
 * @param duration - nowy czas trwania utworu w sekundach
 */
Mixer.setTimelineDuration = function(duration) {
    Mixer.timelineDuration = duration;
    Mixer.trackTimelinesDom.css( {
        width: duration * Mixer.pixelsPerSecond + "px"
    });
    Mixer.actualizeTimes();
    Storage.actualize();
};

/**
 * Metoda ustawia współczynnik "rozciągnięcia" linii czasu - jest to ilość pikseli (w szerokości) na 1 sekundę trwania utworu
 * @param pixelsPerSecond - ilość pikseli na sekundę
 */
Mixer.setPixelsPerSecond = function(pixelsPerSecond) {
    Mixer.pixelsPerSecond = pixelsPerSecond;
    var incrementValue = Math.ceil(30 / Mixer.pixelsPerSecond);
    Mixer.trackTimelinesDom.css( {
        backgroundImage: "repeating-linear-gradient(\
            to right,\
            transparent,\
            transparent " + ((incrementValue * pixelsPerSecond) - 1) + "px,\
            rgb(30%, 65%, 80%) " + (incrementValue * pixelsPerSecond) + "px\
        )"
    });
    Mixer.trackTimelinesDom.css( {
        width: (Mixer.timelineDuration * Mixer.pixelsPerSecond) + "px"
    });
    for (var sampleId in Sample.collection) {
        if (Sample.collection.hasOwnProperty(sampleId))
            Sample.collection[sampleId].changeScale(pixelsPerSecond);
    }
    Mixer.actualizeTimes();
};

/**
 * Metoda odtwarza cały utwór
 */
Mixer.play = function() {
    Mixer.isPlaying = true;
    for (var sampleId in Sample.collection) {
        if (Sample.collection.hasOwnProperty(sampleId))
            Sample.collection[sampleId].play(0);
    }
    /*for (var i = 0; i < Sample.collection.length; ++i) {
        if (Sample.collection[i] !== undefined)
            Sample.collection[i].play(0);
    }*/
    Mixer.pipe.css("left", 0);
    Mixer.pipe.show();
    Mixer.playPauseButton.removeClass("icon-play").addClass("icon-pause");
    Mixer.trackTimelinesDom.addClass("dragging");
    var t = 0;
    Mixer.pipeInterval = window.setInterval(function() {
        Mixer.pipe.css("left", (t * Mixer.pixelsPerSecond) + "px");
        t += 0.05;
    }, 50);
    Mixer.stopTimeout = window.setTimeout(function() {
        Mixer.pause();
    }, Mixer.timelineDuration * 1000);
};

/**
 * Metoda pauzuje puszczony utwór
 */
Mixer.pause = function() {
    window.clearTimeout(Mixer.stopTimeout);
    window.clearInterval(Mixer.pipeInterval);
    /*for (var i = 0; i < Sample.collection.length; ++i) {
        if (Sample.collection[i] !== undefined)
            Sample.collection[i].pause();
    }*/
    for (var sampleId in Sample.collection) {
        if (Sample.collection.hasOwnProperty(sampleId))
            Sample.collection[sampleId].pause(0);
    }
    Mixer.pipe.hide();
    Mixer.playPauseButton.removeClass("icon-pause").addClass("icon-play");
    Mixer.trackTimelinesDom.removeClass("dragging");
    Mixer.isPlaying = false;
};

/**
 * Metoda, która powinna być wowołana gdy chcemu zaktualizować czasy cząstkowe trwania utworu (napisy typu "1s", "2s", ...)
 */
Mixer.actualizeTimes = function() {
    Mixer.timeLabels.children(".time-item").remove();
    var t = 0;
    var incrementValue = Math.ceil(30 / Mixer.pixelsPerSecond);
    while (t < Mixer.timelineDuration) {
        var timeItem = $('<div class="time-item"></div>');
        timeItem.css("left", (t * Mixer.pixelsPerSecond) + "px");
        timeItem.text(t + "s");
        timeItem.appendTo(Mixer.timeLabels);
        t += incrementValue;
    }
};

/**
 * Metoda ustawia nazwę utworu
 * @param name - nowa nazwa utworu
 */
Mixer.setName = function(name) {
    Mixer.mixerName.val(name);
    Mixer.name = name;
    Storage.actualize();
};

Mixer.tracks = {};
Mixer.audios = {};
Mixer.pixelsPerSecond = 0;
Mixer.timelineDuration = 0;
Mixer.draggedSample = null;
Mixer.name = null;
Mixer.isPlaying = false;
Mixer.id = null;