import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Sidenav } from "./components/sidenav";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex max-lg:flex-col gap-8 lg:gap-16">
      <Sidenav />
      <div className="flex flex-col gap-8 w-full">
        <Alert variant="default">
          <AlertCircleIcon />
          <AlertTitle>Account Incomplete</AlertTitle>
          <AlertDescription>
            1. Fill in below to create your account<br/>
            2. Upload the relevant documents.
          </AlertDescription>
        </Alert>
        {children}
      </div>
    </div>
  )
}
