const pokemonStorage = [];

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
            image: data.sprites.other["home"].front_default
        });
    }

    return pokemonStorage;
}

async function showPokemon() {
    const pokemonList = await getPokemon();
    const content = document.getElementById('content');
    
    content.innerHTML = ''; // Container leeren

    pokemonList.forEach((pokemon) => {
        content.innerHTML += `
            <div class="pokemon-card">
                <h3>#${pokemon.id} ${pokemon.name.toUpperCase()}</h3>
                <img src="${pokemon.image}" alt="${pokemon.name}">
            </div>
        `;
    });
}

