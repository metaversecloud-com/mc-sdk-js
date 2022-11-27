import axios from "axios";

export function getWorldDetails(urlSlug: string): Promise<object> {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://api.topia.io/api/world/${urlSlug}/world-details`, {
        headers: { Authorization: process.env.API_KEY },
      })
      .then((response: any) => {
        resolve(response.data);
      })
      .catch(reject);
  });
}
export default getWorldDetails;
