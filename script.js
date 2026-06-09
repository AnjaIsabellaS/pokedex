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
            image: data.sprites.other["official-artwork"].front_default
        });
    }

    return pokemonStorage;
}

async function showPokemon() {
    const pokemonList = await getPokemon(); 
    
    console.log(pokemonList);
}

showPokemon();
