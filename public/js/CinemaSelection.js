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
            <div class="text-white flex items-center space-x-3">
                <span class="fw-semibold">${loggedInUser.fullname}</span>
                <button id="logout" class="text-white hover:bg-gray-800 p-2 rounded-md">Logout</button>
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
        <a href="./login.html">
            <button class="text-white hover:bg-gray-800 p-2 rounded-md">
                <i class="fa-solid fa-user text-white ml-2 text-xl"></i> Sign In
            </button>
        </a>
    `;
}

// Movie and theater logic
let api_url = `https://movie-pass-c5a96-default-rtdb.firebaseio.com/`;

let moviesData;
if (localStorage.getItem("moviesData")) {
    moviesData = JSON.parse(localStorage.getItem("moviesData"));
} else {
    moviesData = await fetchMovieData(api_url);
    localStorage.setItem("moviesData", JSON.stringify(moviesData));
}

const params = new URLSearchParams(window.location.search);
const movieId = params.get("movieId");

const movieData = moviesData.find(movie => movie.movieId === movieId);

if (movieData && movieData.theatres) {
    displayTheatres(movieData.theatres);
} else {
    console.error("No theaters found for the movie.");
}

function getCurrentDateFormatted() {
    const today = new Date();
    const options = { weekday: "long", day: "numeric", month: "long", year: "numeric" };
    return today.toLocaleDateString("en-US", options);
}

const currentDate = getCurrentDateFormatted();

document.querySelector(".movie-title").textContent = movieData.movie_title;
document.querySelector(".movie-details").textContent = `${movieData.duration} mins • ${movieData.genre} • ${movieData.language} • ${movieData.release_date}`;
document.querySelector(".movie-poster").src = movieData.poster;
document.querySelector(".movie-date").textContent = currentDate;

function displayTheatres(theatres) {
    const theatreContainer = document.getElementById("theater-container");
    const slots = ["09:00 AM", "14:00 PM", "23:00 PM"];
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);

    theatres.forEach((theatre, theaterIndex) => {
        const theatreElement = document.createElement("div");
        theatreElement.classList.add("bg-gray-700", "p-4", "rounded-lg", "shadow-md", "space-y-4");

        theatreElement.innerHTML = `
            <div>
                <h3 class="text-xl font-semibold">${theatre.name} - ${theatre.location}</h3>
            </div>
            <div class="flex gap-4 text-sm text-gray-400">
                <span>Parking Available</span>
                <span>Dolby Surround Sound</span>
                <span>Online Booking</span>
            </div>
        `;

        const timeSlotsContainer = document.createElement("div");
        timeSlotsContainer.classList.add("flex", "flex-wrap", "gap-2");

        slots.forEach((slot, slotIndex) => {
            const slotElement = document.createElement("button");
            slotElement.classList.add(
                "bg-gray-600",
                "hover:bg-blue-500",
                "text-white",
                "px-4",
                "py-2",
                "rounded-lg",
                "cursor-pointer",
                "text-sm",
                "font-medium"
            );
            slotElement.textContent = slot;
            let slotTime = slot.slice(0, 5);

            if (slotTime < currentTime) {
                slotElement.disabled = true;
            }

            slotElement.addEventListener("click", () => {
                redirectToBookingPage(theaterIndex, slotIndex);
            });

            timeSlotsContainer.appendChild(slotElement);
        });

        theatreElement.appendChild(timeSlotsContainer);
        theatreContainer.appendChild(theatreElement);
    });
}

function redirectToBookingPage(theaterId, showId) {
    const bookingUrl = `SeatSelection.html?theaterId=${theaterId}&showId=${showId}&movieId=${movieId}`;
    window.location.href = bookingUrl;
}
