import React from 'react'

import previewImg from '../img/preview.png'

const HomePage = () => (
    <div>
        <section className="important-section">
            <h3><strong>Web<em>J</em></strong> służy to tworzenia muzyki na podstawie kawałków audio, które można przenosić na oś czasu.</h3>
            <p>Gdy aplikacja jest połączona z serwerem (stan połączenia na samym dole strony podczas tworzenia muzyki) non stop wysyła dane na temat utworu na serwer. Gdy aplikacja wykryje brak połączenia, to dane przechowywane są lokalnie dopóki połączenie nie zostanie przywrócone. Gdy użytkownik znajdzie się w takim stanie, to w momencie wyłączanie aplikacji zostanie poinformowany okienkiem dialogowym.</p>
        </section>
        <section>
            <h3>Jak używać</h3>
            <p>Przed pierwszym użyciem miksera utworów należy się. Po rejestracji będzie można się zalogować. Panel logowania, rejestracji i wylogowywania znajduje się na samej górze strony internetowej, po prawej stronie - należy kliknąć na stan by rozwinął się odpowiedni panel.</p>
            <p>Po zalogowaniu można przejść do wyboru utworów klikając na podstonę Mixer. Można tam wybrać istniejące utwory, usunąć je lub stworzyć nowy utwór.</p>
            <p>Wygląd miksera:</p>
            <p><img src={previewImg} alt="podgląd miksera" /></p>
            <p>Elementy miksera:</p>
            <ul>
                <li>Mikser - plansza, która zawiera ścieżki (tracki) na których można tworzyć muzykę.</li>
                <li>Audio - są to elementy źródłowe z muzyką. Można w nie kliknąć i je odsłuchać. Gdy utwór się skończy, przestaną grać. Można też je odkliknąć, wtedy natychmiast przestaną grać. Gdy zdecydujemy się na wrzucenie tego kawałka do naszego miksera dźwięków, należy przeciągnąć go do odpowiedniego</li>
                <li>Track - ścieżka z odpowiednio przyciętymi kawałkami muzyki. Może być ich dowolna iliść w projekcie, służą do zrównoleglenia odtwarzania muzyki. Każdy track może mieć ustawioną nazwę przez użytkownika. Tracki można dodawać i usuwać w programie (odpowiednie przyciski)</li>
                <li>Sample - kawałki muzyki odpowiednio przycięte i ustawione na ścieżce. Można je przesuwać. By dodać sample do utworu, należy przeciągnąć Audio na Track. Istnieje także możliwość zmiany długości trwania utworu (max. 999.99s) oraz zmienić start (czyli przesunięcie utworu). Sample usuwa się poprzez przeciągnięcie je na zewnątrz</li>
            </ul>
            <p>Dodatkowe elementy:</p>
            <ul>
                <li>Pryzbliżanie i oddalanie pola widzenia (przycisk "+" - "-" obok napisu "rozciągnij")</li>
                <li>Zmiana długości utworu (domyślnie 16s, zakres: 0.1s - 999.99s</li>
                <li>Zmiana nazwy całego utworu</li>
            </ul>
            <p>Aby puścić muzykę należy kliknąć przycisk "Graj". W tym momecie nie można przesuwać i modyfikować sampli. Możemy albo zatrzyać utwór albo poczekać aż się skończy (patrz: zmiana długości utworu).</p>
        </section>
        <section>
            <h3>Ostrzeżenia</h3>
            <ul>
                <li>Aplikacja była testowania na przeglądarce firefox. Jest to więc zalecana przeglądarka do testowania.</li>
            </ul>
        </section>
    </div>
)

export default HomePage