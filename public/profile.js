document.addEventListener('DOMContentLoaded', async function() {
    if (!isLoggedIn()) {
        alert('Please login to view your profile.');
        window.location.href = 'login.html';
        return;
    }

    setupEventListeners();
    await loadUserProfile();
    await loadAccountStats();
});

function setupEventListeners() {
    document.getElementById('updateProfileForm').addEventListener('submit', handleUpdateProfile);
    document.getElementById('changePasswordForm').addEventListener('submit', handleChangePassword);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
}

async function loadUserProfile() {
    const profileLoading = document.getElementById('profileLoading');
    const profileInfo = document.getElementById('profileInfo');

    try {
        profileLoading.style.display = 'block';
        profileInfo.style.display = 'none';

        const response = await fetchWithAuth(API_ENDPOINTS.users.profile);

        if (response.ok) {
            const userData = await response.json();

            displayProfileInfo(userData);

            populateUpdateForm(userData);

            profileLoading.style.display = 'none';
            profileInfo.style.display = 'block';
        } else {
            profileLoading.style.display = 'none';
            profileInfo.innerHTML = '<p style="text-align: center; color: #c41e3a;">Failed to load profile.</p>';
            profileInfo.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        profileLoading.style.display = 'none';
        profileInfo.innerHTML = '<p style="text-align: center; color: #c41e3a;">Failed to load profile.</p>';
        profileInfo.style.display = 'block';
    }
}

function displayProfileInfo(userData) {
    const profileInfo = document.getElementById('profileInfo');

    profileInfo.innerHTML = `
        <div class="profile-info-row">
            <strong>Email:</strong>
            <span>${userData.email || 'N/A'}</span>
        </div>
        <div class="profile-info-row">
            <strong>Full Name:</strong>
            <span>${userData.name || userData.fullName || 'Not set'}</span>
        </div>
        <div class="profile-info-row">
            <strong>Phone:</strong>
            <span>${userData.phone || userData.phoneNumber || 'Not set'}</span>
        </div>
        <div class="profile-info-row">
            <strong>Country:</strong>
            <span>${userData.country || 'Not set'}</span>
        </div>
        <div class="profile-info-row">
            <strong>Member Since:</strong>
            <span>${userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}</span>
        </div>
        ${userData.points !== undefined ? `
            <div class="profile-info-row">
                <strong>Reward Points:</strong>
                <span>${userData.points}</span>
            </div>
        ` : ''}
        ${userData.bio ? `
            <div class="profile-info-row">
                <strong>Bio:</strong>
                <span>${userData.bio}</span>
            </div>
        ` : ''}
    `;
}

function populateUpdateForm(userData) {
    document.getElementById('profileEmail').value = userData.email || '';
    document.getElementById('profileName').value = userData.name || userData.fullName || '';
    document.getElementById('profilePhone').value = userData.phone || userData.phoneNumber || '';
    document.getElementById('profileCountry').value = userData.country || '';
    document.getElementById('profileBio').value = userData.bio || '';
}

async function handleUpdateProfile(e) {
    e.preventDefault();

    const profileData = {
        email: document.getElementById('profileEmail').value,
        name: document.getElementById('profileName').value,
        phone: document.getElementById('profilePhone').value,
        country: document.getElementById('profileCountry').value,
        bio: document.getElementById('profileBio').value
    };

    try {
        const response = await fetchWithAuth(API_ENDPOINTS.users.profile, {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });

        if (response.ok) {
            alert('Profile updated successfully!');
            await loadUserProfile();
        } else {
            const error = await response.json();
            alert(`Failed to update profile: ${error.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('An error occurred while updating your profile. Please try again.');
    }
}

async function handleChangePassword(e) {
    e.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        alert('New password and confirm password do not match!');
        return;
    }

    if (newPassword.length < 6) {
        alert('Password must be at least 6 characters long!');
        return;
    }

    const passwordData = {
        currentPassword: currentPassword,
        newPassword: newPassword
    };

    try {
        const response = await fetchWithAuth(`${API_ENDPOINTS.users.profile}/password`, {
            method: 'PUT',
            body: JSON.stringify(passwordData)
        });

        if (response.ok) {
            alert('Password changed successfully!');
            document.getElementById('changePasswordForm').reset();
        } else {
            const error = await response.json();
            alert(`Failed to change password: ${error.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error changing password:', error);
        alert('An error occurred while changing your password. Please try again.');
    }
}

async function loadAccountStats() {
    const statsLoading = document.getElementById('statsLoading');
    const accountStats = document.getElementById('accountStats');

    try {
        statsLoading.style.display = 'block';
        accountStats.style.display = 'none';

        const bookingsResponse = await fetchWithAuth(API_ENDPOINTS.bookings.all);

        if (bookingsResponse.ok) {
            const bookingsData = await bookingsResponse.json();
            const bookings = bookingsData.bookings || bookingsData || [];

            const totalBookings = bookings.length;
            const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
            const totalSpent = bookings.reduce((sum, b) => sum + (b.totalPrice || b.price || 0), 0);

            displayStats({
                totalBookings,
                confirmedBookings,
                totalSpent,
                upcomingBookings: bookings.filter(b =>
                    b.status !== 'cancelled' && new Date(b.date) >= new Date()
                ).length
            });

            statsLoading.style.display = 'none';
            accountStats.style.display = 'grid';
        } else {
            statsLoading.style.display = 'none';
            accountStats.innerHTML = '<p style="text-align: center; color: #5c4033;">Unable to load statistics.</p>';
            accountStats.style.display = 'block';
        }
    } catch (error) {
        console.error('Error loading stats:', error);
        statsLoading.style.display = 'none';
        accountStats.innerHTML = '<p style="text-align: center; color: #5c4033;">Unable to load statistics.</p>';
        accountStats.style.display = 'block';
    }
}

function displayStats(stats) {
    const accountStats = document.getElementById('accountStats');

    accountStats.innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${stats.totalBookings}</div>
            <div class="stat-label">Total Bookings</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.confirmedBookings}</div>
            <div class="stat-label">Confirmed</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${stats.upcomingBookings}</div>
            <div class="stat-label">Upcoming</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">$${stats.totalSpent.toFixed(2)}</div>
            <div class="stat-label">Total Spent</div>
        </div>
    `;
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        removeAuthToken();
        alert('You have been logged out successfully.');
        window.location.href = 'index.html';
    }
}
