let allTours = [];
let filteredTours = [];

document.addEventListener('DOMContentLoaded', async function() {
    updateLoginButton();
    await loadTours();
    setupEventListeners();
});

function updateLoginButton() {
    const loginButton = document.querySelector('.login-button');
    if (isLoggedIn()) {
        loginButton.textContent = 'My Account';
        loginButton.href = 'profile.html';
    }
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchTours');
    const filterGuide = document.getElementById('filterGuide');
    const modal = document.getElementById('tourModal');
    const closeModal = document.querySelector('.close-modal');

    searchInput.addEventListener('input', filterTours);
    filterGuide.addEventListener('change', filterTours);

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

async function loadTours() {
    const loading = document.getElementById('toursLoading');
    const error = document.getElementById('toursError');
    const noTours = document.getElementById('noTours');

    try {
        loading.style.display = 'block';
        error.style.display = 'none';
        noTours.style.display = 'none';

        const response = await fetch(API_ENDPOINTS.tours.all);

        if (!response.ok) {
            throw new Error('Failed to fetch tours');
        }

        const data = await response.json();
        allTours = data.tours || data || [];
        filteredTours = [...allTours];

        loading.style.display = 'none';

        if (allTours.length === 0) {
            noTours.style.display = 'block';
        } else {
            displayTours(filteredTours);
        }

    } catch (error) {
        console.error('Error loading tours:', error);
        loading.style.display = 'none';
        error.style.display = 'block';
    }
}

function displayTours(tours) {
    const toursContainer = document.getElementById('toursContainer');
    const noTours = document.getElementById('noTours');

    if (tours.length === 0) {
        toursContainer.innerHTML = '';
        noTours.style.display = 'block';
        return;
    }

    noTours.style.display = 'none';
    toursContainer.innerHTML = tours.map(tour => createTourCard(tour)).join('');

    // Add click event listeners to tour cards
    document.querySelectorAll('.tour-card').forEach((card, index) => {
        card.addEventListener('click', () => showTourDetails(tours[index]));
    });

    // Add click event listeners to book buttons
    document.querySelectorAll('.book-tour-btn').forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            bookTour(tours[index]);
        });
    });
}

// Create tour card HTML
function createTourCard(tour) {
    return `
        <div class="tour-card" data-tour-id="${tour.id || tour._id}">
            <h3>${tour.name || tour.title || 'Unnamed Tour'}</h3>
            <div class="tour-info">
                <strong>Guide:</strong> ${tour.guide || tour.guideName || 'N/A'}
            </div>
            <div class="tour-info">
                <strong>Duration:</strong> ${tour.duration || 'N/A'}
            </div>
            <div class="tour-info">
                <strong>Language:</strong> ${tour.language || 'English'}
            </div>
            ${tour.description ? `
                <div class="tour-description">
                    ${tour.description.substring(0, 150)}${tour.description.length > 150 ? '...' : ''}
                </div>
            ` : ''}
            <div class="tour-price">
                ${tour.price ? `$${tour.price}` : tour.points ? `${tour.points} points` : 'Price TBA'}
            </div>
            <button class="book-tour-btn">Book This Tour</button>
        </div>
    `;
}

function filterTours() {
    const searchTerm = document.getElementById('searchTours').value.toLowerCase();
    const guideFilter = document.getElementById('filterGuide').value;

    filteredTours = allTours.filter(tour => {
        const matchesSearch = !searchTerm ||
            (tour.name && tour.name.toLowerCase().includes(searchTerm)) ||
            (tour.title && tour.title.toLowerCase().includes(searchTerm)) ||
            (tour.description && tour.description.toLowerCase().includes(searchTerm));

        const matchesGuide = !guideFilter ||
            (tour.guide && tour.guide === guideFilter) ||
            (tour.guideName && tour.guideName === guideFilter);

        return matchesSearch && matchesGuide;
    });

    displayTours(filteredTours);
}

async function showTourDetails(tour) {
    const modal = document.getElementById('tourModal');
    const tourDetails = document.getElementById('tourDetails');
    const tourId = tour.id || tour._id;

    modal.style.display = 'block';
    tourDetails.innerHTML = '<p style="text-align: center;">Loading tour details...</p>';

    try {
        const response = await fetch(API_ENDPOINTS.tours.byId(tourId));

        if (response.ok) {
            const detailedTour = await response.json();
            displayTourDetails(detailedTour);
            await loadTourReviews(tourId);
        } else {
            // If detailed fetch fails, use the tour data we have
            displayTourDetails(tour);
            await loadTourReviews(tourId);
        }
    } catch (error) {
        console.error('Error loading tour details:', error);
        displayTourDetails(tour);
    }
}

function displayTourDetails(tour) {
    const tourDetails = document.getElementById('tourDetails');

    tourDetails.innerHTML = `
        <div class="tour-detail-section">
            <h2>${tour.name || tour.title || 'Tour Details'}</h2>

            <div class="tour-info">
                <strong>Guide:</strong> ${tour.guide || tour.guideName || 'N/A'}
            </div>
            <div class="tour-info">
                <strong>Duration:</strong> ${tour.duration || 'N/A'}
            </div>
            <div class="tour-info">
                <strong>Language:</strong> ${tour.language || 'English'}
            </div>
            <div class="tour-info">
                <strong>Max Capacity:</strong> ${tour.maxCapacity || tour.capacity || 'N/A'}
            </div>

            ${tour.description ? `
                <h3>Description</h3>
                <p>${tour.description}</p>
            ` : ''}

            ${tour.highlights ? `
                <h3>Highlights</h3>
                <ul class="highlights-list">
                    ${Array.isArray(tour.highlights)
                        ? tour.highlights.map(h => `<li>${h}</li>`).join('')
                        : `<li>${tour.highlights}</li>`}
                </ul>
            ` : ''}

            <div class="tour-price">
                ${tour.price ? `Price: $${tour.price}` : tour.points ? `Price: ${tour.points} points` : 'Price TBA'}
            </div>

            <button class="book-tour-btn" onclick="bookTour(${JSON.stringify(tour).replace(/"/g, '&quot;')})">
                Book This Tour
            </button>

            <div id="reviewsSection" class="reviews-section">
                <h3>Reviews</h3>
                <div id="reviewsContainer">
                    <p style="text-align: center; color: #5c4033;">Loading reviews...</p>
                </div>
            </div>
        </div>
    `;
}

async function loadTourReviews(tourId) {
    const reviewsContainer = document.getElementById('reviewsContainer');

    try {
        const response = await fetch(API_ENDPOINTS.reviews.byTour(tourId));

        if (response.ok) {
            const reviews = await response.json();

            if (reviews.length === 0 || (Array.isArray(reviews.reviews) && reviews.reviews.length === 0)) {
                reviewsContainer.innerHTML = '<p style="text-align: center; color: #5c4033;">No reviews yet. Be the first to review!</p>';
            } else {
                const reviewsList = Array.isArray(reviews) ? reviews : reviews.reviews || [];
                reviewsContainer.innerHTML = reviewsList.map(review => `
                    <div class="review-card">
                        <div class="review-rating">${'★'.repeat(review.rating || 5)}${'☆'.repeat(5 - (review.rating || 5))}</div>
                        <p><strong>${review.userName || review.user || 'Anonymous'}</strong></p>
                        <p>${review.comment || review.review || ''}</p>
                        ${review.date ? `<p style="font-size: 12px; color: #8b4513;">${new Date(review.date).toLocaleDateString()}</p>` : ''}
                    </div>
                `).join('');
            }
        } else {
            reviewsContainer.innerHTML = '<p style="text-align: center; color: #5c4033;">Unable to load reviews.</p>';
        }
    } catch (error) {
        console.error('Error loading reviews:', error);
        reviewsContainer.innerHTML = '<p style="text-align: center; color: #5c4033;">Unable to load reviews.</p>';
    }
}

function bookTour(tour) {
    if (!isLoggedIn()) {
        alert('Please login to book a tour.');
        window.location.href = 'login.html';
        return;
    }

    localStorage.setItem('selectedTour', JSON.stringify(tour));
    window.location.href = 'tickets.html';
}
