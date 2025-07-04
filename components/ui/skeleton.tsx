import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-background duration-250 rounded-lg skeleton", className)}
      {...props}
    />
  )
}

export { Skeleton }
