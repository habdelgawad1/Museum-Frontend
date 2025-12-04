const API_BASE_URL = 'http://localhost:4423';

const API_ENDPOINTS = {
    auth: {
        register: `${API_BASE_URL}/api/v1/auth/register`,
        login: `${API_BASE_URL}/api/v1/auth/login`
    },

    users: {
        profile: `${API_BASE_URL}/api/v1/users/profile`
    },

    tours: {
        all: `${API_BASE_URL}/api/v1/tours`,
        byId: (id) => `${API_BASE_URL}/api/v1/tours/${id}`,
        byGuide: `${API_BASE_URL}/api/v1/guide/tours`
    },

    home: `${API_BASE_URL}/api/v1/home`,

    bookings: {
        all: `${API_BASE_URL}/api/v1/bookings`,
        create: `${API_BASE_URL}/api/v1/bookings`,
        byId: (id) => `${API_BASE_URL}/api/v1/bookings/${id}`,
        payCash: (id) => `${API_BASE_URL}/api/v1/bookings/${id}/pay-cash`,
        payPoints: (id) => `${API_BASE_URL}/api/v1/bookings/${id}/pay-points`
    },

    reviews: {
        create: `${API_BASE_URL}/api/v1/reviews`,
        byTour: (tourId) => `${API_BASE_URL}/api/v1/tours/${tourId}/reviews`
    },

    admin: {
        users: `${API_BASE_URL}/api/v1/admin/users`,
        tours: `${API_BASE_URL}/api/v1/admin/tours`,
        home: `${API_BASE_URL}/api/v1/admin/home`
    }
};

function getAuthToken() {
    return localStorage.getItem('authToken');
}

function setAuthToken(token) {
    localStorage.setItem('authToken', token);
}

function removeAuthToken() {
    localStorage.removeItem('authToken');
}


function isLoggedIn() {
    return !!getAuthToken();
}

async function fetchWithAuth(url, options = {}) {
    const token = getAuthToken();

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (response.status === 401) {
        removeAuthToken();
        window.location.href = 'login.html';
    }

    return response;
}
