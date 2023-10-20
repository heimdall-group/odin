declare global {
  interface LocaleProperties {
    currentLocale: Ref,
    getAllLocale: Function,
    getCurrentLocale: Function,
    getKeyType: Function,
  }

  interface LocaleTranslations {
    sv: Object,
    en: Object,
  }

  interface LocaleTranslation_Object {
    append: string,
    to: string,
    text: string,
    prepend: string
  }
}
export {}