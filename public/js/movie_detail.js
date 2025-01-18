import fetchMovieData from "./fetchMovieData.js";

const userContainer = document.getElementById("user-container");

// Check if user data exists in localStorage
const currentUser = JSON.parse(localStorage.getItem("user"));
const usersList = JSON.parse(localStorage.getItem("users"));

if (currentUser && usersList) {
    const loggedInUser = usersList.find(user => user.email === currentUser);

    if (loggedInUser) {
        // Show user's name and a logout button
        userContainer.innerHTML = `
            <div class="text-white d-flex align-items-center space-x-3">
                <span class="fw-semibold">${loggedInUser.fullname}</span>
                <button id="logout" class="btn btn-sm btn-outline-light ms-3">Logout</button>
            </div>
        `;

        // Logout functionality
        document.getElementById("logout").addEventListener("click", () => {
            localStorage.removeItem("user");
            localStorage.removeItem("moviesData");
            alert("Logged out successfully!");
            window.location.reload();
        });
    }
} else {
    // Show login button if no user is logged in
    userContainer.innerHTML = `
        <a href="./login.html" class="btn btn-outline-light">
            <i class="fa-solid fa-user me-2"></i>Sign In
        </a>
    `;
}

// Existing functionality
let api_url = `https://movie-pass-c5a96-default-rtdb.firebaseio.com/`;

let moviesData;
if (localStorage.getItem("moviesData")) {
    moviesData = JSON.parse(localStorage.getItem("moviesData"));
} else {
    moviesData = await fetchMovieData(api_url);
    localStorage.setItem("moviesData", JSON.stringify(moviesData));
}

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('movieId');

const movie = moviesData.find(movie => movie.movieId == movieId);

if (movie) {
    displayMovies(movie);
} else {
    console.log("Movie not found");
}

function displayMovies(movie) {
    document.querySelector(".trailer-section iframe").src = movie.trailer;
    document.querySelector(".poster img").src = movie.poster;
    document.querySelector(".movie-title").textContent = movie.movie_title;
    document.querySelector(".movie-rating").textContent = `${movie.rating}/10`;
    document.querySelector(".quality").textContent = movie.quality;
    document.querySelector(".movie-language").textContent = movie.language;
    document.querySelector(".movie-details").textContent = 
        `${movie.duration} mins • ${movie.genre} • ${movie.language} • ${movie.release_date}`;
    document.querySelector(".movie-synopsis").textContent = movie.synopsis;
    document.querySelector(".movie-storyLine").textContent = movie.storyline;
}

// Booking functionality
let btn1 = document.getElementById("book_ticket");
btn1.addEventListener("click", SeatSelection);

function SeatSelection() {
    if (currentUser && usersList) {
        // User is logged in, proceed to seat selection
        window.location.href = `CinemaSelection.html?movieId=${movieId}`;
    } else {
        // User is not logged in, prompt for login or signup
        const confirmLogin = confirm(
            "You need to log in to book tickets. Would you like to log in or sign up now?"
        );

        if (confirmLogin) {
            // Redirect to login/signup page
            window.location.href = "./login.html";
        }
    }
}

