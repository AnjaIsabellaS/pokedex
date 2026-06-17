let pokemonStorage = [];
let currentViewList = [];
let currentOffset = 1;
const limit = 30;
const maxPokemon = 151;
const dialogRef = document.getElementById('pokemonDialog');

async function getPokemonRange(start, count) {
    let newPokemon = [];
    for (let i = start; i < start + count; i++) {
        if (i > maxPokemon) break;
        try {
            let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
            let response = await fetch(url);
            let data = await response.json();
            newPokemon.push({
                id: data.id,
                name: data.name,
                image: data.sprites.other["home"].front_default,
                types: data.types.map(element => element.type.name),
                height: data.height / 10,
                weight: data.weight / 10,
                baseExperience: data.base_experience,
                abilities: data.abilities.map(element => element.ability.name),
                stats: data.stats.map(element => ({name: element.stat.name,value: element.base_stat}))
            });
        } catch (error) {
            console.error(`Fehler beim Laden von Pokémon ${i}:`, error);
        }
    }
    return newPokemon;
}

async function showPokemon() {
    showLoadingScreen();
    pokemonStorage = await getPokemonRange(currentOffset, limit);
    currentViewList = pokemonStorage;
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
    currentViewList = pokemonStorage;
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

function showMainInfo() {
    const pokemonId = Number(dialogRef.querySelector('.dialog_header h2').textContent.split(' ')[0].replace('#', ''));
    const pokemon = pokemonStorage.find(p => p.id === pokemonId);

    document.getElementById('dialogInfo').innerHTML = getMainInfoTemplate(pokemon);
    document.getElementById('mainTab').classList.add('active');
    document.getElementById('statsTab').classList.remove('active');
}

function showStatsInfo() {
    const pokemonId = Number(dialogRef.querySelector('.dialog_header h2').textContent.split(' ')[0].replace('#', ''));
    const pokemon = pokemonStorage.find(p => p.id === pokemonId);

    document.getElementById('dialogInfo').innerHTML = getStatsTemplate(pokemon);
    document.getElementById('statsTab').classList.add('active');
    document.getElementById('mainTab').classList.remove('active');
}

function changePokemon(event, currentViewIndex, step) {
    event.stopPropagation();
    let newIndex = currentViewIndex + step;

    if (newIndex >= 0 && newIndex < currentViewList.length) {
        const nextPokemon = currentViewList[newIndex];
        const globalIndex = pokemonStorage.findIndex(p => p.id === nextPokemon.id);
        openDialog(globalIndex);
    }
}

function closeDialog() {
    dialogRef.close();
}

function renderResults(pokemonArray, input) {
    const content = document.getElementById('content');
    content.innerHTML = '';

    if (pokemonArray.length > 0) {
        pokemonArray.forEach((pokemon) => {
            content.innerHTML += getPokemonCardTemplate(pokemon);
        });
    } else if (input.length >= 3) {
        content.innerHTML = `<p class="no-results">Kein Pokémon gefunden!</p>`;
    }
}

function openDialogById(id) {
    const index = pokemonStorage.findIndex(pokemon => pokemon.id === id);
    if (index !== -1) {
        openDialog(index);
    }
}

function showLoadingScreen() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

function hideLoadingScreen() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

function handleSearch() {
    const input = getSearchInput();
    if (toggleErrorMessage(input.length)) 
        return;
    currentViewList = filterPokemon(pokemonStorage, input); 
    renderResults(currentViewList, input);
    document.getElementById('loadMoreBtn').style.display = 'none';
}

function checkInput() {
    const input = document.getElementById('searchInput').value;
    toggleErrorMessage(input.length);
    if (input.length === 0) {
        currentViewList = pokemonStorage;
        document.getElementById('loadMoreBtn').style.display =
            currentOffset <= maxPokemon
                ? 'block'
                : 'none';
        renderResults(pokemonStorage, "");
    }
}

function toggleErrorMessage(length) {
    const errorMsg = document.getElementById('errorMessage');
    const isInvalid = (length > 0 && length < 3);
    errorMsg.style.display =isInvalid ? 'block' : 'none';
    return isInvalid;
}

function getSearchInput() {
    return document
        .getElementById('searchInput')
        .value
        .trim()
        .toLowerCase();
}

function filterPokemon(allPokemon, input) {
    return allPokemon.filter(pokemon =>pokemon.name
            .toLowerCase()
            .includes(input)
    );
}