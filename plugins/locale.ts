import en from '~/locale/en.json'
import sv from '~/locale/sv.json'

const starting_translation: keyof LocaleTranslations = 'sv';

// Add imports to object
const translations:LocaleTranslations = {
  sv,
  en,
}

export default defineNuxtPlugin((parameter) => {
  const { vueApp } = parameter;
  const { globalProperties } = vueApp.config;
  const cookie = useCookie('odin-preselected-language', {maxAge: 31536000});
  let language: keyof LocaleTranslations;
  if (cookie.value === undefined || cookie.value === null) {
    cookie.value = starting_translation;
    language = starting_translation;
  } else {
    language = cookie.value as keyof LocaleTranslations;
  }

  let translation = translations[language];
  if (translation === undefined) {
    const key: keyof LocaleTranslations = Object.keys(translations)[0] as keyof LocaleTranslations;
    translation = translation[key];
  }

  const locale = reactive({
    translations: translation,
  });

  const defineProperty = (property: string, value: Function | Object) => {
    Object.defineProperty(globalProperties, property, {
      value,
      writable: false,
    });
  }

  const $locale:LocaleProperties = {
    currentLocale: ref(language),
    getAllLocale: ():Array<string> => {
      return Object.keys(translations);
    },
    getCurrentLocale: ():string => {
      return $locale.currentLocale.value;
    },
    getKeyType: (key: keyof typeof locale.translations):string => {
      return typeof locale.translations[key];
    }
   }

  const $translate = (key: keyof typeof locale.translations, parameter = {}): string | object | undefined => {
    if (key === undefined) {
      return 'No provided key'
    }

    if (locale.translations[key] === undefined) {
      return undefined;
    }
    if (typeof locale.translations[key] === 'string') {
      let string = locale.translations[key].toString();
    
      if (string.includes('{') || string.includes('}') ) {
        for (let key in parameter) {
          const element = parameter[key as keyof typeof parameter];
          string = string.replace(`{${key}}`,`${element}`)
        }
        while (string.includes('{') || string.includes('}') ) {
          const section = string.substring(string.indexOf('{') + 1,string.indexOf('}'))
          string = string.replace(`{${section}}`, '')
        }
      }
  
      return string.toString();
    } else {
      return locale.translations[key];
    }
  };

  const $changeLocale = (key: keyof typeof translations):string | void => {
    const translation = translations[key]
    if (translation === undefined) {
      return 'Provided locale key is not valid'
    };
    cookie.value = key;
    $locale.currentLocale.value = key;
    locale.translations = translation;
  }

  const $translateDate = (date: string) => {
    const translatedDate = ref(`${$locale.currentLocale.value}`);

    watch($locale.currentLocale, (newLocale) => {
      translatedDate.value = `${$locale.currentLocale.value}`
    })
    return translatedDate.value
  }

  defineProperty('$locale', $locale)
  defineProperty('$translate', $translate)
  defineProperty('$changeLocale', $changeLocale)
  defineProperty('$translateDate', $translateDate)
})

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $locale: LocaleProperties,
    $translate: Function,
    $changeLocale: Function,
    $translateDate: Function,
  }
}
