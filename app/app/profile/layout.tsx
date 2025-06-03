import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon } from "lucide-react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid gap-6">
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>Account Incomplete</AlertTitle>
        <AlertDescription>
          You are yet to create your account and upload the relevant documents.
        </AlertDescription>
      </Alert>
      {children}
    </div>
  )
}
