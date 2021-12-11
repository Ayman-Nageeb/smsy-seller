import api from "./index";

export const BaseURL = "groups/";
export const editURL = (id) => BaseURL + id + "/";
export const deleteURL = (id) => BaseURL + id;

export const addGroup = async function(name, features) {
  const data = { name, features };
  const response = api.post(BaseURL, data);
  return response;
};

export const getAllGroups = async function(
  withFeatures = false,
  withSellers = false
) {
  const response = await api.get(BaseURL, {
    with_features: Number(withFeatures),
    with_sellers: Number(withSellers),
  });
  return response;
};

export const removeGroup = async function(id) {
  const response = api.delete(deleteURL(id));
  return response;
};

export const updateGroupFeatures = async function(id, features) {
  const response = api.put(editURL(id), { features });
  return response;
};
