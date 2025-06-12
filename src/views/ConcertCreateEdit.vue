<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import ConcertService from "../services/ConcertService";

const route = useRoute();
const router = useRouter();
const toast = useToast();
const idConcert = ref(route.params.idConcert);

const concertData = ref({
  tourName: "",
  artist: "",
  description: "",
  gender: "",
  price: "",
  stock: "",
  poster: "",
  date: "",
  city: "",
});

const isSubmitting = ref(false);

// Función para convertir fecha ISO a formato YYYY-MM-DD
const convertToDatePickerFormat = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

// Función para convertir fecha YYYY-MM-DD a ISO
const convertToISOFormat = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toISOString();
};

// Observador para convertir la fecha cuando cambia
watch(
  () => concertData.value.date,
  (newValue) => {
    if (newValue) {
      concertData.value.date = convertToDatePickerFormat(newValue);
    }
  }
);

const onSubmit = async () => {
  isSubmitting.value = true;
  try {
    const dataToSend = {
      ...concertData.value,
      date: convertToISOFormat(concertData.value.date),
    };

    if (idConcert.value) {
      await ConcertService.updateConcert(dataToSend);
      toast.add({
        severity: "success",
        summary: "Éxito",
        detail: "Concierto actualizado correctamente.",
        life: 3000,
      });
    } else {
      await ConcertService.createConcert(dataToSend);
      toast.add({
        severity: "success",
        summary: "Éxito",
        detail: "Concierto creado correctamente.",
        life: 3000,
      });
    }
    router.push("/newconcerts");
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Hubo un problema al guardar el concierto.",
      life: 3000,
    });
  } finally {
    isSubmitting.value = false;
  }
};

onMounted(async () => {
  if (idConcert.value) {
    const data = await ConcertService.getConcertDataById(idConcert.value);
    concertData.value = {
      ...data,
      date: convertToDatePickerFormat(data.date),
    };
  }
});
</script>

<template>
  <div class="detail-container">
    <div class="detail-content">
      <div class="detail-header">
        <h3>{{ idConcert ? "Editar Concierto" : "Crear Concierto" }}</h3>
      </div>
      <div class="detail-card">
        <div class="detail-form mt-4">
          <div class="form-group">
            <form @submit.prevent="onSubmit" class="login-content">
              <div class="form-group">
                <label for="tourName">Nombre del Tour:</label>
                <InputText
                  id="tourName"
                  v-model="concertData.tourName"
                  required
                  class="input-field"
                />
              </div>
              <div class="form-group">
                <label for="artist">Artista:</label>
                <InputText
                  id="artist"
                  v-model="concertData.artist"
                  required
                  class="input-field"
                />
              </div>
              <div class="form-group">
                <label for="description">Descripción:</label>
                <Textarea
                  id="description"
                  v-model="concertData.description"
                  required
                  class="style-textarea"
                  rows="3"
                />
              </div>
              <div class="form-group">
                <label for="gender">Género:</label>
                <InputText
                  id="gender"
                  v-model="concertData.gender"
                  required
                  class="input-field"
                />
              </div>
              <div class="line-group">
                <div class="form-group">
                  <label for="price">Precio:</label>
                  <InputNumber
                    v-model="concertData.price"
                    id="minmax-price"
                    mode="decimal"
                    showButtons
                    :min="0"
                    :max="10000"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="stock">Stock:</label>
                  <InputNumber
                    v-model="concertData.stock"
                    id="stock"
                    mode="decimal"
                    showButtons
                    :min="0"
                    :max="100000"
                    required
                  />
                </div>
              </div>
              <div class="form-group">
                <label for="poster">Póster:</label>
                <InputText
                  id="poster"
                  v-model="concertData.poster"
                  required
                  class="input-field"
                />
              </div>
              <div class="line-group">
                <div class="form-group">
                  <label for="city">Ciudad:</label>
                  <InputText
                    id="city"
                    v-model="concertData.city"
                    required
                    class="input-field"
                  />
                </div>
                <div class="form-group">
                  <label for="date">Fecha:</label>
                  <Calendar
                    id="date"
                    v-model="concertData.date"
                    required
                    showIcon
                    fluid
                    :showOnFocus="false"
                  />
                </div>
              </div>
              <Button
                type="submit"
                :disabled="isSubmitting"
                class="login-button"
              >
                {{ isSubmitting ? "Guardando..." : "Guardar" }}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

label {
  color: black;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-field {
  width: 100%;
  padding: 0.75rem;
}

.style-textarea {
  width: 100%;
  height: 100%;
  margin-top: 0px !important;
}

.login-button {
  width: 100%;
  margin-top: 1rem;
}
</style>
