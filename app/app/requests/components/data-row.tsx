export function DataRow ({name, value}: {name: string, value?: string | React.ReactElement}) {
  return (
    <li className="flex max-sm:grid max-sm:min-h-13 items-center sm:gap-1 odd:bg-accent/70 dark:odd:bg-accent/40 p-1 px-2 rounded-sm">
      <span className="min-w-44 text-muted-foreground max-sm:text-sm">{name}</span>
      {value ? <span>{value}</span> : <span className="text-muted-foreground text-xs italic">empty</span>}
    </li>
  )
}