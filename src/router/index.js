import { createRouter, createWebHistory } from 'vue-router';
import routes from "../config/routes";
import { AuthService } from "../services/AuthService";

const history = createWebHistory();

const router = createRouter({
  history,
  routes,
  scrollBehavior() {
    return { top: 0 }; // Para garantizar que la página siempre comience desde arriba
  },
});

// Middleware para proteger rutas privadas
router.beforeEach(async (to, from, next) => {
  const publicPages = ['/login', '/register']; // Rutas públicas que no requieren autenticación
  const authRequired = !publicPages.includes(to.path); // Verificar si es una ruta protegida
  const loggedIn = AuthService.getLoggedUser(); // Verificar si hay un usuario en localStorage

  if (authRequired && !loggedIn) {
    // Redirigir al login si no hay usuario autenticado
    next('/login');
  } else if (to.meta?.access === false) {
    // Prevenir acceso a ciertas rutas según las meta propiedades
    next('/');
  } else {
    next(); // Continuar con la navegación
  }
});

export default router;
