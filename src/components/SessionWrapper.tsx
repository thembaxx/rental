"use client"

import { SessionProvider } from "next-auth/react"

interface SessionWrapperProps {
  session: any
  children: React.ReactNode
}

export function SessionWrapper({ session, children }: SessionWrapperProps) {
  return <SessionProvider session={session}>{children}</SessionProvider>
}
