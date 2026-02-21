import { NotionAPI } from "notion-client";

export interface NotionClientOptions {
  authToken?: string;
}

export function createNotionClient(options: NotionClientOptions = {}): NotionAPI {
  return new NotionAPI({
    authToken: options.authToken,
  });
}
