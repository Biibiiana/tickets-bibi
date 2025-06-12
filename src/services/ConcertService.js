import axios from "axios";

const ConcertService = {
  async getConcertList() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/concerts`,
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
        throw new Error(`Error al obtener conciertos: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error en getConcertList:", error);
      throw error;
    }
  },

  async createConcert(params) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/concerts`,
        params,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        return response.data;
      } else {
        throw new Error(`Error al crear concierto: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error en createConcert:", error);
      throw error;
    }
  },

  async updateConcert(params) {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/concerts/${params._id}`,
        params,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(
          `Error al actualizar concierto: ${response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error en updateConcert:", error);
      throw error;
    }
  },

  async getConcertDataById(id) {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/concerts/byId/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error en getConcertDataById:", error);
      throw error;
    }
  },

  async getConcertsByGenre() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/concerts/sort/genre`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error en getConcertDataById:", error);
      throw error;
    }
  },

  async getConcertsByCity() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/concerts/sort/city`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error en getConcertDataById:", error);
      throw error;
    }
  },

  async getConcertsByArtist() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/concerts/sort/artist`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error en getConcertDataById:", error);
      throw error;
    }
  },

  async deleteConcert(id) {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/concerts/${id}`
      );

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(`Error al eliminar concierto: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error en deleteConcert:", error);
      throw error;
    }
  },

  async buyTickets(concert_id, quantity, user_id, tour, artist, price, city, date) {
    try {
      // Primera llamada: Crear el ticket
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

      // Ya tenemos el ticketData directamente de response.data
      const ticketData = response.data;
      const pdfResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/tickets/pdf/${ticketData._id}`,
        {
          tourName: tour,
          artist,
          price,
          city,
          date,
          nEntradas: ticketData.quantity,
          ticketId: ticketData._id,
        },
        {
          responseType: "blob",
        }
      );

      // Crear el enlace de descarga
      const blob = new Blob([pdfResponse.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ticket-${ticketData._id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return ticketData;
    } catch (error) {
      console.error("Error en buyTickets:", error);
      throw error;
    }
  },
};

export default ConcertService;
