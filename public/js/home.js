import fetchMovieData from "./fetchMovieData.js";

let moviesData;
// Check for movies in localStorage or fetch new data
if (localStorage.getItem("moviesData")) {
  moviesData = JSON.parse(localStorage.getItem("moviesData"));
} 
else 
{
  moviesData = await fetchMovieData();
  localStorage.setItem("moviesData", JSON.stringify(moviesData));
}

// Display movies on initial load
displayMovies(moviesData);

// Handle user login state
document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.querySelector(".user");
  const profileContainer = document.createElement("div");
  profileContainer.className = "text-white flex items-center space-x-4";

  // Check if user data exists in localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  
  const users = JSON.parse(localStorage.getItem("users")) 
    
  const res = users.find((currUser) => currUser.email == user)
  if (res) {
    
    // Hide login button
    loginButton.parentElement.style.display = "none";

    // Create profile section
    profileContainer.innerHTML = `
      <div>
        <p class="font-semibold text-lg">${res.fullname}</p>
      </div>
      <button id="logout" class="text-white hover:bg-gray-800 p-2 rounded-md">Logout</button>
    `;

    // Add profile container to the nav bar
    loginButton.parentElement.parentElement.appendChild(profileContainer);

    // Logout button functionality
    document.getElementById("logout").addEventListener("click", () => {
      localStorage.removeItem("user"); // Clear user data
      localStorage.removeItem("moviesData");
      alert("Logged out successfully!");
      window.location.reload(); // Refresh the page
    });
  } else {
    // Ensure login button is visible if no user is logged in
    loginButton.parentElement.style.display = "block";
  }
});

// Function to display movies
function displayMovies(movies) {
  const movieGrid = document.getElementById("movieGrid");
  const noMoviesMessage = document.getElementById("no-movies-message");

  movieGrid.innerHTML = ""; // Clear existing movie cards
  if (movies.length === 0) {
    noMoviesMessage.classList.remove("hidden"); // Show "No movies found" message
  } else {
    noMoviesMessage.classList.add("hidden"); // Hide "No movies found" message
    movies.forEach((movie) => {
      const movieCard = document.createElement("div");
      movieCard.classList.add("glass-card", "cursor-pointer");

      movieCard.addEventListener("click", () => {
        window.location.href = `movie_detail.html?movieId=${movie.movieId}`;
      });

      movieCard.innerHTML = `
        <div class="image-container">
          <img src="${movie.poster}" alt="${movie.movie_title}" class="w-full h-64 object-scale-down rounded-t-lg mb-4" />
        </div>
        <div class="flex-1">
          <p class="font-semibold text-lg text-white truncate text-center">${movie.movie_title}</p>
          <p class="text-white text-sm truncate text-center">${movie.genre} | ${movie.quality}</p>
        </div>
      `;
      movieGrid.appendChild(movieCard);
    });
  }
}

// Filter movies based on selected criteria
function filterMovies() {
  const language = document.getElementById("language-select").value.toLowerCase();
  const genre = document.getElementById("genre-select").value.toLowerCase();
  const format = document.getElementById("format-select").value.toLowerCase();
  const searchTerm = document.getElementById("search-content").value.toLowerCase();

  const filteredMovies = moviesData.filter((movie) => {
    const matchesLanguage = !language || movie.language.toLowerCase().includes(language);
    const matchesGenre = !genre || movie.genre.toLowerCase().includes(genre);
    const matchesFormat = !format || movie.quality.toLowerCase().includes(format);
    const matchesSearchTerm = !searchTerm || movie.movie_title.toLowerCase().includes(searchTerm);

    return matchesLanguage && matchesGenre && matchesFormat && matchesSearchTerm;
  });

  displayMovies(filteredMovies); // Display filtered movies
}

// Event listeners for filtering and searching
document.getElementById("language-select").addEventListener("change", filterMovies);
document.getElementById("genre-select").addEventListener("change", filterMovies);
document.getElementById("format-select").addEventListener("change", filterMovies);
document.getElementById("search-content").addEventListener("input", filterMovies);

// Reset filters button functionality
document.getElementById("reset-filters").addEventListener("click", () => {
  document.getElementById("language-select").value = "";
  document.getElementById("genre-select").value = "";
  document.getElementById("format-select").value = "";
  document.getElementById("search-content").value = "";
  displayMovies(moviesData); // Display all movies
});

console.log(moviesData); // Debugging movies data
