import { AxiosInstance } from "axios";
import jwt from "jsonwebtoken";

export interface TopiaInterface {
  apiDomain?: string;
  apiKey?: string;
  apiProtocol?: string;
  axios: AxiosInstance;
  interactiveKey?: string;
  interactiveSecret?: jwt.Secret;
}
