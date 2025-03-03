let nameH1;
let birthYearSpan;
let heightSpan;
let massSpan;
let filmsDiv;
let planetDiv;
const baseUrl = `http://localhost:9001/api`;

let planetsArray = {};   // to do rename item so its an object not array oops
let filmsArray = {};

// Runs on page load
addEventListener('DOMContentLoaded', () => {
  nameH1 = document.querySelector('h1#name');
  climateSpan = document.querySelector('span#birth_year');
  diameterSpan = document.querySelector('span#mass');
  populationSpan = document.querySelector('span#height');
  homeworldSpan = document.querySelector('span#homeworld');
  filmsUl = document.querySelector('#films>ul');
  const sp = new URLSearchParams(window.location.search)
  const id = sp.get('id')
  getCharacter(id)
});

async function getCharacter(id) {
  let character;
  try {
    character = await fetchCharacter(id)
    character.homeworld = await fetchHomeworld(character, id)
    character.films = await fetchFilms(character, id)
  }
  catch (ex) {
    console.error(`Error reading character ${id} data.`, ex.message);
  }
  renderCharacter(character);

}
async function fetchCharacter(id) {
  let characterUrl = `${baseUrl}/characters/${id}`;
  return await fetch(characterUrl)
    .then(res => res.json())
}

async function fetchHomeworld(character, id) {
  if (id in filmsArray) {
    return filmsArray.id
  }
  else {
    const url = `${baseUrl}/planets/${character?.homeworld}`;
    const planet = await fetch(url)
    .then(res => res.json())
    addtoLocalStore("planets", planet, id)
    return planet;
  }
}

async function fetchFilms(character, id) {
  if (id in planetsArray) {
    return planetsArray.id
  }
  else {
    const url = `${baseUrl}/characters/${character?.id}/films`;
    const films = await fetch(url)
      .then(res => res.json())
    addtoLocalStore("films", films, id)
    return films;
  }

}

const renderCharacter = character => {
  document.title = `SWAPI - ${character?.name}`;  // Just to make the browser tab say their name
  nameH1.textContent = character?.name;
  populationSpan.textContent = character?.height;
  diameterSpan.textContent = character?.mass;
  climateSpan.textContent = character?.birth_year;
  homeworldSpan.innerHTML = `<a href="/planet.html?id=${character?.homeworld.id}">${character?.homeworld.name}</a>`;
  const filmsLis = character?.films?.map(film => `<li><a href="/film.html?id=${film.id}">${film.title}</li>`)
  filmsUl.innerHTML = filmsLis.join("");
}


function addtoLocalStore(type, data, id) {
  if (type === "planets") {
    planetsArray.id = data; // to-do, filter extra data out
  } else if (type === "films") {
    filmsArray.id = data;
  }
}