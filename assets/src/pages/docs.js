import React from 'react'

const DocsPage = () => (
    <div>
        <h2>Dokumentacja</h2>
        <section>
            <h3>Klient - JavaScript</h3>
            <p>Aplikacja po stronie klienta składa się z plików <code>js</code>.</p>
            <p>Podkatalog: assets/js/</p>
            <ul>
                <li>Audio.js - zawiera obiekt Audio na podstawie którego można tworzyć obiekty które reprezentują pojedyńczy utwór do przeciągnięcia na linię czasową</li>
                <li>Sample.js - jest tam obiekt Sample, który reprezentuje przeciągnięty utwór na track</li>
                <li>Track.js - zawiera obiekt Track na podstawie którego można utworzyć nową linię czasową</li>
                <li>Mixer.js - jest tam obiekt spajający wszystkie elementy miksera w całość</li>
                <li>Storage.js- zarządza połączeniem serwerem i local storage. Wykrywanie jest tam np. czy aplikacja jest online, wysyła żądania AJAX do serwera</li>
            </ul>
        </section>
        <section>
            <h3>SOX - Sound eXchange</h3>
            <p>Program sox, który zainstalowany jest na serwerze, pozwala wygnerować gotowy plik audio z utworem.</p>
            <p>Link do projektu: <a href="http://sox.sourceforge.net/" target="_blank">http://sox.sourceforge.net/</a></p>
        </section>
    </div>
)

export default DocsPage