import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { fa } from 'vuetify/iconsets/fa'
import '@fortawesome/fontawesome-free/css/all.css'

const dark = {
    dark: true,
    colors: {
      'background': '#121212',
      'background-800': '#1c1c1c',
      'on-background-800': '#FFFFFF',
      'background-700': '#272727',
      'on-background-700': '#FFFFFF',
      'primary': '#4A328F',
      'on-primary': '#FFFFFF',
      'secondary': '#8962fc',
      // 'secondary': '#FF0266',
      'on-secondary': '#FFFFFF',
      'border-color': '#1c1c1c',
      'error': '#CF6679',
      'info': '#2196F3',
      'success': '#60CD18',
      'on-success': '#FFFFFF',
      'warning': '#FB8C00',
    }
}

export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'dark',
        themes: {
          dark,
        }
    },
    icons: {
      defaultSet: 'fa',
      sets: {
        fa,
      }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})