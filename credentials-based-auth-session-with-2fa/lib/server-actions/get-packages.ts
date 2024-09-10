"use server";

import { getNpmConnection } from "@/lib/services/connections";
import { getIntunedClient, INTUNED_PROJECT_NAME } from "@/lib/intunedClient";

export async function getClaims() {
  const connection = await getNpmConnection();

  if (!connection) {
    throw new Error("User not connected to HR");
  }

  const client = getIntunedClient();
  const result = await client.project.run.sync(INTUNED_PROJECT_NAME, {
    api: "packages",
    parameters: {},
    authSession: {
      id: connection.intuned_auth_session_id,
    },
    retry: {
      maximumAttempts: 2,
    },
  });

  if (result.status === "completed") {
    return {
      success: true,
      result: result.result,
    } as const;
  }

  return {
    success: false,
  } as const;
}
