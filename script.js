const pokemonStorage = [];

// Retrieve the Pokémon data from the API or from memory
async function getPokemon() {
    if (pokemonStorage.length > 0) {
        return pokemonStorage;
    }

    for (let i = 1; i <= 30; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        let data = await response.json();

        pokemonStorage.push({
            id: data.id,
            name: data.name,
            image: data.sprites.other["home"].front_default,
            types: data.types.map(element => element.type.name)
        });
    }
    return pokemonStorage;
}


// The main function that is executed when you click “Search”
async function handleSearch() {
    const input = getSearchInput();

    if (toggleErrorMessage(input.length)) {
        return; 
    }

    const allPokemon = await getPokemon();
    const filtered = filterPokemon(allPokemon, input);

    renderResults(filtered, input);
}


// Called every time the user types (oninput)
function checkInput() {
    const length = document.getElementById('searchInput').value.length;
    toggleErrorMessage(length);
}


// Logic for the error message
function toggleErrorMessage(length) {
    const errorMsg = document.getElementById('errorMessage');
    const isInvalid = (length > 0 && length < 3);
    
    errorMsg.style.display = isInvalid ? 'block' : 'none';
    
    return isInvalid; 
}


// Help function: Retrieves and cleans up the search term
function getSearchInput() {
    return document.getElementById('searchInput').value.trim().toLowerCase();
}


// Logical function: Filters the array
function filterPokemon(allPokemon, input) {
    return allPokemon.filter(pokemon => pokemon.name.toLowerCase().includes(input));
}


// Displays the Pokémon cards or the “No results” message
function renderResults(filteredPokemon, input) {
    const content = document.getElementById('content');
    content.innerHTML = '';

    if (filteredPokemon.length > 0) {
        filteredPokemon.forEach(pokemon => {
            content.innerHTML += getPokemonCardTemplate(pokemon);
        });
    } else if (input.length >= 3) {
        content.innerHTML = `<p class="no-results">Kein Pokémon gefunden!</p>`;
    }
}


// Function for loading all Pokémon at startup
async function showPokemon() {
    const pokemonList = await getPokemon();
    const content = document.getElementById('content');
    content.innerHTML = ''; 
    for (let i = 0; i < pokemonList.length; i++) {
        content.innerHTML += getPokemonCardTemplate(pokemonList[i]);
    }
}


// Template for Pokémon cards
function getPokemonCardTemplate(pokemon) {
    return `
        <div class="pokemon-card">
            <h3>#${pokemon.id} ${pokemon.name.toUpperCase()}</h3>
            <img src="${pokemon.image}" alt="${pokemon.name}">
            <div class="type-container">
                ${pokemon.types.map(type => `
                    <button class="type-btn ${type}">
                        ${type}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

