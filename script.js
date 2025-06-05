const API_KEY = 'c7c5cb12eca0a57341e95ec37d59b62f';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const movieGrid = document.getElementById('movieGrid');
const searchInput = document.getElementById('searchInput');

// 🎯 Градиент для флага
function applyGradientToFlag(colors) {
  const flag = document.querySelector('.flag-color');
  if (!flag || colors.length === 0) return;

  const uniqueColors = [...new Set(colors)];
  const gradient = `linear-gradient(135deg, ${uniqueColors.join(', ')})`;
  flag.style.background = gradient;
}

function getGenres() {
  return fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`)
    .then(res => res.json())
    .then(data => {
      const genreMap = {};
      data.genres.forEach(g => genreMap[g.id] = g.name);
      return genreMap;
    });
}

function getColorForGenre(genreName) {
  const map = {
    Action: "#FF7F11", Adventure: "#B47B32", Animation: "#A3F7BF", Comedy: "#FFD93D",
    Crime: "#8B0000", Documentary: "#E5E5E5", Drama: "#2B3A67", Family: "#FDD2A0",
    Fantasy: "#4CAF50", History: "#A0522D", Horror: "#1C1C1C", Music: "#FF66CC",
    Mystery: "#3B3B98", Romance: "#F38BA0", "Sci-Fi": "#8C52FF", "TV Movie": "#CCCCCC",
    Thriller: "#D62828", War: "#555555", Western: "#DEB887"
  };
  return map[genreName];
}

function renderMovies(movies, genreMap) {
  movieGrid.innerHTML = '';
  movies.forEach(movie => {
    const card = document.createElement('div');
    card.className = 'bg-[#111] rounded-xl overflow-hidden shadow hover:shadow-lg transition duration-300 card';

    const img = document.createElement('img');
    img.src = movie.poster_path ? IMG_URL + movie.poster_path : '';
    img.alt = movie.title;
    img.className = 'poster-img w-full aspect-[2/3] object-cover';
    card.appendChild(img);

    const content = document.createElement('div');
    content.className = 'p-3';

    const title = document.createElement('p');
    title.className = 'text-sm font-semibold mb-2 text-white';
    title.textContent = movie.title;
    content.appendChild(title);

    const tagContainer = document.createElement('div');
    tagContainer.className = 'flex flex-wrap gap-1';

    const genreColors = [];
    (movie.genre_ids || []).forEach(id => {
      const genreName = genreMap[id];
      const color = getColorForGenre(genreName);
      genreColors.push(color);

      const tag = document.createElement('div');
      tag.className = 'w-4 h-2 rounded-full';
      tag.style.backgroundColor = color;
      tagContainer.appendChild(tag);
    });

    content.appendChild(tagContainer);
    card.appendChild(content);

    // ✅ Применить градиент по клику
    card.addEventListener('click', () => {
      applyGradientToFlag(genreColors);
    });

    movieGrid.appendChild(card);
  });
}

async function searchMovies(query) {
  const genreMap = await getGenres();
  fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`)
    .then(res => res.json())
    .then(data => renderMovies(data.results, genreMap));
}

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    searchMovies(searchInput.value);
  }
});

async function loadPopular() {
  const genreMap = await getGenres();
  fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`)
    .then(res => res.json())
    .then(data => renderMovies(data.results, genreMap));
}

loadPopular();
