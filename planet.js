let planetNameH1;
let climateSpan;
let populationSpan;
let diameterSpan;
let charactersUl;
let filmsUl;

const baseUrl = `http://localhost:9001/api`;


addEventListener('DOMContentLoaded', () => {
  planetNameH1 = document.querySelector('h1#name');
  climateSpan = document.querySelector('span#climate');
  diameterSpan = document.querySelector('span#diameter');
  populationSpan = document.querySelector('span#population');
  charactersUl = document.querySelector('#characters>ul');
  filmsUl = document.querySelector('#films>ul');
  const sp = new URLSearchParams(window.location.search)
  const id = sp.get('id')
  getPlanetPageInfo(id)
});

async function getPlanetPageInfo(id) {
    const planetUrl = `${baseUrl}/planets/${id}`
    let planet;

    try {
        planet = await fetchPlanet(planetUrl);
        planet.characters = await fetchCharacters(planetUrl);
        planet.films = await fetchFilms(planetUrl);
    } catch (e) {
        console.error(`Error reading planet ${id} data.`, e.message);
    }

    renderPlanet(planet);
}

async function fetchPlanet(planetUrl) {
    return await fetch(planetUrl)
        .then(res => res.json())
}

async function fetchCharacters(planetUrl) {
    return await fetch(`${planetUrl}/characters`)
        .then(res => res.json())
}

async function fetchFilms(planetUrl) {
    return await fetch(`${planetUrl}/films`)
        .then(res => res.json())
}

const renderPlanet = planet => {
    document.title = `SWAPI - ${planet.name}`;
    planetNameH1.textContext = planet.name;
    climateSpan.textContext = planet.climate;
    diameterSpan.textContext = planet.diameter;
    populationSpan.textContext = planet.population;
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