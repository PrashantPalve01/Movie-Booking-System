// Utility function to fetch movie data from the API
export default async function fetchMovieData() {
    const api_url = `https://movie-pass-c5a96-default-rtdb.firebaseio.com/MovieData.json`;

    try {
        const response = await fetch(api_url);
        const data = await response.json();

        return data;
    } catch (error) {
        console.error("Something went wrong with fetching API", error.message);
        return error;
    }
}


