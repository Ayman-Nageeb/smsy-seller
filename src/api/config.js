import axios from "axios";

export default {
  setDefaults() {
    axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;
    axios.defaults.headers.common["Accept"] = "application/json";

  },

  setAuthorizationHeader(token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  },
};
