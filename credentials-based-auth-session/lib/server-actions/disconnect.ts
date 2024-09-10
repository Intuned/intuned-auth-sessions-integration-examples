"use server";

import {
  getOrangeHrmConnection,
  removeConnection,
} from "@/lib/services/connections";
import { getIntunedClient, INTUNED_PROJECT_NAME } from "@/lib/intunedClient";
import { revalidatePath } from "next/cache";

export async function disconnect() {
  const connection = await getOrangeHrmConnection();

  if (!connection) {
    return;
  }

  const intunedClient = getIntunedClient();

  await intunedClient.project.authSessions.delete(
    INTUNED_PROJECT_NAME,
    connection.intuned_auth_session_id
  );

  await removeConnection(connection.id);

  revalidatePath("/");
}
