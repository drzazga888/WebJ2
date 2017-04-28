# WebJ2
Projekt na Zaawansowane Techniki Internetowe - JEE (RESTful) + React.js

## 1. Streszczenie projektu

Celem projektu będzie stworzenie narzędzia do tworzenia muzyki.

W założeniu aplikacja powinna udostępniać:
- interfejs do wczytywania fragmentów muzyki (tzw. „sample”), które chcielibyśmy użyć w procesie tworzenia,
- ekran tzw. „miksera”, w którym można będzie przeciągać omawiane sample do wybranej ścieżki na osi czasu,
- odsłuchanie tworzonego projektu w mikserze,
- zapisywanie swoich projektów,
- logowanie i rejestrację,
- wyprodukowanie muzyki na podstawie projektu i zwrócenie go w wybranym formacie muzycznym (np. .wav czy .mp3).

## 2. Wymagania

- Rejestracja, logowanie oraz opcja „wyloguj się” dostępna po zalogowaniu,
- Prosty panel użytkownika:
  - Zmiana adresu e-mail,
  - Zmiana hasła,
  - Ostatnia aktywność (np. kilka ostatnich logowań).
- Zarządzanie ogólne swoimi projektami:
  - Zmiana nazwy projektu,
  - Tworzenie nowego projektu,
  - Usuwanie projektu.
- Zarządzanie posiadanymi samplami:
  - Wczytywanie sampli z pliku,
  - Usuwanie sampli,
  - Możliwość odsłuchania sampli,
  - Zmiana nazwy sampli,
  - Wyświetlenie informacji o długości sampla.
- Panel miksera – czyli zasadnicze tworzenie muzyki:
  - Możliwość przenoszenia sampli do ścieżek na osi czasu,
  - Zarządzanie dostępnymi ścieżkami:
    - Dodawanie ścieżki
    - Usuwanie ścieżki
    - Zmiana nazwy ścieżki
    - Ustawienie głośności całej ścieżki
  - Zarządzanie samplami na osi czasu (na konkretnej ścieżce):
    - Zmiana pozycji sampla na osi czasu,
    - Zmiana długości sampla,
    - Przesunięcie w graniu sampla (zmiana „offsetu” sampla),
    - Zmiana głośności sampla,
    - Przyśpieszanie / zwalnianie sampla,
    - Usuwanie sampla ze ścieżki,
    - Przenoszenie sampla na inną ścieżkę w osi czasu.
  - Automatyczne dostosowywanie długości trwania tworzonej muzyki,
  - Wyświetlenie długości trwania utworu,
  - Odsłuchanie utworzonego utworu:
    - Manipulacja wskaźnikiem aktualnej pozycji w graniu muzyki (tzw. „crosshair”),
    - Puszczanie i zatrzymywanie muzyki,
    - Podgląd, w jakim momencie znajduje się aktualnie wskaźnik grania.
  - Zmiana skali osi czasu (ilość wyświetlanych pikseli przypadających na 1 sekundę),
  - Wybiórcze zaznaczenie na osi czasu równoodległych wartości czasowych (np. 0s, 1s, 2s, itd...)
- Możliwość tworzenia muzyki poprzez np. kliknięcie przycisku „utwórz”.

## 3. Technologie

API będzie udostępnione jako REST-owe endpointy, natomiast front-end zostanie wykonany w ReactJS.

Aby umożliwić tworzenie muzyki, użyta zostanie biblioteka „BEADS” (http://www.beadsproject.net/).

We front-endzie prawdopodobnie wykorzystana zostaną następujące technologie:
- DRAG & DROP (w celu np. przeciągania sampli na ścieżkę, https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API),
- Web Audio API (https://developer.mozila.org/en-US/docs/Web/API/Web_Audio_API).

## 4. Główne problemy, z jakimi będzie trzeba się zmierzyć

- Uwierzytelnianie z technologią RESTful,
- Umiejętne napisanie stylów i odpowiednie umiejscowienie reactowych elementów UI w celu stworzenia przyjaznego interfejsu dla użytkownika,
- Możliwe jak największe wsparcie dla przeglądarek internetowych,
- Opanowanie biblioteki muzycznej BEADS lub znalezienie innej; ewentualny problem z eksportowaniem bibliotek projektu do serwisu Bluemix,
- Ewentualna zbyt mała ilość miejsca (lub innych zasobów) w przestrzeni chmurowej na przechowywanie plików muzycznych,
- Sposób przechowywania plików muzycznych (w bazie lub w systemie plików).
