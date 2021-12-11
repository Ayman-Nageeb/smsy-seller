import api from ".";

export const BaseURL = "sellers/"

export const sellersFeaturesURL = BaseURL + "features/";


export const getSellersFeatures = async function() {
  const response = await api.get(sellersFeaturesURL);
  return response;
};

export default {};