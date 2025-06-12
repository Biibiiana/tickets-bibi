<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { AuthService } from "../services/AuthService";
const router = useRouter();
const email = ref("");
const password = ref("");
const loadingAuth = ref(false);
const showErrorPopup = ref(false);
const loginWithEmailAndPassword = async () => {
  loadingAuth.value = true;
  const success = await AuthService.loginFromDatabase(
    email.value,
    password.value
  );
  loadingAuth.value = false;
  if (success) {
    router.push("/concerts");
  } else {
    showErrorPopup.value = true;
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-header">
        <img class="logo" src="/src/assets/LogoCompraEntradas.jpg" />
        <h1>Bienvenido a TicketsB</h1>
      </div>
      <div class="login-card">
        <h2 class="text-center">Inicia Sesión</h2>
        <div class="login-form">
          <div class="form-group">
            <InputText
              type="email"
              v-model="email"
              placeholder="Correo electrónico"
              class="input-field login-form"
              required
            />
          </div>
          <div class="form-group">
            <InputText
              type="password"
              v-model="password"
              placeholder="Contraseña"
              class="input-field login-form"
              required
            />
          </div>
          <Button
            class="login-button"
            :icon="loadingAuth ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'"
            :disabled="loadingAuth"
            label="Inicia sesión"
            raised
            @click="loginWithEmailAndPassword"
          />
        </div>
      </div>
      <div class="register-link">
        <p>
          ¿No tienes cuenta?
          <RouterLink to="/register">Crear Cuenta</RouterLink>
        </p>
      </div>
    </div>
    <div class="login-background"></div>
    <!-- Popup de error -->
    <div
      v-if="showErrorPopup"
      class="error-popup-overlay"
      @click="showErrorPopup = false"
    >
      <div class="error-popup">
        <p>⚠️ Credenciales incorrectas. Por favor, inténtalo nuevamente.</p>
        <button class="popup-close" @click="showErrorPopup = false">
          Cerrar
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
:root {
  background: url("/fondo-login.jpg") no-repeat center center;
  background-size: cover;
}
</style>
