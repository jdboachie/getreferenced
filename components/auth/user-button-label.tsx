import React from 'react'
import { DropdownMenuLabel } from '../ui/dropdown-menu'

export default function UserButtonLabel() {
  return (
    <>
      <DropdownMenuLabel>Emelie Lupert</DropdownMenuLabel>
      <DropdownMenuLabel className="pt-0 text-muted-foreground font-normal">emelielupert@st.upenn.edu</DropdownMenuLabel>
    </>
  )
}
