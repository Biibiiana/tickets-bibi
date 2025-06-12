<script setup>
import Header from "./components/Header.vue";
import { useRoute } from "vue-router";
import { onMounted, ref } from "vue";
import { AuthService } from "./services/AuthService";

const route = useRoute();
const isLogProcess = ref(false);

const verifyLocalStorage = () => {
  if (!localStorage.getItem("verify_azure")) {
    clearInterval(intervalId);
    isLogProcess.value = false;
  }
};

const intervalId = setInterval(verifyLocalStorage, 500);

onMounted(() => {
  isLogProcess.value = localStorage.getItem("verify_azure");
});
</script>

<template>
  <div class="app-container">
    <Header v-if="route.meta?.header != false && !isLogProcess" />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
  <Toast />
</template>

<style>
html {
  margin: 0;
  padding: 0;
  height: 100%;
}

:root {
  /* Tus colores existentes */
  --primary-color: rgb(51, 90, 164);
  --secondary-color: rgb(87, 118, 194);
  --highlight-color: rgb(121, 149, 224);
  --light-color: rgb(154, 180, 255);
  --error-bg: rgb(255, 229, 229);
  --error-text: rgb(217, 83, 79);
  --error-button: rgb(255, 59, 52);
  --white: rgb(255, 255, 255);
  --black: rgb(0, 0, 0);
  --backgroun-transparent-color: rgb(154, 180, 255, 0.8);
  
  /* Estilos del fondo */
  background: url("/fondo-login.jpg") no-repeat center center fixed;
  background-size: cover;
  color-scheme: light;
}

/* Contenedor principal */
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  font-family: "Arial", sans-serif;
}

/* Cabecera */
.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header img {
  width: 100px;
  margin-bottom: 1rem;
}

.login-header h1 {
  color: var(--primary-color);
}

.login-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  opacity: 0.8;
}

/* Contenido del login */
.login-content {
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px;
}

.login-card {
  background-color: var(--light-color);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.input-field,
.input-field:hover,
.input-field:focus {
  width: 100%;
  padding: 0.7rem;
  border-radius: 5px;
  border: 1px solid #ccc;
  background: #9ab4ff 0.9 !important;
}

.login-form {
  margin-bottom: 15px;
}

.login-button {
  width: 100% !important;
  padding: 0.8rem !important;
  background-color: var(--primary-color) !important;
  border: none !important;
  color: white !important;
  font-weight: bold !important;
  border-radius: 8px !important;
  cursor: pointer !important;
}

.login-button:hover {
  background-color: var(--secondary-color) !important;
}

/* Popup de error */
.error-popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.error-popup {
  background: var(--error-bg);
  color: var(--error-text);
  padding: 1.5rem 2rem;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.3);
  min-width: 300px;
}

.popup-close {
  margin-top: 1rem;
  background: var(--error-button);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
}

.popup-close:hover {
  background: var(--error-text);
}

/* Responsividad */
@media screen and (max-width: 768px) {
  .login-content {
    width: 90%;
  }

  .login-header img {
    width: 80px;
  }
}

@media screen and (max-width: 480px) {
  .login-content {
    padding: 1.5rem;
  }

  .login-header h1 {
    font-size: 1.5rem;
  }
}

header {
  height: 100vh;
  width: 100px;
  /* background: url("/fondo-login.jpg") center center;
  background-size: cover; */
}
</style>
