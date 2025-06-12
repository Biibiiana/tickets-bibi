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
const selectedCity = ref("");
const cities = ref([]);

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
      (concert) => concert.city || "Sin Ciudad"
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
    const response = await ConcertService.getConcertsByCity();
    concerts.value = Array.isArray(response)
      ? response
      : Object.values(response);
    cities.value = [...new Set(concerts.value.map((concert) => concert.city))]
      .sort()
      .map((city) => ({ name: city }));
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

const visibleCities = () => {
  fGroupedConcerts(concerts.value);
  if (selectedCity.value) {
    groupedConcerts.value = {
      [selectedCity.value.name]: groupedConcerts.value[selectedCity.value.name],
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
        v-model="selectedCity"
        :options="cities"
        optionLabel="name"
        placeholder="Filtrar por ciudad"
        @change="visibleCities"
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
        v-for="[city, cityConcerts] of Object.entries(groupedConcerts)"
        :key="city"
        class="card-section"
      >
        <h3>{{ city }}</h3>
        <div class="cards-grid">
          <Card
            v-for="concert in cityConcerts"
            :key="concert.id"
            :class="
              cityConcerts.length === 1
                ? 'single-concert'
                : cityConcerts.length === 2
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

<style>
/* Estilos principales */
.concert-list {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  position: relative;
  z-index: 1;
}

/* Grid de cards */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(30%, 1fr));
  gap: 2rem;
  padding: 1rem;
  align-items: stretch;
}

.concert-card {
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
  align-items: center;
}

.single-concert {
  max-width: 1fr;
  margin: 0 auto;
}

.double-concert {
  max-width: 1fr;
}

/* Estilos de imagen */
.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px 12px 0 0;
}

/* Estilos de contenido */
.card-content {
  padding: 1.5rem;
}

.card-section {
  margin-bottom: 2rem;
}

.card-section h3 {
  color: var(--primary-color);
  border-bottom: 2px solid var(--surface-border);
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  border-bottom: 1px solid #eee;
}

.card-button-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.25rem;
}

.card-button {
  width: 100%;
  font-size: small;
}

.buy-section {
  margin-top: 10px;
}

.buy-button {
  margin-left: 20px;
}

.space-items {
  margin-right: 10px;
}

/* Estilos del overlay de carga */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  z-index: 2;
}

.loading-spinner {
  width: 50px;
  height: 50px;
}

/* Media queries */
@media (max-width: 940px) {
  .cards-grid {
    grid-template-columns: 1fr 1fr;
    padding: 0.5rem;
  }
}

@media (max-width: 768px) {
  .single-concert .concert-card,
  .double-concert .concert-card {
    max-width: none;
    width: 100%;
  }

  .concert-list {
    padding: 1rem;
  }
}

@media (max-width: 600px) {
  .cards-grid {
    grid-template-columns: 1fr;
    padding: 0.5rem;
  }
}
</style>

<style scoped>
h3 {
  color: white;
}
</style>
