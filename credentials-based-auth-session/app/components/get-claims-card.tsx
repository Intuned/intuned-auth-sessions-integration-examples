"use client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getClaims } from "@/lib/server-actions/get-claims";
import { useState } from "react";

export function ListClaimsForm() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  return (
    <Card className="sm:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle>List claims</CardTitle>
        <CardDescription className="max-w-lg text-balance leading-relaxed">
          List all claims
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <Button
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              try {
                const claims = await getClaims();
                if (claims.success) {
                  toast.success("Claims fetched successfully");
                  setData(claims.result);
                } else {
                  toast.error("Failed to fetch claims");
                }
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Getting claims ..." : "Get claims"}
          </Button>
        </div>

        {data && (
          <div className="mt-4">
            <hr />
            <div className="mt-4">
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
