import { FormEvent, ReactNode } from "react"
import { Button } from "@/components/ui/button"

type ProfileCardFormProps = {
  title: string
  description: string
  onSubmit: (formData: FormData) => Promise<void>
  children: ReactNode
  footerNote: string
  buttonDisabled?: boolean
  buttonText?: string
}

export default function ProfileCardForm({
  title,
  description,
  onSubmit,
  children,
  footerNote,
  buttonDisabled = false,
  buttonText = "Save"
}: ProfileCardFormProps) {
  return (
    <form
      onSubmit={async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        await onSubmit(formData)
      }}
      className={'border bg-primary-foreground dark:bg-background rounded-xl p-1'}
    >
      <div className={'bg-background dark:bg-primary-foreground rounded-lg shadow-xs border p-4 gap-4 flex flex-col'}>
        <h3 className="font-medium text-lg">{title}</h3>
        <p className="text-sm">{description}</p>
        {children}
      </div>
      <div className={'md:gap-2 gap-4 flex justify-between items-center rounded-b-xl p-3'}>
        <p className="text-sm text-muted-foreground">{footerNote}</p>
        <Button size="sm" type="submit" disabled={buttonDisabled}>
          {buttonText}
        </Button>
      </div>
    </form>
  )
}
