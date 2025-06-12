<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { AuthService } from "../services/AuthService";

const router = useRouter();

// Estado del menú móvil
const showMobileMenu = ref(false);

// Estado de autenticación
const isLoggedIn = computed(() => !!AuthService.getCurrentUser());

// Items del menú con iconos PrimeVue
const menuItems = computed(() => {
  const baseItems = [
    {
      id: 1,
      route: "/concerts",
      label: "Concerts",
      text: "Descubre",
      icon: "pi pi-headphones",
    },
    {
      id: 2,
      route: "/concerts/genre",
      label: "Genre",
      text: "Géneros",
      icon: "pi pi-compass",
    },
    {
      id: 3,
      route: "/concerts/artist",
      label: "Artist",
      text: "Artistas",
      icon: "pi pi-user",
    },
    {
      id: 4,
      route: "/concerts/city",
      label: "City",
      text: "Ciudades",
      icon: "pi pi-map-marker",
    },
    {
      id: 5,
      route: "/tickets",
      label: "Tickets",
      text: "Entradas",
      icon: "pi pi-ticket",
    },
  ];

  // Agregar nuevo concierto si es admin
  if (AuthService.isAdmin()) {
    baseItems.push({
      id: 6,
      route: "/newconcerts",
      label: "Nuevo Concierto",
      text: "Nuevo Concierto",
      icon: "pi pi-plus",
    });
  }

  return baseItems;
});

// Funciones
const logOut = async () => {
  await AuthService.signOut();
  router.push("/login");
};

const toggleMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

// Cerrar menú móvil al hacer clic fuera
document.addEventListener("click", (event) => {
  if (!event.target.closest(".navbar")) {
    showMobileMenu.value = false;
  }
});
</script>

<template>
  <div class="app-container">
    <nav class="navbar">
      <div class="desktop-nav">
        <div class="logo-section">
          <router-link to="/" class="logo-link">
            <img
              src="/src/assets/LogoCompraEntradas.jpg"
              alt="Logo"
              class="logo"
            />
          </router-link>
        </div>
        <div class="nav-links">
          <template v-for="(itemMenu, index) in menuItems" :key="index">
            <router-link :to="{ path: itemMenu.route }" class="nav-item">
              <i :class="itemMenu.icon"></i>
              <span class="nav-text">{{ itemMenu.text }}</span>
            </router-link>
          </template>
        </div>
        <button v-if="isLoggedIn" @click="logOut" class="logout-btn">
          <i class="pi pi-sign-out"></i>
          <span class="nav-text">Cerrar sesión</span>
        </button>
      </div>

      <!-- Botón menú móvil -->
      <button
        icon="pi pi-bars"
        class="mobile-menu-btn"
        @click="toggleMenu"
        aria-label="Menú"
      >
        <i class="pi pi-bars"></i>
        <span></span>
        <span></span>
        <span></span>
      </button>

      <!-- Menú móvil desplegable -->
      <transition name="slide-down">
        <div v-show="showMobileMenu" class="mobile-menu">
          <div class="nav-links">
            <template v-for="(itemMenu, index) in menuItems" :key="index">
              <router-link
                :to="{ path: itemMenu.route }"
                class="nav-item"
                @click="showMobileMenu = false"
              >
                <i :class="itemMenu.icon"></i>
                <span>{{ itemMenu.text }}</span>
              </router-link>
            </template>
          </div>

          <button
            v-if="isLoggedIn"
            @click="logOut"
            class="mobile-logout-btn"
            @click.stop="showMobileMenu = false"
          >
            <i class="pi pi-sign-out"></i>
            Cerrar sesión
          </button>
        </div>
      </transition>
    </nav>
  </div>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100vw;
  background: var(--primary-color);
  color: var(--accent-color);
  padding: 0.75rem 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(8px);
}

/* Logo */
.logo-section {
  display: flex;
  align-items: center;
}

.logo {
  height: 32px;
  width: auto;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.05);
}

/* Menú Desktop */
.desktop-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  color: var(--accent-color);
  text-decoration: none;
  padding: 0.375rem 0.75rem;
  border-radius: 999px;
  transition: all 0.3s ease;
  font-weight: 400;
  font-size: 0.875rem;
}

.nav-item:hover {
  background: rgba(var(--secondary-rgb), 0.1);
  transform: translateY(-2px);
}

.mobile-menu-btn,
.mobile-menu {
  display: none;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 999px;
  background: transparent;
  color: var(--accent-color);
  border: 1px solid rgba(var(--accent-rgb), 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 2rem;
}
.logout-btn:hover {
  background: rgba(var(--secondary-rgb), 0.1);
  transform: translateY(-2px);
}

/* Estilos responsivos */
@media screen and (max-width: 960px) {
  .desktop-nav {
    display: none;
  }

  .mobile-menu {
    display: block;
  }

  .mobile-menu-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: transparent;
    color: var(--accent-color);
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .mobile-menu-btn:hover {
    background: rgba(var(--secondary-rgb), 0.1);
  }

  /* Menú móvil */
  .mobile-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--primary-color);
    padding: 1rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    transform-origin: top;
    animation: slideDown 0.3s ease-out;
  }

  /* Botón de logout móvil */
  .mobile-logout-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    border-radius: 4px;
    background: transparent;
    color: var(--accent-color);
    border: 1px solid rgba(var(--accent-rgb), 0.2);
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
    justify-content: center;
    margin-top: 1rem;
  }
}

.mobile-logout-btn:hover {
  background: rgba(var(--secondary-rgb), 0.1);
  transform: translateY(-2px);
}

/* Animación para el menú desplegable */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
