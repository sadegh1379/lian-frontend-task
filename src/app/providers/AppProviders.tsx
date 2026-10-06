import type { ReactNode } from "react"

import { QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter } from "react-router-dom"

import { queryClient } from "@/app/providers/queryClient"
import { ThemeProvider } from "@/shared/ui/ThemeProvider"
import { Toaster } from "@/shared/ui/sonner"

type AppProvidersProps = {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {children}
          <Toaster />
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
