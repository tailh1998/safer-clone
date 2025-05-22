"use client"

import * as React from "react"

import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes"

const CustomThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export default CustomThemeProvider
