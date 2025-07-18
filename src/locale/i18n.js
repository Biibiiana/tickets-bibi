import { createI18n } from 'vue-i18n'

import en from './locales/en.json'
import es from './locales/es.json'


const checkLanguage = () =>{
  const language = localStorage.getItem('lang');

  const availableLanguages = ['es', 'en']

  if(language && availableLanguages.includes(language)){
    return language;
  }
  localStorage.setItem('lang', 'es');
  return 'es';
}

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: checkLanguage(),
  fallbackLocale: 'es',
  messages: {
    es,
    en
  }
})

export default i18n