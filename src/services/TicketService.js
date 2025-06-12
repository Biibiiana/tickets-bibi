import { downloadData } from "aws-amplify/storage";
import axios from "axios";

const TicketService = {
  async getTicketsList(userId) {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/tickets?user_id=${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(`Error al obtener tickets: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error en getTicketsList:", error);
      throw error;
    }
  },

  async buyTickets(
    concert_id,
    quantity,
    user_id,
    tour,
    artist,
    price,
    city,
    date
  ) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/tickets`,
        {
          concert_id,
          quantity,
          user_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Esperamos a que el ticket se guarde antes de intentar descargarlo
      const ticketData = response.data;

      // Agregamos await para esperar que termine la descarga
      await this.downloadTickets(
        ticketData._id,
        tour,
        artist,
        price,
        city,
        date,
        quantity
      );

      return ticketData;
    } catch (error) {
      console.error("Error en buyTickets:", error);
      throw error;
    }
  },

  async downloadTickets(_id, tour, artist, price, city, date, quantity) {
    try {
      const fecha = new Date(date);
      const dia = String(fecha.getDate()).padStart(2, "0");
      const mes = String(fecha.getMonth() + 1).padStart(2, "0");
      const año = fecha.getFullYear();
      const fechaFormateada = `${dia}/${mes}/${año}`;

      const pdfResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/tickets/pdf/${_id}`,
        {
          tourName: tour,
          artist,
          price,
          city,
          date: fechaFormateada,
          nEntradas: quantity,
          ticketId: _id,
        },
        {
          responseType: "blob",
        }
      );

      // Verificamos que la respuesta es válida
      if (!pdfResponse.data) {
        throw new Error("No se recibió el PDF del servidor");
      }

      // Crear el enlace de descarga
      const blob = new Blob([pdfResponse.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      // Usamos dispatchEvent para garantizar que el navegador procese el click
      const a = document.createElement("a");
      a.href = url;
      a.download = `ticket-${_id}.pdf`;
      a.style.display = "none"; // Ocultamos el elemento

      document.body.appendChild(a);
      const clickEvt = new MouseEvent("click", {
        bubbles: true,
        cancelable: true,
        view: window,
      });
      a.dispatchEvent(clickEvt);

      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar PDF:", error);
      throw error;
    }
  },
};

export default TicketService;
