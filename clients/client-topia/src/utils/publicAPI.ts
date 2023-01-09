import axios from "axios";

export const publicAPI = (apiKey: string) => {
  if (window && typeof window !== "undefined") {
    console.warn(
      "Please use extreme caution when passing sensitive information such as API keys from a client side application.",
    );
  }
  return axios.create({
    baseURL: "https://api.topia.io/api",
    headers: {
      "Authorization": apiKey,
      "Content-Type": "application/json",
    },
  });
};
