<script setup>
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import ConcertService from "../services/ConcertService";
import TicketService from "../services/TicketService";

const toast = useToast();
const concerts = ref([]);
const currentConcert = ref(null);
const dialogVisible = ref(false);
const dialogBuyVisible = ref(false);
const nEntradas = ref(1);
const loading = ref(false);
const groupedConcerts = ref([]);
const selectedGenre = ref("");
const genres = ref([]);

// Función para convertir fecha ISO a formato YYYY-MM-DD
const convertToDatePickerFormat = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const isFutureDate = (dateString) => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today;
};

const fGroupedConcerts = (concerts) => {
  try {
    if (!concerts?.length) {
      console.log("No hay conciertos para agrupar");
      return {};
    }
    const grouped = Object.groupBy(
      concerts,
      (concert) => concert.gender || "Sin Género"
    );
    const sorted = Object.entries(grouped).sort(([a], [b]) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
    );
    groupedConcerts.value = Object.fromEntries(sorted);
  } catch (error) {
    console.error("Error al agrupar conciertos:", error);
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No se pudieron agrupar los conciertos",
      life: 3000,
    });
    return {};
  }
};

const fetchConcerts = async () => {
  loading.value = true;
  try {
    const response = await ConcertService.getConcertsByGenre();
    concerts.value = Array.isArray(response)
      ? response
      : Object.values(response);
    genres.value = [...new Set(concerts.value.map((concert) => concert.gender))]
      .sort()
      .map((genre) => ({ name: genre }));
    fGroupedConcerts(concerts.value);
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No se pudieron cargar los conciertos",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
};

const visibleGenres = () => {
  fGroupedConcerts(concerts.value);
  if (selectedGenre.value) {
    groupedConcerts.value = {
      [selectedGenre.value.name]:
        groupedConcerts.value[selectedGenre.value.name],
    };
  }
  return groupedConcerts.value;
};

const showConcertDetails = async (concert) => {
  currentConcert.value = concert;
  dialogVisible.value = true;
};

const buyTickets = async (concert) => {
  currentConcert.value = concert;
  dialogBuyVisible.value = true;
};

const confirmBuyTickets = async () => {
  try {
    const userId = JSON.parse(localStorage.getItem("user"))._id;
    await TicketService.buyTickets(
      currentConcert.value._id,
      nEntradas.value,
      userId,
      currentConcert.value.tourName,
      currentConcert.value.artist,
      currentConcert.value.price,
      currentConcert.value.city,
      currentConcert.value.date,
    );

    toast.add({
      severity: "success",
      summary: "Éxito",
      detail: "¡Entradas compradas con éxito!",
      life: 3000,
    });
    dialogBuyVisible.value = false;
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No se pudieron comprar las entradas",
      life: 3000,
    });
  }
};

onMounted(() => {
  fetchConcerts();
});
</script>

<template>
  <div class="concert-list">
    <div v-if="loading" class="loading-overlay">
      <ProgressSpinner class="loading-spinner" />
    </div>

    <div class="filter-selector">
      <Dropdown
        v-model="selectedGenre"
        :options="genres"
        optionLabel="name"
        placeholder="Filtrar por género"
        @change="visibleGenres"
      >
        <template #value="slotProps">
          <div v-if="slotProps.value">
            {{ slotProps.value.name }}
          </div>
          <span v-else>{{ slotProps.placeholder }}</span>
        </template>
      </Dropdown>
    </div>

    <div>
      <div
        v-for="[gender, genderConcerts] of Object.entries(groupedConcerts)"
        :key="gender"
        class="card-section"
      >
        <h3>{{ gender }}</h3>
        <div class="cards-grid">
          <Card
            v-for="concert in genderConcerts"
            :key="concert.id"
            :class="
              genderConcerts.length === 1
                ? 'single-concert'
                : genderConcerts.length === 2
                ? 'double-concert'
                : 'concert-card'
            "
          >
            <template #header>
              <img :src="concert.poster" alt="Concierto" class="card-image" />
            </template>

            <template #title>
              {{ concert.tourName }}
            </template>

            <template #subtitle>
              {{ concert.artist }}
            </template>

            <template #content>
              <div class="card-button-group">
                <Button
                  label="Ver Detalles"
                  class="card-button"
                  @click="showConcertDetails(concert)"
                />
                <Button
                  label="Comprar Entradas"
                  class="card-button"
                  @click="buyTickets(concert)"
                  :disabled="!isFutureDate(concert.date)"
                />
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>

    <!-- Dialog de detalles -->
    <Dialog
      v-if="currentConcert"
      header="Detalles del Concierto"
      :visible="dialogVisible"
      @update:visible="dialogVisible = false"
    >
      <div class="concert-details">
        <div class="detail-item">
          <strong class="space-items">Artista:</strong>
          {{ currentConcert.artist }}
        </div>
        <div class="detail-item">
          <strong class="space-items">Tour:</strong>
          {{ currentConcert.tourName }}
        </div>
        <div class="detail-item">
          <strong class="space-items">Descripción:</strong>
          {{ currentConcert.description }}
        </div>
        <div class="detail-item">
          <strong class="space-items">Género:</strong>
          {{ currentConcert.gender }}
        </div>
        <div class="detail-item">
          <strong class="space-items">Precio:</strong>
          {{ currentConcert.price }}€
        </div>
        <div class="detail-item">
          <strong class="space-items">Fecha:</strong>
          {{ convertToDatePickerFormat(currentConcert.date) }}
        </div>
        <div class="detail-item">
          <strong class="space-items">Ciudad:</strong> {{ currentConcert.city }}
        </div>
      </div>
    </Dialog>

    <!-- Dialog de compra -->
    <Dialog
      v-if="currentConcert"
      header="Compra de entradas"
      :visible="dialogBuyVisible"
      @update:visible="dialogBuyVisible = false"
    >
      <div class="concert-details">
        <div class="detail-item">
          <strong class="space-items">Tour:</strong>
          {{ currentConcert.tourName }}
        </div>
        <div class="detail-item">
          <strong class="space-items">Artista:</strong>
          {{ currentConcert.artist }}
        </div>
        <div class="detail-item">
          <strong class="space-items">Precio:</strong>
          {{ currentConcert.price }}€
        </div>
        <div class="buy-section">
          <h3>Compra tus entradas:</h3>
          <InputNumber
            v-model="nEntradas"
            mode="decimal"
            showButtons
            :min="1"
            :max="currentConcert.stock"
            placeholder="Entradas"
          />
          <Button
            label="Comprar"
            class="buy-button"
            @click="confirmBuyTickets"
          />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style scoped>
h3 {
  color: white;
}
</style>
