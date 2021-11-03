import api from "./index";

export const login = async function(data) {
 
  const response = await api.post("supervisors/login", data);
  return response;
};

export default {};
