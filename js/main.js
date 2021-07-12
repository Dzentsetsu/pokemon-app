const pokemon_api_url = "https://pokeapi.co/api/v2/pokemon/";
const pokemon_img_endpoint = "https://pokeres.bastionbot.org/images/pokemon/";
let pokemon_arr;
var pokemon_real_arr = [];
var test_arr = [1, 2, 3, 4];
(async function getPokemon(num) {
  const url = pokemon_api_url + num;

  const obj = await fetch(url);
  const data = await obj.json();

  createPokemonCard(data);
})(1);

function createPokemonCard(pokemonObj) {
  // Creating container for pokemon card
  let card = document.createElement("div");
  document.getElementById("pokedex").appendChild(card);
  //   document.body.appendChild(card);
  card.classList.add("pokemon-card-container");

  // This line makes container have width of its child img
  card.style.width = "max-content";

  // Creating avatar for pokemon card from another API (cause png from there is way better)
  let img = document.createElement("img");
  card.appendChild(img);
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

  // Getting every type this pokemon has in an array of strings
  const getTypes = (pokemonObj) => {
    let temp = [];
    pokemonObj.types.forEach((element) => {
      temp.push(element.type.name);
    });

    return temp;
  };

  const types = getTypes(pokemonObj);
  const labels = makePokemonTypeLabels(types);

  for (let i = 0; i < labels.length; i++) {
    card.appendChild(labels[i]);
  }
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

async function first12Pokemons(limit = 0, offset = 12) {
  let data;
  if (Number.isInteger(limit) && Number.isInteger(offset)) {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    let obj = await fetch(url);
    data = await obj.json();

    pokemon_arr = data.results;
    pokemon_arr.forEach((elem) => {
      getPokemon(elem);
    });

    // console.log(pokemon_real_arr);

    // console.log(pokemon_real_arr);
  }
}
first12Pokemons(15, 100);

setTimeout(doIT, 2000);

async function getPokemon(elem) {
  let obj = await fetch(elem.url);
  let pokemonData = await obj.json();

  pokemon_real_arr.push(pokemonData);
}

function doIT() {
  for (let i = 0; i < pokemon_real_arr.length; i++) {
    createPokemonCard(pokemon_real_arr[i]);
    console.log("Creating pokemon");
  }
}

// let pokem = pokemons.results;
// function createPokemons(pokemons) {
//   pokemons.forEach((elem) => createPokemonCard(elem));
// }

// createPokemons(pokemons);
