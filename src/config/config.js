import axios from "axios";

export const getConfigs = async () => {
  const isLocalHost =
    window?.location?.href.includes("localhost") ||
    window?.location?.href.includes("127.0.0.1");

  const urlLocalConfig = "https://example.com/config/config.json";
  const urlEnvironmentConfig = `${window?.location?.origin}/config/config.json`;
  const urlConfig = isLocalHost ? urlLocalConfig : urlEnvironmentConfig;

  const AuthConfig = {
    mandatorySignIn: true,
    region: "",
    userPoolId: "",
    userPoolWebClientId: "",
    oauth: {
      domain: "",
      scope: ["email", "openid", "profile"],
      redirectSignIn: "",
      redirectSignOut: "",
      responseType: "code",
    },
  };

  let response = null;

  if (isLocalHost) {
    response = {
      data: {
        apiUrl: "http://localhost:5000",
        authRegion: "us-east-1",
        authPoolId: "us-east-1_example",
        authPoolWebClientId: "example12345",
        authDomain: "example.auth.us-east-1.amazoncognito.com",
        authRedirectSignIn: "http://localhost:3000/",
        authRedirectSignOut: "http://localhost:3000/",
        getConcertList: "/api/concerts",
        createConcert: "/api/concerts",
        updateConcert: "/api/concerts",
        getConcertById: "/api/concerts/",
        deleteConcert: "/api/concerts/",
        buyTickets: "/api/concerts/tickets",
      },
    };
  } else {
    try {
      response = await axios.get(urlConfig);
    } catch (error) {
      console.error("Error al obtener configuración:", error);
      throw error;
    }
  }

  AuthConfig.region = response?.data?.authRegion;
  AuthConfig.userPoolId = response?.data?.authPoolId;
  AuthConfig.userPoolWebClientId = response?.data?.authPoolWebClientId;
  AuthConfig.oauth.domain = response?.data?.authDomain;
  AuthConfig.oauth.redirectSignIn = response?.data?.authRedirectSignIn;
  AuthConfig.oauth.redirectSignOut = response?.data?.authRedirectSignOut;

  const API_BASE_URL = response?.data?.apiUrl;

  const apiConfig = {
    getConcertList: API_BASE_URL + "/api/concerts",
    createConcert: API_BASE_URL + "/api/concerts",
    updateConcert: API_BASE_URL + "/api/concerts",
    getConcertById: API_BASE_URL + "/api/concerts/",
    deleteConcert: API_BASE_URL + "/api/concerts/",
    buyTickets: API_BASE_URL + "/api/concerts/tickets",
  };

  return { AuthConfig, apiConfig };
};
