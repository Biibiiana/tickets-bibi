<script setup>
import { ref, computed, onMounted } from "vue";
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

const responsiveOptions = ref([
  {
    breakpoint: "1400px",
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: "1199px",
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: "767px",
    numVisible: 2,
    numScroll: 1,
  },
  {
    breakpoint: "575px",
    numVisible: 1,
    numScroll: 1,
  },
]);

// Función para convertir fecha ISO a formato YYYY-MM-DD
const convertToDatePickerFormat = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Obtener conciertos aleatorios para el carrusel
const randomConcerts = computed(() => {
  const shuffled = [...concerts.value].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 7);
});

// Obtener próximos conciertos ordenados por fecha
const upcomingConcerts = computed(() => {
  return [...concerts.value]
    .filter((concert) => new Date(concert.date) >= new Date())
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 9);
});

const fetchConcerts = async () => {
  loading.value = true;
  try {
    concerts.value = await ConcertService.getConcertList();
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
  <div class="discover-concerts">
    <!-- Carrusel de conciertos aleatorios -->
    <Carousel
      :value="randomConcerts"
      :numVisible="2"
      :numScroll="1"
      :responsiveOptions="responsiveOptions"
      :autoplayInterval="3000"
      class="discover-carousel"
    >
      <template #item="slotProps">
        <Card class="concert-card">
          <template #header>
            <img
              :src="slotProps.data.poster"
              alt="Concierto"
              class="card-image"
            />
          </template>
          <template #title>
            {{ slotProps.data.tourName }}
          </template>
          <template #subtitle>
            {{ slotProps.data.artist }}
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
              />
            </div>
          </template>
        </Card>
      </template>
    </Carousel>

    <!-- Sección de próximos conciertos -->
    <div class="card-section">
      <h3>Próximos Conciertos</h3>
      <div class="cards-grid">
        <Card
          v-for="concert in upcomingConcerts"
          :key="concert.id"
          class="concert-card"
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
              />
            </div>
          </template>
        </Card>
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
.discover-concerts {
  padding: 2rem;
}

.discover-carousel {
  margin-bottom: 2rem;
}
</style>
