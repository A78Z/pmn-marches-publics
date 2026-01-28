export default () => ({
  port: parseInt(process.env.PORT || '3001', 10),
  environment: process.env.NODE_ENV || 'development',

  // Parse / Back4App configuration
  parse: {
    applicationId: process.env.PARSE_APPLICATION_ID,
    javascriptKey: process.env.PARSE_JAVASCRIPT_KEY,
    masterKey: process.env.PARSE_MASTER_KEY,
    restApiKey: process.env.PARSE_REST_API_KEY,
    serverUrl: process.env.PARSE_SERVER_URL || 'https://parseapi.back4app.com',
  },

  // Scraping configuration
  scraping: {
    sourceUrl: process.env.SCRAPING_SOURCE_URL || 'http://www.marchespublics.sn/index.php',
    cronSchedule: process.env.SCRAPING_CRON_SCHEDULE || '0 6,12,18 * * *',
    userAgent:
      process.env.SCRAPING_USER_AGENT ||
      'PMN-Scraper/1.0 (+http://pmn.sn)',
    timeout: parseInt(process.env.SCRAPING_TIMEOUT || '30000', 10),
    maxRetries: parseInt(process.env.SCRAPING_MAX_RETRIES || '3', 10),
  },

  // Email configuration
  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    fromName: process.env.EMAIL_FROM_NAME || 'PMN Marchés Publics',
    fromAddress: process.env.EMAIL_FROM_ADDRESS || 'noreply@pmn.sn',
  },

  // WhatsApp configuration
  whatsapp: {
    apiUrl: process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v17.0',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
  },

  // CORS
  cors: {
    origins: process.env.CORS_ORIGINS || 'http://localhost:3000',
  },
});
