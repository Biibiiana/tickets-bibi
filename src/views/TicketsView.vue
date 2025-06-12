<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import ConcertService from "../services/ConcertService";
import TicketService from "../services/TicketService";
import { FilterMatchMode } from "primevue/api";
import Skeleton from "primevue/skeleton";

const router = useRouter();
const confirm = useConfirm();
const toast = useToast();

const loadingList = ref(false);
const selectedItem = ref();
const ticketsData = ref([]);
const concertData = ref([]);
const userTicketsData = ref([]);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const columns = ref([
  {
    field: "tourName",
    header: "Nombre del Tour",
  },
  {
    field: "artist",
    header: "Artista",
  },
  {
    field: "city",
    header: "Ciudad",
  },
  {
    field: "date",
    header: "Fecha",
  },
  {
    field: "quantity",
    header: "Nº de entradas",
  },
]);

const formatDate = (dateString) => {
  if (!dateString || dateString === "Activo") return dateString;
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

const downloadTickets = async (ticket) => {
  try {
    await TicketService.downloadTickets(
      ticket._id,
      ticket.tourName,
      ticket.artist,
      ticket.price,
      ticket.city,
      ticket.date,
      ticket.quantity
    );

    toast.add({
      severity: "success",
      summary: "Éxito",
      detail: "¡Entradas descargadas con éxito!",
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "No se pudieron descargar las entradas",
      life: 3000,
    });
  }
};

const combineTicketWithConcert = (ticket) => {
  const concert = concertData.value.find((c) => c._id === ticket.concert_id);
  return {
    ...ticket,
    tourName: concert?.tourName ?? "",
    artist: concert?.artist ?? "",
    city: concert?.city ?? "",
    date: concert?.date ?? "",
  };
};

onMounted(async () => {
  try {
    loadingList.value = true;
    const userId = JSON.parse(localStorage.getItem("user"))._id;
    ticketsData.value = await TicketService.getTicketsList(userId);
    concertData.value = await ConcertService.getConcertList();
    if (ticketsData.value.length !== 0 && concertData.value.length !== 0) {
      userTicketsData.value = ticketsData.value.map((ticket) =>
        combineTicketWithConcert(ticket)
      );
    }
    loadingList.value = false;
  } catch (error) {
    console.error(error);
  }
});
</script>

<template>
  <ConfirmDialog />

  <div class="flex flex-column md:flex-row align-items-center p-3">
    <div class="container-title-button px-3">
      <div class="flex-line">
        <h3 class="primary-dark-color">Tus entradas</h3>
      </div>
    </div>
  </div>

  <div class="flex flex-column w-full md:flex-row px-3 container-history-main">
    <!-- ZONA TABLA -->
    <div class="container-history-datatable px-0 pt-3 md:px-3 md:pt-0">
      <div class="flex justify-end mb-3" style="justify-content: end">
        <div class="search-bar">
          <InputText
            v-model="filters['global'].value"
            placeholder="Buscador"
            class="search-input"
          />
          <i class="pi pi-search search-icon"></i>
        </div>
      </div>
      <!-- Tabla -->
      <DataTable
        v-if="!loadingList"
        v-model:filters="filters"
        :value="userTicketsData"
        size="small"
        stripedRows
        resizableColumns
        columnResizeMode="fit"
        paginator
        :rows="10"
        :rowsPerPageOptions="[10, 20, 50, 100, 200]"
        :globalFilterFields="['tourName', 'artist', 'city', 'quantity']"
        class="datatable-style"
        emptyMessage="No posee tickets"
      >
        <Column
          v-for="col in columns"
          :key="col.field"
          :field="col.field"
          :header="col.header"
          sortable
        >
          <template #body="slotProps">
            <div v-if="col.field === 'date'">
              <span>
                <span
                  v-if="isFutureDate(slotProps.data[col.field])"
                  style="color: green"
                  >&#9679;</span
                >
                <span v-else style="color: red">&#9679;</span>
                {{ formatDate(slotProps.data[col.field]) }}
              </span>
            </div>
            <div v-else>
              <span :title="slotProps.data[col.field]">
                {{
                  slotProps.data[col.field].length > 25
                    ? slotProps.data[col.field].slice(0, 25) + "..."
                    : slotProps.data[col.field]
                }}
              </span>
            </div>
          </template>
        </Column>

        <Column field="id" header="Acciones">
          <template #body="slotProps">
            <InputIcon
              class="pi pi-download padding-icon pointer"
              v-tooltip.top="'Descargar'"
              @click="downloadTickets(slotProps.data)"
            >
            </InputIcon>
          </template>
        </Column>
      </DataTable>

      <!-- Loading -->
      <div v-else class="relative">
        <Skeleton width="100%" height="calc(100vh - 100px)" />
        <ProgressSpinner class="w-100" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.flex-line {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3px;
}

.search-bar {
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid var(--primary-color);
  border-radius: 5px;
  background-color: #f9f9f9;
}

.search-input {
  border: none;
  padding: 10px 10px 10px 35px; /* Espacio para la lupa */
  outline: none;
  font-size: 1rem;
  flex-grow: 1;
}

.search-icon {
  position: absolute;
  right: 10px;
  color: var(--primary-color);
  pointer-events: none; /* Para que no interfiera con el clic dentro del input */
}

.pi {
  margin-right: 5px;
}

.p-paginator .p-component {
  height: 15px;
}
</style>
