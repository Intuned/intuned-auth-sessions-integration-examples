"use server";

import { getLoggedInUserId } from "@/lib/auth";
import {
  getOrangeHrmConnection,
  createUserOrangeHrmConnection,
} from "@/lib/services/connections";
import { getIntunedClient, INTUNED_PROJECT_NAME } from "@/lib/intunedClient";
import { v4 } from "uuid";
import { revalidatePath } from "next/cache";

export async function connectUserToOrangeHRM(
  prevState: any,
  formData: FormData
) {
  try {
    const intunedClient = getIntunedClient();
    const connection = await getOrangeHrmConnection();

    const id = connection?.intuned_auth_session_id ?? v4();

    const startResult = await intunedClient.project.authSessions.create.start(
      INTUNED_PROJECT_NAME,
      {
        id,
        parameters: {
          username: formData.get("username")?.toString(),
          password: formData.get("password")?.toString(),
        },
      }
    );

    const operationId = startResult.operationId;

    while (true) {
      const operationResult =
        await intunedClient.project.authSessions.create.result(
          INTUNED_PROJECT_NAME,
          operationId
        );

      if (operationResult.status === "done") {
        const userId = await getLoggedInUserId();
        const authSessionId = operationResult.authSessionId;
        await createUserOrangeHrmConnection(userId, authSessionId);
        revalidatePath("/");
        return {
          status: "success",
          authSessionId,
        };
      }

      if (operationResult.status === "failed") {
        return {
          status: "error",
          message: operationResult.message,
        };
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  } catch (e) {
    console.error(e);
    return {
      status: "error",
      message: "Failed to connect to orange HRM",
    };
  }
}
