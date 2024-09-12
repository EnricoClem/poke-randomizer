document.getElementById('random-btn').addEventListener('click', fetchMultiplePokemon);

function fetchMultiplePokemon() {
    // Getting the n° from the index input
    const count = document.getElementById('pokemon-count').value;

    // Get anly the types selected
    const selectedTypes = Array.from(document.querySelectorAll('#pokemon-types input:checked')).map(input => input.value);
  
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
        generateFilteredPokemon(count, selectedTypes);
    }
}

function generateFilteredPokemon(count, selectedTypes) {
    let generatedCount = 0;
  
    function attemptGeneration() {
        if (generatedCount >= count) return;
  
        const randomId = Math.floor(Math.random() * 898) + 1;
        fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
            .then(response => response.json())
            .then(data => {
            // Check the selected types
            const pokemonTypes = data.types.map(typeInfo => typeInfo.type.name);
            const hasSelectedType = pokemonTypes.some(type => selectedTypes.includes(type));
    
            if (hasSelectedType) {
                displayPokemon(data);
                generatedCount++;
            }
  
            attemptGeneration();
        })
        .catch(error => console.log('Current error:', error));
    }
  
    attemptGeneration();
}

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
  
    // HTML generated
    pokemonCard.innerHTML = `
        <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p><strong>Tipo:</strong> ${pokemon.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
        <p><strong>Altezza:</strong> ${pokemon.height}</p>
        <p><strong>Peso:</strong> ${pokemon.weight}</p>
    `;

    container.appendChild(pokemonCard);
}
