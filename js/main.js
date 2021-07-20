/*
Below this comment we declare global variables
*/
const pokemon_api_url = "https://pokeapi.co/api/v2/pokemon/";
const pokemon_img_endpoint = "https://pokeres.bastionbot.org/images/pokemon/";
const inputBtn = document.querySelector("#input-btn");
const inputSearch = document.querySelector("#input-search");
const dataList = document.querySelector('#pokemon-datalist');
const pokemonNamesArray = {
  data: null,
  fetchData: () => {
    fetch('data/pok-names-en.json').then(response => response.json()).then(pokemonNamesArray.saveData)
  },
  saveData: (data) => {
    pokemonNamesArray.data = data;
    pokemonNamesArray.dataSet = [...new Set(data)];
  },
  makeOptions: () => {
    let fragment = document.createDocumentFragment();
    for (let i = 0; i < pokemonNamesArray.data.length; i++) {
      let temp = document.createElement('option');
      if (i == 0) {
        temp.selected = true;
      }
      temp.value, temp.textContent = pokemonNamesArray.data[i];
      fragment.appendChild(temp);
    }
    dataList.appendChild(fragment);
    delete fragment;
  }
}
/*
Above this comment we global variables
*/
////////////////////////////////////////////////////////
/*
Below this comment we declare async functions
*/

// This function fetching random pokemon on DOMContentLoaded
async function fetchRandomPokemon() {
  let num = Math.floor(Math.random() * 898);

  let data = await fetch(`${pokemon_api_url}${num}`);
  let pokemonData = await data.json();

  createPokemonCard(pokemonData);
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
async function fetchPokemon(pokemonNameOrID) {
  let obj = await fetch(`${pokemon_api_url}${pokemonNameOrID}`);
  let responce = await obj.json();

  createPokemonCard(responce)
}
/*
Above this comment we declare async functions
*/
////////////////////////////////////////////////////////
/*
Below this comment we declare functions
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
  epmtyDiv.classList.add("circle-background");

  // Creating avatar for pokemon card from another API (cause png from there is way better)
  const img = document.createElement("img");
  epmtyDiv.appendChild(img);
  img.width = 210;
  img.height = 210;
  img.style.visibility = "hidden";

  setTimeout(() => {
    img.style.visibility = "visible";
  }, 1500);

  (async () => {
    let obj = await fetch(`${pokemon_img_endpoint}${pokemonObj.id}.png`);
    if (obj.status == 200) {
      let blob = await obj.blob();
      let url = await URL.createObjectURL(blob);
      img.src = url;
    } else {
      img.src = `assets/uknown_pokemon.png`;
    }
  })();

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

function processSearchQuery(searchQuery) {
  if (searchQuery === '' || searchQuery === undefined || searchQuery === ' ' || searchQuery === null) return;
  searchQuery = searchQuery.trim();


  let pokName = '';
  let existInArray = ((str) => {
    const firstLetter = str[0].toUpperCase();
    const tempPokemonName = firstLetter + str.substring(1);
    pokName = tempPokemonName;
    const answer = pokemonNamesArray.data.includes(tempPokemonName);

    return answer;
  })(searchQuery);

  if (existInArray) {
    console.log(`Name found in array`);
    fetchPokemon(pokName);
    return;
  }

  let matchObj = matchRegex(searchQuery);

  if (!existInArray && matchObj.match) {
    fetchPokemon(matchObj.data);
    return;
  }
  if (!existInArray && !matchObj.match) {
    fetchPokemon(matchObj.data)
    return;
  }

  else {
    console.log(`Strange input, returning error`);
  }
}

function matchRegex(searchQuery) {
  const regex = /^#?[0-9]{0,3}/;
  let tempStr = searchQuery.match(regex)[0];
  console.log(searchQuery.match(regex))
  console.dir(tempStr)
  if (tempStr[0] != null) {
    if (tempStr.charAt(0) === '#') {
      fixedStr = tempStr.slice(1);
      return {
        match: true,
        data: fixedStr
      }
    } else return {
      match: true,
      data: tempStr
    }
  } else return {
    match: false,
    data: '79'
  }
}
/*
Above this comment we declare functions
*/
////////////////////////////////////////////////////////
/*
Below this comment we make calls
*/
pokemonNamesArray.fetchData();
window.addEventListener('DOMContentLoaded', fetchRandomPokemon);

inputBtn.addEventListener("click", () => {
  if (inputSearch.value !== "") {
    processSearchQuery(inputSearch.value);
  }
});

document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && inputSearch.value.length !== 0) {
    if (inputSearch.value !== "") {
      processSearchQuery(inputSearch.value);
    }
  }
});

setTimeout(() => {
  pokemonNamesArray.makeOptions();
}, 500);
// fetchPokemons(); Should be executed on search
