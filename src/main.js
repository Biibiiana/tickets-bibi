import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import AddPersonalizedElements from './config/app'
import PrimeVue from "primevue/config"
import { createI18n } from 'vue-i18n'
import es from './locale/locales/es.json'
import en from './locale/locales/en.json'
import 'primevue/resources/themes/lara-dark-blue/theme.css'
import 'primeicons/primeicons.css'

// Crear la aplicación una sola vez
const app = createApp(App)

// Inicializar i18n una sola vez
const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: 'es',
  fallbackLocale: 'es',
  messages: {
    es,
    en
  }
})

// Aplicar plugins en orden específico
app.use(i18n)
app.use(router)
app.use(PrimeVue)
app.use(AddPersonalizedElements)

// Inicializar
app.mount('#app')