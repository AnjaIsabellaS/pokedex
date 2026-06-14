let pokemonStorage = [];
let currentOffset = 1; 
const limit = 30;
const maxPokemon = 151;
const dialogRef = document.getElementById('pokemonDialog');


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
    showLoadingScreen();
    pokemonStorage = await getPokemonRange(currentOffset, limit);
    renderResults(pokemonStorage, "");
    currentOffset += limit;
    hideLoadingScreen();
}


async function loadMorePokemon() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    loadMoreBtn.disabled = true;
    showLoadingScreen();

    const morePokemon = await getPokemonRange(currentOffset, limit);
    pokemonStorage = [...pokemonStorage, ...morePokemon];
    
    renderResults(pokemonStorage, "");
    
    currentOffset += limit;
    hideLoadingScreen();

    if (currentOffset > maxPokemon) {
        loadMoreBtn.style.display = 'none';
    } else {
        loadMoreBtn.disabled = false;
    }
}


function openDialog(index) {
    const pokemon = pokemonStorage[index];
    dialogRef.innerHTML = getDialogTemplate(pokemon, index);
    dialogRef.showModal();
}


function getDialogTemplate(pokemon, index) {
    return `
        <section class="dialog_content" role="dialog" onclick="event.stopPropagation()">
            <header class="dialog_header">
                <h2>#${pokemon.id} ${pokemon.name.toUpperCase()}</h2>
                <button onclick="closeDialog()">✕</button>
            </header>
            <div class="dialog_main_img_container">
                <img src="${pokemon.image}" alt="${pokemon.name}">
            </div>
            <nav class="dialog_footer_navigation">
                <button class="nav_btn" onclick="changePokemon(event, ${index}, -1)">Zurück</button>
                <div class="dialog_counter">${index + 1} / ${pokemonStorage.length}</div>
                <button class="nav_btn" onclick="changePokemon(event, ${index}, 1)">Weiter</button>
            </nav>
        </section>`;
}


function changePokemon(event, currentIndex, step) {
    event.stopPropagation();
    let newIndex = currentIndex + step;
    if (newIndex >= pokemonStorage.length) newIndex = 0;
    if (newIndex < 0) newIndex = pokemonStorage.length - 1;
    openDialog(newIndex);
}


function closeDialog() {
    dialogRef.close();
}


function renderResults(pokemonArray, input) {
    const content = document.getElementById('content');
    content.innerHTML = '';

    if (pokemonArray.length > 0) {
        pokemonArray.forEach((pokemon, index) => {
            content.innerHTML += getPokemonCardTemplate(pokemon, index);
        });
    } else if (input.length >= 3) {
        content.innerHTML = `<p class="no-results">Kein Pokémon gefunden!</p>`;
    }
}


function getPokemonCardTemplate(pokemon, index) {
    return `
        <div class="pokemon-card" onclick="openDialog(${index})">
            <h3>#${pokemon.id} ${pokemon.name.toUpperCase()}</h3>
            <img src="${pokemon.image}" alt="${pokemon.name}">
            <div class="type-container">
                ${pokemon.types.map(type => `
                    <button class="type-btn ${type}">${type}</button>
                `).join('')}
            </div>
        </div>
    `;
}


function showLoadingScreen() { 
    document.getElementById('loadingOverlay').style.display = 'flex'; 
}


function hideLoadingScreen() { 
    document.getElementById('loadingOverlay').style.display = 'none'; 
}


function handleSearch() {
    const input = getSearchInput();
    if (toggleErrorMessage(input.length)) return;
    const filtered = filterPokemon(pokemonStorage, input);
    renderResults(filtered, input);
    document.getElementById('loadMoreBtn').style.display = 'none';
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
    return document
        .getElementById('searchInput')
            .value.trim()
            .toLowerCase(); 
}


function filterPokemon(allPokemon, input) { 
    return allPokemon.filter(pokemon => 
        pokemon.name
            .toLowerCase()
            .includes(input)
    ); 
}