import { getConfigs } from "../config/config";
import axios from "axios";

export const UserService = {
  async getCurrentUser() {
    const { apiConfig } = await getConfigs;
    const url = apiConfig.getCurrentUser;
    let result;

    await axios
      .get(url)
      .then((response) => {
        result = response;
      })
      .catch((err) => {
        result = err;
      });

    return result;
  },
};
