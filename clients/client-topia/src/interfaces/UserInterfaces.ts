import { InteractiveCredentials, ResponseType } from "types";

export interface UserInterface {
  checkInteractiveCredentials(): Promise<void | ResponseType>;
  fetchAvatars(): Promise<void | ResponseType>;
  addAvatar(formData: FormData): Promise<void | ResponseType>;
  updateAvatar(avatarId: string, formData: FormData): Promise<void | ResponseType>;
  deleteAvatar(avatarId: string): Promise<void | ResponseType>;
  fetchAssets(): Promise<void | ResponseType>;
  fetchPlatformAssets(): Promise<object | ResponseType>;
  fetchScenes(): Promise<void | ResponseType>;
  fetchWorldsByKey(): Promise<void | ResponseType>;
  sendEmail({ html, subject, to }: { html: string; subject: string; to: string }): Promise<object | ResponseType>;
  getExpressions({ name, getUnlockablesOnly }: { name?: string; getUnlockablesOnly?: boolean }): Promise<ResponseType>;
  fetchDataObject(appPublicKey?: string, appJWT?: string): Promise<void | ResponseType>;
  setDataObject(dataObject: object | null | undefined, options: object): Promise<void | ResponseType>;
  incrementDataObjectValue(path: string, amount: number, options: object): Promise<void | ResponseType>;

  dataObject?: object | null;
}

export interface UserOptionalInterface {
  credentials?: InteractiveCredentials;
  profileId?: string | null;
  visitorId?: number | null;
  urlSlug?: string;
}
