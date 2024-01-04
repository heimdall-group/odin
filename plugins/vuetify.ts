import { createVuetify } from 'vuetify'
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
import { createI18n, useI18n } from 'vue-i18n'
import { 
  VApp,
  VAppBar,
  VAppBarNavIcon,
  VAppBarTitle,
  VBtn,
  VCard,
  VCardActions,
  VCardSubtitle,
  VCardText,
  VCardTitle,
  VCheckbox,
  VCol,
  VContainer,
  VDatePicker,
  VDialog,
  VFooter,
  VForm,
  VImg,
  VLabel,
  VList,
  VListItem,
  VListItemTitle,
  VMain,
  VNavigationDrawer,
  VParallax,
  VProgressCircular,
  VRadio,
  VRadioGroup,
  VRow,
  VSelect,
  VSheet,
  VSpacer,
  VTable,
  VTextarea,
  VTextField,
  VToolbar,
  VChip,
} from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { fa } from 'vuetify/iconsets/fa'
import '@fortawesome/fontawesome-free/css/all.css'

import { sv, en } from 'vuetify/locale'
import internalSv from '~/locale/sv.json'
import internalEn from '~/locale/en.json'

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
      'on-secondary': '#FFFFFF',
      'error': '#CF6679',
      'info': '#2196F3',
      'success': '#60CD18',
      'on-success': '#FFFFFF',
      'warning': '#FB8C00',
      'border-color': '#272727',
    }
}

const messages = {
  en: {
    ...internalEn,
    $vuetify: {
      ...en,
      dataIterator: {
        rowsPerPageText: 'Items per page:',
        pageText: '{0}-{1} of {2}',
      },
    },
  },
  sv: {
    ...internalSv,
    $vuetify: {
      ...sv,
      dataIterator: {
        rowsPerPageText: 'Element per sida:',
        pageText: '{0}-{1} av {2}',
      },
    },
  },
}

export default defineNuxtPlugin(nuxtApp => {

    const cookie = useInternalCookie('odin-preselected-language', {maxAge: 31536000});
    let language: string;
    if (cookie.value === undefined || cookie.value === null) {
      cookie.value = 'sv';
      language = 'sv';
    } else {
      language = cookie.value as keyof LocaleTranslations;
    }

  const i18n = createI18n({
    datetimeFormats: {
      en: {
        date: {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        },
        time: {
          hour: '2-digit',
          minute: '2-digit',
          hourCycle: 'h24',
        }
      },
      sv: {
        date: {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        },
        time: {
          hour: '2-digit',
          minute: '2-digit',
        }
      }
    },
    legacy: false,
    locale: language,
    messages,
    useScope: 'global',
  });

  const vuetify = createVuetify({
    defaults: {
      global: {
        bgColor: 'background',
      },
      VCard: {
        variant: 'outlined',
        color: 'background-700'
      },
      VSheet: {
        border: true,
        rounded: true,
        color: 'background'
      }
    },
    locale: {
      adapter: createVueI18nAdapter({ i18n, useI18n }),
    },
    components: { 
      VApp,
      VAppBar,
      VAppBarNavIcon,
      VAppBarTitle,
      VBtn,
      VCard,
      VCardActions,
      VCardSubtitle,
      VCardText,
      VCardTitle,
      VCheckbox,
      VCol,
      VContainer,
      VDatePicker,
      VDialog,
      VFooter,
      VForm,
      VImg,
      VLabel,
      VList,
      VListItem,
      VListItemTitle,
      VMain,
      VNavigationDrawer,
      VParallax,
      VProgressCircular,
      VRadio,
      VRadioGroup,
      VRow,
      VSelect,
      VSheet,
      VSpacer,
      VTable,
      VTextarea,
      VTextField,
      VToolbar,
      VChip,
    },
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

  nuxtApp.vueApp.use(i18n)
  nuxtApp.vueApp.use(vuetify)
})
