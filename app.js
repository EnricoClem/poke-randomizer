document.getElementById('random-btn').addEventListener('click', fetchMultiplePokemon);

// Event listener filter button
document.getElementById('toggle-filters-btn').addEventListener('click', function() {
    const filtersBox = document.getElementById('filters-box');
    
    if (filtersBox.style.display === 'none' || filtersBox.style.display === '') {
        filtersBox.style.display = 'block';
    } else {
        filtersBox.style.display = 'none';
    }
});

function fetchMultiplePokemon() {
    // Getting the n° from the index input
    const count = document.getElementById('pokemon-count').value;

    // Get anly the types selected
    const selectedTypes = Array.from(document.querySelectorAll('#pokemon-types input:checked')).map(input => input.value);
  
    // Get only the generation selected
    const selectedGenerations = Array.from(document.querySelectorAll('#pokemon-generations input:checked')).map(input => input.value);

    // Clean the page from old results
    const container = document.getElementById('pokemon-block');
    container.innerHTML = '';
  
    // Randomize the specified number of pokemon
    if (selectedTypes.length === 0) {
        for (let i = 0; i < count; i++) {
          fetchRandomPokemon();
        }
    } else {
        // Filter the types if they are selected
        generateFilteredPokemon(count, selectedTypes, selectedGenerations);
    }
}

function generateFilteredPokemon(count, selectedTypes, selectedGenerations) {
    let generatedCount = 0;
  
    function attemptGeneration() {
        if (generatedCount >= count) return;
  
        const randomId = Math.floor(Math.random() * 898) + 1;
        fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
            .then(response => response.json())
            .then(data => {
            // Check the selected types
            const pokemonTypes = data.types.map(typeInfo => typeInfo.type.name);
            const pokemonGeneration = getGenerationFromId(randomId);

            const hasSelectedType = pokemonTypes.some(type => selectedTypes.includes(type));
            const hasSelectedGeneration = selectedGenerations.length === 0 || selectedGenerations.includes(pokemonGeneration.toString());            
    
            if (hasSelectedType && hasSelectedGeneration) {
                displayPokemon(data);
                generatedCount++;
            }
  
            attemptGeneration();
        })
        .catch(error => console.log('Current error:', error));
    }
  
    attemptGeneration();
}

// Generation mapping
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

function fetchRandomPokemon() {
    // Generate a random number of the total amount of available pokemon
    const randomId = Math.floor(Math.random() * 898) + 1;
  
    // API call
    fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
        .then(response => response.json())
        .then(data => displayPokemon(data))
        .catch(error => console.log('Current error:', error));
}

function displayPokemon(pokemon) {
    const container = document.getElementById('pokemon-block');

    // Add a new card for each pokemon requested
    const pokemonCard = document.createElement('div');
    pokemonCard.classList.add('pokemon-card');

    // Add color to background based on type
    const pokemonTypes = pokemon.types.map(typeInfo => typeInfo.type.name);
    let backgroundColor;
    if (pokemonTypes.length === 1) {
        backgroundColor = typeColors[pokemonTypes[0]];
    } else if (pokemonTypes.length === 2) {
        backgroundColor = `linear-gradient(135deg, ${typeColors[pokemonTypes[0]]} 0%, ${typeColors[pokemonTypes[0]]} 30%, ${typeColors[pokemonTypes[1]]} 100%)`;    }
    pokemonCard.style.background = backgroundColor;
  
    // HTML generated
    pokemonCard.innerHTML = `
        <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
        <div class="pokemon-image-container">
            <img id="pokemon-img-${pokemon.id}" src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <div class="shiny-stars" id="shiny-stars-${pokemon.id}"></div>
        </div>
        <p><strong>Tipo:</strong> ${pokemon.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
        <p><strong>Altezza:</strong> ${pokemon.height}</p>
        <p><strong>Peso:</strong> ${pokemon.weight}</p>
        <button id="shiny-btn-${pokemon.id}" class="shiny-btn" onclick="toggleShiny(${pokemon.id}, '${pokemon.sprites.front_default}', '${pokemon.sprites.front_shiny}')">Shiny Version</button>
    `;

    container.appendChild(pokemonCard);
}

// Switch standard to shiny
function toggleShiny(id, defaultSprite, shinySprite) {
    const img = document.getElementById(`pokemon-img-${id}`);
    const shinyBtn = document.getElementById(`shiny-btn-${id}`);
    const shinyStarsContainer = document.getElementById(`shiny-stars-${id}`);
    
    if (img.src === defaultSprite) {
        img.src = shinySprite;
        shinyBtn.textContent = 'Standard Version';
        shinyBtn.style.backgroundColor = 'gray';

        // Add stars
        shinyStarsContainer.innerHTML = '';
        for (let i = 0; i < 5; i++) {
            const star = document.createElement('div');
            star.classList.add('shiny-star');
            star.style.setProperty('--x', Math.cos(2 * Math.PI * i / 5));
            star.style.setProperty('--y', Math.sin(2 * Math.PI * i / 5));
            shinyStarsContainer.appendChild(star);
        }

        // Remove stars after animation
        setTimeout(() => {
            shinyStarsContainer.innerHTML = '';
        }, 1000);
    } else {
        // Back to standars image
        img.src = defaultSprite;
        shinyBtn.textContent = 'Shiny Version';
        shinyBtn.style.backgroundColor = 'purple';
    }
}
