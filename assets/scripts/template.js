function getDialogTemplate(pokemon, index) {
    const currentViewIndex = currentViewList.findIndex(p => p.id === pokemon.id);
    const isFirst = currentViewIndex <= 0;
    const isLast = currentViewIndex === currentViewList.length - 1;

    return `
        <section class="dialog_content">
            <header class="dialog_header">
                <h2>#${pokemon.id} ${pokemon.name}</h2>
                <button onclick="closeDialog()"> ✕</button>
            </header>

            <div class="dialog_main">
                <div class="dialog_left">
                    <div class="image_nav_container ${pokemon.types[0]}">
                        <div class="dialog_type_container">
                            ${pokemon.types.map(type => `<button class="type-btn ${type}">${type}</button>`).join('')}
                        </div>
                        
                        <button class="img_nav_btn left" 
                                onclick="changePokemon(event, ${currentViewIndex}, -1)" 
                                ${isFirst ? 'disabled' : ''}> ← </button>
                        
                        <img src="${pokemon.image}" alt="${pokemon.name}">
                        
                        <button class="img_nav_btn right" 
                                onclick="changePokemon(event, ${currentViewIndex}, 1)" 
                                ${isLast ? 'disabled' : ''}> →</button>
                    </div>
                </div>

                <div class="dialog_right">
                    <div class="dialog_tabs">
                        <button id="mainTab" class="active" onclick="showMainInfo()">Main</button>
                        <button id="statsTab" onclick="showStatsInfo()">Stats</button>
                    </div>

                    <div id="dialogInfo" class="dialog_stats">
                        ${getMainInfoTemplate(pokemon)}
                    </div>
                </div>
            </div>
            
            <footer class="dialog_footer_navigation"></footer>
        </section>
    `;
}

function getMainInfoTemplate(pokemon) {
    return `
        <p><span>Height:</span>${pokemon.height} m</p>
        <p><span>Weight:</span>${pokemon.weight} kg</p>
        <p><span>Base experience:</span>${pokemon.baseExperience}</p>
        <p><span>Abilities:</span>${
            pokemon.abilities
                .map(ability =>
                    ability
                        .split('-')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')
                )
                .join(', ')
        }</p>
    `;
}


function getStatsTemplate(pokemon) {
    return pokemon.stats.map(stat => `
        <div class="stat-row">
            <span class="stat-name">${stat.name}</span>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${stat.value}%"></div>
            </div>
            <span class="stat-value">${stat.value}</span>
        </div>
    `).join('');
}

function getPokemonCardTemplate(pokemon) {
    return `
        <div class="pokemon-card" onclick="openDialogById(${pokemon.id})">
            <h3>#${pokemon.id} ${pokemon.name.toUpperCase()}</h3>
            <img src="${pokemon.image}" alt="${pokemon.name}">
            <div class="type-container">
                ${pokemon.types.map(type => `<button class="type-btn ${type}">${type}</button>`).join('')}
            </div>
        </div>
    `;
}