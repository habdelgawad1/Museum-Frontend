let availableTours = [];
let selectedTourData = null;

document.addEventListener('DOMContentLoaded', async function() {
    if (!isLoggedIn()) {
        alert('Please login to book tickets.');
        window.location.href = 'login.html';
        return;
    }

    updateLoginButton();
    await loadToursForDropdown();
    checkSelectedTour();
    setupEventListeners();
    await loadUserBookings();
});

function updateLoginButton() {
    const loginButton = document.querySelector('.login-button');
    if (isLoggedIn()) {
        loginButton.textContent = 'My Account';
        loginButton.href = 'profile.html';
    }
}

function setupEventListeners() {
    const bookingForm = document.getElementById('bookingForm');
    const tourSelect = document.getElementById('tourSelect');
    const numTickets = document.getElementById('numTickets');
    const bookingDate = document.getElementById('bookingDate');
    const bookingTime = document.getElementById('bookingTime');

    const today = new Date().toISOString().split('T')[0];
    bookingDate.min = today;

    bookingForm.addEventListener('submit', handleBookingSubmit);
    tourSelect.addEventListener('change', updateBookingSummary);
    numTickets.addEventListener('input', updateBookingSummary);
    bookingDate.addEventListener('change', updateBookingSummary);
    bookingTime.addEventListener('change', updateBookingSummary);
}

function checkSelectedTour() {
    const selectedTour = localStorage.getItem('selectedTour');
    if (selectedTour) {
        try {
            selectedTourData = JSON.parse(selectedTour);
            const tourSelect = document.getElementById('tourSelect');
            tourSelect.value = selectedTourData.id || selectedTourData._id;

            const selectedTourInfo = document.getElementById('selectedTourInfo');
            const tourInfoContent = document.getElementById('tourInfoContent');
            selectedTourInfo.style.display = 'block';
            tourInfoContent.innerHTML = `
                <h3>${selectedTourData.name || selectedTourData.title}</h3>
                <p><strong>Guide:</strong> ${selectedTourData.guide || selectedTourData.guideName || 'N/A'}</p>
                <p><strong>Duration:</strong> ${selectedTourData.duration || 'N/A'}</p>
                <p><strong>Price:</strong> ${selectedTourData.price ? `$${selectedTourData.price}` : 'TBA'}</p>
            `;

            updateBookingSummary();
            localStorage.removeItem('selectedTour');
        } catch (error) {
            console.error('Error parsing selected tour:', error);
        }
    }
}

async function loadToursForDropdown() {
    try {
        const response = await fetch(API_ENDPOINTS.tours.all);
        if (response.ok) {
            const data = await response.json();
            availableTours = data.tours || data || [];

            const tourSelect = document.getElementById('tourSelect');
            availableTours.forEach(tour => {
                const option = document.createElement('option');
                option.value = tour.id || tour._id;
                option.textContent = `${tour.name || tour.title} - ${tour.price ? `$${tour.price}` : 'TBA'}`;
                option.dataset.tour = JSON.stringify(tour);
                tourSelect.appendChild(option);
            });

            if (selectedTourData) {
                tourSelect.value = selectedTourData.id || selectedTourData._id;
            }
        }
    } catch (error) {
        console.error('Error loading tours:', error);
    }
}

function updateBookingSummary() {
    const tourSelect = document.getElementById('tourSelect');
    const numTickets = document.getElementById('numTickets').value;
    const bookingDate = document.getElementById('bookingDate').value;
    const bookingTime = document.getElementById('bookingTime').value;

    const summaryTour = document.getElementById('summaryTour');
    const summaryDateTime = document.getElementById('summaryDateTime');
    const summaryTickets = document.getElementById('summaryTickets');
    const summaryTotal = document.getElementById('summaryTotal');

    summaryTour.textContent = tourSelect.selectedOptions[0]?.text || '-';

    if (bookingDate && bookingTime) {
        const dateObj = new Date(bookingDate);
        summaryDateTime.textContent = `${dateObj.toLocaleDateString()} at ${bookingTime}`;
    } else {
        summaryDateTime.textContent = '-';
    }

    summaryTickets.textContent = numTickets ? `${numTickets} ticket(s)` : '-';

    if (tourSelect.value && numTickets) {
        const selectedOption = tourSelect.selectedOptions[0];
        if (selectedOption && selectedOption.dataset.tour) {
            const tour = JSON.parse(selectedOption.dataset.tour);
            const price = tour.price || 0;
            const total = price * parseInt(numTickets);
            summaryTotal.textContent = `$${total.toFixed(2)}`;
        }
    } else {
        summaryTotal.textContent = '$0.00';
    }
}

async function handleBookingSubmit(e) {
    e.preventDefault();

    const tourSelect = document.getElementById('tourSelect');
    const bookingDate = document.getElementById('bookingDate').value;
    const bookingTime = document.getElementById('bookingTime').value;
    const numTickets = document.getElementById('numTickets').value;
    const specialRequests = document.getElementById('specialRequests').value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

    const tourId = tourSelect.value;
    const selectedOption = tourSelect.selectedOptions[0];
    const tour = JSON.parse(selectedOption.dataset.tour);

    const bookingData = {
        tourId: tourId,
        date: bookingDate,
        time: bookingTime,
        numberOfTickets: parseInt(numTickets),
        totalPrice: tour.price * parseInt(numTickets),
        specialRequests: specialRequests,
        paymentMethod: paymentMethod
    };

    try {
        const response = await fetchWithAuth(API_ENDPOINTS.bookings.create, {
            method: 'POST',
            body: JSON.stringify(bookingData)
        });

        if (response.ok) {
            const result = await response.json();
            const bookingId = result.id || result._id || result.bookingId;

            if (paymentMethod === 'cash') {
                await processPayment(bookingId, 'cash');
            } else if (paymentMethod === 'points') {
                await processPayment(bookingId, 'points');
            }

            alert('Booking confirmed successfully!');

            document.getElementById('bookingForm').reset();
            document.getElementById('selectedTourInfo').style.display = 'none';
            updateBookingSummary();

            await loadUserBookings();
        } else {
            const error = await response.json();
            alert(`Booking failed: ${error.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error creating booking:', error);
        alert('An error occurred while creating your booking. Please try again.');
    }
}

async function processPayment(bookingId, method) {
    try {
        const endpoint = method === 'cash'
            ? API_ENDPOINTS.bookings.payCash(bookingId)
            : API_ENDPOINTS.bookings.payPoints(bookingId);

        const response = await fetchWithAuth(endpoint, {
            method: 'POST'
        });

        if (!response.ok) {
            console.error('Payment processing failed');
        }
    } catch (error) {
        console.error('Error processing payment:', error);
    }
}

async function loadUserBookings() {
    const bookingsLoading = document.getElementById('bookingsLoading');
    const bookingsList = document.getElementById('bookingsList');
    const noBookings = document.getElementById('noBookings');

    try {
        bookingsLoading.style.display = 'block';
        noBookings.style.display = 'none';
        bookingsList.innerHTML = '';

        const response = await fetchWithAuth(API_ENDPOINTS.bookings.all);

        if (response.ok) {
            const data = await response.json();
            const bookings = data.bookings || data || [];

            bookingsLoading.style.display = 'none';

            if (bookings.length === 0) {
                noBookings.style.display = 'block';
            } else {
                displayBookings(bookings);
            }
        } else {
            bookingsLoading.style.display = 'none';
            noBookings.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading bookings:', error);
        bookingsLoading.style.display = 'none';
        bookingsList.innerHTML = '<p style="text-align: center; color: #c41e3a;">Failed to load bookings.</p>';
    }
}

function displayBookings(bookings) {
    const bookingsList = document.getElementById('bookingsList');

    bookingsList.innerHTML = bookings.map(booking => `
        <div class="booking-card">
            <h4>${booking.tourName || booking.tour?.name || 'Tour Booking'}</h4>
            <div class="booking-info">
                <div class="booking-info-row">
                    <span><strong>Booking ID:</strong></span>
                    <span>${booking.id || booking._id}</span>
                </div>
                <div class="booking-info-row">
                    <span><strong>Date:</strong></span>
                    <span>${new Date(booking.date).toLocaleDateString()}</span>
                </div>
                <div class="booking-info-row">
                    <span><strong>Time:</strong></span>
                    <span>${booking.time || 'N/A'}</span>
                </div>
                <div class="booking-info-row">
                    <span><strong>Tickets:</strong></span>
                    <span>${booking.numberOfTickets || booking.tickets}</span>
                </div>
                <div class="booking-info-row">
                    <span><strong>Total Price:</strong></span>
                    <span>$${booking.totalPrice || booking.price || 0}</span>
                </div>
                <div class="booking-info-row">
                    <span><strong>Status:</strong></span>
                    <span class="booking-status ${booking.status || 'pending'}">${booking.status || 'Pending'}</span>
                </div>
            </div>
            ${booking.status !== 'cancelled' ? `
                <div class="booking-actions">
                    <button class="booking-btn update" onclick="updateBooking('${booking.id || booking._id}')">
                        Update
                    </button>
                    <button class="booking-btn cancel" onclick="cancelBooking('${booking.id || booking._id}')">
                        Cancel
                    </button>
                </div>
            ` : ''}
        </div>
    `).join('');
}

async function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
    }

    try {
        const response = await fetchWithAuth(API_ENDPOINTS.bookings.byId(bookingId), {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Booking cancelled successfully!');
            await loadUserBookings();
        } else {
            const error = await response.json();
            alert(`Failed to cancel booking: ${error.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('An error occurred while cancelling your booking. Please try again.');
    }
}
