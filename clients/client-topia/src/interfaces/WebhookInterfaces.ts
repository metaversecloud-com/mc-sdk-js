export interface WebhookInterface {
  webhookId?: string;
  assetId?: string;
  active: boolean;
  dataObject?: object;
  dateAdded: Date;
  description: string;
  isUniqueOnly: boolean;
  lastUpdated?: Date;
  title: string;
  type: string;
  url: string;
  urlSlug: string;
}
