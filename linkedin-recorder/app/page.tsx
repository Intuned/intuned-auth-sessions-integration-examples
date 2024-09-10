import { getUserLinkedInConnectionStatus } from "@/lib/services/connections";
import { ConnectLinkedinCard } from "./components/connect-linkedin-card";
import { LogoutButton } from "./components/logout-button";
import { LikePostForm } from "./components/like-post-form";
import { DisconnectButton } from "./components/dissconnect-button";

export default async function page() {
  const linkedinConnection = await getUserLinkedInConnectionStatus();

  return (
    <div className="container mt-10">
      <div className="flex gap-2">
        <LogoutButton />
        {linkedinConnection.status === "READY" ||
        linkedinConnection.status === "EXPIRED" ? (
          <DisconnectButton />
        ) : null}
      </div>

      <div className="mt-10">
        {linkedinConnection.status === "READY" ? (
          <LikePostForm />
        ) : (
          <ConnectLinkedinCard status={linkedinConnection.status} />
        )}
      </div>
    </div>
  );
}
