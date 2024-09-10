"use client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <Button onClick={() => signOut()} size="sm" variant="outline">
      <LogOut size={16} className="mr-2" />
      Logout
    </Button>
  );
}
