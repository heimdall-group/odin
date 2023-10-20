import { initializeApp } from 'firebase/app'
export default defineNuxtPlugin((nuxtApp) => {
  const { FIREBASE_KEY, FIREBASE_PROJECT } = useRuntimeConfig().public

  initializeApp({
    apiKey: FIREBASE_KEY,
    projectId: FIREBASE_PROJECT,
  })
})
