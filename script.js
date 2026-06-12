let pokemonStorage = [];
let currentOffset = 1; 
const limit = 30;
const maxPokemon = 150;


async function getPokemonRange(start, count) {
    let newPokemon = [];
    for (let i = start; i < start + count; i++) {
        if (i > maxPokemon) break;
        
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        let data = await response.json();

        newPokemon.push({
            id: data.id,
            name: data.name,
            image: data.sprites.other["home"].front_default,
            types: data.types.map(element => element.type.name)
        });
    }
    return newPokemon;
}


async function showPokemon() {
    pokemonStorage = await getPokemonRange(currentOffset, limit);
    renderResults(pokemonStorage, "");
    currentOffset += limit;
}


async function loadMorePokemon() {
    const morePokemon = await getPokemonRange(currentOffset, limit);
    

    pokemonStorage = [...pokemonStorage, ...morePokemon];
    

    const content = document.getElementById('content');
    morePokemon.forEach(pokemon => {
        content.innerHTML += getPokemonCardTemplate(pokemon);
    });

    currentOffset += limit;

  
    if (currentOffset > maxPokemon) {
        document.getElementById('loadMoreBtn').style.display = 'none';
    }
}

async function handleSearch() {
    const input = getSearchInput();

    if (toggleErrorMessage(input.length)) {
        return; 
    }

    const filtered = filterPokemon(pokemonStorage, input);
    renderResults(filtered, input);
    
    document.getElementById('loadMoreBtn').style.display = 'none';
}

function renderResults(pokemonArray, input) {
    const content = document.getElementById('content');
    content.innerHTML = '';

    if (pokemonArray.length > 0) {
        pokemonArray.forEach(pokemon => {
            content.innerHTML += getPokemonCardTemplate(pokemon);
        });
    } else if (input.length >= 3) {
        content.innerHTML = `<p class="no-results">Kein Pokémon gefunden!</p>`;
    }
}

function checkInput() {
    const input = document.getElementById('searchInput').value;
    toggleErrorMessage(input.length);
    
    if (input.length === 0) {
        document.getElementById('loadMoreBtn').style.display = currentOffset <= maxPokemon ? 'block' : 'none';
        renderResults(pokemonStorage, "");
    }
}

function toggleErrorMessage(length) {
    const errorMsg = document.getElementById('errorMessage');
    const isInvalid = (length > 0 && length < 3);
    errorMsg.style.display = isInvalid ? 'block' : 'none';
    return isInvalid; 
}

function getSearchInput() {
    return document.getElementById('searchInput').value.trim().toLowerCase();
}

function filterPokemon(allPokemon, input) {
    return allPokemon.filter(pokemon => pokemon.name.toLowerCase().includes(input));
}

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

