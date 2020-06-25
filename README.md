# Kalas

Kalas er en webapplikasjon som tilbyr muligheten for sammenslåing av fester. Ved hjelp av en kartfunksjon kan brukere se andre kalas (fester) i nærheten, og sende forespørsel om å sammenslå. Webapplikasjonen har også mulighet til å legge til og fjerne medlemmer samt spille selskapsleken Børst. I tillegg til denne funksjonaliteten er det også tatt hensyn til brukerenes sikkerhet.

# Motivasjon

Motivasjonen bak Kalas stammer av at det er mange som har både mulighet og lyst til å feste med en større gjeng, men har ingen i deres omgangskrets som kan. Der skal Kalas tilrettelegge for at likesinnede gjenger kan finne hverandre.

# Logo

![Alt text](/frontend/public/logo_blå.png?raw=true "Kalas logo - blå")

# Kodestil

For kodestil i backend som er skrevet i python, er det PEP8 som er brukt.

For CSS- og Javascriptfiler brukes formatteringsverktøyet Prettier, som man kan lære mer om [her](https://prettier.io). Vi har også satt opp IDE-ene vi bruker til å formattere hver gang endringer lagres, dette anbefales dersom man skal videreutvikle/endre produktet.

# Installering

Webapplikasjonen er todelt:

- Frontend (React), som er webapplikasjonens utseende og funkjsonalitet
- Backend (Django), som lagrer brukerenes data samt verifiserer innlogging/registrering

For å kunne kjøre Kalas må man laste ned koden og installere backend- og frontend-dependencies. I tillegg til dette må man starte både frontend-serveren og backend-serveren for å kunne kjøre webapplikasjonen.

## Nedlastning av kode

For å laste ned produktet må man gjøre følgende:

**Steg 1:**

Gå til "Repository", trykk på "Clone" og kopier HTTPS URL-en

**Steg 2:**

Åpne opp terminalen, og gå til mappen der du ønsker å ha prosjektet

**Steg 3:**

Skriv inn følgende: `git clone URL` hvor man erstattert URL med den kopierte URL-en fra første steg.

Prosjektet skal nå være klonet på din maskin.

## Installering av backend-dependencies

### Python

Backend delen av dette produktet er skrevet i python så for å kunne kjøre koden må brukeren ha installert python på datamaskinen. Dette kan enkelt gjøres ved å gå [her](https://www.python.org/downloads/), og laste ned den nyeste versjonen for ditt operativsystem (per dags dato er dette 3.8.2).

### Rammeverk og avhengigheter

Dette produktet bruker en del rammeverk som er skrevet i Python, og disse rammeverkene må installeres for å kunne starte applikasjonen.

Alle rammeverkene installeres via terminalen med pip og gjøres ikke via en nettside.

### Django

Django er rammeverket for hele databasen som gjør det mulig å opprette tabeller som kan lagre instanser av brukere, kalas og medlemmer i kalaset.

For å installere Django, skriv i terminalen:

    pip install django

Hvis man har lyst å lese mer om Django kan det gjøres [her](https://www.djangoproject.com/).

### Django REST framework

Django REST framework er rammeverket som er brukt for å lage en REST API i produktet slik at frontend kan kommunisere med backend.

For å installere Django REST framework, skriv i terminalen:

    pip install djangorestframework

Hvis man har lyst til å lese mer om Django REST framework kan det gjøres [her](https://www.django-rest-framework.org/).

### Django-cors-headers

For at andre enheter som er på nettsiden skal ha tilgang til databasen bruker applikasjonen django-cors-headers rammeverket.

For å installere django-cors-headers, skriv i terminalen:

    pip install django-cors-headers

Hvis man har lyst å lese mer om django-cors-headers så kan det gjøres [her](https://pypi.org/project/django-cors-headers/).

### Google Maps

Applikasjonen bruker en API fra Google Maps for å kunne finne koordinatene til brukernes kalas. For å kunne bruke api’en må man installere noen funksjonene som koden bruker.

For å installere disse funksjonene, skriv i terminalen:

    pip install -U googlemaps

For å kunne bruke API'en fra Google trenger man en nøkkel som identifiserer brukeren. Denne nøkkelen kan man se hvordan man får [her](https://developers.google.com/maps/documentation/geocoding/get-api-key).

For å skrive inn denne nøkkel går man til:

    42/backend/database/user/google.py

og endrer nøkkel markert av kode.

For testing av programmet mens prosjektet ikke er offentlig kan den nåværende nøkkelen stå, men ved ekstesivt bruk av programmet er det ønskelig at brukeren bruker sin egen nøkkel.

Hvis man vil lese mer om kodebiblioteket for Google Maps api'en som er brukt kan det gjøres [her](https://github.com/googlemaps/google-maps-services-python).

Nå skal du ha installert alle avhengigheter som er nødvendig for applikasjonen sin backend-server.

## Hvordan starte backend-serveren

**Oppstart av backend-server**

Nå som alle avhengighetene er installert kan applikasjonen startes. For å starte backend-serveren følg stegende under. Hvis dette er første gang backend-serveren startes må steg 2, 3 og 4 følges. Ellers kan disse stegene ignoreres.

NB! Dersom "python3" ikke fungerer, prøv å bruke "python" istedenfor i stegene nedenfor.

**Steg 1:** Åpne terminalvinduet

Åpne terminalen i mappen django_kalas, stien for denne mappen er:

    42/backend/database

**Steg 2:** Make migrations

Når terminalviduet er åpnet i den riktige mappen, skriv i terminalen:

    python3 manage.py makemigrations user

**Steg 3:** Migrate

Etter kommandoen fra steg 2 er skrevet i terminalen, skriv i terminalen:

    python3 manage.py migrate

**Steg 4:** Lage en admin-bruker

For å lage en administrerende bruker og få tilgang admin-nettsiden, skriv i terminalen:

    python3 manage.py createsuperuser

Etter å ha skrevet dette blir du spurt om å skrive inn et brukernavn for kontoen din, så emailen din, og til slutt et passord og bekrefte passordet som ble skrevet inn. Brukernavnet og passordet er det som brukes for å logge inn på admin-nettsinden.

**Steg 5:** Starte serveren

For å starte backend-serveren på datamaskinen, skriv i terminalen:

    python3 manage.py runserver

dette vil automatisk sette serveren sin IP-adresse til 127.0.0.1 og port number 8000 for å sette denne IP-adressen til maskinens egen IP-adresse skriver man:

    python3 manage.py runserver "IP-adressen":"den ønskede porten"

**Steg 6:** Avslutte serveren

For å avslutte backend-serveren bruk kommandoen CTRL+C i terminalen.

## Installering av frontend-dependencies

### Node.js og npm

Frontend-delen av Kalas er utviklet ved bruk av Javascript-bibloteket React, og er bygget på plattformen Node.js i tillegg til npm, som følger med Node.js. Node.js kan lastes ned [her](https://nodejs.org/en/download/).

### package.json

package.json er en fil som inneholder alle Node.js-dependencies som er brukt i frontend-delen av Kalas.

For å installere alle de nødvendige frontend-dependencies må man, i terminalen, gå til frontend-mappen, som har sti:

```
42/frontend
```

Skriv deretter inn følgende kommando i terminalen:

```
npm install
```

Nå skal du ha installert alle avhengigheter som er nødvendig for applikasjonen sin frontend-server.

### API

#### Fetch API og Axios

For kommunikasjon mellom frontend-serveren og backend-serveren brukes det to API-er:

- Fetch-API, som det kan leses mer om [her](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- Axios, som det kan leses mer om [her](https://github.com/axios/axios)

Disse API-ene ligger i package.json og blir installert når man skriver `npm install`.
API-ene tar inn en sti som argument, i dette tilfelle er det en IP-addressen til databasen. Dersom man endrer stien til databasen må også dette endres i koden.

##### Endring av database-sti

Databasestien er i koden satt til å være

```
//127.0.0.1:8000
```

som også kan skrives som

```
//localhost:8000
```

For å endre stien til databasen må man gjøre følgende endringer i koden:

**Steg 1:** App.js

I filen App.js som har sti `42/frontend/src/App.js`, må man i App-klassen sin konstruktør endre følgende variabel

```
this.database_url = "//127.0.0.1:8000";
```

Man erstatter altså "//127.0.0.1:8000".

**Steg 2:** MapClass.js

I filen MapClass.js som har sti `42/frontend/src/components/layouts/MapClass.js`, må man endre på følgende variabler:

```
const database_url_coordinates = "//localhost:8000/api/coordinates/";
const database_url_requests = "//localhost:8000/api/requests/";
const database_url_names = "//localhost:8000/api/names/";
```

Avhengig av hvordan databasen er satt opp må "//localhost:8000", og resten av stien endres.

**Steg 3:** Borst.js

I filen Borst.js som har sti `42/frontend/src/components/pages/Borst.js`, må man i funksjonen `componentDidMount()` endre på følgende variabel:

```
const url = "http://127.0.0.1:8000/api/users/";
```

Avhengig av hvordan databasen er satt opp må "http://127.0.0.1:8000", og resten av stien endres.

**Steg 4:** LoggedIn.js

I filen Logged.js som har sti `42/frontend/src/components/pages/LoggedIn.js`, må man endre på følgende variabel:

```
const database_url_requests = "//localhost:8000/api/requests/";
```

Avhengig av hvordan databasen er satt opp må "//localhost:8000", og resten av stien endres.

Dersom man har fulgt alle stegene skal skal frontend-serveren kunne hente informasjon fra backend-serveren.

#### Geocode

For å vise og sette markører på kartet brukes Geocode-modulen som er bygget på Google Maps Geocoding API, som man kan lese mer om [her](https://developers.google.com/maps/documentation/geocoding/intro)

Denne API-ene ligger i package.json og blir installert når man skriver `npm install`.

For å bruke denne API-en kreves det en nøkkel. Dersom man ikke har en nøkkel, se [her](https://developers.google.com/maps/documentation/geocoding/get-api-key).

##### Hvordan endre nøkkel

Dersom man skal endre nøkkel må man gjøre følgende endring i koden:

I filen MapClass.js som har sti `42/frontend/src/components/layouts/MapClass.js`, må man skrive følgende i Map-funksjonen:

```
Geocode.setApiKey("DIN_NØKKEL");
```

gitt at man bruker nøkkelen DIN_NØKKEL.

## Hvordan starte frontend-serveren

For å starte frontend-serveren i development-mode må man, i terminalen, gå til frontend-mappen, som har sti:

```
42/frontend
```

og skrive inn følgende kommando:

```
npm start
```

Frontend-serveren skal nå være oppe, og dersom backend-serveren er oppe skal webapplikasjonen fungere.

# Hvordan kjøre tester
Naviger deg frem til frontend mappen

Kjør npm install med mindre dette er gjort tidligere.

```
npm install
```

Deretter installer Enzyme(et bibliotek som gjør det enklere å skrive tester for React komponenter)

```
npm i --save-dev enzyme enzyme-adapter-react-16
```

Kjør testene

```
npm test
```

# Brukermanual

[Se wikisiden her](https://gitlab.stud.idi.ntnu.no/tdt4140-2020/42/-/wikis/Brukermanual)
