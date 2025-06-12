<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import ConcertService from "../services/ConcertService";

const route = useRoute();
const router = useRouter();
const confirm = useConfirm();
const toast = useToast();

const concertData = ref(null);
const isLoading = ref(true);
const idConcert = ref(route.params.idConcert);

// Función para convertir fecha ISO a formato YYYY-MM-DD
const convertToDatePickerFormat = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const deleteConcert = async () => {
  confirm.require({
    message: "Se va a eliminar el concierto seleccionado\n¿Desea continuar?",
    header: "Eliminar concierto",
    icon: "pi pi-trash",
    rejectLabel: "Cancelar",
    acceptLabel: "Eliminar",
    rejectClass: "p-button-secondary p-button-outlined",
    accept: async () => {
      try {
        await ConcertService.deleteConcert(idConcert.value);
        toast.add({
          severity: "success",
          summary: "Éxito",
          detail: "Se ha eliminado el concierto con éxito.",
          life: 3000,
        });
        router.push("/newconcerts");
      } catch (error) {
        console.error(error);
        toast.add({
          severity: "error",
          summary: "Error",
          detail:
            "Ha habido un error al eliminar el concierto, inténtelo de nuevo.",
          life: 3000,
        });
      }
    },
    reject: () => {},
  });
};

onMounted(async () => {
  try {
    concertData.value = await ConcertService.getConcertDataById(
      idConcert.value
    );
    concertData.value = {
      ...concertData.value,
      date: convertToDatePickerFormat(concertData.value.date),
    };
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Hubo un problema al cargar el concierto.",
      life: 3000,
    });
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <ConfirmDialog />

  <div class="detail-container">
    <div class="detail-content">
      <div class="detail-header">
        <h3 class="text-center">Detalles del Concierto</h3>
      </div>
      <div class="detail-card">
        <div class="detail-form mt-4" v-if="isLoading">
          <p class="text-center">Cargando...</p>
        </div>
        <div class="detail-form mt-4" v-else-if="concertData">
          <div class="form-group">
            <p><strong>Nombre del Tour: </strong> {{ concertData.tourName }}</p>
            <p><strong>Artista: </strong> {{ concertData.artist }}</p>
            <p><strong>Descripción: </strong> {{ concertData.description }}</p>
            <p><strong>Género: </strong> {{ concertData.gender }}</p>
            <div class="line-group">
              <p><strong>Precio: </strong> {{ concertData.price }}</p>
              <p><strong>Stock: </strong> {{ concertData.stock }}</p>
            </div>
            <p>
              <strong>Poster: </strong>
              <img
                :src="concertData.poster"
                alt="Poster"
                width="200"
                class="mt-2"
              />
            </p>
            <div class="line-group">
              <p><strong>Ciudad:</strong> {{ concertData.city }}</p>
              <p><strong>Fecha:</strong> {{ concertData.date }}</p>
            </div>
          </div>
          <div class="button-group">
            <button
              @click="() => router.push(`/concerts/edit/${idConcert}`)"
              class="detail-button"
            >
              Editar
            </button>
            <button @click="deleteConcert" class="detail-button">
              Eliminar
            </button>
            <button
              @click="() => router.push('/newconcerts')"
              class="detail-button"
            >
              Volver
            </button>
          </div>
        </div>
        <template v-else>
          <p class="text-center">No se encontró el concierto.</p>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  font-family: "Arial", sans-serif;
}
.detail-header {
  text-align: center;
  margin-bottom: 2rem;
}

.detail-header h3 {
  color: var(--primary-color);
  margin: 0px 0px 0px 0px !important;
}

.detail-content {
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px;
}

.detail-card {
  background-color: var(--light-color);
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.detail-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.line-group {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.button-group {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  margin-top: 1.5rem;
}

.detail-button {
  width: 100% !important;
  padding: 0.8rem !important;
  background-color: var(--primary-color) !important;
  border: none !important;
  color: white !important;
  font-weight: bold !important;
  border-radius: 8px !important;
  cursor: pointer !important;
}

.detail-button:hover {
  background-color: var(--secondary-color) !important;
}

p {
  margin: 2px 0px 0px 0px !important;
}

.text-center {
  text-align: center;
}

.mt-2 {
  margin-top: 0.5rem;
}

.mt-4 {
  margin-top: 1rem;
}

/* Responsividad */
@media screen and (max-width: 768px) {
  .detail-content {
    width: 90%;
  }

  .detail-header img {
    width: 80px;
  }
}

@media screen and (max-width: 480px) {
  .detail-content {
    padding: 1.5rem;
  }

  .detail-header h1 {
    font-size: 1.5rem;
  }
}
</style>
