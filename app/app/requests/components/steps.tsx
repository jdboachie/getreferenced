"use client"

import {
  UserIcon,
  BuildingIcon,
  CheckCheckIcon,
  CalendarDaysIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return
  const y = el.getBoundingClientRect().top + window.scrollY - 150
  window.scrollTo({ top: y, behavior: "smooth" })
}

export function Steps() {
  return (
    <div className="md:w-full md:max-w-56 h-fit flex md:flex-col gap-2 md:sticky md:top-38 max-sm:grid max-md:grid-cols-2] overflow-auto">
      <Button
        onClick={() => scrollTo("institution")}
        variant="ghost"
        size="lg"
        className="justify-start shadow-none"
      >
        <BuildingIcon />
        Institution
      </Button>

      <Button
        onClick={() => scrollTo("recommenders")}
        variant="ghost"
        size="lg"
        className="justify-start shadow-none"
      >
        <UserIcon />
        Recommender(s)
      </Button>

      <Button
        onClick={() => scrollTo("details")}
        variant="ghost"
        size="lg"
        className="justify-start shadow-none"
      >
        <CalendarDaysIcon />
        Details & Deadline
      </Button>

      <Button
        onClick={() => scrollTo("preview")}
        variant="ghost"
        size="lg"
        className="justify-start shadow-none"
      >
        <CheckCheckIcon />
        Review & Submit
      </Button>
    </div>
  )
}
