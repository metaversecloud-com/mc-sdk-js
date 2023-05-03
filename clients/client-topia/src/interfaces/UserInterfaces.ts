import { InteractiveCredentials } from "types";

export interface UserOptionalInterface {
  credentials?: InteractiveCredentials | object;
  profileId?: string | null;
  visitorId?: number | null;
  urlSlug?: string;
}
