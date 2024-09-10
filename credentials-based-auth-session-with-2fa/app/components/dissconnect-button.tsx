"use client";
import { Button } from "@/components/ui/button";
import { disconnect } from "@/lib/server-actions/disconnect";
import { Loader2, Unplug } from "lucide-react";
import { useState } from "react";

export function DisconnectButton() {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={loading}
      onClick={async () => {
        try {
          setLoading(true);
          await disconnect();
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? (
        <Loader2 className="mr-2 animate-spin" size={16} />
      ) : (
        <Unplug className="mr-2" size={16} />
      )}{" "}
      Disconnect Account
    </Button>
  );
}
