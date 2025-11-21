let allGames = [];

fetch('/g/config.json')
  .then(res => res.json())
  .then(games => {
    allGames = games;
    renderGames(allGames);
    console.log(`Games loaded: ${allGames.length}`);
  })
  .catch(err => {
    console.error('Failed to load games:', err);
  });

function renderGames(games) {
  const container = document.querySelector('.games-scroll-container');
  container.innerHTML = '';

  games.forEach(game => {
    const link = document.createElement('a');
    link.href = game.url;
    link.target = "_self";
    link.className = 'game-card';
    link.innerHTML = `
      <img src="${game.image}" alt="${game.name}">
      <h2>${game.name}</h2>
    `;
    container.appendChild(link);
  });
}

// Search functionality
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  const filteredGames = allGames.filter(game =>
    game.name.toLowerCase().includes(query)
  );
  renderGames(filteredGames);
});