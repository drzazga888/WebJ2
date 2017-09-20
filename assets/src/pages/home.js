import React from 'react'

import previewImg from '../img/preview.png'

const HomePage = () => (
    <div>
        <section className="important-section">
            <h3><strong>Web<em>J</em></strong> służy to tworzenia muzyki na podstawie kawałków audio, które można przenosić na oś czasu.</h3>
        </section>
        <section>
            <h3>Jak używać</h3>
            <p>Przed pierwszym użyciem miksera utworów należy się zarejestrować. Po rejestracji będzie można się zalogować. Panele logowania, rejestracji oraz opcja wylogowania znajdują się na samej górze strony, po prawej stronie - należy najechać kursorem na nazwę użytkownika by rozwinął się odpowiedni panel.</p>
            <p>Po zalogowaniu można przejść do wyboru utworów klikając na pozycję Projekty w menu głównym. Można tam wybrać istniejące utwory, usunąć je lub stworzyć nowe.</p>
            <p>Wygląd miksera:</p>
            <p><img src={previewImg} alt="podgląd miksera" /></p>
            <p>Elementy miksera:</p>
            <ul>
                <li>Mikser - plansza, która zawiera ścieżki (tracki) na których można tworzyć muzykę.</li>
                <li>Pliki audio - są to elementy źródłowe z muzyką. Można w nie kliknąć i je odsłuchać. Gdy utwór się skończy, przestaną grać. Można też je odkliknąć, wtedy natychmiast przestaną grać. Gdy zdecydujemy się na wrzucenie któregoś pliku audio do naszego miksera dźwięków, należy przeciągnąć go do odpowiedniej ścieżki</li>
                <li>Ścieżki - pola na linii czasu z odpowiednio przyciętymi kawałkami audio. Może być ich dowolna ilość, pomagają w zrównolegleniu odtwarzania muzyki. Każda ścieżka może mieć ustawioną nazwę przez użytkownika. Ścieżki można dodawać i usuwać w programie (odpowiednie przyciski)</li>
                <li>Sample - kawałki muzyki odpowiednio przycięte i ustawione na ścieżce. Można je przesuwać. By dodać sample do utworu, należy przeciągnąć Audio na Track. Istnieje możliwość zmiany długości trwania dzwięku, offsetu (czyli przesunięcie utworu), punktu startu (początek sampla) oraz wzmocnienia. Sample usuwa się poprzez kliknięcie przycisku usuwania w prawej górnej części sampla.</li>
            </ul>
            <p>Dodatkowe elementy:</p>
            <ul>
                <li>Pryzbliżanie i oddalanie pola widzenia (suwak obok napisu "rozciągnij")</li>
                <li>Zmiana nazwy całego utworu</li>
            </ul>
            <p>Aby puścić muzykę należy kliknąć przycisk "Graj". Możemy albo zatrzyać utwór albo poczekać aż się skończy.</p>
        </section>
    </div>
)

export default HomePage