let nameH1;
let birthYearSpan;
let heightSpan;
let massSpan;
let filmsDiv;
let planetDiv;
let vehicleSpan;
const baseUrl = `http://localhost:9001/api`;

let localPlanetStore = {};
let localFilmStore = {};

// Runs on page load
addEventListener('DOMContentLoaded', () => {
  nameH1 = document.querySelector('h1#name');
  climateSpan = document.querySelector('span#birth_year');
  diameterSpan = document.querySelector('span#mass');
  populationSpan = document.querySelector('span#height');
  homeworldSpan = document.querySelector('span#homeworld');
  filmsUl = document.querySelector('#films>ul');
  vehicleSpan = document.querySelector('span#vehicle_class');
  const sp = new URLSearchParams(window.location.search);
  const id = sp.get('id');
  getSessionStorage();
  getCharacter(id);
});

// Runs on page Unload
addEventListener("beforeunload", () => {
  storeSessionStorage(); // Save Session Storage Objects 
});

function getSessionStorage () {
  if (sessionStorage.getItem("charStorePlanet")) {
    localPlanetStore = JSON.parse(sessionStorage.getItem("charStorePlanet"));
  }
  
  if (sessionStorage.getItem("charStoreFilm")) {
    localFilmStore = JSON.parse(sessionStorage.getItem("charStoreFilm"));
  }
}

function storeSessionStorage () {
  sessionStorage.setItem("charStorePlanet",JSON.stringify(localPlanetStore));
  sessionStorage.setItem("charStoreFilm",JSON.stringify(localFilmStore));
}

async function getCharacter(id) {
  let character;
  try {
    character = await fetchCharacter(id)
    character.homeworld = await fetchHomeworld(character, id)
    character.films = await fetchFilms(character, id)
    character.vehicle = await fetchVehicle(character);
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
  if (id in localPlanetStore) {
    return localPlanetStore[id]
  }
  else {
    const url = `${baseUrl}/planets/${character?.homeworld}`;
    let planet = await fetch(url)
    .then(res => res.json())
    addtoLocalStore("planets", planet, id)
    return planet;
  }
}

async function fetchFilms(character, id) {
  if (id in localFilmStore) {
    return localFilmStore[id]
  } else {
    const url = `${baseUrl}/characters/${character?.id}/films`;
    let films = await fetch(url)
      .then(res => res.json())
    addtoLocalStore("films", films, id)
    return films;
  }
}

async function fetchVehicle(character) {
    const url = `${baseUrl}/vehicles/${character?.id}`;
    const response = await fetch(url)
    if (!response.ok) return null
    const vehicle = await response.json();
    return vehicle.vehicle_class;
  
}

const renderCharacter = character => {
  document.title = `SWAPI - ${character?.name}`;  // Just to make the browser tab say their name
  nameH1.textContent = character?.name;
  populationSpan.textContent = character?.height;
  diameterSpan.textContent = character?.mass;
  climateSpan.textContent = character?.birth_year;
  homeworldSpan.innerHTML = `<a href="/planet.html?id=${character?.homeworld.id}">${character?.homeworld.name}</a>`;
  const filmsLis = character?.films?.map(film => `<li><a href="/film.html?id=${film.id}">${film.title}</li>`);
  filmsUl.innerHTML = filmsLis.join("");

  if (character?.vehicle) {
    vehicleSpan.innerHTML = `<a href="/vehicle.html?id=${character?.id}">${character?.vehicle}</a>`;
  } else {
    vehicleSpan.textContent = "No vehicle assigned";
  } 
};

function addtoLocalStore(type, data, id) {
  if (type === "planets") {
    localPlanetStore[id] = data; // to-do, filter extra data out
  } else if (type === "films") {
    localFilmStore[id] = data;
  }
}