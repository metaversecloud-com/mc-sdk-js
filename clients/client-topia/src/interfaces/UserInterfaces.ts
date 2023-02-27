import { InteractiveCredentials } from "types";

export interface UserOptionalInterface {
  credentials?: InteractiveCredentials | object;
  visitorId?: number | null;
  urlSlug?: string;
}
