"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  connectUserToNpm,
  resumeUserConnectionToNPM,
} from "@/lib/server-actions/connect-user-to-npm";
import { Input } from "@/components/ui/input";
import { useFormState, useFormStatus } from "react-dom";
import { Label } from "@/components/ui/label";

export function ConnectCard({
  status,
}: {
  status: "NOT_CONNECTED" | "EXPIRED" | "PENDING";
}) {
  const [startFormActionState, startFormAction] = useFormState(
    connectUserToNpm,
    undefined
  );

  const [resumeFormActionState, resumeFormAction] = useFormState(
    resumeUserConnectionToNPM,
    undefined
  );

  const shouldShow2faForm =
    startFormActionState?.status === "requested_more_info" &&
    resumeFormActionState?.status !== "failed";

  return (
    <Card className="sm:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle>Connect NPM account</CardTitle>
        <CardDescription className="max-w-lg text-balance leading-relaxed">
          {status === "EXPIRED"
            ? "Your NPM connection has expired. Please reconnect to continue automating actions"
            : "Connect your NPM account start automating actions"}
          .
        </CardDescription>
      </CardHeader>

      {shouldShow2faForm ? (
        <CardFooter className="flex flex-col gap-2 items-start">
          <form className="flex  gap-2 items-center" action={resumeFormAction}>
            <Label>OTP</Label>
            <Input
              placeholder=""
              name="operationId"
              value={startFormActionState.operationId}
              className="hidden"
            />
            <Input
              placeholder=""
              name="infoRequestId"
              value={startFormActionState.id}
              className="hidden"
            />
            <Input placeholder="Enter OTP" name="otp" />
            <SubmitButton />
          </form>
        </CardFooter>
      ) : (
        <CardFooter className="flex flex-col gap-2 items-start">
          <form className="flex  gap-2" action={startFormAction}>
            <Input placeholder="Username" name="username" />
            <Input placeholder="Password" name="password" type="password" />
            <SubmitButton />
          </form>
          {startFormActionState?.status == "failed" ? (
            <p className="text-red-500"> {startFormActionState.message}</p>
          ) : null}
          {resumeFormActionState?.status == "failed" ? (
            <p className="text-red-500"> {resumeFormActionState.message}</p>
          ) : null}
        </CardFooter>
      )}
    </Card>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 animate-spin" size={16} /> : null}
      Connect
    </Button>
  );
}
