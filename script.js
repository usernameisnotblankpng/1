const apiKey = 'AIzaSyC_zKXBO3XyzuXc2AaEct6yQq7-GOg4Ygc'; // Your YouTube API Key
const clientId = '72221346487-77rh3u5hilusjpneh44gcikm5cn1ehld.apps.googleusercontent.com'; // Your Google OAuth Client ID
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const searchResults = document.getElementById('search-results');
const videoPlayer = document.getElementById('video-player');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const videoList = document.getElementById('video-list');
let accessToken = null;

// Initialize Google Sign-In
function initializeGoogleSignIn() {
    google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
    });
    google.accounts.id.renderButton(
        document.getElementById('google-signin'),
        { theme: 'outline', size: 'large' }
    );
}

// Handle Google Sign-In Response
function handleCredentialResponse(response) {
    accessToken = response.credential;
    fetchRecommendedVideos();
}

// Fetch Recommended Videos
async function fetchRecommendedVideos() {
    if (!accessToken) return;

    const url = `https://www.googleapis.com/youtube/v3/activities?part=snippet,contentDetails&mine=true&maxResults=10&access_token=${accessToken}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.items) {
        displayRecommendedVideos(data.items);
    }
}

// Display Recommended Videos
function displayRecommendedVideos(items) {
    videoList.innerHTML = ''; // Clear previous results
    items.forEach(item => {
        if (item.snippet.type === 'recommendation') {
            const videoItem = document.createElement('div');
            videoItem.className = 'video-item';
            videoItem.innerHTML = `
                <img src="${item.snippet.thumbnails.medium.url}" alt="${item.snippet.title}">
                <div class="details">
                    <div class="title">${item.snippet.title}</div>
                    <div class="channel">${item.snippet.channelTitle}</div>
                </div>
            `;
            videoItem.addEventListener('click', () => {
                videoPlayer.src = `https://www.youtube.com/embed/${item.contentDetails.upload.videoId}`;
                videoPlayer.scrollIntoView({ behavior: 'smooth' });
            });
            videoList.appendChild(videoItem);
        }
    });
}

// Initialize Google Sign-In on page load
window.onload = initializeGoogleSignIn;

// Rest of the code (search functionality and dark mode) remains the same
