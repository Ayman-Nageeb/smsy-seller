import axios from "axios";
import { responseCodes } from "./responseCodes";
import router from "../router/index";
import store from "../store";
import { currentSupervisorPermissionsURL, logoutURL, refreshCurrentSupervisorPermissions } from "./supervisors";

export default {
  async makeAPIRequest(method, url, data) {
    const requestConfiguration = { method, url, data };
    try {
      const response = await axios(requestConfiguration);
      //always refresh current authenticated supervisor permissions after the request is ended
      if (store.getters["Supervisors/isAuthenticated"]){
        const dont_refresh_urls = [
          currentSupervisorPermissionsURL(),
          logoutURL,
        ];
        
        if(dont_refresh_urls.indexOf(url) < 0) {
          refreshCurrentSupervisorPermissions();
        }
      }
      //-------------- end of refreshing permissions -------------//
      return response;
    } catch (error) {
      const responseCode = error.response.status;
      const responseData = error.response;
      switch (responseCode) {
        case responseCodes.HTTP_UNAUTHORIZED:
          //incase the user is'nt authenticated and not in login page
          if (router.history.current.name == "Login") {
            throw error;
          }
          alert("go to login page HTTP_UNAUTHORIZED");
          router.push({
            name: "Login",
            query: { next: router.history.current.name },
          });
          break;
        default:
          throw error;
      }
      return responseData;
    }
  },
  async post(url, data) {
    return await this.makeAPIRequest("post", url, data);
  },
  async get(url, data) {
    return await this.makeAPIRequest("get", url, data);
  },
};
