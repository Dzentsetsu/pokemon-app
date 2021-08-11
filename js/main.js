/*
Below this comment we declare global variables
*/
const pokemon_api_url = "https://pokeapi.co/api/v2/pokemon/";
const pokemon_img_endpoint = "https://pokeres.bastionbot.org/images/pokemon/";
const inputBtn = document.querySelector("#input-btn");
const inputSearch = document.querySelector("#input-search");
const dataList = document.querySelector('#pokemon-datalist');
const clearBtn = document.querySelector('.clear-btn');
const errorDiv = document.querySelector('#error');

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

  try {
    let data = await fetch(`${pokemon_api_url}${num}`);
    let pokemonData = await data.json();

    createPokemonCard(pokemonData);
  } catch (error) {
    console.log(error)
  }
}

// This function fecthing Pokemons. limit - how many pokemons you want to get. offset is id offset
async function fetchPokemons(limit = 0, offset = 10) {
  if (Number.isInteger(limit) && Number.isInteger(offset)) {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;

    try {
      let obj = await fetch(url);
      let data = await obj.json();
      pokemon_arr = data.results;
    } catch (error) {
      console.log(error)
    }
    pokemon_arr.forEach((elem) => {
      fetchPokemon(elem);
    });
  } else {
    showErrorMessage('Wrong setting for limit or offset');
    return;
  }
}

async function fetchPokemon(pokemonNameOrID) {
  try {
    let obj = await fetch(`${pokemon_api_url}${pokemonNameOrID}`);
    let responce = await obj.json();
    createPokemonCard(responce)
  } catch (error) {
    console.log(error)
  }
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

  // Heart icon
  const divSvg = document.createElement('div');
  divSvg.classList.add('heart-container');
  epmtyDiv.appendChild(divSvg);

  const heartMain = document.createElement("svg");
  heartMain.classList.add('heart-main');
  heartMain.style.viewBox ="0 0 512 512";
  heartMain.style.width = "100";
  heartMain.style.title = "heart";
  divSvg.appendChild(heartMain);

  // const heartBack = document.createElement("svg");
  // heartBack.classList.add("heart-background");
  // heartBack.viewBox ="0 0 512 512";


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
    try {
      let obj = await fetch(`${pokemon_img_endpoint}${pokemonObj.id}.png`);
      if ((obj.status <= 200 && obj.status <= 299)) {
        let blob = await obj.blob();
        let url = await URL.createObjectURL(blob);
        img.src = url;
      } else {
        img.src = `assets/uknown_pokemon.png`;
      }
    } catch (error) {
      img.src = `assets/uknown_pokemon.png`;
      console.log('You still fine, I inserted uknown pokemon img, api with img data must be dead');
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

  if(!pokedexSection.hasChildNodes()) {
    pokedexSection.appendChild(fragment);
  } else pokedexSection.insertBefore(fragment, pokedexSection.firstChild);
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
  trimedQuery = searchQuery.trim();
  if (trimedQuery === '' || trimedQuery.length === 0) {
    showErrorMessage(`Empty search!!`)
    return;
  }

  let queryObject = matchRegex(trimedQuery);

  if (queryObject.data) {
    fetchPokemon(queryObject.data);
    return;
  }
  else {
    showErrorMessage(queryObject.errorMessage);
    return;
  }
}

function matchRegex(searchQuery) {
  const regexNum = /^#?[0-9]{0,}/;
  const regexString = /[a-zA-Z]+/;

  let success, doesNotExist, wrongName;

  success = {
    data: undefined,
    errorMessage: undefined
  };

  doesNotExist = {
    data: undefined,
    errorMessage: 'There is only 898 pokemons registered in National Pokedex'
  };

  wrongName = {
    data: undefined,
    errorMessage: 'Pokemon with this name does not exist'
  }

  let inputString, inputNumber;

  if (isNaN(searchQuery) && searchQuery.charAt(0) !== '#') {
    inputString = searchQuery.match(regexString)[0];
    
    if (existInArray(inputString)) {
      success.data = inputString.toLowerCase();
      return success;
    } else return wrongName;
} else {
    inputNumber = searchQuery.match(regexNum)[0];

    if (inputNumber.charAt(0) === '#') {
      inputNumber = inputNumber.slice(1);
      if (inputNumber.length > 3) return doesNotExist;
      success.data = inputNumber;
      return success;
    }

    if (typeof (+inputNumber) === 'number') {
      if (inputNumber.length >= 4) return doesNotExist;
      if (inputNumber.length <= 3) {
        success.data = inputNumber;
        return success;
      }
    } else return doesNotExist;
  }
}
function showErrorMessage(str = 'Uknown pokemon') {
  inputBtn.disabled = true;

  errorDiv.innerHTML = `<strong>Error! </strong>${str}`;
  errorDiv.classList.remove('error');
  errorDiv.classList.add('show');

  setTimeout(() => {
    errorDiv.classList.remove('show');
    errorDiv.classList.add('hide');  
  },1300);
  
  setTimeout(()=> {
    errorDiv.classList.remove('hide');
  },2600);

  setTimeout(() => {
    inputBtn.disabled = false;
    errorDiv.classList.add('error');
  },2601);
}

function existInArray(str) {
  const firstLetter = str[0].toUpperCase();
  const tempPokemonName = firstLetter + str.substring(1);
  const answer = pokemonNamesArray.data.includes(tempPokemonName);
  return answer;
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
  if (inputSearch.value.length !== 0) {
    processSearchQuery(inputSearch.value);
  }
});

document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && inputSearch.value.length !== 0) {
    processSearchQuery(inputSearch.value);
  }
});

clearBtn.addEventListener('click', (e) => {
  inputSearch.value = "";
});

setTimeout(() => {
  pokemonNamesArray.makeOptions();
}, 300);
// fetchPokemons(); Should be executed on search