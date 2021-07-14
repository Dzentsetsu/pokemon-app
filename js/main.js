/*
Below this comment we declare global variables
*/
const pokemon_api_url = "https://pokeapi.co/api/v2/pokemon/";
const pokemon_img_endpoint = "https://pokeres.bastionbot.org/images/pokemon/";
let numberOfClicks = 0;
/*
Above this comment we global variables
*/
////////////////////////////////////////////////////////
/*
Below this comment we declare async functions
*/

// This function fetches pokemon by specific id
async function fetchPokemonByID(num) {
  if (Number.isNaN(num)) return;
  const url = pokemon_api_url + num;

  const obj = await fetch(url);
  const data = await obj.json();

  createPokemonCard(data);
}

// This function fetching random pokemon on DOMContentLoaded
async function fetchRandomPokemon() {
  let num = Math.floor(Math.random() * 898);

  let data = await fetch(`${pokemon_api_url}${num}`);
  let pokemonRawData = await data.json();

  createPokemonCard(pokemonRawData);
}

// This function fecthing Pokemons. limit - how many pokemons you want to get. offset is id offset
async function fetchPokemons(limit = 0, offset = 10) {
  let data;
  if (Number.isInteger(limit) && Number.isInteger(offset)) {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    let obj = await fetch(url);
    data = await obj.json();

    pokemon_arr = data.results;
    pokemon_arr.forEach((elem) => {
      fetchPokemonByID(elem);
    });
  } else return;
}
/*
Above this comment we declare async functions
*/
////////////////////////////////////////////////////////
/*
Below this comment we functions
*/
function createPokemonCard(pokemonObj) {
  // Creating container for pokemon card
  const fragment = document.createDocumentFragment();
  const card = document.createElement("div");
  const pokedexSection = document.getElementById("pokedex");
  card.classList.add("pokemon-card-container");
  fragment.appendChild(card);
  // This line makes container have width of its child img
  card.style.width = "max-content";

  //Creating empty div behind the img to style background
  const epmtyDiv = document.createElement("div");
  card.appendChild(epmtyDiv);
  epmtyDiv.style.height = 210;
  epmtyDiv.classList.add("circle-background");

  // Creating avatar for pokemon card from another API (cause png from there is way better)
  const img = document.createElement("img");
  epmtyDiv.appendChild(img);
  img.width = 210;
  img.height = 210;
  img.src = `${pokemon_img_endpoint}${pokemonObj.id}.png`;

  // Creating pokemon id
  let p = document.createElement("p");
  p.innerText = `# ${pokemonObj.id}`;
  p.classList.add("pokemon-id");
  card.appendChild(p);

  // Creating h5 with pokemon name in it
  let h5 = document.createElement("h5");
  h5.classList.add("pokemon-name");
  h5.innerText = `${pokemonObj.name}`;
  card.appendChild(h5);

  // Creating Pokemon types
  const types = getPokemonTypes(pokemonObj);
  const labels = makePokemonTypeLabels(types);

  for (let i = 0; i < labels.length; i++) {
    card.appendChild(labels[i]);
  }

  pokedexSection.appendChild(fragment);
}

// Making Labels for every type this pokemon has
function makePokemonTypeLabels(types) {
  if (!Array.isArray(types)) return;
  if (types.length === 0) return;

  let temp = [];

  types.forEach((elem) => {
    let span = document.createElement("span");
    span.classList.add(`${elem}`);
    span.innerText = elem;
    temp.push(span);
  });

  return temp;
}

function createPokemonCards() {
  for (let i = 0; i < pokemon_real_arr.length; i++) {
    createPokemonCard(pokemon_real_arr[i]);
    console.log("Creating pokemon");
  }
}

// returns [] of strings with Pokemon types
function getPokemonTypes(pokemonObj) {
  let temp = [];
  pokemonObj.types.forEach((element) => {
    temp.push(element.type.name);
  });
  return temp;
}
/*
Above this comment we declare functions
*/
////////////////////////////////////////////////////////
/*
Below this comment we make calls
*/

window.addEventListener("DOMContentLoaded", fetchRandomPokemon);
window.addEventListener("click", () => {
  numberOfClicks++;
});

// fetchPokemons(); Should be executed on search
// setTimeout(doIT, 2000);
