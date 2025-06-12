<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { AuthService } from "../services/AuthService";
import { useToast } from "primevue/usetoast";

const router = useRouter();
const toast = useToast();

const username = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);

const handleSubmit = async () => {
  if (password.value !== confirmPassword.value) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Las contraseñas no coinciden",
      life: 3000,
    });
    return;
  }

  loading.value = true;
  try {
    await AuthService.register(username.value, email.value, password.value);
    toast.add({
      severity: "success",
      summary: "Éxito",
      detail: "Cuenta creada exitosamente",
      life: 3000,
    });
    router.push("/login");
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: error.message || "Error al crear la cuenta",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-content">
      <div class="login-header">
        <h2>Crear Cuenta</h2>
      </div>
      <div class="login-card">
        <div class="form-group">
          <InputText
            v-model="username"
            placeholder="Nombre de usuario"
            class="input-field login-form"
            required
          />
        </div>
        <div class="form-group">
          <InputText
            v-model="email"
            type="email"
            placeholder="Correo electrónico"
            class="input-field login-form"
            required
          />
        </div>
        <div class="form-group">
          <InputText
            v-model="password"
            type="password"
            placeholder="Contraseña"
            class="input-field login-form"
            required
          />
        </div>
        <div class="form-group">
          <InputText
            v-model="confirmPassword"
            type="password"
            placeholder="Confirmar contraseña"
            class="input-field login-form"
            required
          />
        </div>
        <Button
          label="Crear Cuenta"
          class="login-button"
          :icon="loadingAuth ? 'pi pi-spin pi-spinner' : 'pi pi-sign-in'"
          :disabled="loading"
          raised
          @click="handleSubmit"
        />
      </div>
      <div class="login-link">
        <p>
          ¿Ya tienes cuenta? <RouterLink to="/login">Iniciar Sesión</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<style>
.login-link {
  text-align: center;
  margin-top: 1rem;
}

.login-link a {
  color: #2196f3;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}

h2,
p {
  color: black;
}
</style>
