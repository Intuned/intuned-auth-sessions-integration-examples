import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { connections } from "../db/schema";
import { getIntunedClient, INTUNED_PROJECT_NAME } from "../intunedClient";
import { getLoggedInUserId } from "../auth";

export async function getOrangeHrmConnection() {
  const userId = await getLoggedInUserId();

  const returnedConnections = await db
    .select()
    .from(connections)
    .where(
      and(
        eq(connections.userId, userId),
        eq(connections.connection_type, "orange-hrm")
      )
    );

  if (returnedConnections.length === 0) {
    return null;
  }

  return returnedConnections[0];
}

export function createUserOrangeHrmConnection(
  userId: string,
  intunedAuthSessionId: string
) {
  return db.insert(connections).values({
    userId,
    connection_type: "orange-hrm",
    intuned_auth_session_id: intunedAuthSessionId,
  });
}

export async function getIntunedConnectionStatus() {
  const orangeHrmConnection = await getOrangeHrmConnection();

  if (!orangeHrmConnection) {
    return { status: "NOT_CONNECTED" as const, id: null };
  }

  const intunedClient = getIntunedClient();

  const intunedAuthSession = await intunedClient.project.authSessions.one(
    INTUNED_PROJECT_NAME,
    orangeHrmConnection.intuned_auth_session_id
  );

  return { status: intunedAuthSession.status, id: orangeHrmConnection.id };
}

export async function removeConnection(connectionId: string) {
  await db.delete(connections).where(eq(connections.id, connectionId));
}
