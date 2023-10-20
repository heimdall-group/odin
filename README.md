## Setup

Make sure to install the dependencies:

```bash
npm install
```

Setup env file
```.env
# Server

# Mongodb url
MONGO_URL = ''
# Discord Client public key
DISCORD_CLIENT_PUBLIC_KEY = ''
# Discord Client secret key
DISCORD_CLIENT_SECRET_KEY = ''
#Discord Redirect URI
DISCORD_REDIRECT_URI = ''
#Discord Server ID
DISCORD_SERVER_ID = ''
#Discord Member Role ID
DISCORD_MEMBER_ROLE_ID = ''

# Client

# Discord Oauth url
DISCORD_OAUTH_URL = ''
# Session ID Cookie name
SESSION_ID_COOKIE_NAME = ''

# Firebase api key
FIREBASE_API_KEY = ''
# Firebase project Id
FIREBASE_PROJECT_ID = ''
```

After creating your firebase project make sure to create an service account and download a certificate. Save this certificate in root directory as cert.json

## Development Server

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

## Production

Build the application for production:

```bash
npm run build
```

## Translation script

Vue global properties:
  - $locale: An object with different properties. All types are defined under models/locale.model.ts
  - $translate: Translates the provided key parameter into the corresponding value defined in locale/(Language tag).json
    - To add a new language create a Json file and import it into plugins/locale.ts and add it to the translations object. The import name / key provided in the object will be used as a visual representation of the language
    - When defining a translation it can either a string or an object. ADD MORE NOTES HERE
  - $changeLocale: 

## Reusable components

## Server

- ## Middleware

- ## Status codes

- ## General Practices
  - When making external requests (Discord, Firebase) handle error before throwing createError. Parsing external projects might create an unhandled error in the createError function.

## Composables
- ## usePagnation
  - A function that can be placed inside of a useAsyncData composable. Interfaces can be found in types/pagnation.d.ts
  - Add the following to setup in a component / page.
  - Cache will be updated with completion / empty booleans depending on result
  - Second parameter provided has to be a "ref([])". This ref will be updated with the data when refresh / initial fetch.
  - To get more data just run the refresh function
  ```js
    const news = ref([] as Array<News>);
    const cache:usePagnationCache = reactive({limit: 5});
    const token = await user.value.getIdToken();
    const { data, pending, refresh } = await useAsyncData('internal-news', () => usePagnation({
      url: `/api/v1/news/internal/${token}`,
      cache: cache,
    }, news));
  ```
