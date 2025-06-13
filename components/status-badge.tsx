import { Badge } from "@/components/ui/badge";
import { SpinnerIcon } from "./icons";

export default function StatusBadge(
  { status }
  :
  { status: "pending" | "rejected" | "accepted" | "drafted" | undefined }
) {
  return (
    <Badge
      variant={status === "pending" ? "secondary" : status === "rejected" ? "destructive" : status === "accepted" ? "secondary" : "default"}
    >
      {status === "pending" && <span className="flex items-center gap-1.5"><div className="bg-neutral-500 size-2 rounded-full" /> Pending</span>}
      {status === "rejected" && <span className="flex items-center gap-1.5"><div className="bg-red-500 size-2 rounded-full" /> Rejected</span>}
      {status === "accepted" && <span className="flex items-center gap-1.5"><div className="bg-green-500 size-2 rounded-full" /> Accepted</span>}
      {status === "drafted" && <span className="flex items-center gap-1.5"><div className="bg-blue-500 size-2 rounded-full" /> Drafted</span>}
      {!status && <SpinnerIcon />}
    </Badge>
  )
}
