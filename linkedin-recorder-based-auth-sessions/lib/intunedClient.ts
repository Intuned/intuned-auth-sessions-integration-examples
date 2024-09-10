import { IntunedClient } from "@intuned/client";

export const INTUNED_PROJECT_NAME = process.env.INTUNED_PROJECT_NAME as string;

export function getIntunedClient() {
  return new IntunedClient({
    apiKey: process.env.INTUNED_API_KEY as string,
    workspaceId: process.env.INTUNED_WORKSPACE_ID as string,
  });
}
