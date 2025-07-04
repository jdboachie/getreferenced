"use client"

import {
  BuildingIcon,
  CheckCheckIcon,
  CalendarDaysIcon,
  User2Icon,
  Users2Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (!el) return
  const y = el.getBoundingClientRect().top + window.scrollY - 150
  window.scrollTo({ top: y, behavior: "smooth" })
}

const steps = [
  { id: "profile", icon: User2Icon, label: "Profile" },
  { id: "institution", icon: BuildingIcon, label: "Institution details" },
  { id: "recommenders", icon: Users2Icon, label: "Recommender(s)" },
  { id: "details", icon: CalendarDaysIcon, label: "Details & Deadline" },
  { id: "preview", icon: CheckCheckIcon, label: "Review & Submit" },
];

export function Steps() {
  return (
    <div className="md:w-full md:max-w-56 h-fit flex md:flex-col gap-2 md:sticky md:top-38 overflow-auto">
      {steps.map(({ id, icon: Icon, label }) => (
        <Button
          key={id}
          onClick={() => scrollTo(id)}
          variant="ghost"
          size="lg"
          className="justify-start shadow-none"
        >
          <Icon />
          {label}
        </Button>
      ))}
    </div>
  )
}
