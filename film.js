let filmNameH1;
let releaseDate;
let director;
let episode;
const baseUrl = `http://localhost:9001/api`;


addEventListener('DOMContentLoaded', () => {
  filmNameH1 = document.querySelector('h1#filmName');
  releaseDate = document.querySelector('span#releaseDate');
  director = document.querySelector('span#director');
  episode = document.querySelector('span#episode');
  charactersUl = document.querySelector('#characters>ul');
  planetsUl = document.querySelector('#planets>ul');

  const sp = new URLSearchParams(window.location.search)
  const id = sp.get('id')

  getFilm(id)
});

async function getFilm(id) {
  let film;
  try {
    film = await fetchFilm(id)
    film.characters = await fetchCharacter(id)
    film.planets = await fetchPlanets(id)
  }
  catch (ex) {
    console.error(`Error reading film ${id} data.`, ex.message);
  }
  renderFilm(film);

}
async function fetchFilm(id) {
  let filmUrl = `${baseUrl}/films/${id}`;
  return await fetch(filmUrl)
    .then(res => res.json())
}

async function fetchCharacter(id) {
  const url = `${baseUrl}/films/${id}/characters`;  
  const character = await fetch(url)
    .then(res => res.json())
  return character;
}

async function fetchPlanets(id) {
  const url = `${baseUrl}/films/${id}/planets`;  
  const films = await fetch(url)
    .then(res => res.json())
  return films;
}

const renderFilm = film => {
  document.title = `SWAPI - ${film?.title}`;  
  filmNameH1.textContent = film?.title;
  releaseDate.textContent = film?.release_date;
  director.textContent = film?.director;
  episode.textContent = film?.episode_id;

  const planetLis = film?.planets?.map(planet => `<li><a href="/planet.html?id=${planet.id}">${planet.name}</a></li>`)
  planetsUl.innerHTML = planetLis?.join("");

  const characterLis = film?.characters?.map(character => `<li><a href="/character.html?id=${character.id}">${character.name}</a></li>`)
  charactersUl.innerHTML = characterLis.join("");
}