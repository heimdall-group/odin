import DiscordMarkdown from '@felixrydberg/discord-markdown';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(DiscordMarkdown)
})
