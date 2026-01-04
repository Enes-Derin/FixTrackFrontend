// Application Configuration
const config = {

    API_BASE_URL: 'https://fixtrackbackend.onrender.com' || 'http://localhost:8080',
    APP_NAME: 'FixTrack Teknik Servis',
    APP_VERSION: '1.0.0',


    PDF_PAGE_SIZE: 'A4',
    PDF_ORIENTATION: 'portrait',
    PDF_MARGIN: 20,
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],


    ITEMS_PER_PAGE: 10,
    DEBOUNCE_DELAY: 300,

    DEBUG_MODE: import.meta.env.DEV,
};

export default config;