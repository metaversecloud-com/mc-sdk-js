import axios from "axios";

export const publicAPI = (apiKey: string) => {
  return axios.create({
    baseURL: "https://api.topia.io/api",
    headers: {
      "Accept-Encoding": "",
      "Authorization": apiKey,
      "Content-Type": "application/json",
    },
  });
};
