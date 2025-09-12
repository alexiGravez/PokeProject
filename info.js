document.addEventListener('DOMContentLoaded', function() {
  const sendRequestButton = document.getElementById('send-request');
  const loader = document.getElementById('loader');
  const responseElement = document.getElementById('response');
  const pokemonCard = document.getElementById('pokemon-card');
  const resourceSelect = document.getElementById('resource');
  const identifierInput = document.getElementById('identifier');
            
  // Actualizar el endpoint cuando cambia el recurso
  resourceSelect.addEventListener('change', updateEndpoint);
  identifierInput.addEventListener('input', updateEndpoint);
  
  function updateEndpoint() {
  const resource = resourceSelect.value;
  const identifier = identifierInput.value.trim();
  const endpointInput = document.getElementById('endpoint');
      
  let endpoint = `https://pokeapi.co/api/v2/${resource}/`;
  if (identifier) {
    endpoint += `${identifier}`;
  }
      
  endpointInput.value = endpoint;
  }
  
// Inicializar el endpoint
updateEndpoint();
  
// Manejar el envío de la solicitud
sendRequestButton.addEventListener('click', function() {
  const resource = resourceSelect.value;
  const identifier = identifierInput.value.trim();
  
  if (!identifier) {
    alert('Por favor, ingresa un ID o nombre de Pokémon');
    return;
  }
  
  // Mostrar loader
  loader.style.display = 'block';
  pokemonCard.style.display = 'none';
  responseElement.textContent = 'Cargando...';
  
  // Realizar la solicitud a la PokeAPI
  fetch(`https://pokeapi.co/api/v2/${resource}/${identifier.toLowerCase()}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Pokémon no encontrado');
        }
        return response.json();
    })
    .then(data => {
        // Ocultar loader y mostrar respuesta
        loader.style.display = 'none';
        
        // Formatear y mostrar la respuesta JSON
        responseElement.textContent = JSON.stringify(data, null, 2);
        
        // Si es un Pokémon, mostrar la tarjeta
        if (resource === 'pokemon') {
            displayPokemonCard(data);
        }
    })
    .catch(error => {
        loader.style.display = 'none';
        responseElement.textContent = `Error: ${error.message}`;
        pokemonCard.style.display = 'none';
    });
});
  
  // Función para mostrar la tarjeta de Pokémon
  function displayPokemonCard(pokemonData) {
    const pokemonName = document.getElementById('pokemon-name');
    const pokemonImage = document.getElementById('pokemon-img');
    const pokemonHeight = document.getElementById('pokemon-height');
    const pokemonWeight = document.getElementById('pokemon-weight');
    const pokemonType = document.getElementById('pokemon-type');
    const pokemonAbilities = document.getElementById('pokemon-abilities');
    
    
    // Actualizar la información del Pokémon
    pokemonName.textContent = pokemonData.name;
    pokemonImage.src = pokemonData.sprites.front_default;
    pokemonHeight.textContent = `${(pokemonData.height / 10).toFixed(1)} m`;
    pokemonWeight.textContent = `${(pokemonData.weight / 10).toFixed(1)} kg`;
    pokemonAbilities.innerHTML = '';
    pokemonData.abilities.forEach(abilityInfo => {
        const li = document.createElement('li');
        li.textContent = abilityInfo.ability.name;
        pokemonAbilities.appendChild(li);
    });
    
    // Obtener los tipos
    const types = pokemonData.types.map(typeInfo => typeInfo.type.name);
    pokemonType.textContent = types.join(', ');
    
    // Mostrar la tarjeta
    pokemonCard.style.display = 'block';
  }
            
  // Cargar Pikachu por defecto
  sendRequestButton.click();
});
