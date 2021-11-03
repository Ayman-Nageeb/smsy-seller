import axios from "axios"

export default {

    setDefaults() {
        axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;
    },

    setAuthorizationHeader(token){
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
}
