// Application Configuration
const config = {
    // API Configuration
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',

    // Application Settings
    APP_NAME: 'FixTrack Teknik Servis',
    APP_VERSION: '1.0.0',

    // PDF Settings
    PDF_PAGE_SIZE: 'A4',
    PDF_ORIENTATION: 'portrait',
    PDF_MARGIN: 20,
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],

    // UI Settings
    ITEMS_PER_PAGE: 10,
    DEBOUNCE_DELAY: 300,

    // Development Settings
    DEBUG_MODE: import.meta.env.DEV,
};

export default config;