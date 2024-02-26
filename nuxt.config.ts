// https://nuxt.com/docs/api/configuration/nuxt-config
import * as path from 'path';

const isGenerate = process.argv.includes('--prerender') || process.argv.includes('generate');
const outputPath = parseInt(process.env.PRODUCTION.toString()) == 0 ? 'development' : 'production';
const year = 31536000

const config = defineNuxtConfig({
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
    'nuxt-scheduler',
    // 'nuxt-security',
  ],
  pinia: {
    autoImports: ['defineStore']
  },
  runtimeConfig: {
    public: {
      ENVIRONMENT: process.env.ENVIRONMENT,
      FIREBASE_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_PROJECT: process.env.FIREBASE_PROJECT_ID,
      DISCORD_OAUTH_URL: process.env.PRODUCTION === '1' ? process.env.PRODUCTION_DISCORD_OAUTH_URL : process.env.DEVELOPMENT_DISCORD_OAUTH_URL,
      SESSION_ID_COOKIE_NAME: process.env.SESSION_ID_COOKIE_NAME,
      BASE_URL: process.env.PRODUCTION === '1' ? process.env.PRODUCTION_BASE_URL : process.env.DEVELOPMENT_BASE_URL
    },
    MONGO_URL: process.env.MONGO_URL,
    DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
    DISCORD_CLIENT_PUBLIC_KEY: process.env.DISCORD_CLIENT_PUBLIC_KEY,
    DISCORD_CLIENT_SECRET_KEY: process.env.DISCORD_CLIENT_SECRET_KEY,
    DISCORD_REDIRECT_URI: `${process.env.PRODUCTION === '1' ? process.env.PRODUCTION_BASE_URL : process.env.DEVELOPMENT_BASE_URL}${process.env.DISCORD_REDIRECT_URI}`,
    DISCORD_SERVER_ID: process.env.DISCORD_SERVER_ID,
    DISCORD_MEMBER_ROLE_ID: process.env.DISCORD_MEMBER_ROLE_ID,
    DISCORD_NEWS_CHANNEL_ID: process.env.DISCORD_NEWS_CHANNEL_ID,
    DISCORD_EVENTS_CHANNEL_ID: process.env.DISCORD_EVENTS_CHANNEL_ID,
    ENCRYPTION_SECRET: process.env.ENCRYPTION_SECRET,
    ENCRYPTION_ALGORITHM: process.env.ENCRYPTION_ALGORITHM,
    ENCRYPTION_BYTES: process.env.ENCRYPTION_BYTES,

    AWS_KEY: process.env.AWS_KEY,
    AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
    AWS_REGION: process.env.AWS_REGION,
    S3_BUCKET_URL: process.env.S3_BUCKET_URL,
    S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    S3_OBJECT_URL: process.env.PRODUCTION === '1' ? process.env.PRODUCTION_S3_OBJECT_URL : process.env.DEVELOPMENT_S3_OBJECT_URL,
  },
  security: {
    // Replace with route specific for /api/v1/upload
    xssValidator: false,
    headers: {
      crossOriginResourcePolicy: false,
    },
  },
  nitro: {
    plugins: [
      '~/server/index.ts',
      // '~/server/plugins/scheduler.ts'
    ],
    output: {
      dir: path.join(__dirname, `./.output/${outputPath}/website`),
      serverDir: path.join(__dirname, `./.output/${outputPath}/website/server`),
      publicDir: path.join(__dirname, `./.output/${outputPath}/website/public`),
    },
  },
  vite: {
    server: {
      cors: false
    }
  },
  typescript: {
    strict: true
  },
});

if (isGenerate) {
  const ignores = [
    "components/default",
    "components/super-admin",
    "layouts/*",
    "!layouts/app.vue",
    "pages/*",
    "!pages/app",
    "!pages/app.vue",
    "!pages/index.vue",
  ];

  const routes = {
    output: {
      dir: path.join(__dirname, `./.output/${outputPath}/app`),
      serverDir: path.join(__dirname, `./.output/${outputPath}/app/files/server`),
      publicDir: path.join(__dirname, `./.output/${outputPath}/app/files/public`),
    },
  };

  if (config.ignore) {
    config.ignore.push(...ignores)
  } else {
    config.ignore = ignores
  }

  if (config.nitro) {
    config.nitro = Object.assign(config.nitro, routes)
  } else {
    config.nitro = routes
  }
}

export default config
