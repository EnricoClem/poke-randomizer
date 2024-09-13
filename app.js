document.addEventListener('DOMContentLoaded', function() {
    const typesBox = document.getElementById('types-box');
    const generationsBox = document.getElementById('generations-box');
    const randomBtn = document.getElementById('random-btn');
    const toggleTypesBtn = document.getElementById('toggle-types-btn');
    const toggleGenerationsBtn = document.getElementById('toggle-generations-btn');
    
    // Close all filters
    function closeAllFilters() {
        typesBox.style.display = 'none';
        generationsBox.style.display = 'none';
    }
    
    // Listener types
    toggleTypesBtn.addEventListener('click', function() {
        if (typesBox.style.display === 'none' || typesBox.style.display === '') {
            closeAllFilters();  // Close the other
            typesBox.style.display = 'block';
        } else {
            typesBox.style.display = 'none';
        }
    });

    // Listener generations
    toggleGenerationsBtn.addEventListener('click', function() {
        if (generationsBox.style.display === 'none' || generationsBox.style.display === '') {
            closeAllFilters();  // Close the other
            generationsBox.style.display = 'block';
        } else {
            generationsBox.style.display = 'none';
        }
    });

    // Listener generate
    randomBtn.addEventListener('click', function() {
        closeAllFilters();  // Close all filters
        fetchMultiplePokemon();  // Call to generate
    });
    
    // Get more than one pokemon
    function fetchMultiplePokemon() {
        const count = document.getElementById('pokemon-count').value;
        const selectedTypes = Array.from(document.querySelectorAll('#pokemon-types input:checked')).map(input => input.value);
        const selectedGenerations = Array.from(document.querySelectorAll('#pokemon-generations input:checked')).map(input => input.value);

        // Clear old results
        const container = document.getElementById('pokemon-block');
        container.innerHTML = '';
      
        if (selectedTypes.length === 0) {
            // If no types selected
            for (let i = 0; i < count; i++) {
                fetchRandomPokemon();
            }
        } else {
            // Filtered by types and gen
            generateFilteredPokemon(count, selectedTypes, selectedGenerations);
        }
    }

    // Function to generate filtered pokemon
    function generateFilteredPokemon(count, selectedTypes, selectedGenerations) {
        let generatedCount = 0;

        function attemptGeneration() {
            if (generatedCount >= count) return;

            const randomId = Math.floor(Math.random() * 898) + 1;
            fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
                .then(response => response.json())
                .then(data => {
                    const pokemonTypes = data.types.map(typeInfo => typeInfo.type.name);
                    const pokemonGeneration = getGenerationFromId(randomId);

                    const hasSelectedType = pokemonTypes.some(type => selectedTypes.includes(type));
                    const hasSelectedGeneration = selectedGenerations.length === 0 || selectedGenerations.includes(pokemonGeneration.toString());

                    if (hasSelectedType && hasSelectedGeneration) {
                        displayPokemon(data);
                        generatedCount++;
                    }

                    attemptGeneration();  // Keep generating untill the selected number
                })
                .catch(error => console.log('Errore attuale:', error));
        }

        attemptGeneration();
    }

    // Determintating generation based on ID
    function getGenerationFromId(id) {
        if (id <= 151) return 1;
        if (id <= 251) return 2;
        if (id <= 386) return 3;
        if (id <= 493) return 4;
        if (id <= 649) return 5;
        if (id <= 721) return 6;
        if (id <= 809) return 7;
        return 8;
    }

    // Get a random pokemon
    function fetchRandomPokemon() {
        const randomId = Math.floor(Math.random() * 898) + 1;
        fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
            .then(response => response.json())
            .then(data => displayPokemon(data))
            .catch(error => console.log('Errore attuale:', error));
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
        } else if (pokemonTypes.length === 2) {
            backgroundColor = `linear-gradient(135deg, ${typeColors[pokemonTypes[0]]} 0%, ${typeColors[pokemonTypes[0]]} 30%, ${typeColors[pokemonTypes[1]]} 100%)`;
        } else {
            // Default background color if more than 2 types
            backgroundColor = '#ffffff'; // or any other default color
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
