import { InteractiveCredentials } from "types";

export interface UserOptionalInterface {
  credentials?: InteractiveCredentials | object;
  email?: string;
  visitorId?: number | null;
  urlSlug?: string;
}
