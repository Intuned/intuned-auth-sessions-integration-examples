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
import { connectUserToOrangeHRM } from "@/lib/server-actions/connect-user-to-hrm";
import { Input } from "@/components/ui/input";
import { useFormState, useFormStatus } from "react-dom";

export function ConnectCard({
  status,
}: {
  status: "NOT_CONNECTED" | "EXPIRED" | "PENDING";
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      if (event.data.type == "RECORDER_SESSION_FINISHED_SUCCESSFULLY") {
        toast("Session finished successfully");
        router.refresh();
        return;
      }

      if (event.data.type == "RECORDER_SESSION_FAILED") {
        toast("Session recording failed");
        return;
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  //@ts-ignore
  const [state, formAction] = useFormState(connectUserToOrangeHRM, {
    message: "",
  });

  return (
    <Card className="sm:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle>Connect Orange HRM</CardTitle>
        <CardDescription className="max-w-lg text-balance leading-relaxed">
          {status === "EXPIRED"
            ? "Your Orange HRM connection has expired. Please reconnect to continue automating actions"
            : "Connect your Orange HRM account start automating actions"}
          .
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col gap-2 items-start">
        <form className="flex  gap-2" action={formAction}>
          <Input placeholder="Username" name="username" />
          <Input placeholder="Password" name="password" type="password" />
          <SubmitButton />
        </form>
        {state.message ? (
          <p className="text-red-500"> {state.message}</p>
        ) : null}
      </CardFooter>
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
