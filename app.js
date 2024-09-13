document.addEventListener('DOMContentLoaded', function() {
    const randomBtn = document.getElementById('random-btn');
    const searchBtn = document.getElementById('search-btn');
    
    // Set to keep track of generated Pokémon IDs
    const generatedPokemonIds = new Set();

    // Listener generate random pokemon
    randomBtn.addEventListener('click', function() {
        const container = document.getElementById('pokemon-block');
        container.innerHTML = '';
        generatedPokemonIds.clear();  // Clear previous Pokémon IDs
        const count = document.getElementById('pokemon-count').value;
        generateRandomPoke(count);
    });
    
    function generateRandomPoke(count) {
        let promises = [];
        for(let i=0; i<count; i++) {
            const randomId = Math.floor(Math.random() * 898) + 1;
            promises.push(fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`));
        }
        Promise.all(promises)
            .then(responses => Promise.all(responses.map(r => r.json())))
            .then(results => {
                for(let i=0; i<count; i++) {
                    let pokemonData = results[i];
                    generatedPokemonIds.add(pokemonData.id); 
                    displayPokemon(pokemonData);
                }
            })
            .catch(error => console.log('Errore attuale:', error))
    }

    // Listener search pokemon
    searchBtn.addEventListener('click', function() {
        const container = document.getElementById('pokemon-block');
        container.innerHTML = '';
        generatedPokemonIds.clear();  // Clear previous Pokémon IDs
        const idOrName = document.getElementById('pokemon-search').value;
        searchPoke(idOrName);
    });

    function searchPoke(idOrName) {
        idOrName = idOrName.trim();
/*
        switch(typeof idOrName) {
            case 'string':
                idOrName = idOrName.toLowerCase();
                break;
            case 'number':
                // 
                break;
            default:
                // error
                // mostra un messaggio d'errore per ricordare all'utente 
                // che deve inserire solo il nome o l'id numerico
        }
*/
        if (typeof idOrName == 'string') {
            idOrName = idOrName.toLowerCase();
        }

        fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName}`)
            .then(response => response.json())
            .then(pokemonData => {
                generatedPokemonIds.add(pokemonData.id); 
                displayPokemon(pokemonData);
            })
            .catch(error => console.log('Errore attuale:', error))

    }

    // Visualize the pokemon
    function displayPokemon(pokemon) {
        const container = document.getElementById('pokemon-block');
        const pokemonCard = document.createElement('div');
        pokemonCard.classList.add('pokemon-card');

        const abilities = pokemon.abilities.map(abilityInfo => abilityInfo.ability.name).join(', ');

        // Formatting height and weight
        function decimal(value) {
            const stringValue = value.toString();
            return stringValue.length === 1 ? `0,${stringValue}` : `${stringValue.slice(0, -1)},${stringValue.slice(-1)}`;
        }

        const formattedHeight = decimal(pokemon.height);
        const formattedWeight = decimal(pokemon.weight);

        // Background based on type
        const pokemonTypes = pokemon.types.map(typeInfo => typeInfo.type.name);
        let backgroundColor;

        if (pokemonTypes.length === 1) {
            backgroundColor = typeColors[pokemonTypes[0]];
        } else {
            backgroundColor = `linear-gradient(135deg, ${typeColors[pokemonTypes[0]]} 0%, ${typeColors[pokemonTypes[0]]} 30%, ${typeColors[pokemonTypes[1]]} 100%)`;
        }

        pokemonCard.style.background = backgroundColor;
        
        // HTML generated
        pokemonCard.innerHTML = `
            <div class="pokemon-image-container flex-col">
                <img class="pokemon-img" id="pokemon-img-${pokemon.id}" src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                <div class="shiny-stars" id="shiny-stars-${pokemon.id}"></div>
                <button id="shiny-btn-${pokemon.id}" class="shiny-btn" onclick="toggleShiny(${pokemon.id}, '${pokemon.sprites.front_default}', '${pokemon.sprites.front_shiny}')">
                    <img class="shiny-logo" src="resources/poke-icon-SHINY.svg" alt=""> <span>Shiny Version</span>
                </button>
            </div>
            <div class="flex">
                <ul class="poke-list">
                    <li><h3 class="poke-name">${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3></li>
                    <li><p><strong>Id:</strong> ${pokemon.id}</p></li>
                    <li><p><strong>Type:</strong> ${pokemon.types.map(typeInfo => typeInfo.type.name).join(', ')}</p></li>
                    <li><p><strong>Weight:</strong> ${formattedWeight} Kg</p></li>
                    <li><p><strong>Height:</strong> ${formattedHeight} m</p></li>
                    <li><p><strong>Abilities:</strong> ${abilities}</p></li>
                </ul>
            </div>
        `;

        container.appendChild(pokemonCard);
    }

    // Define toggleShiny function globally
    window.toggleShiny = function(id, defaultSprite, shinySprite) {
        const img = document.getElementById(`pokemon-img-${id}`);
        const shinyBtn = document.getElementById(`shiny-btn-${id}`);
        const shinyStarsContainer = document.getElementById(`shiny-stars-${id}`);
        
        if (img.src === defaultSprite) {
            img.src = shinySprite;
            shinyBtn.textContent = 'Standard Version';
            shinyBtn.style.backgroundColor = 'gray';

            shinyStarsContainer.innerHTML = '';
            for (let i = 0; i < 5; i++) {
                const star = document.createElement('div');
                star.classList.add('shiny-star');
                star.style.setProperty('--x', Math.cos(2 * Math.PI * i / 5));
                star.style.setProperty('--y', Math.sin(2 * Math.PI * i / 5));
                shinyStarsContainer.appendChild(star);
            }

            setTimeout(() => {
                shinyStarsContainer.innerHTML = '';
            }, 1000);
        } else {
            img.src = defaultSprite;
            shinyBtn.innerHTML = '<img class="shiny-logo" src="resources/poke-icon-SHINY.svg" alt=""> <span>Shiny Version</span>';
            shinyBtn.style.backgroundColor = 'purple';
        }
    };

    // Types color mapping
    const typeColors = {
        normal: '#A8A77A',
        fire: '#EE8130',
        water: '#6390F0',
        electric: '#F7D02C',
        grass: '#7AC74C',
        ice: '#96D9D6',
        fighting: '#C22E28',
        poison: '#A33EA1',
        ground: '#E2BF65',
        flying: '#A98FF3',
        psychic: '#F95587',
        bug: '#A6B91A',
        rock: '#B6A136',
        ghost: '#735797',
        dragon: '#6F35FC',
        dark: '#705746',
        steel: '#B7B7CE',
        fairy: '#D685AD'
    };
});
