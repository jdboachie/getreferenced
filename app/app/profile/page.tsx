'use client';

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";


function Page() {
  const user = useQuery(api.auth.getCurrentUser);
  return (
    <div>
      {JSON.stringify(user, null, 2)}
    </div>
  )
}

export default Page