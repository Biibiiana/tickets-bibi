import store from "../store/store";

import axiosInterceptors from "../config/axiosInterceptors";

import PrimeVue from "primevue/config";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Textarea from "primevue/textarea";
import Menu from "primevue/menu";
import ProgressSpinner from "primevue/progressspinner";
import DataTable from "primevue/datatable";
import Calendar from 'primevue/calendar';
import Card from "primevue/card";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup";
import Row from "primevue/row";
import Listbox from "primevue/listbox";
import Dialog from "primevue/dialog";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";
import Dropdown from "primevue/dropdown";
import ConfirmDialog from "primevue/confirmdialog";
import ConfirmationService from 'primevue/confirmationservice'
import Carousel from 'primevue/carousel';

// Importar traducciones de idiomas (asegúrate de instalarlo si es necesario)
import es from "../locale/locales/es"; // Traducción al español predeterminada de PrimeVue
import en from "../locale/locales/en"; // Traducción al inglés predeterminada de PrimeVue

const AddPersonalizedElements = (app) => {
  // Install the store instance as a plugin
  app.use(store);

  // PrimeVue configs
  app.use(PrimeVue, {
    locale: es, // Idioma predeterminado
    locales: {
      en: en, // Configuración del inglés
      es: es, // Configuración del español
    },
  });

  app.use(ToastService);
  app.use(ConfirmationService);

  app.component("ConfirmDialog", ConfirmDialog);
  app.component("Card", Card);
  app.component("Button", Button);
  app.component("Column", Column);
  app.component("Carousel", Carousel);
  app.component("Calendar", Calendar);
  app.component("InputText", InputText);
  app.component("InputNumber", InputNumber);
  app.component("Textarea", Textarea);
  app.component("Menu", Menu);
  app.component("ProgressSpinner", ProgressSpinner);
  app.component("ColumnGroup", ColumnGroup);
  app.component("Row", Row);
  app.component("Listbox", Listbox);
  app.component("Dialog", Dialog);
  app.component("DataTable", DataTable);
  app.component("Toast", Toast);
  app.component("Dropdown", Dropdown);

  // Set Axios Interceptor
  axiosInterceptors();
};

export default AddPersonalizedElements;
