// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  
  build: {
    transpile: ['vuetify']
  },
  css: [
    'vuetify/lib/styles/main.sass',
    '@fortawesome/fontawesome-svg-core/styles.css',
  ],
  devtools: { enabled: true },
  imports: {
    dirs: ['stores']
  },
  modules: [
    '@pinia/nuxt',
  ],
  pinia: {
    autoImports: ['defineStore']
  },
  runtimeConfig: {
    public: {
      FIREBASE_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_PROJECT: process.env.FIREBASE_PROJECT_ID,
      DISCORD_OAUTH_URL: process.env.DISCORD_OAUTH_URL,
      SESSION_ID_COOKIE_NAME: process.env.SESSION_ID_COOKIE_NAME,
    },
    MONGO_URL: process.env.MONGO_URL,
    DISCORD_CLIENT_PUBLIC_KEY: process.env.DISCORD_CLIENT_PUBLIC_KEY,
    DISCORD_CLIENT_SECRET_KEY: process.env.DISCORD_CLIENT_SECRET_KEY,
    DISCORD_REDIRECT_URI: process.env.DISCORD_REDIRECT_URI,
    DISCORD_SERVER_ID: process.env.DISCORD_SERVER_ID,
    DISCORD_MEMBER_ROLE_ID: process.env.DISCORD_MEMBER_ROLE_ID,
  },
  nitro: {
    plugins: ['~/server/index.ts'],
  },
  typescript: {
    strict: true
  },
});
