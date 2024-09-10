"use server";

import { getUserLinkedinConnection } from "@/lib/services/connections";
import { getIntunedClient, INTUNED_PROJECT_NAME } from "@/lib/intunedClient";

export async function likeLinkedinPost({ url }: { url: string }) {
  const linkedinConnection = await getUserLinkedinConnection();

  if (!linkedinConnection) {
    throw new Error("User not connected to LinkedIn");
  }

  const client = getIntunedClient();
  const result = await client.project.run.sync(INTUNED_PROJECT_NAME, {
    api: "like-post",
    parameters: {
      url,
    },
    authSession: {
      id: linkedinConnection.intuned_auth_session_id,
    },
    retry: {
      maximumAttempts: 2,
    },
  });

  if (result.status === "completed") {
    return {
      success: true,
      message: result.result.message,
    };
  }

  return {
    success: false,
  };
}
