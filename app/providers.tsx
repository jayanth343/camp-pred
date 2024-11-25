'use client'

import { NextUIProvider } from "@nextui-org/react"
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#fff',
    },
    secondary: {
      main: '#7928ca',
    },
    background: {
      default: '#000',
      paper: '#111',
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <NextUIProvider>
        {children}
      </NextUIProvider>
    </ThemeProvider>
  )
} 