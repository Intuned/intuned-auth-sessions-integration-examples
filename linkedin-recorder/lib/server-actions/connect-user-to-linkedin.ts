"use server";

import { getLoggedInUserId } from "@/lib/auth";
import {
  getUserLinkedinConnection,
  createUserLinkedinConnection,
} from "@/lib/services/connections";
import { getIntunedClient, INTUNED_PROJECT_NAME } from "@/lib/intunedClient";
import { v4 } from "uuid";

export async function connectUserToLinkedin() {
  try {
    const intunedClient = getIntunedClient();
    const linkedinConnection = await getUserLinkedinConnection();

    const id = linkedinConnection?.intuned_auth_session_id ?? v4();

    const result = await intunedClient.project.authSessions.recorder.start(
      INTUNED_PROJECT_NAME,
      {
        authSessionId: id,
      }
    );

    const userId = await getLoggedInUserId();
    if (!linkedinConnection) {
      await createUserLinkedinConnection(userId, id);
    }

    return result.recorderUrl;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to connect to LinkedIn");
  }
}
