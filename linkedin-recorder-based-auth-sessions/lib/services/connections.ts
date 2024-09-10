import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { connections } from "../db/schema";
import { getIntunedClient, INTUNED_PROJECT_NAME } from "../intunedClient";
import { getLoggedInUserId } from "../auth";

export async function getUserLinkedinConnection() {
  const userId = await getLoggedInUserId();

  const returnedConnections = await db
    .select()
    .from(connections)
    .where(
      and(
        eq(connections.userId, userId),
        eq(connections.connection_type, "linkedin")
      )
    );

  if (returnedConnections.length === 0) {
    return null;
  }

  return returnedConnections[0];
}

export function createUserLinkedinConnection(
  userId: string,
  intunedAuthSessionId: string
) {
  return db.insert(connections).values({
    userId,
    connection_type: "linkedin",
    intuned_auth_session_id: intunedAuthSessionId,
  });
}

export async function getUserLinkedInConnectionStatus() {
  const linkedinConnection = await getUserLinkedinConnection();

  if (!linkedinConnection) {
    return { status: "NOT_CONNECTED" as const, id: null };
  }

  const intunedClient = getIntunedClient();

  const intunedAuthSession = await intunedClient.project.authSessions.one(
    INTUNED_PROJECT_NAME,
    linkedinConnection.intuned_auth_session_id
  );

  return { status: intunedAuthSession.status, id: linkedinConnection.id };
}

export async function removeConnection(connectionId: string) {
  await db.delete(connections).where(eq(connections.id, connectionId));
}
