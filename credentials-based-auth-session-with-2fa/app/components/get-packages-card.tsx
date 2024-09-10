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
import { getClaims as getPackages } from "@/lib/server-actions/get-packages";
import { useState } from "react";

export function ListNpmPackages() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  return (
    <Card className="sm:col-span-2">
      <CardHeader className="pb-3">
        <CardTitle>List your npm packages</CardTitle>
        <CardDescription className="max-w-lg text-balance leading-relaxed">
          List all your npm pacakges
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="w-full">
          <Button
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              try {
                const packages = await getPackages();
                if (packages.success) {
                  toast.success("packages fetched successfully");
                  setData(packages.result);
                } else {
                  toast.error("Failed to fetch packages");
                }
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Getting packages ..." : "Get packages"}
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
