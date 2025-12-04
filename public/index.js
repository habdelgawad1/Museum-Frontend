document.addEventListener('DOMContentLoaded', async function() {
    updateLoginButton();
    await loadMuseumInfo();
});

function updateLoginButton() {
    const loginButton = document.querySelector('.login-button');
    if (isLoggedIn()) {
        loginButton.textContent = 'My Account';
        loginButton.href = 'profile.html';
    }
}

async function loadMuseumInfo() {
    try {
        const response = await fetch(API_ENDPOINTS.home);
        if (response.ok) {
            const museumData = await response.json();
            console.log('Museum info loaded:', museumData);
        }
    } catch (error) {
        console.error('Error loading museum information:', error);
    }
}
