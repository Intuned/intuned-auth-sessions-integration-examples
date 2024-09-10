import { getIntunedConnectionStatus } from "@/lib/services/connections";
import { ConnectCard } from "./components/connect-card";
import { LogoutButton } from "./components/logout-button";
import { ListClaimsForm } from "./components/get-claims-card";
import { DisconnectButton } from "./components/dissconnect-button";

export default async function page() {
  const connection = await getIntunedConnectionStatus();

  return (
    <div className="container mt-10">
      <div className="flex gap-2">
        <LogoutButton />
        {connection.status === "READY" || connection.status === "EXPIRED" ? (
          <DisconnectButton />
        ) : null}
      </div>

      <div className="mt-10">
        {connection.status === "READY" ? (
          <ListClaimsForm />
        ) : (
          <ConnectCard status={connection.status} />
        )}
      </div>
    </div>
  );
}
