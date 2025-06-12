import axios from "axios";

export const AuthService = {
  // Token storage
  tokenKey: "auth-token",
  refreshTokenKey: "auth-refresh-token",

  // Configurar axios con interceptores
  setupAxios() {
    axios.interceptors.request.use(async (config) => {
      const token = localStorage.getItem(this.tokenKey);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });
  },

  // Obtener token del localStorage
  getJwtToken() {
    return localStorage.getItem(this.tokenKey);
  },

  // Obtener refresh token del localStorage
  getRefreshToken() {
    return localStorage.getItem(this.refreshTokenKey);
  },

  // Guardar tokens en localStorage
  saveTokens(accessToken, refreshToken) {
    localStorage.setItem(this.tokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
  },

  // Limpiar tokens
  clearTokens() {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
  },
  
  getCurrentUser() {
    const userString = localStorage.getItem("user");
    if (!userString) return null;
    try {
      return JSON.parse(userString);
    } catch (error) {
      console.error("Error al parsear usuario:", error);
      localStorage.removeItem("user");
      return null;
    }
  },

  isAdmin() {
    const user = this.getCurrentUser();
    return user?.role === "admin";
  },

  async loginFromDatabase(email, password) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );

      const { user, token } = response.data;
      this.saveTokens(token, null);
      localStorage.setItem("user", JSON.stringify(user));
      return true;
    } catch (error) {
      console.error("Error en loginFromDatabase:", error);
      return false;
    }
  },

  async register(username, email, password) {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
        {
          username,
          email,
          password,
        }
      );

      const { user, token } = response.data;
      this.saveTokens(token, null);
      localStorage.setItem("user", JSON.stringify(user));
      return true;
    } catch (error) {
      console.error("Error en registro:", error);
      throw error;
    }
  },

  getLoggedUser() {
    const userString = localStorage.getItem("user");
    if (!userString) return null;

    try {
      return JSON.parse(userString);
    } catch (error) {
      console.error("Error al parsear usuario:", error);
      localStorage.removeItem("user"); // Limpiar el dato corrupto
      return null;
    }
  },

  async signOut() {
    this.clearTokens();
    localStorage.removeItem("user");
  },
};

// Inicializar axios
AuthService.setupAxios();
