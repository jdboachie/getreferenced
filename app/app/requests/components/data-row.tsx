export function DataRow ({name, value}: {name: string, value?: string | React.ReactElement}) {
  return (
    <li className="flex max-sm:grid items-start sm:gap-1 odd:bg-accent/70 dark:odd:bg-accent/40 p-1 px-2 rounded-sm">
      <span className="min-w-44 text-muted-foreground">{name}</span>
      <span>{value}</span>
    </li>
  )
}