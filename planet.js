let planetNameH1;
let climateSpan;
let populationSpan;
let diameterSpan;
let charactersUl;
let filmsUl;

const baseUrl = `http://localhost:9001/api`;

let localCharacterStore = {};
let localFilmStore = {};

addEventListener('DOMContentLoaded', () => {
  planetNameH1 = document.querySelector('h1#name');
  climateSpan = document.querySelector('span#climate');
  diameterSpan = document.querySelector('span#diameter');
  populationSpan = document.querySelector('span#population');
  charactersUl = document.querySelector('#characters>ul');
  filmsUl = document.querySelector('#films>ul');
  const sp = new URLSearchParams(window.location.search);
  const id = sp.get('id');
  getSessionStorage();
  getPlanetPageInfo(id);
});

// Runs on page Unload
addEventListener("beforeunload", () => {
    storeSessionStorage(); // Save Session Storage Objects 
});
  
function getSessionStorage () {
if (sessionStorage.getItem("planetStoreChar")) {
    localCharacterStore = JSON.parse(sessionStorage.getItem("planetStoreChar"));
}

if (sessionStorage.getItem("planetStoreFilm")) {
    localFilmStore = JSON.parse(sessionStorage.getItem("planetStoreFilm"));
}
}

function storeSessionStorage () {
    sessionStorage.setItem("planetStoreChar",JSON.stringify(localCharacterStore));
    sessionStorage.setItem("planetStoreFilm",JSON.stringify(localFilmStore));
}

async function getPlanetPageInfo(id) {
    const planetUrl = `${baseUrl}/planets/${id}`
    let planet;

    try {
        planet = await fetchPlanet(planetUrl);
        planet.characters = await fetchCharacters(planetUrl, id);
        planet.films = await fetchFilms(planetUrl, id);
    } catch (e) {
        console.error(`Error reading planet ${id} data.`, e.message);
    }

    renderPlanet(planet);
}

async function fetchPlanet(planetUrl) {
    return await fetch(planetUrl)
        .then(res => res.json())
}

async function fetchCharacters(planetUrl, id) {
    if (id in localCharacterStore) {
        return localCharacterStore[id]
    } else {
        let characters =  await fetch(`${planetUrl}/characters`)
            .then(res => res.json())
        addtoLocalStore("characters", characters, id)
        return characters
    }
}

async function fetchFilms(planetUrl, id) {
    if (id in localFilmStore) {
        return localFilmStore[id]
    } else {
        let films = await fetch(`${planetUrl}/films`)
            .then(res => res.json())
        addtoLocalStore("films", films, id)
        return films;
    }
}

const renderPlanet = planet => {
    document.title = `SWAPI - ${planet.name}`;
    planetNameH1.textContent = planet.name;
    climateSpan.textContent = planet.climate;
    diameterSpan.textContent = planet.diameter;
    populationSpan.textContent = planet.population;
    renderFilms(planet);
    renderCharacters(planet);
}

const renderFilms = (planet) => {
    planet.films.forEach(film => {
        let listItem = document.createElement('li');
        listItem.innerHTML  = `<li><a href="/film.html?id=${film.id}">${film.title}<li>`;
        filmsUl.appendChild(listItem);
    });
}

const renderCharacters = (planet) => {
    planet.characters.forEach(character => {
        let listItem = document.createElement('li');
        listItem.innerHTML  = `<li><a href="/character.html?id=${character.id}">${character.name}<li>`;
        charactersUl.appendChild(listItem);
    });
}

function addtoLocalStore(type, data, id) {
    if (type === "films") {
      localFilmStore[id] = data; // to-do, filter extra data out
    } else if (type === "characters") {
      localCharacterStore[id] = data;
    }
  }