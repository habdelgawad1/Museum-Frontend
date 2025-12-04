document.addEventListener('DOMContentLoaded', async function() {
    if (!isLoggedIn()) {
        alert('Please login to access the admin panel.');
        window.location.href = 'login.html';
        return;
    }
    setupTabs();
    setupForms();
    await loadAdminTours();
});

function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`${targetTab}Tab`).classList.add('active');
        });
    });
}

function setupForms() {
    document.getElementById('createTourForm').addEventListener('submit', handleCreateTour);
    document.getElementById('addAdminForm').addEventListener('submit', handleAddAdmin);
    document.getElementById('updateMuseumForm').addEventListener('submit', handleUpdateMuseum);
}

async function handleCreateTour(e) {
    e.preventDefault();
    const tourData = {
        name: document.getElementById('tourName').value,
        guide: document.getElementById('tourGuide').value,
        duration: document.getElementById('tourDuration').value,
        language: document.getElementById('tourLanguage').value,
        price: parseFloat(document.getElementById('tourPrice').value),
        maxCapacity: parseInt(document.getElementById('tourCapacity').value),
        description: document.getElementById('tourDescription').value
    };

    try {
        const response = await fetchWithAuth(API_ENDPOINTS.admin.tours, {
            method: 'POST',
            body: JSON.stringify(tourData)
        });

        if (response.ok) {
            alert('Tour created successfully!');
            document.getElementById('createTourForm').reset();
            await loadAdminTours();
        } else {
            const error = await response.json();
            alert(`Failed to create tour: ${error.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error creating tour:', error);
        alert('An error occurred while creating the tour. Please try again.');
    }
}

async function loadAdminTours() {
    const loadingEl = document.getElementById('adminToursLoading');
    const listEl = document.getElementById('adminToursList');

    try {
        loadingEl.style.display = 'block';
        listEl.innerHTML = '';

        const response = await fetch(API_ENDPOINTS.tours.all);

        if (response.ok) {
            const data = await response.json();
            const tours = data.tours || data || [];

            loadingEl.style.display = 'none';

            if (tours.length === 0) {
                listEl.innerHTML = '<p style="text-align: center; color: #5c4033;">No tours available.</p>';
            } else {
                displayAdminTours(tours);
            }
        } else {
            loadingEl.style.display = 'none';
            listEl.innerHTML = '<p style="text-align: center; color: #c41e3a;">Failed to load tours.</p>';
        }
    } catch (error) {
        console.error('Error loading tours:', error);
        loadingEl.style.display = 'none';
        listEl.innerHTML = '<p style="text-align: center; color: #c41e3a;">Failed to load tours.</p>';
    }
}

function displayAdminTours(tours) {
    const listEl = document.getElementById('adminToursList');
    listEl.innerHTML = tours.map(tour => `
        <div class="admin-item">
            <h4>${tour.name || tour.title}</h4>
            <div class="admin-item-info">
                <div class="admin-item-row">
                    <span><strong>Guide:</strong></span>
                    <span>${tour.guide || tour.guideName || 'N/A'}</span>
                </div>
                <div class="admin-item-row">
                    <span><strong>Duration:</strong></span>
                    <span>${tour.duration || 'N/A'}</span>
                </div>
                <div class="admin-item-row">
                    <span><strong>Price:</strong></span>
                    <span>$${tour.price || 0}</span>
                </div>
                <div class="admin-item-row">
                    <span><strong>Capacity:</strong></span>
                    <span>${tour.maxCapacity || tour.capacity || 'N/A'}</span>
                </div>
            </div>
            <div class="admin-actions">
                <button class="admin-btn edit" onclick='editTour(${JSON.stringify(tour).replace(/'/g, "\\'")})'}>
                    Edit
                </button>
                <button class="admin-btn delete" onclick="deleteTour('${tour.id || tour._id}')">
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

function editTour(tour) {
    document.getElementById('tourName').value = tour.name || tour.title || '';
    document.getElementById('tourGuide').value = tour.guide || tour.guideName || '';
    document.getElementById('tourDuration').value = tour.duration || '';
    document.getElementById('tourLanguage').value = tour.language || 'English';
    document.getElementById('tourPrice').value = tour.price || 0;
    document.getElementById('tourCapacity').value = tour.maxCapacity || tour.capacity || 0;
    document.getElementById('tourDescription').value = tour.description || '';

    const form = document.getElementById('createTourForm');
    const submitBtn = form.querySelector('.submit-btn');
    submitBtn.textContent = 'Update Tour';

    form.dataset.tourId = tour.id || tour._id;
    form.onsubmit = async (e) => {
        e.preventDefault();
        await handleUpdateTour(form.dataset.tourId);
    };
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function handleUpdateTour(tourId) {
    const tourData = {
        id: tourId,
        name: document.getElementById('tourName').value,
        guide: document.getElementById('tourGuide').value,
        duration: document.getElementById('tourDuration').value,
        language: document.getElementById('tourLanguage').value,
        price: parseFloat(document.getElementById('tourPrice').value),
        maxCapacity: parseInt(document.getElementById('tourCapacity').value),
        description: document.getElementById('tourDescription').value
    };

    try {
        const response = await fetchWithAuth(API_ENDPOINTS.admin.tours, {
            method: 'PUT',
            body: JSON.stringify(tourData)
        });

        if (response.ok) {
            alert('Tour updated successfully!');
            resetTourForm();
            await loadAdminTours();
        } else {
            const error = await response.json();
            alert(`Failed to update tour: ${error.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error updating tour:', error);
        alert('An error occurred while updating the tour. Please try again.');
    }
}

function resetTourForm() {
    const form = document.getElementById('createTourForm');
    form.reset();
    form.dataset.tourId = '';
    const submitBtn = form.querySelector('.submit-btn');
    submitBtn.textContent = 'Create Tour';
    form.onsubmit = handleCreateTour;
}

async function deleteTour(tourId) {
    if (!confirm('Are you sure you want to delete this tour?')) {
        return;
    }

    try {
        const response = await fetchWithAuth(API_ENDPOINTS.admin.tours, {
            method: 'DELETE',
            body: JSON.stringify({ id: tourId })
        });

        if (response.ok) {
            alert('Tour deleted successfully!');
            await loadAdminTours();
        } else {
            const error = await response.json();
            alert(`Failed to delete tour: ${error.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error deleting tour:', error);
        alert('An error occurred while deleting the tour. Please try again.');
    }
}

async function handleAddAdmin(e) {
    e.preventDefault();

    const adminData = {
        email: document.getElementById('adminEmail').value,
        password: document.getElementById('adminPassword').value,
        role: document.getElementById('adminRole').value
    };

    try {
        const response = await fetchWithAuth(API_ENDPOINTS.admin.users, {
            method: 'POST',
            body: JSON.stringify(adminData)
        });

        if (response.ok) {
            alert('Admin user created successfully!');
            document.getElementById('addAdminForm').reset();
        } else {
            const error = await response.json();
            alert(`Failed to create admin: ${error.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error creating admin:', error);
        alert('An error occurred while creating the admin user. Please try again.');
    }
}

async function handleUpdateMuseum(e) {
    e.preventDefault();

    const museumData = {
        name: document.getElementById('museumName').value,
        description: document.getElementById('museumDescription').value,
        address: document.getElementById('museumAddress').value,
        phone: document.getElementById('museumPhone').value,
        email: document.getElementById('museumEmail').value,
        website: document.getElementById('museumWebsite').value,
        openingHours: document.getElementById('openingHours').value
    };

    try {
        const response = await fetchWithAuth(API_ENDPOINTS.admin.home, {
            method: 'PUT',
            body: JSON.stringify(museumData)
        });

        if (response.ok) {
            alert('Museum information updated successfully!');
        } else {
            const error = await response.json();
            alert(`Failed to update museum info: ${error.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error updating museum info:', error);
        alert('An error occurred while updating the museum information. Please try again.');
    }
}
