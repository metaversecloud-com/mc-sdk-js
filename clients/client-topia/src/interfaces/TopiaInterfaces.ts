import { AxiosInstance } from "axios";

export interface TopiaInterface {
  axios: AxiosInstance;
  apiDomain: string;
  apiKey?: string;
  interactiveKey?: string;
  interactiveSecret?: string;
}
