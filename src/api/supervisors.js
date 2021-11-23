import api from "./index";

export const login = async function(data) {
 
  const response = await api.post("supervisors/login", data);
  return response;
};

export const logout = async function(tokens = null) {
  if(!tokens) tokens = 'current';
  
  const response = await api.get("supervisors/logout", tokens);
  return response;
}

export default {};
