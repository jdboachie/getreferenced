import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-secondary dark:bg-background animate-pulse duration-250 rounded-md skeleton", className)}
      {...props}
    />
  )
}

export { Skeleton }
