"use server";

import { getLoggedInUserId } from "@/lib/auth";
import {
  getNpmConnection,
  createOrUpdateNpmConnection,
} from "@/lib/services/connections";
import { getIntunedClient, INTUNED_PROJECT_NAME } from "@/lib/intunedClient";
import { v4 } from "uuid";
import { revalidatePath } from "next/cache";
import type {
  AuthSessionCreateDoneResult,
  AuthSessionCreateFailedResult,
  AuthSessionCreateRequestedMoreInfoResult,
} from "@intuned/client/models/components";

type FormState =
  | AuthSessionCreateDoneResult
  | AuthSessionCreateFailedResult
  | AuthSessionCreateRequestedMoreInfoResult;

export async function connectUserToNpm(
  prevState: any,
  formData: FormData
): Promise<FormState & { operationId: string }> {
  try {
    const intunedClient = getIntunedClient();
    const connection = await getNpmConnection();

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
    const checkResult = await checkOperationResult(operationId);
    return {
      ...checkResult,
      operationId,
    };
  } catch (e) {
    console.error(e);
    return {
      status: "failed",
      error: "INTERNAL_ERROR",
      message: "Failed to connect to NPM",
      operationId: "",
    };
  }
}

export async function resumeUserConnectionToNPM(
  prevState: any,
  formData: FormData
): Promise<FormState> {
  try {
    const intunedClient = getIntunedClient();

    const operationId = formData.get("operationId")?.toString();
    if (!operationId) {
      throw new Error("operationId is required");
    }

    const otp = formData.get("otp")?.toString();
    if (!otp) {
      throw new Error("OTP is required");
    }

    const infoRequestId = formData.get("infoRequestId")?.toString();
    if (!infoRequestId) {
      throw new Error("infoRequestId is required");
    }

    await intunedClient.project.authSessions.create.resume(
      INTUNED_PROJECT_NAME,
      operationId,
      {
        infoRequestId,
        input: otp,
      }
    );

    return checkOperationResult(operationId);
  } catch (e) {
    console.error(e);
    return {
      status: "failed",
      error: "INTERNAL_ERROR",
      message: "Failed to connect to NPM",
    };
  }
}
async function checkOperationResult(operationId: string) {
  const intunedClient = getIntunedClient();
  while (true) {
    const operationResult =
      await intunedClient.project.authSessions.create.result(
        INTUNED_PROJECT_NAME,
        operationId
      );

    console.log("operationResult", operationResult);

    if (operationResult.status === "done") {
      const userId = await getLoggedInUserId();
      const authSessionId = operationResult.authSessionId;
      await createOrUpdateNpmConnection(userId, authSessionId);
      revalidatePath("/");
      return operationResult;
    }

    if (operationResult.status === "failed") {
      return operationResult;
    }

    if (operationResult.status === "requested_more_info") {
      return operationResult;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
