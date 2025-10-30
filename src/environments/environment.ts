export const environment = {
  production: false,
  apiUrl: '/api', // Usando proxy para desarrollo
  appName: 'Festum App',
  version: '1.0.0',
  geoapifyApiKey: process.env['GEOAPIFY_API_KEY'] || ''
};