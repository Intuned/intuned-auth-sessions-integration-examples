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
import { connectUserToLinkedin } from "@/lib/server-actions/connect-user-to-linkedin";

export function ConnectLinkedinCard({
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

  return (
    <Card className="sm:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle>Connect Linkedin</CardTitle>
        <CardDescription className="max-w-lg text-balance leading-relaxed">
          {status === "EXPIRED"
            ? "Your Linkedin connection has expired. Please reconnect to continue automating actions"
            : "Connect your Linkedin account start automating actions"}
          .
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Button
          disabled={loading}
          onClick={async () => {
            try {
              setLoading(true);
              const recorderUrl = await connectUserToLinkedin();
              window.open(recorderUrl, "newWindow", "height=600,width=800");
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? <Loader2 className="mr-2 animate-spin" size={16} /> : null}
          Connect
        </Button>
      </CardFooter>
    </Card>
  );
}
