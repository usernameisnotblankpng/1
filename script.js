const apiKey = 'AIzaSyC_zKXBO3XyzuXc2AaEct6yQq7-GOg4Ygc'; // Your YouTube API Key
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchResults = document.getElementById('search-results');
const videoPlayer = document.getElementById('video-player');
const darkModeToggle = document.getElementById('dark-mode-toggle');

// Function to search for videos
async function searchVideos(query) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&q=${encodeURIComponent(query)}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.items;
}

// Function to display search results
function displayResults(items) {
    searchResults.innerHTML = ''; // Clear previous results
    items.forEach(item => {
        if (item.id.kind === 'youtube#video') {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <img src="${item.snippet.thumbnails.medium.url}" alt="${item.snippet.title}">
                <div class="details">
                    <div class="title">${item.snippet.title}</div>
                    <div class="channel">${item.snippet.channelTitle}</div>
                </div>
            `;
            resultItem.addEventListener('click', () => {
                videoPlayer.src = `https://www.youtube.com/embed/${item.id.videoId}`;
                videoPlayer.scrollIntoView({ behavior: 'smooth' }); // Smooth scroll to the player
            });
            searchResults.appendChild(resultItem);
        }
    });
}

// Event listener for the search button
searchButton.addEventListener('click', async () => {
    const query = searchInput.value.trim();
    if (query) {
        const videos = await searchVideos(query);
        displayResults(videos);
    }
});

// Optional: Allow pressing "Enter" to search
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchButton.click();
    }
});

// Dark Mode Toggle Functionality
darkModeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', darkModeToggle.checked);
});

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    darkModeToggle.checked = true;
}
